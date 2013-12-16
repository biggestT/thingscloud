
var createLogo = function (R, n, id) {

	console.log(R);

	var logo = d3.select(id);

	back = logo.append('circle')
		.attr('r', R)
		.attr('cx', R)
		.attr('cy', R)
		.attr('fill', 'rgb(80,242,51)');

	var circles = [];
	var lines = [];

	var r = R/4.0;

	// starting point of connective lines
	lines[0] = [];
	lines[0].x1 = 2*R;
	lines[0].y1 = 2*R;

	for (var i = 0; i < n; i++) {
		var sign = Math.pow(-1, i);
		circles[i] = [];
		var x = R+sign*Math.random()*(R-1.5*r);
		var y = R*2-i/n*R*2;
		circles[i].x = x;
		circles[i].y = y;

		if (i > 0 && i < n) {
			lines[i] = [];
			lines[i-1].x2 = x;
			lines[i-1].y2 = y;
			lines[i].x1 = x;
			lines[i].y1 = y;
		}

	};

	var c = [20, 20, 20, 20];

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
	
}

window.onload = function () {

	var radius = document.getElementById('logoContainer').offsetWidth / 2;
	createLogo(radius, 4, '#logo');
}