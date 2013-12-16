/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'templates',
  'views/object'
], function ($, _, Backbone, bs, JST, Object) {

  'use strict';
  var ENTER_KEY = 13;

  var ThingthumbnailView = Object.extend({
  	
  	tagName: 'li',

    template: JST['app/scripts/templates/thing.ejs'],

    events: {
    	'click .delete': 'clear',
    	'click .add-tags': 'addTags',
    	'keydown input' : 'updateOnEnter'
    },

		initialize: function () {
			// done like this so that genericEvents don't overwrite any events
	    // we've defined here (in case they share the same key)
	    this.events = _.extend({}, this.objectEvents, this.events);
	    this.delegateEvents();

			// Wait for image a changed image element to be loaded before re-rendering the view
			// this.listenTo(this.model, 'change:photo', waitForImage);
			this.listenTo(this.model, 'change:processing', this.render);
			this.listenTo(this.model, 'change:tags', this.render);

			// this.$img = $('<img>', { 
			// 	src: this.model.getPhoto().url,
			// 	class: 'thing not-selected' 
			// }); 

			

		},

		render: function () {

			$(this.el).empty();

			var html = this.template(this.model.toJSON());
			$(this.el).append(html);

			// this.$('.image-container').prepend(this.$img);
			console.log('rendering thing view');
			this.$selected = this.$('selected');
			this.$processing = this.$('.badge.processing');
			this.$options = this.$('div.options-container');
			this.$newTag = this.$('div.new-tag');
			this.$newTagInput = this.$('input.new-tag-input');
			
			this.delegateEvents();

			return this;	
		},

		// SHOW OR HIDE OPTIONS MENU
		showOptions: function (){
			if(!this.model.isProcessing()) {
				this.$options.show();
				this.$newTagInput.focus();
			}
		},
		hideOptions: function () {
			this.$options.hide();
		},

		toggleSelected: function () {
      var selected = !this.model.isSelected();
      this.model.setSelected(selected);
      this.$selected.toggle();
    },
		edit: function () {
			// this.$el.addClass('editing');
			// this.$input.focus();
		},

		addTags: function () {
			// this.model.addTag();
			this.$newTag.show();
			this.$newTagInput.focus();
		},

		close: function () {
			// var trimmedValue = this.$input.val().trim();
			// this.$input.val(trimmedValue);

			// if (trimmedValue) {
			// 	this.model.save({ title: trimmedValue });
			// } else {
			// 	this.clear();
			// }

			// this.$el.removeClass('editing');
		},

		updateOnEnter: function (e) {
			if (e.which === ENTER_KEY) {
				var trimmedTag = this.$newTagInput.val().trim();
				this.$newTagInput.val(trimmedTag);

				if (trimmedTag) {
					var oldTags = this.model.get('tags').slice();
					var newTags = [];
					newTags.push(trimmedTag);
					// ;
					// console.log(oldTags);
					// console.log(newTags);
					this.model.save({ tags: newTags.concat(oldTags) });
					// this.$newTagInput.val('');
				} else {
					this.$newTag.hide();
				}
			}
		},
		clear: function () {
			this.model.destroy({
				success: whenThingDestroyed.bind(this),
				error: whenError,
				wait: true
			});
			function whenThingDestroyed(model, response) {
				Backbone.eventAgg.trigger('message:new', 'succesfully deleted thing with tId:' + response.tid, 'info');
			};
			function whenError(error){
				Backbone.eventAgg.trigger('message:new', 'could not delete thing! Error:' + error, 'danger');

			}
		}


  });

  return ThingthumbnailView;
});