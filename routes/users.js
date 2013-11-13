/*
 * GET users listing.
 */
var request = require('superagent');


exports.list = function(req, res){
	console.log(req.url);
  request.post(app.get('neo4j'))
  	.send({
			query: "START n=node(*) where has(n.name) return n.name"
		})
		.end(function (neo4jRes){
			res.send(neo4jRes.text);
		});
};