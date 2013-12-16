/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/objectList',
    'views/message',
    'collections/messages'
], function ($, _, Backbone, JST, ObjectListView, MessageView, MessageCollection) {

    'use strict';

    var MessageBoxView = Backbone.View.extend({

    	// template: JST['app/scripts/templates/messageBox.ejs'],

    	initialize: function(options) {

    		if (!options.messageCollection) throw "no message collection provided";

    		this._messages = options.messageCollection;

    		this._messagesView = new ObjectListView({
					collection: this._messages,
					childViewConstructor: MessageView,
				  childViewTagName: 'div'
				});
				this.render();
    	},

    	render: function () {
    		$(this.el).empty();
    		$(this.el).append(this._messagesView.render().el);
    		// var html = this.
    	}
    });

    return MessageBoxView;
});

