var express = require('express');
var app = express();
var fs = require('fs');

app.set('view engine', 'ejs');  //tell Express we're using EJS

app.get('/', function (req, res) {

	var pg = require("pg");
	var conString = "postgres://postgres:postgres@127.0.0.1:5433/test";
	var client = new pg.Client(conString);
	client.connect();

	var query = client.query("SELECT name, ST_AsGeoJSON(geom) as geometry \
	   FROM world;"
	  );
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on("end", function (result) {
		console.log(JSON.stringify(result.rows, null, "    "));
		res.render('index', {val: JSON.stringify(result.rows)});
		client.end();
	});

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});