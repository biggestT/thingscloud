$(function() {
	$('.drawing').width($('#globalContainer').width());
	
	$(window).resize(function() {
  	$('.drawing').width($('#globalContainer').width());
  	// $('.drawing').height('700px');
  	console.log("rezides");
	});
});