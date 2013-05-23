/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Tag Model
	// ----------

	app.Tag = Backbone.Model.extend({
		defaults: {
			word: "N/A",
		}

	});
})();