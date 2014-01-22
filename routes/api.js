/*
 * GET one user's things
 */
var request = require('superagent');
var Hashids = require('hashids');
var async = require('async');


// Parses column style neo4j query result into backbone styled JSON suitable for client serverlications
function sendJSONResponse (neo4jRes) {

	if (!neo4jRes.error) {
		// build JSON object from neo4j result
		var result = neo4jRes.body;
	  var parsed = [];

	  for (var k in result.data) {
	    var object = {};
	    for (var c in result.columns) {
	      var cn = result.columns[c];
	      object[cn] = result.data[k][c];
	    }
	    parsed.push(object);
	  }

	  // send array if multiple results or just one object if not
	  parsed = (parsed.length == 1) ?  parsed[0] : parsed;
	  console.log(neo4jRes.error);

	  this.status(neo4jRes.statusCode);
  	this.send(parsed);
  	return 1;
	}
	else {
		this.status(neo4jRes.statusCode)
		this.send({'error': neo4jRes.body});
	}
	
}

// UNIQUE THINGSBOOK ID GENERATION
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

exports.deleteThing = function (req, res) {
	console.log(req.params.tid);
	request.post(server.get('neo4jCypherUrl'))
  	.send({
			query: "START  DELETE it, r",
			params: {
				uid: req.uid,
				tid: req.params.tid
			}
		})
		.end(function (neo4jRes) {
			console.log(neo4jRes.body);
			console.log(server.get('neo4jCypherUrl'));
		});

}

exports.deleteThingREST = function (req, res) {

	var db = server.get('neo4j');
	var tid = req.params.tid;

	var query = [
	'START t=node:Things(tid={tid})',
	'MATCH (t)-[r]-()',
	'WITH t, r',
	'MATCH (t)-[r1?]->(n)-[r2?]-(o)',
	'WHERE o IS NULL AND ID(o) <> ID(t)',
	'WITH t, r, n',
	'DELETE r, n, t'
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

exports.getThings = function(req, res){

  request.post(server.get('neo4jCypherUrl'))	
  	.send({
			query: "START me=node:Users(uid={uid}) MATCH me-[r:OWNS]->t  WITH t AS thing, r.since AS ownedSince MATCH photo<-[?:IN]-thing WITH thing, ownedSince, photo.path AS path, photo.url AS photo MATCH tag<-[?:IS]-thing WITH thing.visibility AS visibility, thing.tid AS tid, COLLECT(tag.tagName) AS tags, path, ownedSince, photo RETURN tid, tags, photo, path, visibility, ownedSince ORDER BY ownedSince DESC",
			params: {
				uid: req.uid,
				name: req.name
			}
		})
		.end(sendJSONResponse.bind(res));
};

// Gets a user's profile 
exports.getProfile = function(req, res){
  request.post(server.get('neo4jCypherUrl'))
  	.send({
			query: 
				"START me=node(*) WHERE me.uid! ={uid} RETURN me.name AS name, me.since AS since",
			params: {
				uid: req.uid,
				name: req.name
			}
		})
		.end(sendJSONResponse.bind(res));
};

// Creates a new user's profile by using the neo4j REST API client
// through the REST API we can add an index to the user
exports.addProfileREST = function(req, res){

	var db = server.get('neo4j');

	async.waterfall([
		checkIfUserExists,
		saveUserNode, 
		createUserIndex,
		],
		sendResponse
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

	function sendResponse(err, result) {
		if (err) {
			res.status(400);
			res.send(err);
		}
		else {
			res.send(result);
		}
	};
};

exports.addThingREST = function(req, res) {
	
	var db = server.get('neo4j');
	var tid = generateThingsbookID(req.uid);

	async.waterfall([
		checkIfThingExists,
		saveThingNode, 
		createThingIndex,
		connectThing,
		],
		sendResponse
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

	function sendResponse(err, result)	{
		if(err) { 
			res.status(400);
			res.send(err);
		}
		else {
			res.send(result[0]);
		}
	};		
};

exports.updateThing = function(req, res) {
	request.post(server.get('neo4jCypherUrl'))
  	.send({
			query: 
					"START tag=node(*) WHERE tag.tagName! IN {tags} WITH COLLECT(tag.tagName) AS existingTags FOREACH(newTag in filter(oldTag in {tags} WHERE NOT(oldTag in existingTags))  : CREATE (tag{tagName:newTag})) WITH existingTags START thing=node:Things(tid={tid}), tag=node(*) WHERE tag.tagName! IN {tags} CREATE UNIQUE thing-[r:IS]->tag return tag",
			params: {
				tid: req.params.tid,
				tags: req.body.tags
			}
	})
	.end(function (neo4jRes) {
		if(!neo4jRes.error) {
			// send the object as response to tell about correct update
			res.send(req.body);
		}
		else {
			res.status(neo4jRes.statusCode);
			res.send({'error': neo4jRes.body});
		}
	});
}