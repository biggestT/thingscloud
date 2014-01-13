/*global require*/
'use strict';

require.config({
    // Add timestamp to files to get rid of caching
    // urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        async: {
            exports: 'async'
        },
        // d3 js for SVG creation and manipulation
        // Currently just used for procedural logotype 
        // Might further on be used for data visualisations
        d3: {
            exports: 'd3'
        },
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        async: '../bower_components/async/lib/async',
        d3: '../bower_components/d3/d3',
        bootstrap: 'vendor/bootstrap',
        // Dropbox API javascript wrapper
        dbox: '//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.1/dropbox.min',
    },
    // waitSeconds: 40
});

require([
    'backbone',
    'views/app'
], function (Backbone, App) {
    
    var app = new App();
});
