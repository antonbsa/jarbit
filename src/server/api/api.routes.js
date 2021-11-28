const express = require('express');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const apiRoutes = express.Router();

apiRoutes.get('/', (req, res) => {
  res.send('hello from API');
});

apiRoutes.use('/user', userRoutes);
apiRoutes.use('/auth', authRoutes);

module.exports = apiRoutes;