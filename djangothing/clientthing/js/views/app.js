/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};


	// The main Application
	// ---------------

	app.AppView = Backbone.View.extend({

		el: $('#thingsbookApp'),

		statsTemplate: _.template($('#stats-template').html()),

		events: {
			'click .profileLink': 'showThingProfile'
		},

		initialize: function () {
			// create the components of which the app consists of
			this.$searchResults = this.$('#searchResults');
			this.$searchBar = this.$('#searchBar');
			this.$formAddThing = this.$('#addThing');

			this.results = new app.SearchResultsView({
				el: this.$searchResults
			});
			this.formAddThing = new app.FormAddThingView({
				el: this.$formAddThing
			});
			this.searchBar= new app.SearchBarView({
				el: this.$searchBar
			});
			// Set up the event which the main application listens to
			Backbone.bind("search:results", this.showSearchResults, this);

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

		},
		showThingProfile: function () {

		},
		showSearchResults: function () {
			this.$searchResults.show();
		}

	});
