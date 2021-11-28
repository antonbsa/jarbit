const User = require('../models/User');

async function validateChatId(req, res, next) {
  const { chatId } = req.params;

  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    res.data = user;
    next();
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

module.exports = {
  validateChatId
}