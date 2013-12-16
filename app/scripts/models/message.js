/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var MessageModel = Backbone.Model.extend({

        defaults: {
      		'type': 'info',
      		'text': 'default message'
        },

        initialize: function () {
        	
        }

        // addMessage: function (message, type) {
        // 	var messages = this.get('messages');
        // 	var id = this_idCount;

        // 	messages.push({
        // 		'type': message,
        // 		'text': type,
        // 		'id': this_idCount
        // 	});

        // 	this._idCount++;
        // 	this.trigger('message:added', id);
        // },
        // removeMessage: function (id) {
        // 	var messages = this.get('messages');
        // 	var index = $.inArray('id', id);

        // 	messages.splice(index, 1);

        // 	this._idCount--;
        // 	this.trigger('message:removed', id);
        // }	


    });

    return MessageModel;
});