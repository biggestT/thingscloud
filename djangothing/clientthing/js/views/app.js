/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The main Application
	// ---------------

	app.AppView = Backbone.View.extend({

		el: '#thingsbookApp',

		statsTemplate: _.template($('#stats-template').html()),

		events: {
		},

		initialize: function () {

			new app.SearchResultsView();
			// var viewTest = new app.SearchView();
			// new app.SearchView();
			// new app.Thing();
			console.log("initializing app");
			// app.Things.fetch();
		},

		render: function () {

		}


	});
})(jQuery);
