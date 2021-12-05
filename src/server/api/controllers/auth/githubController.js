const axios = require("axios");
const User = require('../../models/User');
const { githubAuthClient, githubAuthSecret } = require('../../../params');

const githubApiURL = 'https://api.github.com';
const githubURL = 'https://github.com';

async function authenticate(req, res) {
  const userId = res.data;

  res.redirect(`${githubURL}/login/oauth/authorize?state=${JSON.stringify({ userId })}&client_id=${githubAuthClient}&scope=notifications%20read:user`);
}

async function oauthCallback(req, res) {
  const { code, state } = req.query;
  const { userId } = JSON.parse(state);

  const params = {
    client_id: githubAuthClient,
    client_secret: githubAuthSecret,
    code,
  }

  const opts = { headers: { accept: 'application/json' } };
  try {
    const authResponse = await axios.post(`${githubURL}/login/oauth/access_token`, params, opts);
    const { access_token } = authResponse.data;

    const { data } = await axios.get(`${githubApiURL}/user`, { headers: { Authorization: `token ${access_token}` } });
    const { login: username, location } = data;

    const user = await User.findOne({ userId });
    const githubData = {
      access_token: {
        value: access_token,
        generated_at: new Date(),
      },
      username,
    }

    if (location) githubData.location = location;

    user.authentications.github = githubData;
    await user.save();

    return res.status(200).json({ success: true, message: 'Github data added to user' });
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
}

module.exports = {
  authenticate,
  oauthCallback,
}