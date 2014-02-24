/*global define*/

define([
    'underscore',
    'backbone',
    'dbox'
], function (_, Backbone) {
    'use strict';


    // Show responses from the Dropbox API
    function onDropBoxResponse (err, filestat) {
    	if (err) {
    		Backbone.eventAgg.trigger('message:new', 'Dropbox error:' + err.responseText, 'danger');
    	}
    	else {
    		Backbone.eventAgg.trigger('message:new', 'Dropbox created/deleted/modified:' + filestat.path, 'info');
    	}
    }
    // Wrapper for the dropbox.js API interface
    // contains a single dropbox client instance 

    var DropboxModel = Backbone.Model.extend({

      defaults: {
      	authenticated: false,
  			uid: null,
  			oAuthToken: null,
  			appKey: 'cd4zzu95jt7sylk'
      },

      initialize: function () {
      	this._client = new Dropbox.Client({ key: this.get('appKey') });

      	this._client.onError.addListener(function(error) {
		  		console.error(error);
				});
				console.log('initalizing db model');
				this.login();
	    },
	   
	    deleteFile: function(path) {
	    	this._client.remove(path, onDropBoxResponse);
	    },
	    login: function () {
	    	this._client.authenticate( function (error, client) {
					if (error) {return console.error(error);}
					console.log('getting client object');
					this._client = client;
					this.set({ authenticated: true });

					
				}.bind(this));
	    },
	    getOauthToken: function () {
	    	return this._client.credentials().token;
	    },
	    getAccountInfo: function (callback) {
	    	this._client.getAccountInfo( function (error, userInfo) {
						if (error) { return console.error(error); }
						console.log('userId: ' + userInfo.uid +' Name: ' + userInfo.name);
						this(userInfo);
					}.bind(callback)
				);
	    },
	    readDir:function (path, callback) {
				this._client.readdir(path, function (error, fileList, statObject) {
					if(error){ return console.error(error); }
					this(fileList);
				}.bind(callback));
			},
			getThumbnailURLs: function (root, photoFileList) {
				var thumbnailUrls = [];
				for (var i in photoFileList) {
					thumbnailUrls[i] = this._client.thumbnailUrl(root + photoFileList[i], { size: 'm' });
				}
				return thumbnailUrls;
				
			},

			// Creates a lower resolution image of the choosed dropbox file 
			// and stores it in the user's dropbox in a thingsbook-folder
			// @method createThingsbookImage
			// @param {String} photoFilePath
			// @param {Function} callback that gets the returned imagepath
			// @return {String} path public path to the lower resolution image 

			createThingsbookImage: function (photoFilePath, callback) {

				var client = this._client;

				client.readThumbnail(photoFilePath, { blob: true, size: 'l' }, moveFileToThingsbook);

				function moveFileToThingsbook (error, blob, fileStat) {
					if(error){ return console.error(error); }
					var newFilePath = fileStat.path.replace(/.*\//, '');
					client.writeFile(Backbone.appFolder + newFilePath , blob, getPublicURL);
				}

				function getPublicURL (error, fileStat) {
					onDropBoxResponse(error, fileStat);
					client.makeUrl(fileStat.path, { download: true , downloadHack: true }, returnURL)
				}

				function returnURL (error, shareURL) {
					if(error){ return console.error(error); }
					callback(shareURL.url);
				}

			},

			signout: function () {
				this._client.signOut( function (error) {
				if (error) {return console.error(error);}
					this.set({authenticated: false});
					console.log('user logged out');
				}.bind(this));
			}
			
    });

    return DropboxModel;
});