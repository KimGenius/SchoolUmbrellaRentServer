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

require('./routes/main')(app, mysql.pool());
app.use(function (req, res, next) {
    res.status(404).send('?');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});