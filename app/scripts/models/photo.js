/*global define*/

// NOT USED ATM,!!!

define([
	'underscore',
	'backbone',
	'models/baseModel'
], function (_, Backbone, BaseModel) {
	'use strict';

	var PhotoModel = BaseModel.extend({

		idAttribute: 'pId',

		defaults: _.extend({},BaseModel.prototype.defaults, {
			url: 'http://placehold.it/320x240',
			path: '/',
			selected: false
		}),
		

		initialize: function () {
			this.defaults = _.extend({}, this.Events, this.events);
			console.log(this.get('selected'));
		},

		// PHOTO GET/SET
    getPhoto: function () {
      return {'url': this.get('url'), 'path': this.get('path')};
    },
    setPhoto: function (url, dbPath) {
      this.set({
        'url': url,
        'path': dbPath
      })
    }

		
	});

	return PhotoModel;
});