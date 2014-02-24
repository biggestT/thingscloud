define([
	'underscore',
	'backbone',
	'models/photo',
	'collections/baseCollection'
], function (_, Backbone, Photo, BaseCollection) {
	
	'use strict';

	var PhotoCollection = BaseCollection.extend({
		
		model: Photo,

		comparator: 'path',
		
		initialize: function() {
			PhotoCollection.__super__.initialize.apply(this, arguments);
		},

		meta: function (prop, value) {
			if(value === undefined) {
				return this._meta[prop];
			} else {
				this._meta[prop] = value;
			}
		},
		

		url:  function() {
		},

		getSelected: function () {

			var filtered = this.filter( function(photo) {
				return (photo.get('selected'));
			});

			return new PhotoCollection(filtered);
		}
			
	});

	return PhotoCollection;
});