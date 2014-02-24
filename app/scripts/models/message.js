/*global define*/

define([
		'underscore',
		'backbone'
], function (_, Backbone) {
	'use strict';

	var MessageModel = Backbone.Model.extend({

		defaults: {
			'type': 'info',
			'text': 'default message'
		},

		initialize: function () {
			
		}

	});

	return MessageModel;
});