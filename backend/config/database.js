const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

let pool = null;

async function getConnection() {
  try {
    if (pool) {
      return pool;
    }
    pool = await sql.connect(config);
    console.log('Connected to Azure SQL Database');
    return pool;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

async function closeConnection() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Database connection closed');
    }
  } catch (err) {
    console.error('Error closing database connection:', err);
    throw err;
  }
}

module.exports = {
  getConnection,
  closeConnection,
  sql,
};
