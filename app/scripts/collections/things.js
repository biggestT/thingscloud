/*global define*/

define([
  'underscore',
  'backbone',
  'models/thing',
  'collections/baseCollection'
], function (_, Backbone, Thing, BaseCollection) {
	
  'use strict';

  var ThingsCollection = BaseCollection.extend({
    
    model: Thing,

    initialize: function() {
      ThingsCollection.__super__.initialize.apply(this, arguments);
    },
    
    url:  function() {
      if( this._meta['user'] && this._meta['token']) {
    		return Backbone.serverURL + this._meta['user'] + '/things' + '?access_token=' + this._meta['token'];
      }
      else {
      	console.error('no username and oAuthToken set for uploading to server ');
      }
  	}
      
  });

  return ThingsCollection;
});