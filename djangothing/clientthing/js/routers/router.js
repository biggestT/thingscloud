/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Router
	// ----------
	var Workspace = Backbone.Router.extend({
		routes: {
			"about":                 "about",    // #page about thingsbook
			"companies":             "companies",    // #page for companies
			"contact":               "contact",    // #page for contacting thingsbook
	    "search/:query":        "search",  // #search/hammer
	    "things/:id": 					"thingProfile"   // #things/id3
		},

		about : function () {
			
		},
		thingProfile: function (id) {

		},
		search: function (query) {

		}
	});

	app.thingsbookRouter = new Workspace();
	Backbone.history.start({pushState: true});
})();
