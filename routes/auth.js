const express = require('express');
const authController = require('../controller/auth');
const route = express.Router();

route.get('/login', authController.getLogin);

route.post('/login', authController.postLogin);

route.post('/logout', authController.postlLogout);

route.get('/SignUp', authController.getSingUp);

route.post('/signup', authController.PostSiginUp);

module.exports = route;