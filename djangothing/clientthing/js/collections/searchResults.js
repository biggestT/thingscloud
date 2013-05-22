/*global Backbone */
var app = app || {};

(function ($) {
	'use strict';


	app.SearchResults = Backbone.Collection.extend({
		// Reference to this collection's model.
		// model: app.Thing,
		url:  function(){
    	return "http://127.0.0.1:8000/things/search/" + this.searchTerm + "/?format=json";
  	},
  	parse: function (response) {
  		return response.results;
  	}
 		// Save all of the resulting items under the "things" namespace.
		// localStorage: new Backbone.LocalStorage('things-backbone')

	}, {
	  search: function(searchTerm){
	    var results = new app.SearchResults();
	    results.searchTerm = searchTerm;
	    results.fetch({
	      success: function(collection, response){
	        Backbone.trigger("search:results", results);
	      },
	      error: function(collection, response){
	        Backbone.trigger("search:error", response);
	      }
	    }); 
	  }
	})

})();
