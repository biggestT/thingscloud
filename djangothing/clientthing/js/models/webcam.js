var app = app || {};

app.CameraModel = Backbone.Model.extend({
  defaults: {
    camera: null
  },
  initialize: function() {

		var vendors = ['', 'ms', 'moz', 'webkit', 'o'];
    
    for(var x = 0; x < vendors.length && ( !window.URL || !navigator.getUserMedia); ++x) {
    		window.URL = window[vendors[x]+'URL']
        navigator.getUserMedia = navigator[vendors[x]+'GetUserMedia'];
    }
    if (!window.URL || !navigator.getUserMedia ) {
      alert('getUserMedia() is not supported in your browser');
    }

    // this.set({ camera: $('#camera') });
    this.set({ camera: document.querySelector('#camera') });

 
  	navigator.getUserMedia( {video: true}, this.initializeCamera.bind(this) , function(err) {console.log(err)} );
  
 	},
 	initializeCamera: function (stream) {
 		
 		this.get('camera').src = window.URL.createObjectURL(stream);
 		// this.set({ camera: new Video( });
    // Set  state
    // this.changeState(this.get('inputStates')['camera']);
 	}
});