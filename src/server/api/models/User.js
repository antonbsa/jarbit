const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  chatId: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);