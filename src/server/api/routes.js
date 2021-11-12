const express = require('express');
const routes = express.Router();

const userController = require('./controllers/userController');

routes.get('/', (req, res) => {
  res.send('hello world');
});

routes.get('/index', userController.index);
routes.post('/store', userController.store);

module.exports = routes;