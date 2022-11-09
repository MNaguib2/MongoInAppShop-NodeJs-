const express = require('express');
const app = express();
const rootDir = require('./util/path');
const MongoConnect = require('./util/database');
const BodyParser = require('body-parser');
const Data = require('./Data');
const User = require('./models/User');
const flash = require('connect-flash');
const errorController= require('./controller/error');
const multer =require('multer');


const MongoDbURI = 
`mongodb+srv://mena:${Data.password}@cluster0.ovkbw.mongodb.net/${Data.name}?retryWrites=true&w=majority`
const mongooes = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf'); //this is first way to use algoristhm csrf token after install (npm install --save csurf)

const store = new MongoDBStore({
  uri: MongoDbURI,
  collection: 'Registery'
});

const csurfProduct = csurf(); //is second way in use algoristhm csrf token

const adminData = require('./routes/admin');
const routershop = require('./routes/shop');
const auth = require('./routes/auth');

const fileStorage = multer.diskStorage({
  destination: (req , file, cb) => {
      cb(null, 'images')
  }, 
  filename: (req, file , cb) => {
     //console.log(file);
      cb(null, file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(BodyParser.urlencoded({ extended: false })); //this is to Handle JSON Request incomming
app.use(multer({  /*dest:'images' this comment to edite in file storage in extention or any thing*/
 storage: fileStorage,
 fileFilter: fileFilter}).single('image'))

app.set('view engine', 'ejs');

app.set('views', 'show page');

const path = require('path');
// console.log(rootDir);
app.use(express.static(path.join(rootDir , 'public'))); // to direcct to folder css
app.use('/images',express.static(path.join(rootDir, 'images'))); // to direcct to folder source file


app.use(session(
  {secret: 'my sedcret', resave: false, saveUninitialized: false, 
  //*
  cookie: {maxAge: (3600000 * 3)}, 
  //you can add any configuration to cookie here*/
  store: store
}));

/* i will comment this to use signin and define every user
app.use((req, res, next) => {
  User.findById('6160d377aee8733895e1c8e5')//this to db mongoose
  //User.findById('6150ed114a973eb705a100b0') //this to use db mongo normal
    .then(user => {
      //req.user = new User(user.name, user.email, user.cart, user._id); //this syntax when use Defualt mongo
      req.user = user; // this syntax use during mongoose 
      next();
    })
    .catch(err => console.log(err));
});
//*/

app.use(csurfProduct); 
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})
app.use('/admin', adminData);
app.use('/auth', auth);
app.use(routershop);

  /* this is will comment to work use mongooes instead of use query mongo basic

    MongoConnect.mongoConnect((client) => {
      app.listen(3300);
    })

    in this will use tooles mongooes that tooles such as sequalize in sql //*/

    //*
    mongooes.connect(
      MongoDbURI)
    .then(result => {
      User.findOne()
      .then(user => {
        if(!user){
          const user = new User({
            password: 'mena',
            email: 'test@test.com',
            items: []
          });
          user.save();
        }
      })
      .catch(err => console.log(err));
      app.listen(3300);
    })
    .catch(err => console.log(err));

    //*/

    app.get('/500', errorController.get500);
    
    app.use((error, req, res, next) => {
      // res.status(error.httpStatusCode).render(...);
      // res.redirect('/500');
        //console.log(error);
      res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn,
        Error : error
      });
    });