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
      return res.status(400).json({ success: false, error: 'Missing first name argument' });
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

async function setIsWaitingValue(req, res) {
  try {
    const { userId, waitingValue } = req.body;

    if (waitingValue === undefined) {
      return res.status(400).json({ success: false, error: 'Missing waiting value' });
    }
    if (typeof waitingValue !== 'boolean') {
      return res.status(400).json({ success: false, error: 'Wrong waiting value type' });
    }
    if (userId) {
      return res.status(400).json({ success: false, error: 'Missing userId' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(400).json({ success: false, error: 'No user found' });
    }

    user.is_waiting_action = waitingValue;
    await user.save();

    return res.status(200).json({ success: true, message: 'Waiting value has been updated!' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

module.exports = {
  index,
  store,
  checkChatId,
  setIsWaitingValue,
}