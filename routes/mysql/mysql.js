'use strict'
const mysql = require('mysql');
const mysql_config = require('./config');
module.exports.pool = function () {
    var pool = mysql.createPool(mysql_config);
    return pool;
};