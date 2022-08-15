var mysql = require('mysql');

var pool = mysql.createPool({
  host            : 'us-cdbr-east-06.cleardb.net',
  user            : 'b71e93b0879965',
  password        : 'fb2590aa',
  database        : 'heroku_67e0c751e4b8160',
});

// var pool = mysql.createPool({
//   host            : 'us-cdbr-east-04.cleardb.com',
//   user            : 'ba78fb274f2846',
//   password        : 'e7c84551',
//   database        : 'heroku_2502c22c3414591',
// });

module.exports.pool = pool;
