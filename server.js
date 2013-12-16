
/**
 * Module dependencies.
 */

var express = require('express');
var api = require('./routes/api');
var http = require('http');
var path = require('path');
// var dropbox = require('dropbox');
var request = require('superagent');

// Neo4j database 
var neo4j = require('neo4j');
var localNeo4jURL = 'http://localhost:7474';
var db = new neo4j.GraphDatabase(localNeo4jURL);

// global server object
server = express();

// all environments
server.set('port', process.env.PORT || 8000);
server.set('neo4j', (process.env.NEO4J_URL  || localNeo4jURL) + '/db/data/cypher');
server.use(express.favicon());
server.use(express.logger('dev'));
server.use(express.bodyParser());
server.use(express.methodOverride());
server.use(server.router);
// server.use(express.static(path.join(__dirname, 'public')));


// development only where we skip CORS protection
if ('development' == server.get('env')) {
  server.use(express.errorHandler());
  server.use(express.static(__dirname + '/server'));
  server.all('*', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Methods", "DELETE");
	  res.header("Access-Control-Allow-Headers", "Content-Type");
	  next();
	});
	console.log('starting in development mode');
}
else if ('production' == server.get('env')) {
	server.use(express.static(__dirname + '/dist'));
	server.all('*', function(req, res, next) {
	  next();
	});
	console.log('starting in production mode');
}

// always pass requests through authentication pipeline
// where we ask the Dropbox Core API for the UID corresponding
// to the access_token retrieved from the thingsbook client
server.get('*', getUserIdFromDropbox);
server.post('*', getUserIdFromDropbox);
server.delete('*', getUserIdFromDropbox);

function getUserIdFromDropbox (req, res, next) {
	
	// Set all response headers to json type
	res.setHeader('Content-Type', 'application/json');

	request
		.get('https://api.dropbox.com/1/account/info' + '?access_token=' + req.query.access_token)
		.end( function(error, res) {
			var userInfo = JSON.parse(res.text);
			// pass the confirmed dropbox uid on with the request objects to be used in the actual CRUD method
			console.log(userInfo.uid);
			req.uid = userInfo.uid;
			req.name = userInfo.display_name;
  		next();
		})
};
// Set up GET routes

// server.get('/', routes.index);
// Lists all the users
// server.get('/users', users.list);

// Get a user's profile
server.get('/api/:name', api.getProfile);
// server.get('/:tid', api.getThing);
// Lists the things belonging to a user
server.get('/api/:name/things', api.getThings);

// Set up POST routes
server.delete('/api/:tid', api.deleteThing)
// Add a new user
server.post('/api/:name', api.addProfile);
// Add a thing to a user
server.post('/api/:name/things', api.addThing);

http.createServer(server).listen(server.get('port'), function(){
  console.log('Express server listening on '  + server.get('port'));
});
