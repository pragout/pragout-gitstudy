"use strict";

var _name;
var _where;
var newValues = {$set: 
	{address: "92210 Saint Cloud", 
		tel:["0141129403","0686801769"],
		mail:["philippe.ragout@free.fr","philippe.ragout@gmail.com"]
	}
};
var newValues2 = {$set: {product_id: 154}};

var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Name ? ", function(answer) {
	_name = answer;
	rl.close();
});

rl.on("close", function() {
	_where = {name:{$regex:_name,$options:"$i"}};
	console.log(_where);
	update(_where, newValues);
});

/*
 *========================================================
 * Update Document
 *========================================================
 */

const {MongoClient: mMongo} = require('mongodb');
const client = new mMongo('mongodb://localhost:27017', {useUnifiedTopology: true});
const assert = require('assert');
const dbName = 'mydb';

function update(query, newValues) {
	client.connect(function(err) {
		assert.equal(null, err);
		console.log("Connected successfully to server");
		const db = client.db(dbName);

		db.collection('customers').updateMany(query, newValues, function(err, res) {
			assert.equal(err, null);
			console.log("res.result :", res.result);
			console.log(res.result.n, "document updated");
			client.close();
		});
	});
};
