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

async function setIsWaitingValue(req, res) {
  try {
    const { _id, chatId, waitingValue } = req.body;

    if (waitingValue === undefined) return res.status(400).json({ message: 'Missing waiting value' });
    if (typeof waitingValue !== 'boolean') return res.status(400).json({ message: 'Wrong waiting value type' });
    if (!_id && !chatId) return res.status(400).json({ message: 'Missing user ID or chat ID' });

    const userCondition = _id ? { _id } : { chatId };
    const user = await User.findOne(userCondition);

    if (!user) return res.status(400).json({ message: 'No user found' });

    user.is_waiting_action = waitingValue;
    await user.save();

    return res.status(200).json({ message: 'Waiting value has been updated!' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  index,
  store,
  checkChatId,
  setIsWaitingValue,
}