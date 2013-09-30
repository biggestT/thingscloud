
/*
 * GET home page.
 */
var request = require('superagent');
var neoURL = process.env.NEO4J_URL  || 'http://localhost:7474';

exports.index = function(req, res) {
	console.log('url to neo4j rest API' + neoURL);
	request.post(neoURL + 
		'/db/data/cypher').send({
			query: 'START n=node(1) RETURN n.title'
		}).end(function (neo4jRes){
			res.send(neo4jRes.text);
		});
};

