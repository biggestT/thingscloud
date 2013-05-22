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
			new app.SearchBarView();
			new app.FormAddThingView();

			// this is where we will authenticate us as a valid app to the Thingsbook API
			$.ajaxSetup({
		    headers: {
		        // 'user_id': dataWeb.get("id"),
		        // 'api_key': dataWeb.get("api_key"),
						// 'Access-Control-Allow-Origin': 'null',
						// origin: 'tor'
		    }
			});

	
			// var allThings = new app.ThingsList();
			// allThings.fetch();
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
