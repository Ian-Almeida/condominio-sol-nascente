const express = require('express');
const db = require('../../database/deps')
const router = express.Router();

router.get('/', async (req, res) => {
  const query = 'SELECT * FROM condominios';
  let results = await db.execute(query);
  res.send(results)
});

module.exports = router;
