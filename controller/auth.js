const User = require("../models/User");
const bcrypt = require('bcryptjs');
let validPassword ;

exports.getLogin = (req, res, next) => {
  validPassword = req.query.validPassword;
  res.render("auth/login", {
    path: req.url,
    pageTitle: "Login",
    isAuthenticated: false,
    passwordvalid : validPassword,
    csrfToken : req.csrfToken()
  });
};

exports.postLogin = (req, res, next) => {
  //res.setHeader('Set-Cookie','loggedIn=true ');//this is way to inherent loggedIn in another pages
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email : email})
    .then((user) => {
      if(user){
        bcrypt.compare(password, user.password)
        .then(result => {
          if(result) {
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
      });
          }else {
            res.redirect('/auth/login' + '?validPassword=Please Add Password correct')
          } 
        })      
      } else {
        res.redirect('/auth/login' + '?validPassword=This Email is Not Register !! Try SingUp')
      }          
    })
    .catch((err) => console.log(err));
};

exports.postlLogout = (req, res, next) => {
  //res.setHeader('Set-Cookie','loggedIn=true ');//this is way to inherent loggedIn in another pages
  req.session.isLoggedIn = false;
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSingUp = (req, res, next) => {
   validPassword = req.query.validPassword;
  res.render("auth/signup", {
    path: req.url,
    pageTitle: "Login",
    isAuthenticated: false,
    passwordvalid : validPassword
  });
};
exports.PostSiginUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmPassword;
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
