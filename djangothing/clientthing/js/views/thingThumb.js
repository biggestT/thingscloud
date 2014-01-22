/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	//  View for one thingThumbnail
	// --------------

	// The DOM element for a todo item...
	app.ThingThumbView = Backbone.View.extend({
		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#thingThumb-template').html()),

		// The DOM events specific to an item.
		events: {
			'click .profileLink': 'viewThingProfile'
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			// this.listenTo(this.model, 'destroy', this.remove);
			// this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the thing Thumbnail 
		render: function () {
			// console.log(this.model.toJSON());
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		viewThingProfile: function () {
				
		}
	});
})(jQuery);
