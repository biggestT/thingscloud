/*
 * GET one user's things
 */
var request = require('superagent');

// Parses column style neo4j query result into backbone styled JSON suitable for client applications
function sendJSONResponse (neo4jRes) {

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
  this.send(parsed);
}

exports.getThings = function(req, res){

  request.post(app.get('neo4j'))
  	.send({
			query: "START me=node:node_auto_index(name={name}) MATCH me-[r:OWNS]->t WHERE me.uid={uid}  WITH t AS thing, r.since AS ownedSince MATCH photo-[?:PHOTO_OF]->thing WITH thing, ownedSince, photo.path AS path, photo.url AS photo MATCH tag<-[?:IS]-thing WITH thing.visibility AS visibility, COLLECT(tag.tag) AS tags, path, ownedSince, photo RETURN tags, photo, path, visibility, ownedSince ORDER BY ownedSince DESC",
			params: {
				uid: req.uid,
				name: req.name
			}
		})
		.end(sendJSONResponse.bind(res));
};

// Gets a user's profile or creates it if it doesn't exist
exports.getProfile = function(req, res){
  request.post(app.get('neo4j'))
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

exports.addProfile = function(req, res){

	var now = new Date();
  request.post(app.get('neo4j'))
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

  request.post(app.get('neo4j'))
  	.send({
			query: 
				"START me=node:node_auto_index(name={name}) WHERE me.uid={uid} CREATE (thing { visibility:{vis} }), (photo { url: {url}, path: {path} }), photo-[:PHOTO_OF]->thing, me-[:OWNS { since: {date} }]->thing",
			params: {
				uid: req.uid,
				name: req.name,
				vis: req.body.visibility,
				url: req.body.photo,
				path: req.body.path,
				date: req.body.created
			}
		})
		.end(sendJSONResponse.bind(res));
};