/*global Backbone */
var app = app || {};

(function ($) {
	'use strict';

	// Todo Collection
	// ---------------



	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	app.ThingsList = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Thing,
		url: 'http://127.0.0.1:8000/things/things/'
 		// Save all of the todo items under the `"todos"` namespace.
		// localStorage: new Backbone.LocalStorage('things-backbone')

	});

})();
