/*global define*/

define([
		'jquery',
		'underscore',
		'backbone',
		'templates',
		'views/object'
], function ($, _, Backbone, JST, Object) {
		'use strict';

		var PreviewView = Object.extend({

			template: JST['app/scripts/templates/preview.ejs'],
			events: {
				'click .photo-thumbnail': 'toggleSelected'
			},
	
			initialize: function () {
				this.events = _.extend({}, this.objectEvents, this.events);
	    	this.delegateEvents();
			},

			render: function () {

				$(this.el).empty();
				
				var html = this.template(this.model.toJSON());
				$(this.el).append(html);

				this.$img = this.$('.photo-thumbnail');
				this.$icon = this.$('.selected');
				this.$icon.hide();

	    	this.delegateEvents();

				return this;
			},
			toggleSelected: function () {
				var selected = !this.model.get('selected');
				this.model.set({ selected: selected });
				this.$img.toggleClass('transparent-semi');
				this.$icon.toggle();
			},
			toggleOptions: function () {

			}
		});


		return PreviewView;
});