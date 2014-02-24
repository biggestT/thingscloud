define([
  'underscore',
  'backbone',
  'models/message'
], function (_, Backbone, Message) {
	
  'use strict';

  var MessageCollection = Backbone.Collection.extend({
    
    model: Message,

    initialize: function(options) {

      if (!options.eventAggregator) throw "no event aggregator provided";

      _(this).bindAll('addMessage', 'removeMessage');

      this.on('add', updateModelsCollection);

      function updateModelsCollection ( baseModel ) {
        baseModel.collection = this;
      }

      this._fadeTime = 250;
      this.listenTo(options.eventAggregator, 'message:new', this.addMessage);

    },

    getFadeTime: function () {
      return this._fadeTime;
    },

    removeMessage: function (message) {
      message.trigger('message:removed');
      // wait until message has had time to fade out before removing it from the collection
      window.setTimeout(function () {
        this.remove(message);
      }.bind(this), this._fadeTime);
    },
    
    addMessage: function (messageText, messageType) {
      console.log('new incoming message');
      var newMessage = new Message({
        text: messageText,
        type: messageType
      })
      this.add(newMessage);
      newMessage.trigger('message:added');
      window.setTimeout(function () {
        this.removeMessage(newMessage);
      }.bind(this), 4000);
    }
      
  });

  return MessageCollection;
});