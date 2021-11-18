const express = require('express');
const routes = express.Router();

const userController = require('./controllers/userController');

routes.get('/', (req, res) => {
  res.send('hello from API');
});

//TODO: tirar essa rota
routes.get('/test', (req, res) =>{
  console.log("dentro test");
  res.status(200).json({ test: 'dale' });
});

routes.get('/index', userController.index);
routes.post('/store', userController.store);

module.exports = routes;