
/*
 * GET home page.
 */
var request = require('superagent');

exports.index = function(req, res) {
	request.post(process.env.NEO4J_REST_URL + 
		'/cypher').send({
			query: 'START n=node(1) RETURN n.title'
		}).end(function (neo4jRes){
			res.send(neo4jRes.text);
		})
};