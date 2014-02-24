/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/objectList',
    'views/thing',
    'views/add',
    'views/login'
], function ($, _, Backbone, JST, ObjectListView, ThingView, AddView, LoginView) {

    'use strict';

    var UserView = Backbone.View.extend({

      template: JST['app/scripts/templates/user.ejs'],

			initialize: function () {
				this.listenTo( this.model, 'change:name change:since', this.render );
				this.listenTo( this.model.get('dropbox'), 'change:authenticated', this.render );
				this._myThingsView = new ObjectListView({
					collection: this.model.get('things'),
					childViewConstructor: ThingView,
				  childViewTagName: 'el'
				});

				this._addView = new AddView ({
					model: this.model
				});

				this._loginView = new LoginView({
					model: this.model.get('dropbox')
				})
			},
			
			render: function() {

				var html;

				if (this.model.get('dropbox').get('authenticated')) {

					$(this.el).empty();
					html = this.template(this.model.toJSON());
					$(this.el).append(html);

					this.$('#add').empty();
					this.$('#add').append(this._addView.render().el);

					this.$('.things-list').empty();
					this.$('.things-list').append(this._myThingsView.render().el);

				} 
				else {
					$(this.el).empty();
					html = this.template(this.model.toJSON());
					$(this.el).append(html);
				}

				this.$('#login').empty();
				this.$('#login').append(this._loginView.render().el);
				
			}

	    
	   });

    return UserView;
});