const express = require('express');
const authRoutes = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/auth/githubController');

// Github
const githubRoutes = express.Router();
authRoutes.use('/github', githubRoutes);

githubRoutes.get('/authenticate', authMiddleware.validateSomeId, authController.authenticate);
githubRoutes.get('/oauth-callback', authController.oauthCallback);

module.exports = authRoutes;