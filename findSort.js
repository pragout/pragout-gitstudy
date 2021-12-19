"use strict";
/*
 *========================================================
 * Sort the Result
 *========================================================
 */

const {MongoClient: mMongo} = require('mongodb');
const client = new mMongo('mongodb://localhost:27017', {useUnifiedTopology: true});
const assert = require('assert');
const dbName = 'mydb';

client.connect(function(err) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	const db = client.db(dbName);
	const collCustomers = db.collection('customers');
	const collProducts = db.collection('products');
	const projection = {projection: {_id:0}};
	const query = {};
	//const mySort = {name: 1}; // ascending 
	const mySort = {name: -1}; // descending 

	console.log("========= customers =============");
	find(db, collCustomers, projection, query, mySort, displayArray, function() {
		console.log("========= products =============");
		find(db, collProducts , {}, query, mySort, displayLines, function() {
			client.close();
		});
	});
});

const find = function(db, coll, projection, query, sort, display, callback) {
	coll.find(query, projection).sort(sort).toArray(function(err, res) {
	//coll.find(query, projection).sort(sort).limit(2).toArray(function(err, res) {
		assert.equal(err, null, "Pb find");
		display(res, true);
		callback();
	});
}

const displayArray = function(res) {
	const len = res.length;
	for (var i = 0; i < len; i++) {
		console.log(res[i]);	
	}
	console.log(`=== ${len} lignes ===`);
}

const displayLines = function(docs, header = false) {
	const len = docs.length;
	for (var i = 0; i < len; i++) {
		if (i == 0) {
			displayLine(docs[i], header);
		} else {
			displayLine(docs[i]);
		}
	}
	console.log(`=== ${len} lignes ===`);
}

const displayLine = function(doc, header = false) {
	if (header) {
		displayHeader(doc);	
	}
	var line = '';
	for (const property in doc) {
		line += doc[property] + '; ';
	}
	console.log(line.replace(/; $/,''));
}

const displayHeader = function(doc) {
	var header = '';
	for (const property in doc) {
		header += property + '; ';
	}
	console.log(header.replace(/; $/,''));
}
