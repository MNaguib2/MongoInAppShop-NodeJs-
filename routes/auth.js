const express = require('express');

const authController = require('../controller/auth');

const { check , body } = require('express-validator/check');
const User = require("../models/User");

const route = express.Router();

route.get('/login', authController.getLogin);

route.post('/login', authController.postLogin);

route.post('/logout', authController.postlLogout);

route.get('/SignUp', authController.getSingUp);

route.post('/SignUp',
    [
        check('email')
        .isEmail()
        .withMessage('This Email is not vaild')
        .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //   throw new Error('This email address if forbidden.');
            // }
            // return true;
            return User.findOne({ email: value }).then(userDoc => {
              if (userDoc) {
                return Promise.reject(
                  'E-Mail exists already, please pick a different one.'
                );
              }
            });
          }),
        body(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters.'
          )
            .isLength({ min: 5 })
            .isAlphanumeric(), //allow numbers and normal characters
          body('confirmPassword')
          .trim() //this is metod specialist by sanitising this made remove space or athor symbols and use another method to put anuther character
                 //trim characters (whitespace by default) from both sides of the input.
                //https://www.npmjs.com/package/validator
          .custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Passwords have to match!');
            }
            return true;
          })          
    ]
    , authController.PostSiginUp);

route.get('/reset', authController.getReset);

route.post('/reset', authController.PostRestPassword);

route.get('/:token', authController.getNewPassword);

route.post('/newPassword', authController.PostNewPassword);

module.exports = route;