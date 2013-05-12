/*global Backbone */
var app = app || {};

// NOT SURE WHY THIS WOULD BE NECCESSARY
// (function () {

	//  View for one thingThumbnail
	// --------------
		// Things for testing
	var testResults = [{	
									tags:["couch", "1988", "yellow", "retro"], 
									photo:"http://4.bp.blogspot.com/-nzHYIwsGba0/TktQdIM259I/AAAAAAAAApE/E5aO6JN-8F8/s1600/painted+couch+before.jpg", 
									owner: {
										surname: "Tor",
										lastname: "Nilsson Ohrn"
									} 
								},
								{	
									tags:["plant", "palmtree", "IKEA"], 
									photo:"http://www.ikea.com/us/en/images/products/pachira-aquatica-potted-plant__0121016_PE277829_S4.JPG", 
									owner: {
										surname: "Emil",
										lastname: "Riseby"
									} 
								}];

	app.SearchResultsView = Backbone.View.extend({
		
		el:$("#searchResults"),

		// The DOM events specific to an item.
		events: {
		},
		// initialize with collection of things
		initialize: function () {
			this.collection = new app.ThingsList(testResults);
			this.render();
			console.log("created new collection of things");
		},
		// show thumbnails of all things in the result
		render: function () {
			var that = this;
			_.each(this.collection.models, function(item){
				that.renderThing(item);
			}, this);
		},
		// render one thing's thumbnail
		renderThing: function (item) {
			var thingView = new app.ThingThumbView({
				model: item
			});
			this.$el.append(thingView.render().el);
		}
	});
// });