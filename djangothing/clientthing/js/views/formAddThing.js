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
		var data = this.$tag;
		// data[1]	= this.$image;
		console.log(data.val());
    	return false;
	}
	// var arr = this.$el.serializeArray();
 //    var data = _(arr).reduce(function(acc, field) {
 //      acc[field.name] = field.value;
 //      return acc;
 //    }, {});
});	