require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const { Pool } = require('pg');
const searchRoutes = require('./routes/search');
const path = require('path');

const app = express();
const port = process.env.SV_PORT;

// PostgreSQL pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Middleware
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/search', searchRoutes(pool));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
