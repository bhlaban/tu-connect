const express = require('express');
const { getConnection, sql } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new trip
router.post('/', async (req, res) => {
  try {
    const {
      streamId,
      location,
      date,
      startTime,
      stopTime,
      weatherConditionId,
      waterClarityConditionId,
      waterLevelConditionId,
      notes,
      catches, // Array of catch objects
    } = req.body;

    // Validation
    if (!streamId || !date) {
      return res.status(400).json({ error: 'Stream and date are required' });
    }

    // Convert empty strings to null for time fields and validate format
    const validStartTime = startTime && typeof startTime === 'string' && startTime.trim() !== '' ? startTime.trim() : null;
    const validStopTime = stopTime && typeof stopTime === 'string' && stopTime.trim() !== '' ? stopTime.trim() : null;

    const pool = await getConnection();

    // Start a transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Insert trip
      const tripResult = await transaction.request()
        .input('userId', sql.Int, req.user.id)
        .input('streamId', sql.Int, streamId)
        .input('location', sql.VarChar, location || null)
        .input('date', sql.Date, date)
        .input('startTime', sql.Time, validStartTime)
        .input('stopTime', sql.Time, validStopTime)
        .input('weatherConditionId', sql.Int, weatherConditionId || null)
        .input('waterClarityConditionId', sql.Int, waterClarityConditionId || null)
        .input('waterLevelConditionId', sql.Int, waterLevelConditionId || null)
        .input('notes', sql.Text, notes || null)
        .query(`
          INSERT INTO Trips 
          (userId, streamId, location, date, startTime, stopTime, weatherConditionId, waterClarityConditionId, waterLevelConditionId, notes, createdAt) 
          OUTPUT INSERTED.id, INSERTED.*
          VALUES (@userId, @streamId, @location, @date, @startTime, @stopTime, @weatherConditionId, @waterClarityConditionId, @waterLevelConditionId, @notes, GETDATE())
        `);

      const trip = tripResult.recordset[0];

      // Insert catches if provided (each catch is unique, no quantity)
      if (catches && catches.length > 0) {
        for (const catchItem of catches) {
          await transaction.request()
            .input('tripId', sql.Int, trip.id)
            .input('speciesId', sql.Int, catchItem.speciesId)
            .input('length', sql.Decimal(5, 2), catchItem.length || null)
            .input('notes', sql.Text, catchItem.notes || null)
            .query(`
              INSERT INTO Catches (tripId, speciesId, length, notes, createdAt)
              VALUES (@tripId, @speciesId, @length, @notes, GETDATE())
            `);
        }
      }

      await transaction.commit();

      res.status(201).json({
        message: 'Trip logged successfully',
        trip: trip,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to log trip' });
  }
});

// Get all trips for the logged-in user
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT 
          t.*,
          s.name as streamName,
          wc.name as weatherCondition,
          wcl.name as waterClarityCondition,
          wlc.name as waterLevelCondition
        FROM Trips t
        INNER JOIN Streams s ON t.streamId = s.id
        LEFT JOIN WeatherConditions wc ON t.weatherConditionId = wc.id
        LEFT JOIN WaterClarityConditions wcl ON t.waterClarityConditionId = wcl.id
        LEFT JOIN WaterLevelConditions wlc ON t.waterLevelConditionId = wlc.id
        WHERE t.userId = @userId 
        ORDER BY t.date DESC, t.createdAt DESC
      `);

    // Get catches for each trip
    const trips = result.recordset;
    for (const trip of trips) {
      const catchesResult = await pool.request()
        .input('tripId', sql.Int, trip.id)
        .query(`
          SELECT 
            c.id,
            c.length,
            c.notes,
            sp.id as speciesId,
            sp.name as speciesName,
            sp.scientificName
          FROM Catches c
          INNER JOIN Species sp ON c.speciesId = sp.id
          WHERE c.tripId = @tripId
          ORDER BY c.createdAt
        `);
      trip.catches = catchesResult.recordset;
    }

    res.json({
      trips: trips,
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get a single trip by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT 
          t.*,
          s.name as streamName,
          wc.name as weatherCondition,
          wcl.name as waterClarityCondition,
          wlc.name as waterLevelCondition
        FROM Trips t
        INNER JOIN Streams s ON t.streamId = s.id
        LEFT JOIN WeatherConditions wc ON t.weatherConditionId = wc.id
        LEFT JOIN WaterClarityConditions wcl ON t.waterClarityConditionId = wcl.id
        LEFT JOIN WaterLevelConditions wlc ON t.waterLevelConditionId = wlc.id
        WHERE t.id = @id AND t.userId = @userId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const trip = result.recordset[0];

    // Get catches for the trip
    const catchesResult = await pool.request()
      .input('tripId', sql.Int, trip.id)
      .query(`
        SELECT 
          c.id,
          c.length,
          c.notes,
          sp.id as speciesId,
          sp.name as speciesName,
          sp.scientificName
        FROM Catches c
        INNER JOIN Species sp ON c.speciesId = sp.id
        WHERE c.tripId = @tripId
        ORDER BY c.createdAt
      `);
    trip.catches = catchesResult.recordset;

    res.json({
      trip: trip,
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Update a trip
router.put('/:id', async (req, res) => {
  try {
    const {
      streamId,
      location,
      date,
      startTime,
      stopTime,
      weatherConditionId,
      waterClarityConditionId,
      waterLevelConditionId,
      notes,
      catches,
    } = req.body;

    const pool = await getConnection();

    // Check if trip exists and belongs to user
    const checkResult = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.user.id)
      .query('SELECT id FROM Trips WHERE id = @id AND userId = @userId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Convert empty strings to null for time fields and validate format
    const validStartTime = startTime && typeof startTime === 'string' && startTime.trim() !== '' ? startTime.trim() : null;
    const validStopTime = stopTime && typeof stopTime === 'string' && stopTime.trim() !== '' ? stopTime.trim() : null;

    // Start a transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Update trip
      const result = await transaction.request()
        .input('id', sql.Int, req.params.id)
        .input('streamId', sql.Int, streamId)
        .input('location', sql.VarChar, location || null)
        .input('date', sql.Date, date)
        .input('startTime', sql.Time, validStartTime)
        .input('stopTime', sql.Time, validStopTime)
        .input('weatherConditionId', sql.Int, weatherConditionId || null)
        .input('waterClarityConditionId', sql.Int, waterClarityConditionId || null)
        .input('waterLevelConditionId', sql.Int, waterLevelConditionId || null)
        .input('notes', sql.Text, notes || null)
        .query(`
          UPDATE Trips 
          SET streamId = @streamId,
              location = @location,
              date = @date,
              startTime = @startTime,
              stopTime = @stopTime,
              weatherConditionId = @weatherConditionId,
              waterClarityConditionId = @waterClarityConditionId,
              waterLevelConditionId = @waterLevelConditionId,
              notes = @notes,
              updatedAt = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @id
        `);

      // Delete existing catches and insert new ones
      await transaction.request()
        .input('tripId', sql.Int, req.params.id)
        .query('DELETE FROM Catches WHERE tripId = @tripId');

      if (catches && catches.length > 0) {
        for (const catchItem of catches) {
          await transaction.request()
            .input('tripId', sql.Int, req.params.id)
            .input('speciesId', sql.Int, catchItem.speciesId)
            .input('length', sql.Decimal(5, 2), catchItem.length || null)
            .input('notes', sql.Text, catchItem.notes || null)
            .query(`
              INSERT INTO Catches (tripId, speciesId, length, notes, createdAt)
              VALUES (@tripId, @speciesId, @length, @notes, GETDATE())
            `);
        }
      }

      await transaction.commit();

      res.json({
        message: 'Trip updated successfully',
        trip: result.recordset[0],
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete a trip
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.user.id)
      .query('DELETE FROM Trips WHERE id = @id AND userId = @userId');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

module.exports = router;
