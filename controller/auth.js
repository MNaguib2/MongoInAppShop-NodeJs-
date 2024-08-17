const User = require("../models/User");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const aler = require('alert');
const { check , validationResult } = require('express-validator/check');
let validPassword;

//*
const nodemail = require('nodemailer');
const sendridtransport = require('nodemailer-sendgrid-transport');
// const transport = nodemail.createTransport(sendridtransport({
//   auth: {
//     api_key: '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'
//   }
// }))
const transport = nodemail.createTransport({
  service: "gmail",
  auth: {
    user: "teste.learningnodejs@gmail.com",
    pass: `${process.env.passGMAIL}` // hide password
  },
  tls: {
    rejectUnauthorized: false
  }
})
let mailOptions = {
  from: "menaafefe1@gmail.com",
  to: "menaafefe414@yahoo.com",
  subject: "Testing",
  text: "first email send from Node Js from NodeMail"
}
// transport.sendMail(mailOptions , (err , successful) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log("sended email is successful !!");
//   }
// })
//*/ there is two way to send email via node js on from sendgrib ofcourse use nodemail and another use nodemail only

exports.getLogin = (req, res, next) => {
  validPassword = req.query.validPassword;
  message = req.flash('error');
  res.render("auth/login", {
    path: req.url,
    pageTitle: "Login",
    isAuthenticated: false,
    passwordvalid: validPassword,
    errorMessage : message, //in this page use two way on via link url and anohter via flash
    // csrfToken : req.csrfToken()
  });
};

exports.postLogin = (req, res, next) => {
  //res.setHeader('Set-Cookie','loggedIn=true ');//this is way to inherent loggedIn in another pages
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password)
          .then(result => {
            if (result) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.user = user;
              req.session.save((err) => {  //.save ( ) to wait until finish
                console.log(
                  err
                    ? "this is  error in PostLogin in AuthController " + err
                    : "No error Found Successful Login in PostLogin in AuthController "
                );
                res.redirect("/");
                return transport.sendMail({
                  to: email,
                  from: 'menaafefe1@gmail.com',
                  subject: 'siginUp Sucessed !!',
                  html: '<h1>You Successfully signed Up !</h1>'
                }).catch(err => console.log(err));
              });
            } else {
              req.flash('error', 'this is error in email or password');
              res.redirect('/auth/login' + '?validPassword=Please Add Password correct')
            }
          })
      } else {
        req.flash('error', 'this is error in email or password');
        res.redirect('/auth/login' + '?validPassword=This Email is Not Register !! Try SingUp')//this another way to send error two page get render
      }
    })
    .catch((err) => console.log(err));
};

exports.postlLogout = (req, res, next) => {
  //res.setHeader('Set-Cookie','loggedIn=true ');//this is way to inherent loggedIn in another pages
  req.session.isLoggedIn = false;
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};

exports.getSingUp = (req, res, next) => {
  validPassword = req.query.validPassword;
  res.render("auth/signup", {
    path: req.url,
    pageTitle: "Login",
    isAuthenticated: false,
    passwordvalid: validPassword,
    oldData : {
      email: '',
      password : '',
      confirmPassword : ''
    },
    ValidationErrors : []
  });
};
exports.PostSiginUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmPassword;
  const errors = validationResult(req);
  //console.log(errors.array());
  if(!errors.isEmpty()){
    return res.status(422).render("auth/signup", {
      path: req.url,
      pageTitle: "Login",
      isAuthenticated: false,
      passwordvalid: errors.array()[0].msg,
      oldData : {
        email: email,
        password : password,
        confirmPassword : confirmpassword
      },
    ValidationErrors : errors.array()
    });
  }
  let addUser;
  User.findOne({ email: email })
    .then((result) => {
      if (!result) {
        if (password == confirmpassword) {
          return bcrypt.hash(password, 12)
            .then(hasedPasswoed => {
              addUser = new User({
                password: hasedPasswoed,
                email: email,
                items: [],
              });
              addUser.save();
              req.session.isLoggedIn = true;
              req.session.user = addUser;
              req.session.save((err) => {
                console.log(
                  err
                    ? ("this is  error in PostSiginUp in AuthController " + err)
                    : "No error Found Successful Login in PostLogin in AuthController "
                );
                res.redirect("/");
                //console.log(email);
                return transport.sendMail({
                  to: email,
                  from: 'menaafefe1@gmail.com',
                  subject: 'siginUp Sucessed !!',
                  html: '<h1>You Successfully signed Up !</h1>'
                }).then(result => {
                  //console.log(result);
                }).catch(err => console.log(err));
              });
            })
        } else {
          res.redirect('/auth/SignUp' + '?validPassword=Please Add Password correct');
        }
      } else {
        res.redirect('/auth/SignUp' + '?validPassword=This Email is already Register');
      }
    })
    .catch((err) => console.log(err));
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/restpassword', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.PostRestPassword = (req, res, next) => {
  emailEnter = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/auth/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({ email: emailEnter })
      .then(result => {
        if (!result) {
          req.flash('error', 'No account with this email found.');
          return res.redirect('/auth/reset')
        } else {
          result.restToken = token;
          result.restTokenExpiration = Date.now() + (3600000 * 3);
          return result.save()
            .then(resu => {
              if (resu) {
                res.redirect('/')
                return transport.sendMail({
                  from: 'menaafefe1@gmail.com',
                  to: emailEnter,
                  subject: 'siginUp Sucessed !!',
                  html:
                    `
               <p>You requested a password reset</p>
               <p>Click this <a href="http://localhost:3300/auth/${token}">link</a> to set a new password.</p>
             `,
                  //text : token //this is work but now we will try another way
                })
                  //.then(result => {
                  //   console.log(result);
                  // })
                  .catch(err => console.log(err));
              }
            }).catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  })
}

exports.getNewPassword = (req, res, next) => {
  let message = req.flash('error');
  // console.log(req.baseUrl + req.url);
  let token = req.params.token;
  User.findOne({ restToken: token, restTokenExpiration: { $gt: Date.now() } })
    .then(result => {
      //console.log(result);
      if (result) {
        // if(result.restTokenExpiration > Date.now()){ //this is comment to use another way to detected conditation expiration date is remain
        res.render('auth/newPassword', {
          path: req.baseUrl + req.url,
          pageTitle: 'New Password',
          errorMessage: message[0],
          userId: result._id
        });
        // }else{//this is comment to use another way to detected conditation expiration date is remain
        //   res.redirect('/auth/reset');
        // }
      } else {
        res.redirect('/');
      }
    }).catch(err => console.log(err));

}
exports.PostNewPassword = (req, res, next) => {
  const password = req.body.password;
  const passwordConfirm = req.body.confirmPassword;
  const userId = req.body.UserId;
  if (password == passwordConfirm) {
    User.findById(userId)
      .then(user => {
        if (!user) {
          aler('Please Check Your Mail')
          return res.redirect('/');
        } else {          
          return bcrypt.hash(password , 12)
          .then(PasswordHashed => {
            user.password = PasswordHashed;
            user.restToken = null;
            user.restTokenExpiration = null;
            user.save()
            .then(result => {
              res.redirect('/auth/login');
              console.log('Password Is Changed Ok !!')
            })
            .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  } else {
    req.flash('error', 'this Password is Not Confirm')
    res.redirect('back');
  }
}