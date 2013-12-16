/*global define*/

	define([
		'jquery',
		'underscore',
		'backbone',
		'async',
		'templates',
		'models/thing',
		'models/photo',
		'collections/things',
		'collections/photos',
		'views/objectList',
		'views/preview'
	], function ($, _, Backbone, async, JST, Thing, Photo, Things, Photos, ObjectListView, PreviewView ) {

	'use strict';

	var AddThingView = Backbone.View.extend({
		
		events: {
    	"click .add-open": "open",
	    "click .add-upload": "upload"
	  },

	  tagName: 'section',

		template: JST['app/scripts/templates/add.ejs'],

		initialize: function () {
			_(this).bindAll('listFiles');

			this._open = false;
			this._rootFolder = 'Camera Uploads/';
			this._dropbox = this.model.get('dropbox');
			this._collection = this.model.get('things');
			this._photos = new Photos();

			this._photoListView = new ObjectListView({
				collection: this._photos,
				childViewConstructor: PreviewView,
				childViewTagName: 'el'
			});

		},

		open: function() {
			console.log('opening add');
			this._open = true;
			this.listFiles();
			this.render();
		},

		close: function () {
			this._open = false;
			this.render();
		},
		
		render: function() {

			$(this.el).empty();

			var html = this.template({ open: this._open });
			$(this.el).append(html);
			
			this.delegateEvents();

			if (this._open) {
				// this._photoListView.render();
				this.$('.photo-list').prepend(this._photoListView.render().el);
			}
			
			return this;
		},

		listFiles: function () {


			var root = this._rootFolder;
			var db = this._dropbox;
			var potentialUploads = this._photos;
			var alreadyListed = [];
			var alreadyUploaded = [];

			this._collection.each(function (thing) {
				alreadyUploaded.push(thing.getPhoto().path);
			});

			potentialUploads.each(function (photo) {
				alreadyListed.push(photo.getPhoto().path)
			});

			var excludeFileList = alreadyUploaded.concat(alreadyListed);
			db.readDir(root, function (fileList) {

				// filter out only image files in fileList
				var photoFileList = _.filter(fileList, function (fileName) {
					var isNotAlreadyListed = $.inArray(fileName, excludeFileList) < 0;
					var isPhoto = fileName.match(/^.*\.jpg$/);
					return (isPhoto && isNotAlreadyListed);
				});
				// console.log(this.rootFolder);
				var thumbnailUrls = db.getThumbnailURLs(root, photoFileList);
				// Put all listed models in an array and then add them all to the collection

				var tempPhotos = [];
				for (var i in thumbnailUrls) {
					var tempPhoto = new Photo();
					tempPhoto.setPhoto(thumbnailUrls[i], photoFileList[i]);
					tempPhotos.push(tempPhoto);
				}
				potentialUploads.add(tempPhotos);

			}.bind({db: db}));

		},
		upload: function () {

			var root = this._rootFolder;
			var db = this._dropbox;

			var potentialUploads = this._photos;
			var photosToUpload = potentialUploads.getSelected();

			var usersThings = this._collection;
			var thingsToUpload = new Things();

			// Turn selected photos into things
			var newThings = [];
			photosToUpload.each(function (photo) {
				console.log('trying to add photo to new model');
				var photoInfo = photo.getPhoto();
				var newThing = new Thing();
				newThing.setPhoto(photoInfo.url, photoInfo.path);
				newThings.push(newThing);
			})

			thingsToUpload.add(newThings);
			console.log(newThings);
			// add temporary things with low res thumbnails as pictures
			usersThings.add(thingsToUpload.models);

			// Create dropbox image links for thingsbook to use 
			// Runs in parallell and when all images are created the collection
			// is synced with the server's database
			async.each(thingsToUpload.models, createNewThing, allThingsSaved);

			function allThingsSaved (err) {
				console.log('all images saved to server and dropox');
				// finally remove photos from potential uploads list
				potentialUploads.remove(photosToUpload.models);
			}

			function createNewThing (thing, callback) {

				var photoPath =	thing.getPhoto().path;
				thing.setProcessing(true);

				db.createThingsbookImage(root + photoPath, saveNewThing);

				function saveNewThing (url) {
					
					console.log('setting new photo for thing with photo url: ' + url);

					// Set new photo on model, the photo  only show up when loaded
					thing.setNewPhoto(url, photoPath);
					
					// save the thing to the server with the new photo even though it hasn't been loaded for
					// client display yet
					thing.save({photo: url}, {
						success: whenThingReady.bind(thing),
						error: savingFailed,
						wait: true
					});

					function whenThingReady (model, response) {
						Backbone.eventAgg.trigger('message:new', 'thing saved to server with tid: ' + response.tid, 'success');
						this.setProcessing(false);
						callback();
					}
					function savingFailed (model, error) {
						Backbone.eventAgg.trigger('message:new', 'thing could not be saved to server: ' + error, 'danger');
						model.destroy();
					}
				}
			}

			// close the add view when finished
			this.close();
		}

	});

	return AddThingView;

});