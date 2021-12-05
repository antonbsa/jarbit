const { validate: isUuid } = require('uuid');
const User = require('../models/User');

async function validateUserId(req, res, next) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing user ID' });
  }
  if (!isUuid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(200).json({ success: false, message: 'User not found' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  res.data = userId;
  next();
}

module.exports = {
  validateUserId
}