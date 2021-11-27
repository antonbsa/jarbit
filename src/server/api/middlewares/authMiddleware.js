const User = require('../models/User');

async function validateSomeId(req, res, next) {
  const { chatId, userId } = req.query;

  if (userId) {
    const user = await User.findOne({ _id: userId });

    if (!user) return res.status(400).json({ success: false, message: 'nao achou usuario com o _id' });
    res.data = userId;

    next()
  } else if (chatId) {
    const user = await User.findOne({ chatId: parseInt(chatId) });

    if (!user) return res.status(400).json({ success: false, message: 'nao achou usuario com o chatId' });
    res.data = user._id;

    next()
  } else {
    return res.status(400).json({ success: false, message: 'algum dado precisa ser passado' })
  }
}

module.exports = {
  validateSomeId
}