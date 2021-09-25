const express = require('express');
const app = express();
const rootDir = require('./util/path');
const MongoConnect = require('./util/database');
const BodyParser = require('body-parser');


const adminData = require('./routes/admin');
const routershop = require('./routes/shop');

app.use(BodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.set('views', 'show page');

const path = require('path');
app.use(express.static(path.join(rootDir, 'public'))); // to direcct to folder css


app.use('/admin', adminData);
app.use(routershop);


    MongoConnect.mongoConnect((client) => {
      app.listen(3300);
    })
