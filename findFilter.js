"use strict";

var _name;
var _address;
var _where;

const projection1 = {projection: {_id:0, name:1}};
const projection2 = {projection: {_id:0}};
const projection3 = {projection: {address:0}};

var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Name ? ", function(answer) {
	_name = answer;
	rl.question("Address ? ", function(answer) {
		_address = answer;
		rl.close();
	});
});

rl.on("close", function() {
	_where = {name:{$regex:_name,$options:"$i"}, address:{$regex:_address,$options:"$i"}};
	console.log(_where);
	query(projection2, _where);
});

/*
 *========================================================
 * Filter With Regular Expressions 
 *========================================================
 */

const {MongoClient: mMongo} = require('mongodb');
const client = new mMongo('mongodb://localhost:27017', {useUnifiedTopology: true});
const assert = require('assert');
const dbName = 'mydb';

function query(projection, query) {
	client.connect(function(err) {
		assert.equal(null, err);
		console.log("Connected successfully to server");
		const db = client.db(dbName);
		const collCustomers = db.collection('customers');
 
		//findOne(db, collCustomers, projection, query, displayLine, function() {
		find(db, collCustomers, projection, query, displayLines, function() {
			client.close();
		});
	});
};

const findOne = function(db, coll, projection, query, display, callback) {
	coll.findOne(query, projection, function(err, res) {
		assert.equal(err, null);
		display(res, true);
		callback();
	});
}

const find = function(db, coll, projection, query, display, callback) {
	coll.find(query, projection).toArray(function(err, res) {
		assert.equal(err, null, `Pb find ${query}`);
		display(res, true);
		callback();
	});
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
