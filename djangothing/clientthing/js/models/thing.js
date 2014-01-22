/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Thing Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Thing = Backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			tag: ["N/A"],
			photo: "http://placehold.it/350x150",
			owner: 1
		},
		url: function() {
		  return "http://127.0.0.1:8000/things/things/" + this.get('id') + "/?format=json";
		}

	});
})();
