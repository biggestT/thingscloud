/*global define*/

define([
	'underscore',
	'backbone',
	'collections/things'
], function (_, Backbone, ThingsCollection) {

	'use strict';

	var UserModel = Backbone.Model.extend({


		defaults: {
			name: 'Visitor',
			uid: null,
			authenticated: false,
			since: null
		},

		initialize: function () {

			var things = new ThingsCollection();
			things.meta('user', this.get('name'));

			this.set({
				things: things
			});

			this.listenTo(this.get('dropbox'), 'change:authenticated', this.updateUser);			
			this.updateUser();

		},

		url: function () {
			return Backbone.serverURL + this._nameConcat;
		},

		getThings: function () {
			var things = this.get('things');
			if (things) {
				things.meta('user', this.get('name'));
				things.fetch();
			}
		},

		getName: function () {
			return this.get('name');
		},
		
		signout: function () {
			this.get('dropbox').signout();
		},

		isAuthenticated: function () {
			return this.get('dropbox').get('authenticated');
		},

		updateUser: function () {
			var db = this.get('dropbox');
			if(db) {
				if (db.get('authenticated')) {

					var db = this.get('dropbox');

					db.getAccountInfo(function (userInfo) {

						// Format the dropbox username to fit into an URL
						var nameConcat = userInfo.name.toLowerCase().replace(/\s/g, '-');

						// Update the user info and push it to the server to authorize it for thingsbook API requests
						this.set({
							authenticated: true,
							name: userInfo.name,
							uid: userInfo.uid
						})
						// set private variables that are used in the url to call the thingsbook API
						this._nameConcat = nameConcat;

						// UGLY FIX!!!
						this.save();
						this.fetch();

						
						// Set the user's thingscollection to connect to the right thingbook API-URL
						this.get('things').meta('user', nameConcat);
						this.get('things').fetch();

					}.bind(this));
				} else {
					this.set(this.defaults);
				}
			} 
		}

	});

	return UserModel;

});