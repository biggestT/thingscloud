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
    templateTags: JST['app/scripts/templates/tags.ejs'],
    templateProcessing: JST['app/scripts/templates/processing.ejs'],

    events: {
    	'click .delete-thing': 'deleteThing',
    	'click .delete-tag': 'deleteTag',
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
			this.listenTo(this.model, 'change:photo', this.render);
			this.listenTo(this.model, 'change:processing', this.updateProcessing);
			this.listenTo(this.model, 'change:tags', this.updateTags);
		},

		render: function () {

			$(this.el).empty();

			var html = this.template(this.model.toJSON());
			$(this.el).append(html);

			console.log('rendering thing view');
			this.$selected = this.$('selected');
			this.$processing = this.$('.processing');
			this.$options = this.$('div.options-container');
			this.$tags = this.$('div.tags');
			this.$newTag = this.$('div.new-tag');
			this.$newTagInput = this.$('input.new-tag-input');
			
			this.delegateEvents();

			this._rendered = true;
			this.updateTags();
			this.updateProcessing();

			return this;	
		},

		updateTags: function () {

			if (!this._rendered) this.render();

			// Update tags
			this.$tags.empty();
			var html = this.templateTags({tags: this.model.get('tags')});
			this.$tags.append(html);
			
		},
		updateProcessing: function () {
			
			if (!this._rendered) this.render();

			// show processing badge if model is processing
			this.$processing.empty();
			if (this.model.isProcessing()) {
				var html = this.templateProcessing();
				this.$processing.append(html);
			}
		},

		// SHOW OR HIDE THING OPTIONS MENU
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

		addTags: function () {
			this.$newTag.show();
			this.$newTagInput.focus();
		},

		updateOnEnter: function (e) {
			if (e.which === ENTER_KEY) {
				var trimmedString = this.$newTagInput.val().trim();
				this.$newTagInput.val(trimmedString);

				if (trimmedString) {
					var newTags = trimmedString.split(', ');
					var oldTags = this.model.get('tags');
					for (var i in newTags) {
						oldTags.push(newTags[i]);
					}
					this.model.trigger('change:tags');
					this.$newTagInput.val('');
				} else {
					this.$newTag.hide();
				}
				this.addTags();
			}
		},

		deleteThing: function () {
			this.model.destroy();
		},

		deleteTag: function (event) {
					
			var tag = event.target.dataset.tagname;
			var tags = this.model.get('tags');

			var index = tags.indexOf(tag);
			tags.splice(index, 1);
			this.model.trigger('change:tags');
		}

  });

  return ThingthumbnailView;
});