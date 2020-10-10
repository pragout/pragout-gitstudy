const {MongoClient: mMongo} = require('mongodb');
const client = new mMongo('mongodb://localhost:27017', {useUnifiedTopology: true});

const assert = require('assert');
 
// Database Name
const dbName = 'mydb';

client.connect(function(err) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	const db = client.db(dbName);
	const collCustomers = db.collection('customers');
	const collProducts = db.collection('products');
 
 	// Find All
	find(db, collCustomers, displayCustomer, function() {
		find(db, collProducts, displayProduct, function() {
 			// Find the first document in the customers collection
			findOne(db, collCustomers, displayOneCustomer, function() {
				client.close();
			});
		});
	});
});

const findOne = function(db, coll, display, callback) {
	coll.findOne({}, function(err, res) {
		assert.equal(err, null);
		display(res);
		callback();
	});
}

const find = function(db, coll, display, callback) {
	coll.find({}).toArray(function(err, res) {
		assert.equal(err, null, "Pb find");
		display(res);
		callback();
	});
}

const displayOneCustomer = function(doc) {
	console.log(doc.name, doc.address);
}

const displayCustomer = function(docs) {
	const len = docs.length;
	for (var i = 0; i < len; i++) {
		console.log(
			docs[i]._id,
			docs[i].name,
			docs[i].address
		);
	}
	console.log(`=== ${len} lignes ===`);
}

const displayProduct = function(docs) {
	const len = docs.length;
	for (var i = 0; i < len; i++) {
		console.log(
			docs[i]._id,
			docs[i].name
		);
	}
	console.log(`=== ${len} lignes ===`);
}
