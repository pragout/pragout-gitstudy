"use strict";
const http = require('http');
const express = require('express');
const app = express();
const server = http.Server(app);

const HOSTNAME = '127.0.0.1';
const PORT = 8081;

const MongoDB = require ('./lib/MongoDB.class.js');
const dbName = 'mydb';
const mdbUrl = '//localhost:27017';

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
	res.render('index');
}).get('/insert/:collection', (req, res) => {
	let data = '';
	if (req.params.collection == "products") {
		data = [
			{ _id: 154, name: 'Chocolate Heaven'},
			{ _id: 155, name: 'Tasty Lemon'},
			{ _id: 156, name: 'Vanilla Dream'}
		];
	} else {
		data = [
			{ name: 'John', address: 'Highway 71'},
			{ name: 'Peter', address: 'Lowstreet 4'},
			{ name: 'Amy', address: 'Apple st 652'},
			{ name: 'Hannah', address: 'Mountain 21'},
			{ name: 'Michael', address: 'Valley 345'},
			{ name: 'Sandy', address: 'Ocean blvd 2'},
			{ name: 'Betty', address: 'Green Grass 1'},
			{ name: 'Richard', address: 'Sky st 331'},
			{ name: 'Susan', address: 'One way 98'},
			{ name: 'Vicky', address: 'Yellow Garden 2'},
			{ name: 'Ben', address: 'Park Lane 38'},
			{ name: 'William', address: 'Central st 954'},
			{ name: 'Chuck', address: 'Main Road 989'},
			{ name: 'Viola', address: 'Sideway 1633'}
		];
	}
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	insert(req.params.collection, data).then((response) => {
		res.write(JSON.stringify(response));
		console.log(response.result.n, "document inserted");
		res.end();
	}).catch((error) => {
		res.write(error);
		res.end();
	});
}).use((req, res, next) => {
	res.redirect('/');
});

server.listen(PORT, HOSTNAME, () => {
	console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

/*
 *========================================================
 * Insert Document(s)
 *========================================================
 */
function insert(collection, data) {
	return new Promise((resolve, reject) =>  {
		let mdb = new MongoDB(dbName, mdbUrl);
		mdb.insert(collection, data)
		.then(result => {resolve(result)})
		.catch(error => {reject(JSON.stringify(error))});
	});
}
