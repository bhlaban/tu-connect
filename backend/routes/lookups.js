const express = require('express');
const { getConnection, sql } = require('../config/database');
const router = express.Router();

// Get all streams
router.get('/streams', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query('SELECT id, name, location, description FROM Streams WHERE isActive = 1 ORDER BY name');
    
    res.json({ streams: result.recordset });
  } catch (error) {
    console.error('Error fetching streams:', error);
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
});

// Get all species
router.get('/species', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query('SELECT id, name, scientificName, description FROM Species WHERE isActive = 1 ORDER BY name');
    
    res.json({ species: result.recordset });
  } catch (error) {
    console.error('Error fetching species:', error);
    res.status(500).json({ error: 'Failed to fetch species' });
  }
});

// Get all weather conditions
router.get('/weather-conditions', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query('SELECT id, name, description FROM WeatherConditions WHERE isActive = 1 ORDER BY name');
    
    res.json({ weatherConditions: result.recordset });
  } catch (error) {
    console.error('Error fetching weather conditions:', error);
    res.status(500).json({ error: 'Failed to fetch weather conditions' });
  }
});

// Get all water conditions
router.get('/water-conditions', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query('SELECT id, name, description FROM WaterConditions WHERE isActive = 1 ORDER BY name');
    
    res.json({ waterConditions: result.recordset });
  } catch (error) {
    console.error('Error fetching water conditions:', error);
    res.status(500).json({ error: 'Failed to fetch water conditions' });
  }
});

// Get all lookup data in one call
router.get('/all', async (req, res) => {
  try {
    const pool = await getConnection();
    
    const [streams, species, weatherConditions, waterConditions] = await Promise.all([
      pool.request().query('SELECT id, name, location, description FROM Streams WHERE isActive = 1 ORDER BY name'),
      pool.request().query('SELECT id, name, scientificName, description FROM Species WHERE isActive = 1 ORDER BY name'),
      pool.request().query('SELECT id, name, description FROM WeatherConditions WHERE isActive = 1 ORDER BY name'),
      pool.request().query('SELECT id, name, description FROM WaterConditions WHERE isActive = 1 ORDER BY name')
    ]);
    
    res.json({
      streams: streams.recordset,
      species: species.recordset,
      weatherConditions: weatherConditions.recordset,
      waterConditions: waterConditions.recordset
    });
  } catch (error) {
    console.error('Error fetching lookup data:', error);
    res.status(500).json({ error: 'Failed to fetch lookup data' });
  }
});

module.exports = router;
