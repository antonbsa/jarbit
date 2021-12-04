require('dotenv').config();
const mongoose = require("mongoose");
const { databaseUrl } = require('../../params');

function connectToDatabase() {
  mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on('error', (e) => console.error(e));
  db.once("open", () => console.log('📦 Connected to the database'));
}

module.exports = connectToDatabase;