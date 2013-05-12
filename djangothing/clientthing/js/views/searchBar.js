/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function () {
	'use strict';
  
	//  View for the searchbar
	// --------------
 	app.SearchView = Backbone.View.extend({
 			events: {
          "keypress input[type=button]": "doSearchOnEnter"  
      },

      initialize: function(){
      	this.$input = this.$('#searchBar');
        this.render();
      },

      render: function(){
          // var template = _.template( $("#search-template").html(), {} );
          // this.el.html( template );
          console.log(this.$input());
      },
      
      doSearchOnEnter: function (e) {
				if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
					return;
				}
				alert( "Search for " + this.$input.val() );
				this.$input.val('');
			}
  });
});
    