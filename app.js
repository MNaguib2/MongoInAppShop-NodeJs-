const express = require('express');
const app = express();
const adminData = require('./routes/admin');
const routershop = require('./routes/shop');

app.use('/admin', adminData);
app.use(routershop);


app.set('view engine', 'ejs');

app.set('views', 'show page');

const path = require('path');
app.use(express.static(path.join(rootDir, 'public'))); // to direcct to folder css

app.listen(3300);