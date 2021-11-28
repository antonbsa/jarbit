const { Schema, model } = require('mongoose');

// Auth schemas
const githubSchema = new Schema({
  access_token: {
    value: {
      type: String,
      required: true,
    },
    generated_at: {
      type: Date,
      required: true,
    }
  },
  username: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  }
}, { _id: false });

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  chatId: {
    type: Number,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  authentications: {
    github: {
      type: githubSchema,
      required: false,
    }
  }
}, {
  timestamps: true
});

module.exports = model('User', userSchema);