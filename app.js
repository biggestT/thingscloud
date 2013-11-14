
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// var dropbox = require('dropbox');
var request = require('superagent');

// Dropbox-js for authentication with Dropbox

// var DROPBOX_APP_KEY = "cd4zzu95jt7sylk"
// var DROPBOX_APP_SECRET = "h9nriwl3nysyh3s";

// var dbClient = new dropbox.Client({
//     key: "your-key-here",
//     secret: "your-secret-here"
// });

// Neo4j database 
var neo4j = require('neo4j');
var localNeo4jURL = 'http://localhost:7474';
var db = new neo4j.GraphDatabase(localNeo4jURL);

// global app object
app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('neo4j', (process.env.NEO4J_URL  || localNeo4jURL) + '/db/data/cypher');
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only where we skip CORS protection
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.all('*', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Content-Type");
	  next();
	});
}

// always pass requests through authentication pipeline
// where we ask the Dropbox Core API for the UID corresponding
// to the access_token retrieved from the thingsbook client
app.get('*', getUserIdFromDropbox);
app.post('*', getUserIdFromDropbox);

function getUserIdFromDropbox (req, res, next) {
	request
		.get('https://api.dropbox.com/1/account/info' + '?access_token=' + req.query.access_token)
		.end( function(error, res) {
			var userInfo = JSON.parse(res.text);
			// pass the confirmed dropbox uid on with the request objects to be used in the actual CRUD method
			req.uid = userInfo.uid;
			req.name = userInfo.display_name;
  		next();
		})
};
// Set up GET routes

// app.get('/', routes.index);
// Lists all the users
// app.get('/users', users.list);

// Get a user's profile
app.get('/:name', user.getProfile);
// Lists the things belonging to a user
app.get('/:name/things', user.getThings);

// Set up POST routes

// Add a new user
app.post('/:name', user.addProfile);
// Add a thing to a user
app.post('/:name/things', user.addThing);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on '  + app.get('port'));
});
