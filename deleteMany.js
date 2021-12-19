"use strict";

var _name;
var _where;

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
	_where = {name:{$regex:_name, $options:"$i"}};
	console.log(_where);
	del(_where);
});

/*
 *========================================================
 * Delete Document
 *========================================================
 */

const {MongoClient: mMongo} = require('mongodb');
const client = new mMongo('mongodb://localhost:27017', {useUnifiedTopology: true});
const assert = require('assert');
const dbName = 'mydb';

function del(query) {
	client.connect(function(err) {
		assert.equal(null, err);
		console.log("Connected successfully to server");
		const db = client.db(dbName);
		db.collection('customers').deleteMany(query, function(err, res) {
			assert.equal(err, null);
			console.log(res.result.n, "documents deleted");
			client.close();
		});
	});
};
