const {MongoClient: mMongo} = require('mongodb');
const client = new mMongo('mongodb://localhost:27017', {useUnifiedTopology: true});

const assert = require('assert');
 
// Database Name
const dbName = 'mydb';

// Objets pour mises à jour =============================================
var objCie = { name: "Company Inc", address: "Highway 37" };
var objCies = [
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
var objProd = [
	{ _id: 154, name: 'Chocolate Heaven'},
	{ _id: 155, name: 'Tasty Lemon'},
	{ _id: 156, name: 'Vanilla Dream'}
];
// ======================================================================

client.connect(function(err) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	const db = client.db(dbName);
	const collCustomers = db.collection('customers');
	const collProducts = db.collection('products');
 
 	// Insert one document customers
	insertOneDocument(db, collCustomers, objCie, function() {
		// Insert some documents customers
		insertDocuments(db, collCustomers, objCies, function() {
			// Insert some documents products
			insertDocuments(db, collProducts, objProd, function() {
				client.close();
			});
		});
	});
});

const insertOneDocument = function(db, coll, obj, callback) {
	coll.insertOne(obj, function(err, res) {
		assert.equal(err, null);
		console.log("1 document inserted");
		callback();
	});
}

const insertDocuments = function(db, coll, obj, callback) {
	coll.insertMany(obj, function(err, res) {
		assert.equal(err, null);
		console.log("Number of documents inserted: " + res.insertedCount);
		callback();
	});
}
