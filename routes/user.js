/*
 * GET one user's things
 */
var request = require('superagent');



exports.getThings = function(req, res){

  request.post(app.get('neo4j'))
  	.send({
			query: "START me=node:node_auto_index(name={name}) WHERE me.uid={uid} MATCH me-[r:OWNS]->t WITH t AS thing, r.since AS ownedSince MATCH photo-[:PHOTO_OF]->thing WITH thing, ownedSince, photo.mediumPhoto AS mediumPhoto MATCH tag<-[:IS]-thing WITH thing.visibility AS visibility, COLLECT(tag.tag) AS tags, ownedSince, mediumPhoto RETURN tags, mediumPhoto, visibility, ownedSince ORDER BY ownedSince DESC",
			params: {
				uid: req.uid
			}
		})
		.end(function (neo4jRes){
			res.send(neo4jRes.text);
		});
};

exports.getProfile = function(req, res){
  request.post(app.get('neo4j'))
  	.send({
			query: 
				"START me=node:node_auto_index(name={name}) WHERE me.uid={uid} RETURN me.name",
			params: {
				uid: req.uid
			}
		})
		.end(function (neo4jRes){

			console.log(neo4jRes.text);
		});
};

exports.addProfile = function(req, res){
  request.post(app.get('neo4j'))
  	.send({
			query: 
				"START me=node:node_auto_index(name={name}) WHERE me.uid={uid} WITH COUNT(*) AS exists WHERE exists=0 CREATE (me {name: {name}, since: {since}, uid: {uid}}) RETURN me",
			params: {
				uid: req.uid,
				name: req.name,
				since: new Date()
			}
		})
		.end(function (neo4jRes){
			console.log(neo4jRes.text);
		});
};

exports.addThing = function(req, res){

  request.post(app.get('neo4j'))
  	.send({
			query: 
				"START me=node:node_auto_index(name={name}) WHERE me.uid={uid} CREATE (thing { visibility:{vis} }), (photo { url: {url}, path: {path} }), photo-[:PHOTO_OF]->thing, me-[:OWNS { since: {date} }]->thing",
			params: {
				uid: req.uid,
				name: req.params.name,
				vis: req.body.visibility,
				url: req.body.photo,
				path: req.body.path,
				date: req.body.created
			}
		})
		.end(function (neo4jRes){
			console.log(neo4jRes.text);
		});
};