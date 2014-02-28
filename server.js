
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


// DEVELOPMENT / PRODUCTION DIFFERENCES
// -------------------

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
// production mode that uses packaged javascript file for the client
else if ('production' == server.get('env')) {
	server.use(express.static(__dirname + '/dist'));
	server.all('*', function(req, res, next) {
	  next();
	});
	console.log('starting in production mode');
}

// MIDDLEWARE FOR AUTHENTICATION OF REQUESTS
// ---------------

// always pass requests through authentication pipeline
// where we ask the Dropbox Core API for the UID corresponding
// to the access_token retrieved from the thingsbook client
server.get('/api/*', dropboxAuthentication);

// post and delete requests should always be authenticated first
server.post('/api/*', dropboxAuthentication);
server.delete('/api/*', dropboxAuthentication);

function dropboxAuthentication (req, res, next) {
	
	// Set all response headers to json type
	res.setHeader('Content-Type', 'application/json');

	var token = req.header('Access-Token');

	// If the request tries to be authenticated
	if (token) {
		request
		.get('https://api.dropbox.com/1/account/info' + '?access_token=' + req.header('Access-Token'))
		.end( function(error, res) {
			if (error) {
				// unathorized authentication attempt!
				res.status(401); 
				res.send(error);
			}	
			else {
				var userInfo = JSON.parse(res.text);
			// pass the confirmed dropbox uid on with the request objects to be used in the actual CRUD method
			req.authenticated = true;
			req.uid = userInfo.uid;
			req.name = userInfo.display_name;
			next();
			}
		})
	}

	// if the request doesn't try to be authenticated
	else {
		req.authenticated = false;
		next();
	}

};

// READ ROUTES
// --------

// Get a user's profile
server.get('/api/:name', api.getProfileREST);

// Lists the things belonging to a user
server.get('/api/:name/things', api.getThingsREST);

// CREATE, UPDATE and DELETE ROUTES
// ------------------

server.delete('/api/:tid', api.deleteThingREST)
server.delete('/api/:name/things/:tid', api.deleteThingREST)

// Add a new user
server.post('/api/:name', api.addProfileREST);
// Add a thing to a user
server.post('/api/:name/things', api.addThingREST);

// Update existing things
server.put('/api/:tid', api.updateThingREST);
server.put('/api/:name/things/:tid', api.updateThingREST);


// KICK OF THE SERVER!
// -----------

http.createServer(server).listen(server.get('port'), function(){
  console.log('Express server listening on '  + server.get('port'));
});

module.exports = server;
