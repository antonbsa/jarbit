const express = require('express');
const apiRoutes = express.Router();

apiRoutes.get('/', (req, res) => {
  res.send('hello from API');
});

module.exports = apiRoutes;