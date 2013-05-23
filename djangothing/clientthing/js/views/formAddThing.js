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
		
		var tag = this.$tag.val();
		var photo = this.$image.val();

		var tagModel = new app.Tag({word: tag});
		var thingModel = new app.Thing({photo: photo, tag:[tag]});
		console.log(JSON.stringify(thingModel));
		
		$.ajax({
			type: "POST",
			url: urltag,
			data: JSON.stringify(tagModel),
			contentType: 'application/json'
		});
		$.ajax({
			type: "POST",
			url: urlthing,
			data: JSON.stringify(thingModel),
			contentType: 'application/json'
		});
    	return false;
	}
});	