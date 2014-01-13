/*
 * GET one user's things
 */
var request = require('superagent');
var Hashids = require('hashids');

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

// By knowing the secret for the Hashid we can know when by whom and when a certain thing was created from its unique tId


function generateThingsbookID(uid) {

	var hash = new Hashids('my secret');
	var now = new Date();
	var millisecondsPassed = now.getTime() - Date.UTC(2013, 10, 01, 0, 0, 0, 0);

	var tId = hash.encrypt(uid, millisecondsPassed);

	return tId;
}

exports.deleteThing = function (req, res) {
	console.log(req.params.tid);
	request.post(server.get('neo4j'))
  	.send({
			query: "START t=node(*) MATCH me-[:OWNS]->t, t<-[r1?:PHOTO_OF]-b, t-[r2?:IS]->() WHERE has(t.tId) AND t.tId={tid} AND me.uid={uid}  WITH t.tId AS tid, r1, r2, t, b DELETE t, r1, b, r2 RETURN tid LIMIT 1",
			params: {
				uid: req.uid,
				tid: req.params.tid
			}
		})
		.end(sendJSONResponse.bind(res));
}

exports.getThings = function(req, res){

  request.post(server.get('neo4j'))	
  	.send({
			query: "START me=node(*) MATCH me-[r:OWNS]->t WHERE has(me.uid) AND me.uid={uid}  WITH t AS thing, r.since AS ownedSince MATCH photo-[?:PHOTO_OF]->thing WITH thing, ownedSince, photo.path AS path, photo.url AS photo MATCH tag<-[?:IS]-thing WITH thing.visibility AS visibility, thing.tId AS tid, COLLECT(tag.tagName) AS tags, path, ownedSince, photo RETURN tid, tags, photo, path, visibility, ownedSince ORDER BY ownedSince DESC",
			params: {
				uid: req.uid,
				name: req.name
			}
		})
		.end(sendJSONResponse.bind(res));
};

// Gets a user's profile 
exports.getProfile = function(req, res){
  request.post(server.get('neo4j'))
  	.send({
			query: 
				"START me=node:node_auto_index(name={name}) WHERE me.uid={uid} RETURN me.name AS name, me.since AS since",
			params: {
				uid: req.uid,
				name: req.name
			}
		})
		.end(sendJSONResponse.bind(res));
};

// Creates a new user's profile if it doesn't already exist
exports.addProfile = function(req, res){

	var now = new Date();
  request.post(server.get('neo4j'))
  	.send({
			query: 
				"START me=node:node_auto_index(name={name}) WHERE me.uid={uid} WITH COUNT(*) AS exists WHERE exists=0 CREATE (me {name: {name}, since: {since}, uid: {uid}}) RETURN me.name AS name, me.since AS since",
			params: {
				uid: req.uid,
				name: req.name,
				since: now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() 
			}
		})
		.end(sendJSONResponse.bind(res));
};

exports.addThing = function(req, res){

	var tId = generateThingsbookID(req.uid);

  request.post(server.get('neo4j'))
  	.send({
			query: 
				"START me=node:node_auto_index(name={name}) WHERE me.uid={uid} CREATE (thing { tId: {tid}, visibility:{vis} }), (photo { url: {url}, path: {path} }), photo-[:PHOTO_OF]->thing, me-[:OWNS { since: {date} }]->thing RETURN thing.tId AS tid",
			params: {
				uid: req.uid,
				tid: tId,
				name: req.name,
				vis: req.body.visibility,
				url: req.body.photo,
				path: req.body.path,
				date: req.body.created
			}
		})
		.end(sendJSONResponse.bind(res));
};

exports.updateThing = function(req, res) {
	request.post(server.get('neo4j'))
  	.send({
			query: 
					"START tag=node(*) WHERE tag.tagName! IN {tags} WITH COLLECT(tag.tagName) AS existingTags FOREACH(newTag in filter(oldTag in {tags} WHERE NOT(oldTag in existingTags))  : CREATE (tag{tagName:newTag})) WITH existingTags START thing=node(*), tag=node(*) WHERE thing.tId! = {tid} AND tag.tagName! IN {tags} CREATE UNIQUE thing-[r:IS]->tag return tag",
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