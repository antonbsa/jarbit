const axios = require("axios");
const User = require('../../models/User');

const githubApiUrl = 'https://api.github.com';
const githubUrl = 'https://github.com';

async function authenticate(req, res) {
  const userId = res.data;

  res.redirect(`${githubUrl}/login/oauth/authorize?state=${JSON.stringify({ userId })}&client_id=${process.env.DEV_GITHUB_OAUTH_CLIENT}&scope=notifications%20read:user`);
}

async function oauthCallback(req, res) {
  const { code, state } = req.query;
  const { userId } = JSON.parse(state);

  const params = {
    client_id: process.env.DEV_GITHUB_OAUTH_CLIENT,
    client_secret: process.env.DEV_GITHUB_OAUTH_SECRET,
    code
  }

  const opts = { headers: { accept: 'application/json' } };
  const authResponse = await axios.post(`${githubUrl}/login/oauth/access_token`, params, opts);
  const { access_token } = authResponse.data;

  const { data } = await axios.get(`${githubApiUrl}/user`, { headers: { Authorization: `token ${access_token}` } });
  const { login: username, location } = data;

  // TODO :: salvar o access_token do usuário
  const user = await User.findOne({ _id: userId });
  const githubData = {
    access_token: {
      value: access_token,
      generated_at: new Date(),
    },
    username
  }

  if (location) githubData.location = location;

  user.authentications.github = githubData;
  await user.save();
  // TODO :: adicionar os try/catchs nessa parte

  // const userResponse = await axios.get('${githubApiUrl}/notifications?all=true', { headers: { Authorization: `token ${access_token}` } });
  return res.status(200).json({ success: true, message: 'Github data added to user' });
}

module.exports = {
  authenticate,
  oauthCallback,
}