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

      // make sure tags array is a new one
      if (this.isNew()) this.set('tags', []); // not sure why this is needed
      
      this.on('change:tags',function(){ this.save(); });

      this.on('request', function () { this.setProcessing(true); })
      this.on('sync', function () { this.setProcessing(false); })

      BaseModel.prototype.initialize.call(this, arguments);
    },

    // PHOTO GET/SET/DELETE METHODS
    // --------------------------

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
    deletePhoto: function () {
      var photo = this.getPhoto();
      Backbone.db.deleteFile(Backbone.appFolder + photo['path']);
    },
    setNewPhoto: function ( url, dbPath) {

      this._loadingPhotoPath = dbPath;

      // create new dummy jQuery object to tell us when the new image has finished loading
      var img = $('<img>', { src: url }); 

      // once image is loaded it will be added to the model
      img.load(changeToNewPhoto.bind(this));
        
      function changeToNewPhoto () {
  
        this.set({
          'photo': url,
          'path': dbPath
        });
      };

    },

    // CUSTOMIZED SYNC METHODS 
    // -------------------

    fetch: function(options) {
      options || (options = {});
      options.success = onFetchSuccess;
      // options.error = onFetchError;
      // call backbone default fetch
      
      function onFetchSuccess (resp, status, xhr) {
        Backbone.eventAgg.trigger('message:new', 'succesfully fetched thing with id:' + resp.tid, 'info');
      }

      Backbone.Model.prototype.fetch.call(this, options);
    },

    save: function(attrs, options) {
      options || (options = {});
      options.success =  (this.isNew()) ? onCreationSuccess : onUpdateSuccess;
      options.error =  (this.isNew()) ? onCreationError : onUpdateError;
        

      function onUpdateSuccess (model, resp, opt) {
        Backbone.eventAgg.trigger('message:new', 'updated thing with tid:' + resp.tid, 'info');
      }
      function onCreationSuccess (model, resp, opt) {
        Backbone.eventAgg.trigger('message:new', 'created a new thing with tid:' + resp.tid, 'success');
      }
      function onCreationError (resp) {
        Backbone.eventAgg.trigger('message:new', 'error creating thing:' + JSON.parse(response.responseText[0]['code']), 'danger');
      }
      function onUpdateError (resp) {
        Backbone.eventAgg.trigger('message:new', 'error updating thing:' + JSON.parse(response.responseText[0]['code']) , 'danger');
      }

      Backbone.Model.prototype.save.call(this, attrs, options);
    },

    destroy: function (options) {
      options || (options = {});
      options.success = onDestroySuccess;
      options.error = onDestroyError;

      function onDestroySuccess (model, resp, options) {
        model.deletePhoto();
        Backbone.eventAgg.trigger('message:new', 'thing with tid:' + resp.tid + ' deleted' , 'info');
      }
      function onDestroyError (model, resp, options) {
        Backbone.eventAgg.trigger('message:new', 'Error deleting thing' + resp.tid , 'danger');
      }
      Backbone.Model.prototype.destroy.call(this, options);
    },

    // SET OPTIONS COMMON FOR ALL SERVER SYNCRONISATION CALLS
    sync: function(method, model, options) {

      options || (options = {} );

      options.wait = true;

        switch (method) {

          case "delete":
            options.data = JSON.stringify(this);
            options.contentType = 'application/json';
            break;

        }

        return Backbone.sync.call(model, method, model, options);
    }


    
    
  });

  return ThingModel;
});