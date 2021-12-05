const User = require('../models/User');
const { v4: uuid } = require('uuid');

async function index(req, res) {
  try {
    const users = await User.find();
    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function store(req, res) {
  try {
    const { firstName, lastName, chatId, language } = req.body;
    if (!firstName) {
      return res.status(400).json({ error: 'Missing first name argument' });
    }

    const user = new User({
      userId: uuid(),
      firstName,
      lastName,
      chatId,
      language,
    });

    await user.save();
    return res.status(201).json({ message: 'User added succesfully!' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function checkChatId(req, res) {
  try {
    const chatId = req.params.id;
    const user = await User.findOne({ chatId });
    if (!user) {
      return res.status(200).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  index,
  store,
  checkChatId,
}