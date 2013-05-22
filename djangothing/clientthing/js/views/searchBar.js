/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

// (function ($) {
// 	'use strict';
  
	//  View for the searchbar
	// --------------
 	app.SearchBarView = Backbone.View.extend({

      el: $("#searchBar"),

      // perform search when key is pressed while inside a searchfield
 			events: {
          "keypress input[type=search]": "doSearchOnEnter"  
      },

      initialize: function(){
      	this.$input = this.$('#searchField');
        console.log(this.$input);
        this.render();
      },

      render: function(){
          // var template = _.template( $("#search-template").html(), {} );
          // this.el.html( template );
          console.log(this.$input);
      },
      
      doSearchOnEnter: function (e) {
				if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
          return;
        }
        // Move below, just here while server side is set up for specific search queries
				this.$input.val('');
        app.SearchResults.search(this.$input.val());
			}
  });
// });
    