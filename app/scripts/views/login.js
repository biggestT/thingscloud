/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'templates'
], function ($, _, Backbone, JST) {
	'use strict';

	var LoginView = Backbone.View.extend({

			events: {
				"click .login": "login",
				"click .signout": "signout"
			 },

		template: JST['app/scripts/templates/login.ejs'],

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.render();
		},
		render: function () {
			
			$(this.el).empty();
			var html = this.template(this.model.toJSON());
			$(this.el).append(html);

			this.delegateEvents();

			return this;
		},
		login: function () {
			this.model.login();
		},
		signout: function () {
			this.model.signout();
		}
	});

	return LoginView;
});