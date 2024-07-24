const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

module.exports = (pool) => {
  router.post(
    '/',
    [
      body('searchText').trim().escape().notEmpty().withMessage('Search text is required'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const searchText = req.body.searchText.toUpperCase(); // Ensure the search text is in uppercase
      console.log(`Search text: ${searchText}`); // Log the search text

      try {
        const results = await pool.query('SELECT info FROM items WHERE character = $1', [searchText]);
        console.log(`Query results: ${JSON.stringify(results.rows)}`); // Log query results
        res.json(results.rows.map(row => row.info)); // Return only the info field
      } catch (error) {
        console.error(error); // Log any errors
        res.status(500).send('Server error');
      }
    }
  );

  return router;
};
