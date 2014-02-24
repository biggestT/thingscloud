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


			Backbone.serverURL = './api/';
			Backbone.appFolder = 'thingsbook/images/'; // name of the dropbox folder where thingsbook store its lowers images
		
			// RANDOMLY GENERATED SVG LOGO
			//--------

			var logo = new LogoView({
				el: $('#logoContainer')
			});
			
			// EVENT AGGREGATOR AND ITS VIEW
			// --------------

			Backbone.eventAgg = new Backbone.Model();

			var appMessages = new MessageCollection({
				eventAggregator: Backbone.eventAgg
			});

			var messageBox = new MessageBoxView({
				messageCollection: appMessages,
				el: '#message-box'
			});

			var messageLog = new MessageModel();

			var messageBox = new MessageView({
				el: this.$('#message-box'),
				model: messageLog
			});

			
			// DROPBOX CLIENT OBJECT INITIALIZATION
			//-------------

			// Dropbox wrapper-model for communicating with the dropbox.js library
			var db = new Dropbox();
			// attach a single dropbox client instance to 
			// something that all the applications classes can use
			Backbone.db = db; 

			// set the Oauth token as default parameter in all further ajax requests
			$(document).ajaxSend(function(event, request) {
				var token = db.getOauthToken();
				if (token) {
					request.setRequestHeader('Access-Token', token);
				}
			});

			// THINGSCLOUD USER OBJECT CONTAINING GUI
			// -------------

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