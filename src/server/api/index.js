require('dotenv').config();

const initBot = require('../bot/index');
//TODO fixme
if (true) initBot();

const express = require('express');

const routes = require('./routes');
const connectToDatabase = require('./service/database');

connectToDatabase();

const app = express();
const port = 3000

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`rodando em https://localhost:${port}`)
});