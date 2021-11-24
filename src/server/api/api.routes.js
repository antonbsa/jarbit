const express = require('express');
const apiRoutes = express.Router();

apiRoutes.get('/', (req, res) => {
  res.send('hello from API');
});

//TODO: tirar essa rota
apiRoutes.get('/test', (req, res) =>{
  console.log("dentro test");
  res.status(200).json({ test: 'dale' });
});

module.exports = apiRoutes;