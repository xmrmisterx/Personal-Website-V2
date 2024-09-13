var mysql = require('mysql');

// var pool = mysql.createPool({
//   host            : 'us-cdbr-east-06.cleardb.net',
//   user            : 'b71e93b0879965',
//   password        : 'fb2590aa',
//   database        : 'heroku_67e0c751e4b8160',
// });

var pool = mysql.createPool({
  host            : 'caij57unh724n3.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
  user            : 'ue4ladd0heslkf',
  password        : 'p885b1ed81a9e330617033050d23165f0a50d441f71d06fa88839040452afb112',
  database        : 'd9uhqmpgn3to31',
});

module.exports.pool = pool;
