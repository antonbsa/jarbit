require('dotenv').config();
const mongoose = require("mongoose");

function connectToDatabase() {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on('error', (e) => console.error(e));
  db.once("open", () => console.log('📦 Connected to the database'));
}

module.exports = connectToDatabase;