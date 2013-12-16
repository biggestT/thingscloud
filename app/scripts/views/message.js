/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MessageView = Backbone.View.extend({

        template: JST['app/scripts/templates/message.ejs'],

        initialize: function () {

        	_(this).bindAll('show', 'hide');

        	this.listenTo(this.model, 'message:added', this.show);
        	this.listenTo(this.model, 'message:removed', this.hide);

        	// this._fadeTime = this.model.collection.getFadeTime();
        	// this.render();
        },

        render: function () {

        	$(this.el).empty();
        	var html = this.template(this.model.toJSON());
        	$(this.el).append(html);
        	$(this.el).css('display', 'none');

        	return this;
        },

        show: function () {
        	var fadeTime =  this.model.collection.getFadeTime();
        	$(this.el).fadeIn(fadeTime);
        },

        hide: function () {
        	var fadeTime =  this.model.collection.getFadeTime();
        	$(this.el).fadeOut(fadeTime);
        }
    });

    return MessageView;
});