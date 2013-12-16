// ABSTRACT CLASS
// Base class for things and photos and more

define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  'use strict';

  var BaseModel = Backbone.Model.extend({

    defaults: {
    	processing: false,
    	selected: false
    },

    // PROCESSING SET/GET/TOGGLE
    
    isProcessing: function () {
      return this.get('processing');
    },
    setProcessing: function (processing) {
      console.log('setting processing to: ' + processing);
      this.set({ 'processing': processing });
    },
    
    // SELECTED SET/GET/TOGGLE

    isSelected: function () {
      return this.get('selected');
    },
    setSelected: function (selected) {
      this.set({ 'selected': selected });
    },
    toggleSelected: function () {
      this.set({
        'selected': !this.get('selected')
      })
    }
    
  });

  return BaseModel;
});