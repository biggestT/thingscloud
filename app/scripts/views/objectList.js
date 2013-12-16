/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function ($, _, Backbone, JST) {

  'use strict';
  
  // Generic view for a list of updateable objects
  // copied from http://liquidmedia.org/blog/2011/02/backbone-js-part-3/

  var ObjectListView = Backbone.View.extend({

    template: JST['app/scripts/templates/objectList.ejs'],


    initialize : function(options) {

      _(this).bindAll('add', 'remove');
   
      if (!options.childViewConstructor) throw "no child view constructor provided";
      if (!options.childViewTagName) throw "no child view tag name provided";
   
      this._childViewConstructor = options.childViewConstructor;
      this._childViewTagName = options.childViewTagName;
   
      this._childViews = [];
      
      this.collection.each(this.add);
    
      // Remove or add childviews when their corresponding models are removed from the collection
      this.collection.bind('add', this.add);
      this.collection.bind('remove', this.remove);
    },
   
    add : function(model) {
      var childView = new this._childViewConstructor({
        tagName : this._childViewTagName,
        model : model
      });
      
      this._childViews.push(childView);
      if (this._rendered) $(this.el).prepend(childView.render().el);
    },
   
    remove : function(model) {
      var viewToRemove = _(this._childViews).select(function(cv) { return cv.model === model; })[0];
      this._childViews = _(this._childViews).without(viewToRemove);
      if (this._rendered) $(viewToRemove.el).remove();
    },
   
    render : function() {

      var that = this;
      this._rendered = true;
   
      $(this.el).empty();
      _(this._childViews).each(function(childView) {
        $(that.el).prepend(childView.render().el);
      });
   
      return this;
  },
});

return ObjectListView;
});