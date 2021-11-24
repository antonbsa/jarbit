const User = require('../models/User');

async function validateChatId(req, res, next) {
  const { chatId } = req.params;
  console.log(req.query, req.params, req.body);

  try {
    const user = await User.findOne({ chatId });
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  validateChatId
}