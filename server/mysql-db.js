var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'13.124.150.35',
    port:3306,
    user:'capstone',
    password:'capstone',
    database:'capstoneDB'
});

module.exports = connection;