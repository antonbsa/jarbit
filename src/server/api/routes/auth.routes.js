const express = require('express');
const authRoutes = express.Router();

const { validateUserId } = require('../middlewares/authMiddleware');
const { authenticate, oauthCallback } = require('../controllers/auth/githubController');

// Github
const githubRoutes = express.Router();
authRoutes.use('/github', githubRoutes);

githubRoutes.get('/authenticate', validateUserId, authenticate);
githubRoutes.get('/oauth-callback', oauthCallback);

module.exports = authRoutes;