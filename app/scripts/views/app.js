/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
	'routes/router',
	'models/user',
	'views/user',
	'views/add',
	'views/login',
	'views/logo',
	'views/message',
	'models/dropbox',
	'models/message',
	'views/messageBox',
	'collections/messages'
], function ($, _, Backbone, JST, Router, UserModel, UserView, AddView, LoginView, LogoView, MessageView, Dropbox, MessageModel, MessageBoxView, MessageCollection) {

	'use strict';


	var AppView = Backbone.View.extend({
		
		el: '#app',

		template: JST['app/scripts/templates/app.ejs'],

		initialize: function() {

			Router.initialize();
			this.render();

			// Bind global app variables to the Backbone object that is included in all classes
			Backbone.eventAgg = new Backbone.Model();
			Backbone.serverURL = './api/';

			var appMessages = new MessageCollection({
				eventAggregator: Backbone.eventAgg
			});

			var messageBox = new MessageBoxView({
				messageCollection: appMessages,
				el: '#message-box'
			});

			window.setTimeout(checkConnectionToServer, 5000);

			function checkConnectionToServer () {
				// $.ajax('Backbone.ServerURL', {
				//   statusCode: {
				//     404: function() {
				//       alert('Not working');
				//     },
				//     200: function() {
				//       alert('Working');
				//     }
			 //  	}	
			 //  });
			};
			// app.eventAgg = new 
			var logo = new LogoView({
				el: $('#logoContainer')
			});
			
			// Dropbox wrapper-model for communicating with the dropbox.js library
			var db = new Dropbox();

			var messageLog = new MessageModel();

			var messageBox = new MessageView({
				el: this.$('#message-box'),
				model: messageLog
			});
			// Initialize a user of the application
			var user = new UserModel({
				dropbox: db
			});
			
			var userView = new UserView({ 
				el: this.$('#user'),
				model: user 
			});

		},
		render: function() {
			this.$el.html(this.template());
		}

	  });

	return AppView;
});