const { validate: isUuid } = require('uuid');
const User = require('../models/User');

async function validateUserId(req, res, next) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Missing ID' });
  }
  if (!isUuid(userId)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
  res.data = userId;
  next();
}

module.exports = {
  validateUserId
}