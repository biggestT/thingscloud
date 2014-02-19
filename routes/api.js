/*
 * GET one user's things
 */
var request = require('superagent');
var Hashids = require('hashids');
var async = require('async');

// SEND REPSONSE TO CLIENT 
// ----------------------

// Callback function to send response from queries
function sendResponse(err, result)	{
	if(err) { 
		this.status(400);
		this.send(err);
	}
	else {
		if (result.length > 1) {
			this.send(result);
		}
		else {
			this.send(result[0]);
		}
	}
};		

// UNIQUE THINGSBOOK ID GENERATION
// -----------------------------

// Hash INPUT: 
// DropBoxUserId + Milliseconds passed between 2013.10.01 and the current time
// -> 2^30 (if the number of dropboxusers stays below 1 billion) * 2^37 (if the current time < 2020.01.01) ~= 2^70 different inputs
// to avoid conflicts we need a hashfunction that has more outputs than inputs
// Hash OUTPUT:
// HashIds uses 62 different characters in hashes, 
// and therefore we set the hash length to 12 since 62^12 > 2^70

// By knowing the secret for the Hashid we can know when by whom and when a certain thing was created from its unique tid


function generateThingsbookID(uid) {

	var hash = new Hashids('my secret');
	var now = new Date();
	var millisecondsPassed = now.getTime() - Date.UTC(2013, 10, 01, 0, 0, 0, 0);

	var tid = hash.encrypt(uid, millisecondsPassed);

	return tid;
}

// DELETE THING AND ITS RELATIONSHIPS
// ---------------------

exports.deleteThingREST = function (req, res) {

	var db = server.get('neo4j');
	var tid = req.params.tid;

	var query = [
	'START t=node:Things(tid={tid})',
	'MATCH (t)-[r]-()',
	'WITH t, r',
	'MATCH (t)-[r2]->(n)',
	'WHERE NOT (t)-[r2]->(n)--()',
	'DELETE t, r, n'
	].join('\n');

	params = {
		tid: req.params.tid,
		uid: req.uid
	};

	db.query(query, params, function(err, result) {
		if(err) { 
			res.status(400);
			res.send(err.message);
		}
		else {
			res.send(req.body);
		}
	})
}

// GET A THING AND ITS RELATED DATA
// ------------------------------

exports.getThingsREST = function(req, res){

	var db = server.get('neo4j');

	var query = [
		'START me=node:Users(uid={uid})',
		'MATCH me-[r:OWNS]->t',
		'WITH t AS thing, r.since AS ownedSince',
		'OPTIONAL MATCH photo<-[:IN]-thing',
		'WITH thing, ownedSince, photo.path AS path, photo.url AS photo',
		'OPTIONAL MATCH tag<-[:IS]-thing',
		'WITH thing.visibility AS visibility, thing.tid AS tid,',
		'COLLECT(tag.tagName) AS tags, path, ownedSince, photo',
		'RETURN tid, tags, photo, path, visibility, ownedSince',
		'ORDER BY ownedSince DESC'
		].join('\n');

		var params = {
			uid: req.uid
		};

		db.query(query, params, sendResponse.bind(res));
};


// GET A USERS PROFILE DATA
// -------------------

exports.getProfileREST = function(req, res) {

	var db = server.get('neo4j');

	var query = [
		'START me=node:Users(uid={uid})',
		'RETURN me.name AS name, me.since AS since'
		].join('\n');

		var params = {
			uid: req.uid
		};

		db.query(query, params, sendResponse.bind(res));

};


// ADD A NEW PROFILE IF IT DOES NOT EXIST
// ---------------------------

exports.addProfileREST = function(req, res){

	var db = server.get('neo4j');

	async.waterfall([
		checkIfUserExists,
		saveUserNode, 
		createUserIndex,
		],
		sendResponse.bind(res)
	);
	
	// see if user exists and if not then create it
	function	checkIfUserExists(callback) {
		db.getIndexedNodes('Users', 'uid', req.uid, function(err, nodes) {
			
			if (nodes.length) { 
				res.send(nodes[0].data); // stop waterfall and send back already existing user
			}
			else {
				callback(err);
			}

		});
	};

	function saveUserNode(callback) {
		var now = new Date();
		var since =  now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
		var newUser = db.createNode({uid: req.uid, name: req.name, since: since});
		newUser.save(callback);
	};

	function createUserIndex(node, callback) {
		node.index('Users', 'uid', req.uid, function (err) {
			callback(err, node.data);
		});
	};

};

// ADD A NEW THING
// ---------------

exports.addThingREST = function(req, res) {
	
	var db = server.get('neo4j');
	var tid = generateThingsbookID(req.uid);

	async.waterfall([
		checkIfThingExists,
		saveThingNode, 
		createThingIndex,
		connectThing,
		],
		sendResponse.bind(res)
	);

	function checkIfThingExists(callback) {
		db.getIndexedNodes('Things', 'tid', tid, function(err, nodes) {
			if (nodes.length) { var err = 'tID already exists'; }
			callback(err);
		});
	};

	function saveThingNode(callback) {
		var thing = db.createNode({tid: tid, visibility: req.body.visibility});
		thing.save(callback);
	};

	function createThingIndex(node, callback) {
		node.index('Things', 'tid', node.data.tid, callback);
	};

	function connectThing(callback) {
		var query = [
		'START me=node:Users(uid={uid})',
		',thing=node:Things(tid={tid})',
		'CREATE',
		'(photo { url: {url}, path: {path} })',
		',photo<-[:IN]-thing,',
		'me-[:OWNS { since: {date} }]->thing',
		'RETURN thing.tid AS tid'
		].join('\n');

		var params = {
			uid: req.uid,
			tid: tid,
			url: req.body.photo,
			path: req.body.path,
			vis: req.body.visibility,
			date: req.body.created
		};

		db.query(query, params, callback);
	};

};

// UPDATE A THING WITH NEW TAGS
// --------------------------

exports.updateThingREST = function(req, res) {
	
	var db = server.get('neo4j');

	var query = [
		'OPTIONAL MATCH (tag)',
		'WHERE tag.tagName IN {tags}',
		'WITH COLLECT (tag.tagName) AS existingTags',
		'FOREACH(newTag IN filter(oldTag IN {tags} WHERE NOT(oldTag IN existingTags)) | CREATE (tag{tagName:newTag}))',
		'WITH existingTags',
		'START thing=node:Things(tid={tid}), tag=node(*)',
		'WHERE tag.tagName IN {tags}',
		'CREATE UNIQUE thing-[r:IS]->tag return tag'
		].join('\n');

		var params = {
			tid: req.params.tid,
			tags: req.body.tags
		};

		db.query(query, params, sendRequestBody);

		function sendRequestBody(err, result) {
			if (err) { 
				res.status(400);
				res.send(err); 
			}
			else {
			res.send(req.body); // to confirm update
		}
		}; 
};
