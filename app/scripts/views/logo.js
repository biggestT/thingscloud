/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'd3'
], function ($, _, Backbone, JST, d3) {

  'use strict';


	var createLogo = function (R, n, id) {

		var logo = d3.select(id);

		var r = R/5.0;

		var circles = [];
		var shift = Math.round(Math.random());
		for (var i = 0; i < n; i++) {
			var sign = Math.pow(-1, i+shift);
			circles[i] = [];
			var x = R+sign*Math.random()*(R-1.5*r);
			var y = (i+1)/n*R*1.5;
			circles[i].x = x;
			circles[i].y = y;
		};

		var lines = [];

		for (var i = 1; i < n; i++) {
			lines[i-1] = [];
			lines[i-1].x1 = circles[i-1].x;
			lines[i-1].y1 = circles[i-1].y;
			lines[i-1].x2 = circles[i].x;
			lines[i-1].y2 = circles[i].y;
		}	

		var circles = logo.selectAll('circle')
			.data(circles)
			.enter()
			.append('circle');

		var lines = logo.selectAll('line')
			.data(lines)
			.enter()
			.append('line');

		var circlesAttributes = circles
			.attr('cx', function (d) { return d.x; })
			.attr('cy', function (d) { return d.y; })
			.attr('r', r)
			.attr('fill', 'white')

		var linesAttributes = lines 
			.attr('x1', function (d) { return d.x1; })
			.attr('y1', function (d) { return d.y1; })
			.attr('x2', function (d) { return d.x2; })
			.attr('y2', function (d) { return d.y2; })
			.attr('style', 'stroke:white;stroke-width:'+r/1.3 );
		
	};

  var LogoView = Backbone.View.extend({

    template: JST['app/scripts/templates/logo.ejs'],

    initialize: function () {
			var radius = this.$el.width() / 2;
			createLogo(radius, 3, '#logo');
		}
	});

  return LogoView;
});