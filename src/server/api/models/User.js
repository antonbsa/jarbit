const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  /* _id: {
    type: String,
    required: true,
  }, */
  chatId: {
    type: Number,
    required: false,
  },
  language: {
    type: String,
    required: false
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: false,
  }
}, {
  timestamps: true
});

module.exports = model('User', userSchema);