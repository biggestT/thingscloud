/*global Backbone */
var app = app || {};

// NOT SURE WHY THIS WOULD BE NECCESSARY
// (function () {

	app.SearchResultsView = Backbone.View.extend({
		
		el:$("#searchResults"),

		// The DOM events specific to an item.
		events: {
		},
		// This view should listen to an event that is fired when a succesful search is made
		initialize: function () {
			Backbone.bind("search:results", this.showResults, this);
		},
		showResults: function (results) {
			this.collection = results;
			// console.log(this.collection.toJSON());
			this.render();
		},
		// show thumbnails of all things in the result
		render: function () {
			this.$el.empty();
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