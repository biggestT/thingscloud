/*
 * GET users listing.
 */
var request = require('superagent');


exports.list = function(req, res){
  request.post(app.get('neo4j'))
  		.send({
			query: "START me=node:node_auto_index(name='Tor') MATCH me-[r:OWNS]->t WITH t AS thing, r.since AS ownedSince MATCH tag<-[:IS]-thing WITH thing.visibility AS visibility, COLLECT(tag.tag) AS tags, ownedSince RETURN tags, visibility, ownedSince ORDER BY ownedSince DESC"
		})
		.end(function (neo4jRes){
			res.send(neo4jRes.text);
		});
};