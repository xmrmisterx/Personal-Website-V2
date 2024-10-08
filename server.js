const { urlencoded } = require('body-parser');
var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');
var axios = require('axios');
// require('dotenv'). config();

var app = express();
app.use(express.static('public'));

// set local port for testing

// app.set('port', 5125);

// console.log("process.env.APP_URL, ", process.env.APP_URL);

// set heroku port for deployment

var port = process.env.PORT || 8080;
app.set('port', port);
// app.set('port', 5432);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CORS());

// set server URL

// const serverURL = "https://nguyenbo-personal-website.herokuapp.com/"; 

// const serverURL = "http://localhost:5125/";
// const serverURL = "http://localhost:5432/";
const serverURL = "https://nguyenbo-website-d62b4830b849.herokuapp.com";

const { Client } = require('pg');

const client = new Client({
  // connectionString: process.env.serverURL,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

/* IMAGE SCRAPER FOR MOUNTAIN SITE CODE */

// set variables for image scraper

var item_number = 0;
var img_url = '';
var query_str = '';

// get request for image scraper

app.get('/scraper/:str', (req, res) => {

  // set query string

  query_str = req.params.str;

  (async () => {
    try {

      // get item number

      const response = await axios.get("https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=" + query_str + "&format=json&formatversion=2");
      item_number = response.data.query.pages[0].pageprops.wikibase_item;

    } catch (error) {
      console.log(error.response);
    }

    try {

      // get image name

      const response = await axios.get("https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=" + item_number + "&format=json");
      let image_name = response.data.claims.P18[0].mainsnak.datavalue.value;

      // replace spaces in image name with underscores

      let processed_image_name = "";

      for (let i=0; i <image_name.length; i++) {
        curr_letter = image_name[i];
        if (curr_letter == " "){
          curr_letter = "_";
        }
        processed_image_name += curr_letter;
      }

      // image url is wiki site plus image name

      img_url = "https://commons.wikimedia.org/w/thumb.php?width=400&f=" + processed_image_name;

    } catch (error) {
      console.log(error.response);
    }

    // send image url

    res.send(img_url);

  })();
});

/* WORKOUT LOG CODE */

const getAllQuery = 'SELECT * FROM workout';
const insertQuery = "INSERT INTO workout (name, reps, weight, unit, date) VALUES ($1, $2, $3, $4, $5)";

// const insertQuery = "INSERT INTO workout (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?, ?, ?, ?, ?)";
const updateQuery = "UPDATE workout SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=?";
const deleteQuery = "DELETE FROM workout WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS workout";
const makeTableQuery = `CREATE TABLE workout(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        unit BOOLEAN, 
                        date DATE);`;

// Unit of 0 is lbs and unit of 1 is kgs

// gets table data function

const getAllData = (res) => { 
  client.query(getAllQuery, (err, rows, fields) => {
  // mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if (err){
      next(err);
      return;
    }
    res.set("Access-Control-Allow-Origin: *");
    res.json({ "rows": rows });
  })
}

// create function to ping server every 30 mins to prevent Heroku app from sleeping (every 5 minutes is 300000 ms)

setInterval(function() {
  https.get(serverURL);
}, 1800000);

// get request to get data

app.get('/api',function(req,res,next){
  var context = {};
  client.query(getAllQuery, (err, rows, fields) => {
  // mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.set("Access-Control-Allow-Origin: *");
    res.send(context);
  });
});

// post request to insert data

app.post('/api',function(req,res,next){
  var {name, reps, weight, unit, date} = req.body;
  // var {name, reps, weight, unit, date, id} = req.body;
  client.query(
  // mysql.pool.query(
    insertQuery, 
    [name, reps, weight, unit, date],
    // [name, reps, weight, unit, date, id],
    (err, result) => {
      if(err){
        next(err);
        return;
      }
      getAllData(res); 
    }
  );
});

// delete request to delete row

app.delete('/api',function(req,res,next){
  var {id} = req.body;
  var context = {};
  client.query(deleteQuery, [id], (err, result) => {
  // mysql.pool.query(deleteQuery, [id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    getAllData(res);
  });
});

// put request to edit row

app.put('/api',function(req,res,next){
  var context = {};
  var {name, reps, weight, unit, date, id} = req.body;
  client.query(updateQuery,
  // mysql.pool.query(updateQuery,
      [name, reps, weight, unit, date, id],
    (err, result) => {
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.set("Access-Control-Allow-Origin: *");
    res.send(context);
  });
});

// get request to reset table

app.get('/api/reset-table',function(req,res,next){
  var context = {};
  client.query(dropTableQuery, function(err){
    client.query(makeTableQuery, function(err){
  // mysql.pool.query(dropTableQuery, function(err){
  //   mysql.pool.query(makeTableQuery, function(err){
      console.log("table reset");
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});













