const User = require('../models/User');
const { v4:uuid } = require('uuid');

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
    const { first_name, last_name, chatId, language } = req.body;
    if (!first_name) return res.status(400).json({ error: 'Missing first_name' });

    const user = new User({
      _id: uuid(),
      first_name,
      last_name,
      chatId,
      language
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
    if (!chatId) return res.status(400).json({ message: 'Missing chatId' });

    const user = await User.findOne({ chatId });
    return res.status(200).json({ data: (user) ? user : false });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function setWaitingAction(req, res) {
  try {
    const { waitingValue } = req.body;
    if (!waitingValue) return res.status(400).json({ message: 'Missing waiting value' });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  index,
  store,
  checkChatId,
  setWaitingAction,
}