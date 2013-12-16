/*global define*/

define([
    'jquery',
    'backbone',
    'views/addThing',
    'views/user'
], function ($, Backbone, AddThingView, UserView) {
    'use strict';

    var Router = Backbone.Router.extend({
        
        routes: {
        	'/add' : 'add',
            '/users/:name' : 'user'
        },

        add: function() {
        	// go into topview where user can add a new thing
        	console.log('going into add view');
            var addView = new AddThingView();
        },
        user: function () {
            console.log('going into user view');
        	var userView = new UserView();
        }
    });

    var initialize = function() {


    	var router = new Router;

    	Backbone.history.start();
    	console.log('history started');

    };


   return {
    	initialize: initialize
   };

});