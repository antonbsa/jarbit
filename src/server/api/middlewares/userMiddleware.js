const User = require('../models/User');

async function checkUserData(req, res, next) {
  const { firstName } = req.body;
  if (!firstName) {
    return res.status(400).json({ error: 'Missing first name argument' });
  }

  res.data = req.body;
  next();
}

async function validateChatId(req, res, next) {
  const { chatId } = req.params;

  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      return res.status(200).json({ success: false, error: 'User not found' });
    }

    res.data = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  checkUserData,
  validateChatId,
}