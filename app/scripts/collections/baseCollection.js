define([
  'underscore',
  'backbone',
  'models/baseModel'
], function (_, Backbone, BaseModel) {
	
  'use strict';

  var BaseCollection = Backbone.Collection.extend({
    
    model: BaseModel,

    initialize: function() {
      this._meta = {};
      this.on('add', updateModelsCollection);

      function updateModelsCollection ( baseModel ) {
        baseModel.collection = this;
      }
    },

    meta: function (prop, value) {
      if(value === undefined) {
        return this._meta[prop];
      } else {
        this._meta[prop] = value;
      }
    },

    getSelected: function () {

      var filtered = this.filter( function(baseModel) {
        return (baseModel.get('selected'));
      });

      return new BaseCollection(filtered);
    }
      
  });

  return BaseCollection;
});