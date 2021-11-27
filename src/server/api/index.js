require('dotenv').config();
const initBot = require('../bot/index');

const express = require('express');
const apiRoutes = require('./api.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

const connectToDatabase = require('./service/database');
connectToDatabase();

const app = express();
const port = 3000

app.use(express.json());
app.use('/api', apiRoutes);
apiRoutes.use('/user', userRoutes);
apiRoutes.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(port, () => {
  //TODO: deixar dinamico
  console.log(`⚡ Running in http://localhost:${port}`);
});

if (process.env.BOT_API_TOKEN) initBot();