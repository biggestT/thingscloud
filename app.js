
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var neo4j = require('neo4j');

// global app object
app = express();

// connect to local neo4j database 
var localNeo4jURL = 'http://localhost:7474';
var db = new neo4j.GraphDatabase(localNeo4jURL);


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
