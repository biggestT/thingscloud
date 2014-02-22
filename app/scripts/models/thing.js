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
      this.on('change:tags', this.save.bind(this));
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
    setNewPhoto: function ( url, dbPath) {

      this._loadingPhotoPath = dbPath;

      // create new dummy jQuery object to tell us when the new image has finished loading
      var img = $('<img>', { src: url }); 

      // async.parallel()
      // once image is loaded it will be added to the model
      img.load(changeToNewPhoto.bind(this));
        
      function changeToNewPhoto () {
  
        this.set({
          'photo': url,
          'path': dbPath
        });
      };

    },

    addTag: function () {
      this.set({
        tags: ['new tag']
      });
    },

    // FUNCTIONS FOR COMMUNICATING WITH THE SERVER

    sync: function(method, model, options) {

      options || (options = {});

       // passing options.url will override 
       // the default construction of the url in Backbone.sync
      options.wait = true;
      this.setProcessing(true);

        switch (method) {

          case "create":
            options.success = onCreationSuccess.bind(this);
            options.error = onCreationFail;
            return this.collection.sync.call(model, method, model, options);

          case "delete":
            options.data = JSON.stringify(this);
            options.contentType = 'application/json';
            options.url = Backbone.serverURL + this.id  + '?access_token=' + this.collection._meta['token'];
            options.success = onDeleteSuccess.bind(this);
            options.error = onDeleteFail;
            break;

          case "update":
            options.url = Backbone.serverURL + this.id  + '?access_token=' + this.collection._meta['token'];
            options.success = onUpdateSuccess.bind(this);
            options.error = onUpdateFail;
            break;
        }

        // if (options.url) {
        return Backbone.sync.call(model, method, model, options);
        // }

        function onCreationSuccess (model, response) {
          Backbone.eventAgg.trigger('message:new', 'succesfully created thing with tId:' + model.tid, 'info');
          this.setProcessing(false);
        }
        function onCreationFail (response) {
          Backbone.eventAgg.trigger('message:new', 'could not delete thing! Error:' + JSON.parse(response.responseText)[0]['code'], 'danger');
        }
        function onUpdateSuccess (model, response) {
          Backbone.eventAgg.trigger('message:new', 'updated thing with tid:' + model.tid, 'info');
          this.setProcessing(false);
        }
        function onUpdateFail (response) {
          Backbone.eventAgg.trigger('message:new', 'could not update thing! Error:' + JSON.parse(response.responseText)[0]['code'], 'danger');
        }
        function onDeleteSuccess (model, response) {
          this.trigger('destroy');
          this.collection.remove(this);
          Backbone.eventAgg.trigger('message:new', 'Thing with tid: ' + model.tid + ' successfully deleted', 'info');
        }
        function onDeleteFail (response) {
          Backbone.eventAgg.trigger('message:new', 'could not delete thing! Error:' + JSON.parse(response.responseText)[0]['code'], 'danger');
        }

    },


    
    
  });

  return ThingModel;
});