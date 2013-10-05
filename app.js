
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var usersThings = require('./routes/usersThings');
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
console.log(app.get('neo4j'));
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', users.list);
app.get('/users/:name', usersThings.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on '  + app.get('port'));
});
