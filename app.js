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
}).get('/update/:name', (req, res) => {
	let newValues = {$set: 
		{address: "92210 Saint Cloud", 
			tel:["0141129403","0686801769"],
			mail:["philippe.ragout@free.fr","philippe.ragout@gmail.com"]
		}
	};
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	update("customers", {name:{$regex:"^"+req.params.name,$options:"$i"}}, newValues).then((response) => {
		res.write(JSON.stringify(response));
		console.log(response.result.n, "document updated");
		res.end();
	}).catch((error) => {
		res.write(error);
		res.end();
	});
}).get('/delete/:name', (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	del("customers", {name:{$regex:"^"+req.params.name,$options:"$i"}}).then((response) => {
		res.write(JSON.stringify(response));
		console.log(response.result.n, "document deleted");
		res.end();
	}).catch((error) => {
		res.write(error);
		res.end();
	});
}).get('/drop/:collection', (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	drop(req.params.collection).then((response) => {
		res.write(response);
		console.log(req.params.collection, "deleted");
		res.end();
	}).catch((error) => {
		res.write(error);
		res.end();
	});
}).get('/find/:name', (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	find("customers", {name:{$regex:"^"+req.params.name,$options:"$i"}}).then((response) => {
		res.write(response);
		res.end();
	}).catch((error) => {
		res.write(error);
		res.end();
	});
}).get('/sort/:collection/-1', (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	sort(req.params.collection, {}, {name: -1}).then((response) => {
		res.write(response);
		res.end();
	}).catch((error) => {
		res.write(error);
		res.end();
	});
}).get('/sort/:collection/1', (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	sort(req.params.collection, {}, {name: 1}).then((response) => {
		res.write(response);
		res.end();
	}).catch((error) => {
		res.write(error);
		res.end();
	});
}).get('/join', (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	join().then((response) => {
		res.write(response);
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

/*
 *========================================================
 * Update Document(s)
 *========================================================
 */
function update(collection, query, data) {
	return new Promise((resolve, reject) =>  {
		let mdb = new MongoDB(dbName, mdbUrl);
		mdb.update(collection, query, data)
		.then(result => {resolve(result)})
		.catch(error => {reject(JSON.stringify(error))});
	});
}

/*
 *========================================================
 * Delete Document(s)
 *========================================================
 */
function del(collection, query) {
	return new Promise((resolve, reject) =>  {
		let mdb = new MongoDB(dbName, mdbUrl);
		mdb.del(collection, query)
		.then(result => {resolve(result)})
		.catch(error => {reject(JSON.stringify(error))});
	});
}

/*
 *========================================================
 * Drop collection
 *========================================================
 */
function drop(collection) {
	return new Promise((resolve, reject) =>  {
		let mdb = new MongoDB(dbName, mdbUrl);
		mdb.drop(collection)
		.then(result => {resolve(JSON.stringify(result))})
		.catch(error => {reject(JSON.stringify(error))});
	});
}

/*
 *========================================================
 * Find
 *========================================================
 */
function find(collection, query) {
	return new Promise((resolve, reject) =>  {
		let mdb = new MongoDB(dbName, mdbUrl);
		mdb.find(collection, query, {projection: {_id:0}})
		.then(result => {resolve(JSON.stringify(result))})
		.catch(error => {reject(JSON.stringify(error))});
	});
}

/*
 *========================================================
 * Sort the Result
 *========================================================
 */
function sort(collection, query, sort) {
	return new Promise((resolve, reject) =>  {
		let mdb = new MongoDB(dbName, mdbUrl);
		mdb.findSort(collection, query, {projection: {_id:0}}, sort)
		.then(result => {resolve(JSON.stringify(result))})
		.catch(error => {reject(JSON.stringify(error))});
	});
}

/*
 *========================================================
 * Join Collections
 *========================================================
 */
function join() {
	return new Promise((resolve, reject) =>  {
		let mdb = new MongoDB(dbName, mdbUrl);
		mdb.connect().then(db => {
			db.collection('customers').aggregate([
			{$lookup:
				{
					from: 'products',			// collection to join
					localField: 'product_id',	// field from the input documents
					foreignField: '_id',		// field from the documents of the "from" collection
					as: 'orderdetails'			// output array field
				}
			}
		    ]).toArray(function(err, res) {
				if (err) reject(JSON.stringify(err));
				resolve(JSON.stringify(res));
				mdb.client.close();
			});
		});
	});
}
