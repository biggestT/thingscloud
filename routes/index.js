
/*
 * GET home page.
 */
var request = require('superagent');

exports.index = function(req, res) {
	request.post(app.get('neo4j')).send({
			query: 'START n=node(*) RETURN n.name	'
		}).end(function (neo4jRes){
			res.send(neo4jRes.text);
		});
};

