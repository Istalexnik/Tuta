const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

// PostgreSQL pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files 
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/search', (req, res) => {
  const searchText = req.body.searchText;
  console.log(`Search text113ff: ${searchText}`);  // Log the search text

  pool.query('SELECT * FROM items WHERE text ILIKE $1', [`%${searchText}%`], (error, results) => {
    if (error) {
      console.error(error);  // Log any errors
      res.status(500).send('Server error');
      return;
    }
    console.log(`Query results: ${JSON.stringify(results.rows)}`);  // Log query results
    res.json(results.rows);
  });
});

// Start the server
const port = process.env.SV_PORT; // Use SV_PORT for the server port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
