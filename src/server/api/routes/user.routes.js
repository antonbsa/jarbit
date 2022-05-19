const express = require('express');
const userRoutes = express.Router();

const { index, store, checkChatId } = require('../controllers/userController');
const { checkUserData } = require('../middlewares/userMiddleware');

userRoutes.get('/', (req, res) => {
  res.send('hello from USER');
});

userRoutes.get('/index', index);
userRoutes.post('/store', checkUserData, store);
userRoutes.get('/check-chatid/:id', checkChatId);

module.exports = userRoutes;
