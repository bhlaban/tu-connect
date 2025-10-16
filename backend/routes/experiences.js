const express = require('express');
const { getConnection, sql } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new stream experience
router.post('/', async (req, res) => {
  try {
    const {
      streamId,
      customStreamName,
      location,
      date,
      weatherConditionId,
      waterConditionId,
      fishCaught,
      speciesId,
      customSpecies,
      notes,
    } = req.body;

    // Validation
    if ((!streamId && !customStreamName) || !location || !date) {
      return res.status(400).json({ error: 'Stream name, location, and date are required' });
    }

    const pool = await getConnection();

    // Insert experience
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .input('streamId', sql.Int, streamId || null)
      .input('customStreamName', sql.VarChar, customStreamName || null)
      .input('location', sql.VarChar, location)
      .input('date', sql.Date, date)
      .input('weatherConditionId', sql.Int, weatherConditionId || null)
      .input('waterConditionId', sql.Int, waterConditionId || null)
      .input('fishCaught', sql.Int, fishCaught || 0)
      .input('speciesId', sql.Int, speciesId || null)
      .input('customSpecies', sql.VarChar, customSpecies || null)
      .input('notes', sql.Text, notes || null)
      .query(`
        INSERT INTO Experiences 
        (userId, streamId, customStreamName, location, date, weatherConditionId, waterConditionId, fishCaught, speciesId, customSpecies, notes, createdAt) 
        OUTPUT INSERTED.*
        VALUES (@userId, @streamId, @customStreamName, @location, @date, @weatherConditionId, @waterConditionId, @fishCaught, @speciesId, @customSpecies, @notes, GETDATE())
      `);

    res.status(201).json({
      message: 'Experience logged successfully',
      experience: result.recordset[0],
    });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Failed to log experience' });
  }
});

// Get all experiences for the logged-in user
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT 
          e.*,
          s.name as streamName,
          sp.name as speciesName,
          wc.name as weatherCondition,
          wtc.name as waterCondition
        FROM Experiences e
        LEFT JOIN Streams s ON e.streamId = s.id
        LEFT JOIN Species sp ON e.speciesId = sp.id
        LEFT JOIN WeatherConditions wc ON e.weatherConditionId = wc.id
        LEFT JOIN WaterConditions wtc ON e.waterConditionId = wtc.id
        WHERE e.userId = @userId 
        ORDER BY e.date DESC, e.createdAt DESC
      `);

    res.json({
      experiences: result.recordset,
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Get a single experience by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT 
          e.*,
          s.name as streamName,
          sp.name as speciesName,
          wc.name as weatherCondition,
          wtc.name as waterCondition
        FROM Experiences e
        LEFT JOIN Streams s ON e.streamId = s.id
        LEFT JOIN Species sp ON e.speciesId = sp.id
        LEFT JOIN WeatherConditions wc ON e.weatherConditionId = wc.id
        LEFT JOIN WaterConditions wtc ON e.waterConditionId = wtc.id
        WHERE e.id = @id AND e.userId = @userId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({
      experience: result.recordset[0],
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// Update an experience
router.put('/:id', async (req, res) => {
  try {
    const {
      streamId,
      customStreamName,
      location,
      date,
      weatherConditionId,
      waterConditionId,
      fishCaught,
      speciesId,
      customSpecies,
      notes,
    } = req.body;

    const pool = await getConnection();

    // Check if experience exists and belongs to user
    const checkResult = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.user.id)
      .query('SELECT id FROM Experiences WHERE id = @id AND userId = @userId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Update experience
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('streamId', sql.Int, streamId || null)
      .input('customStreamName', sql.VarChar, customStreamName || null)
      .input('location', sql.VarChar, location)
      .input('date', sql.Date, date)
      .input('weatherConditionId', sql.Int, weatherConditionId || null)
      .input('waterConditionId', sql.Int, waterConditionId || null)
      .input('fishCaught', sql.Int, fishCaught || 0)
      .input('speciesId', sql.Int, speciesId || null)
      .input('customSpecies', sql.VarChar, customSpecies || null)
      .input('notes', sql.Text, notes || null)
      .query(`
        UPDATE Experiences 
        SET streamId = @streamId,
            customStreamName = @customStreamName,
            location = @location, 
            date = @date, 
            weatherConditionId = @weatherConditionId, 
            waterConditionId = @waterConditionId, 
            fishCaught = @fishCaught, 
            speciesId = @speciesId,
            customSpecies = @customSpecies, 
            notes = @notes,
            updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    res.json({
      message: 'Experience updated successfully',
      experience: result.recordset[0],
    });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// Delete an experience
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.user.id)
      .query('DELETE FROM Experiences WHERE id = @id AND userId = @userId');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

module.exports = router;
