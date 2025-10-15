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
      streamName,
      location,
      date,
      weather,
      waterCondition,
      fishCaught,
      species,
      notes,
    } = req.body;

    // Validation
    if (!streamName || !location || !date) {
      return res.status(400).json({ error: 'Stream name, location, and date are required' });
    }

    const pool = await getConnection();

    // Insert experience
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .input('streamName', sql.VarChar, streamName)
      .input('location', sql.VarChar, location)
      .input('date', sql.Date, date)
      .input('weather', sql.VarChar, weather || null)
      .input('waterCondition', sql.VarChar, waterCondition || null)
      .input('fishCaught', sql.Int, fishCaught || 0)
      .input('species', sql.VarChar, species || null)
      .input('notes', sql.Text, notes || null)
      .query(`
        INSERT INTO Experiences 
        (userId, streamName, location, date, weather, waterCondition, fishCaught, species, notes, createdAt) 
        OUTPUT INSERTED.*
        VALUES (@userId, @streamName, @location, @date, @weather, @waterCondition, @fishCaught, @species, @notes, GETDATE())
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
        SELECT * FROM Experiences 
        WHERE userId = @userId 
        ORDER BY date DESC, createdAt DESC
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
      .query('SELECT * FROM Experiences WHERE id = @id AND userId = @userId');

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
      streamName,
      location,
      date,
      weather,
      waterCondition,
      fishCaught,
      species,
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
      .input('streamName', sql.VarChar, streamName)
      .input('location', sql.VarChar, location)
      .input('date', sql.Date, date)
      .input('weather', sql.VarChar, weather || null)
      .input('waterCondition', sql.VarChar, waterCondition || null)
      .input('fishCaught', sql.Int, fishCaught || 0)
      .input('species', sql.VarChar, species || null)
      .input('notes', sql.Text, notes || null)
      .query(`
        UPDATE Experiences 
        SET streamName = @streamName, 
            location = @location, 
            date = @date, 
            weather = @weather, 
            waterCondition = @waterCondition, 
            fishCaught = @fishCaught, 
            species = @species, 
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
