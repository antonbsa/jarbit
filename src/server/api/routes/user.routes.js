const express = require('express');
const userRoutes = express.Router();

const { index, store, checkChatId, setIsWaitingValue } = require('../controllers/userController');
// const userMiddleware = require('../middlewares/userMiddleware');

userRoutes.get('/', (req, res) => {
  res.send('hello from USER');
});

userRoutes.get('/index', index);
userRoutes.post('/store', store);
userRoutes.get('/check-chatid/:id', checkChatId);
userRoutes.post('/set-waiting-value', setIsWaitingValue);

module.exports = userRoutes;