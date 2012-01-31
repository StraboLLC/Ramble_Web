var map;
$(document).ready(function() {

	// Initializing some map stuff
	var myOptions = {
		center: new google.maps.LatLng(44.00858496025453, 286.8300942840576),
		zoom: 15,
		overviewMapControl: false,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("map"), myOptions);
});
