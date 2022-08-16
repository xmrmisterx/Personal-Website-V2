var mysql = require('mysql');

var pool = mysql.createPool({
  host            : 'us-cdbr-east-06.cleardb.net',
  user            : 'b71e93b0879965',
  password        : 'fb2590aa',
  database        : 'heroku_67e0c751e4b8160',
});

module.exports.pool = pool;
