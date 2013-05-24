/*global Backbone */
var app = app || {};

app.FormAddThingView = Backbone.View.extend({
	el:$("#formAddThing"),

	// perform post to db
	events: {
		"submit" : "getFormData"
	},

	initialize: function(){
		this.$tag = this.$('#form-tag');
		this.$image = this.$('#form-image');
		this.render();
	},

	render: function(){

	},

	getFormData: function(event){
		var urlthing = "http://127.0.0.1:8000/things/add/"
		var urltag = "http://127.0.0.1:8000/things/tags/"
		
		var photo = this.$image.val();
		var tags = this.$tag.val();
		var tags = tags.split(" ");
		
		var tagCollection = Backbone.Collection.extend({
			model: app.Tag
		});

		var TAGS = new tagCollection(tagModel);
		var i = 0;
		
		while(tags[i]){
			var tagModel = new app.Tag({word: tags[i]});
			// TAGS.add(tagModel);
			$.ajax({
				type: "POST",
				async: false,
				url: urltag,
				data: JSON.stringify(tagModel),
				contentType: 'application/json',
			});
			i++;
		}
		
		var tagModel = new app.Tag({word: tag});
		var thingModel = new app.Thing({photo: photo, tag:[tag], owner: 1});

		console.log(JSON.stringify(thingModel));
		
		$.ajax({
			type: "POST",
			async: false,
			url: urlthing,
			data: JSON.stringify(thingModel),
			contentType: 'application/json',
		});

		this.$tag.val('');
		this.$image.val('');
    	return false;
	}
});	