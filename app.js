const express = require('express');
const app = express();
const rootDir = require('./util/path');
const MongoConnect = require('./util/database');
const BodyParser = require('body-parser');
const Data = require('./Data');
const User = require('./models/User');
const mongooes = require('mongoose');

const adminData = require('./routes/admin');
const routershop = require('./routes/shop');

app.use(BodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.set('views', 'show page');

const path = require('path');
app.use(express.static(path.join(rootDir, 'public'))); // to direcct to folder css

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

app.use('/admin', adminData);
app.use(routershop);

  /* this is will comment to work use mongooes instead of use query mongo basic

    MongoConnect.mongoConnect((client) => {
      app.listen(3300);
    })

    in this will use tooles mongooes that tooles such as sequalize in sql //*/

    //*
    mongooes.connect(
      `mongodb+srv://mena:${Data.password}@cluster0.ovkbw.mongodb.net/${Data.name}?retryWrites=true&w=majority`)
    .then(result => {
      User.findOne()
      .then(user => {
        if(!user){
          const user = new User({
            name: 'mena',
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