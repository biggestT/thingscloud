/*
 * GET one user's things
 */
var request = require('superagent');


exports.list = function(req, res){

  req.name = req.params.name.toLowerCase();

  request.post(app.get('neo4j'))
  	.send({
			query: "START me=node:node_auto_index(name='" + req.name + "') MATCH me-[r:OWNS]->t WITH t AS thing, r.since AS ownedSince MATCH photos-[:PHOTO_OF]->thing WITH thing, ownedSince, COLLECT(photos.url) AS photos MATCH tag<-[:IS]-thing WITH thing.visibility AS visibility, COLLECT(tag.tag) AS tags, ownedSince, photos RETURN tags, photos, visibility, ownedSince ORDER BY ownedSince DESC"
		})
		.end(function (neo4jRes){
			res.header("Access-Control-Allow-Origin", "*");
			res.send(neo4jRes.text);
		});
};