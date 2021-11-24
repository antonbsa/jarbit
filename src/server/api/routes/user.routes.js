const express = require('express');
const userRoutes = express.Router();

const userController = require('../controllers/userController');
const userMiddleware = require('../middlewares/userMiddleware');

userRoutes.get('/', (req, res) => {
  res.send('hello from USER');
});

userRoutes.get('/index', userController.index);
userRoutes.post('/store', userController.store);
userRoutes.get('/check-chatid/:id', userController.checkChatId);
userRoutes.post('/set-waiting-value', userController.setIsWaitingValue);

module.exports = userRoutes;