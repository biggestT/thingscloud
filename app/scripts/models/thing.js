/*global define*/

define([
  'underscore',
  'backbone',
  'models/baseModel',
  'async'
], function (_, Backbone, BaseModel, async) {

  'use strict';

  var ThingModel = BaseModel.extend({

    defaults: _.extend({},BaseModel.prototype.defaults, {
    	tags: [],
      photo: null,
      visibility: 'private',
      created: '2013-01-28',
      path: null
    }),

    idAttribute: 'tid',

    initialize: function () {


    },

    // PHOTO GET/SET

    getPhoto: function () {
      return {'url': this.get('photo'), 'path': this.get('path')};
    },
    getLoadingPhotoPath: function () {
      return this._loadingPhotoPath;
    },
    setPhoto: function (url, dbPath) {
      this.set({
        'photo': url,
        'path': dbPath
      });
    },
    setNewPhoto: function (url, dbPath) {

      console.log('waiting for new image');
      this._loadingPhotoPath = dbPath;

      // create new dummy jQuery object to tell us when the new image has finished loading
      var img = $('<img>', { src: url }); 

      // async.parallel()
      // once image is loaded it will be added to the model
      img.load(changeToNewPhoto.bind(this));
        
      function changeToNewPhoto () {
        console.log('changing to new photo inside thing model');
        this.set({
          'photo': url,
          'path': dbPath
        });
        
      };

    },

    addTag: function () {
      // var newTags = this.get('tags');
      // var newTag = 'new tag';
      // newTags.push(newTag);
      this.set({
        tags: ['new tag']
      });
    },

    // FUNCTIONS FOR COMMUNICATING WITH THE SERVER

    sync: function(method, model, options) {

      options || (options = {});

       // passing options.url will override 
       // the default construction of the url in Backbone.sync

        switch (method) {
          case "create":
            return this.collection.sync.call(model, method, model, options);
          // case "read":
          //     options.url = "/myservice/getUser.aspx?id="+model.get("id");
          //     break;
          case "delete":
            console.log('trying to delete thing');
            options.url = 'http://127.0.0.1:8000/' + this.id  + '?access_token=' + this.collection._meta['token'];
            break;
          // case "update":
          //     options.url = "/myService/setUser.aspx";
          //     break;
        }

        if (options.url) {
          return Backbone.sync.call(model, method, model, options);
        }
    }

    
    
  });

  return ThingModel;
});