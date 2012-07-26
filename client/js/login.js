/**
 * Ramble Web Application
 * @author Will Potter <will@strabogis.com>
 * ©2012 Strabo, LLC. All Rights Reserved.
 */


var map;
$(document).ready(function() {

	var lat=44.00858496025453,lng=286.8300942840576;
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			lat=position.coords.latitude;
			lng=position.coords.longitude;
			var myOptions2 = {
				center: new google.maps.LatLng(lat,lng),
				zoom: 15,
				overviewMapControl: false,
				panControl: false,
				mapTypeId: google.maps.MapTypeId.SATELLITE
			};
			map = new google.maps.Map(document.getElementById("map"), myOptions2);
		});
	} else {
		var myOptions = {
			center: new google.maps.LatLng(lat,lng),
			zoom: 15,
			overviewMapControl: false,
			panControl: false,
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};
		map = new google.maps.Map(document.getElementById("map"), myOptions);
	}
	document.getElementById('mce-EMAIL').onkeypress=function(e) {
		var code = e.which;
		if(code===13) {
			document.getElementById('mc-embedded-subscribe-form').submit();
		}
	};
});
