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
      // if( this._meta['user'] && this._meta['token']) {
    		// return 'http://127.0.0.1:8000/' + this._meta['user'] + '/things' + '?access_token=' + this._meta['token'];
      // }
      // else {
      // 	console.error('no username and oAuthToken set for uploading to server ');
      // }
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