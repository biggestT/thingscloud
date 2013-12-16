/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'templates'
], function ($, _, Backbone, JST) {
	'use strict';

	var ObjectView = Backbone.View.extend({


		// The DOM events specific to a thing
			objectEvents: {
				'mouseenter .object': 'showOptions',
				'mouseleave .object': 'hideOptions'
			},

	  // template: JST['app/scripts/templates/object.ejs']

	});


	return ObjectView;
});