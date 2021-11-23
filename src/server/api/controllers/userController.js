const User = require('../models/User');

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
    const { name } = req.body;
    if (!name) {
      return res.sttus(400).json({ error: 'Missing name' });
    }

    const user = new User({
      //TODO: escolher o tipo de definição de id
      // _id: 1,
      name
    });

    await user.save();
    return res.status(201).json({ message: 'user added succesfully!' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  index,
  store
}