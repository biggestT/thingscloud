
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
var neo4jTransactional = require('node2neo');

var neo4jURL = process.env.GRAPHENEDB_URL || 'http://test:NtZGJE4S8L1Gb5R4A6MT@test.sb01.stations.graphenedb.com:24789';

var db = new neo4j.GraphDatabase(neo4jURL);
var dbTransactional = neo4jTransactional(neo4jURL);


// global server object
server = express();

// all environments
server.set('port', process.env.PORT || 5000);
server.set('neo4jCypherUrl', neo4jURL + '/db/data/cypher');
server.set('neo4j', db);
server.set('neo4jTransactional', dbTransactional);
server.use(express.favicon());
server.use(express.logger('dev'));
server.use(express.bodyParser());
server.use(express.methodOverride());
server.use(server.router);

// server.use(express.static(path.join(__dirname, 'public')));


// development only where we skip CORS protection
if ('development' == server.get('env')) {
  server.use(express.errorHandler());
  server.use(express.static(__dirname + '/app'));
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
server.get('/api/*', getUserIdFromDropbox);
server.post('/api/*', getUserIdFromDropbox);
server.delete('/api/*', getUserIdFromDropbox);

function getUserIdFromDropbox (req, res, next) {
	
	// Set all response headers to json type
	res.setHeader('Content-Type', 'application/json');

	request
		.get('https://api.dropbox.com/1/account/info' + '?access_token=' + req.query.access_token)
		.end( function(error, res) {
			if (error) {
				res.status(401); // unathorized!
				res.send(error);
			}
			var userInfo = JSON.parse(res.text);
			// pass the confirmed dropbox uid on with the request objects to be used in the actual CRUD method
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
server.get('/api/:name', api.getProfileREST);
// server.get('/:tid', api.getThing);
// Lists the things belonging to a user
server.get('/api/:name/things', api.getThingsREST);

// Set up POST routes
server.delete('/api/:tid', api.deleteThingREST)
// Add a new user
server.post('/api/:name', api.addProfileREST);
// Add a thing to a user
server.post('/api/:name/things', api.addThingREST);

// Set up PUT routes
server.put('/api/:tid', api.updateThingREST);

http.createServer(server).listen(server.get('port'), function(){
  console.log('Express server listening on '  + server.get('port'));
});

module.exports = server;
