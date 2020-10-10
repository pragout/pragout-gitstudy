"use strict";
const http = require('http');
const hostname = '127.0.0.1';
const port = 8081;
const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	join().then((response) => {
		res.write(response);
		res.end();
	}).catch((error) => {
		res.write(error);
		res.end();
	});
});
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

/*
 *========================================================
 * Join Collections
 *========================================================
 */

const {MongoClient: mMongo} = require('mongodb');
const dbName = 'mydb';

function join() {
	return new Promise((resolve, reject) =>  {
		const client = new mMongo('mongodb://localhost:27017', {useUnifiedTopology: true});
		client.connect(function(err) {
			if (err) reject(err);
			const db = client.db(dbName);
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
				if (err) reject(err);
				resolve(JSON.stringify(res));
				client.close();
			});
		});
	});
}
