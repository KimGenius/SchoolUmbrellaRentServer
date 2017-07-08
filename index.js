'use strict';
const express = require('express');
const app = express();

const mysql = require('./routes/mysql/mysql');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

require('./routes/main')(app, mysql.pool());
app.use(function (req, res, next) {
    res.status(404).send('?');
});

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});