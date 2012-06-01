/**
 * Ramble Web Application
 * @author Will Potter <will@strabogis.com>
 * @license ©2012 Strabo, LLC. All Rights Reserved.
 */



/**
 * Creates a new Track
 * @param {Object} Response from the server
 * @constructor
 */
function RambleTrack(obj,map) {
	/**
	 * A reference to the {@link RambleMap} where this track should be drawn.
	 * @type RambleMap
	 */
	 this.map = map;
	/**
	 * A reference to the route of this track that displays on the map.
	 * @type google.maps.PolyLine
	 */
	this.route = null;
	/**
	 * The unique file identifier for the video.
	 * @type string
	 */
	this.filename = obj.filename;
	/**
	 * The user given name for the video. Pulled from the database, not the embedded JSON file.
	 * @type string
	 */
	this.name = obj.name;
	/**
	 * An array of all points in the track sorted by video time
	 * @type Array
	 */
	this.points = obj.track.points;
	/**
	 * A reference for the Marker that displays on the Google Map.
	 * @type RichMarker
	 */
	this.richMarker = obj.richMarker;
	/**
	 * An array of google.maps.Points that will be used to generate the currentRoute.
	 * @type Array
	 */
	this.routeCoords=null;
	/**
	 * UNIX Timestamp representing the date of capture. This date is recorded on the device's local time.
	 * @type Number
	 */
	this.captureDate = obj.track.captureDate;
	/**
	 * The mode of the compass (Magnetic or True North)
	 * @type String
	 */
	this.compass = obj.track.compass;
	/**
	 * A string representing the model of the device where the video is recorded.
	 * @type String
	 * @example "iPhone"
	 */
	this.deviceModel = obj.track.deviceModel;
	/**
	 * The name of the device
	 * @type String
	 * @example "Ramble's iPhone"
	 */
	this.deviceName = obj.track.deviceName;
	/**
	 * The orientation of the device during the filming of the video.
	 * @type String
	 * @example Horizontal
	 * @example Vertical
	 */
	this.orientation = obj.track.orientation;
	/**
	 * The version of the device's software
	 * @type Number
	 */
	this.softwareVersion = obj.track.softwareVersion;
	/**
	 *
	 * @type Array
	 */
	this.taggedPeople = obj.track.taggedPeople;
	/**
	 *
	 * @type Array
	 */
	this.taggedPlaces = obj.track.taggedPlaces;
	/**
	 * The title of the {@link Track}
	 * @type String
	 */
	this.title = obj.track.title;
	/**
	 * The type of {@link Track} (Video or Picture)
	 * @type String
	 * @example "Video"
	 * @example "Picture"
	 */
	this.tracktype = obj.track.tracktype;
	/**
	 * The UNIX Timestamp of the Video's upload (Based off of server time)
	 * @type Number
	 */
	this.uploadDate = obj.track.uploadDate;
	/**
	 * The Facebook Identifier of the User who uploaded the {@link Track}.
	 * @type Number
	 */
	this.user_id = obj.user_id;
	/**
	 * The Facebook name of the {@link User} who took recorded the {@link Track}.
	 * @type String
	 */
	this.user_name = obj.user_name;

}
/**
 *
 */
/**
 * Resets the marker on the track by setting the rotation and position to those values of Point 0.
 */
RambleTrack.prototype.toStart = function() {
	var deg = Math.round(this.points[0].heading) - 90;
	this.richMarker.setPosition(new google.maps.LatLng(this.points[0].latitude, this.points[0].longitude));
	this.richMarker.setContent('<div class="marker"><div id="' + this.filename + '-marker" class="video-camera-marker" style="transform:rotate(' + deg + 'deg);-moz-transform:rotate(' + deg + 'deg);-webkit-transform:rotate(' + deg + 'deg);-o-transform:rotate(' + deg + 'deg);-ms-transform:rotate(' + deg + 'deg);" ><img src="/build/images/arrow.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/' + this.user_id + '/picture" alt="" title="' + this.name + '"/></div></div>')
};
/**
 * Initializes the appropriate Google Maps objects and stores them in the {@link RambleTrack} object.
 */
RambleTrack.prototype.plot = function() {
	// Set Points Array
	this.routeCoords = [];
	for (var x in this.points) {
		this.routeCoords.push(new google.maps.LatLng(this.points[x].latitude, this.points[x].longitude));
	}
	this.map.latLngBounds.extend(new google.maps.LatLng(this.points[0].latitude, this.points[0].longitude));
	this.map.map.fitBounds(latLngBounds);
	this.route = new google.maps.Polyline({
		path: this.routeCoords,
		strokeColor: "rgb(48,157,230)",
		strokeOpacity: 0.73,
		strokeWeight: 5
	});
	this.route.setMap(this.map.map);
	var deg = Math.round(this.points[0].heading) - 90;
	this.richMarker = new RichMarker({
		map: this.map.map,
		flat: true,
		position: new google.maps.LatLng(this.points[0].latitude, this.points[0].longitude),
		anchor: RichMarkerPosition.MIDDLE,
		content: '<div class="marker"><div id="' + this.filename + '-marker" class="video-camera-marker" style="transform:rotate(' + deg + 'deg);-moz-transform:rotate(' + deg + 'deg);-webkit-transform:rotate(' + deg + 'deg);-o-transform:rotate(' + deg + 'deg);-ms-transform:rotate(' + deg + 'deg);" ><img src="/build/images/arrow.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/' + this.user_id + '/picture" alt="" title="' + this.name + '"/></div></div>'
	});
	this.richMarker.setMap(this.map.map);
	//TODO: Make sure this is used in the right context
	google.maps.event.addListener(this.richMarker, 'click', function() {
		cT = idx;
		initViewer(this.filename);
		var llb = new google.maps.LatLngBounds();
		for (var x in this.points) {
			llb.extend(new google.maps.LatLng(this.points[x].latitude, this.points[x].longitude));
		}
		this.map.map.fitBounds(llb);
	});
};

/**
 * A reference to the Video Element that is embedded on the page.
 * @type HTMLElement
 */
var video;
/**
 * A reference to the Google Map
 * @type google.maps.Map
 */
var map;
/**
 * The index of the current track in the tracks array.
 * @type number
 */
var cT;
/**
 * The index of the current point in the points array of the current track.
 * @type number
 */
var currentPoint;
/**
 * A reference to the marker of the current track.
 * @type google.maps.Marker
 */
var currentMarker;
/**
 * A reference to the path line of the current track.
 * @type google.maps.Polyline
 */
var route;
/**
 * A reference bounds of the map element.
 * @type google.maps.LatLngBounds
 */
var latLngBounds;
/**
 * An array of tracks to be displayed on the page.
 * @type Array
 */
var tracks;
/**
 * An array of a user's friends.
 * @type Array
 */
var friends;


/**
 * Initialize Dom Listeners For UI Elements
 */

function initListeners() {
	video = $('#video')[0];
	if (video.addEventListener) {
		video.addEventListener("timeupdate", followRoute, false);
	} else if (vid.attachEvent) {
		video.attachEvent("ontimeupdate", followRoute);
	}
	if (video.addEventListener) {
		video.addEventListener("ended", pause, false);
	} else if (vid.attachEvent) {
		video.attachEvent("ended", pause);
	}
	document.oncontextmenu = function(e) {
		return false;
	};

	$('video').dblclick(function() {
		if (this.paused === true) {
			play();
		} else {
			pause();
		}
	});
	$('#play-pause').click(function() {
		if (video.paused === true) {
			play();
		} else {
			pause();
		}
	});
	if (track.orientation === "vertical") {
		$('#video').removeClass('landscape');
	} else {
		$('#video').addClass('landscape');
	}
	$('#scrub-bar').click(function(event) {
		var x = event.pageX - $(this).offset().left;
		var percentDone = x / $(this).width();
		$('#played').width((percentDone * 100) + "%");
		video.currentTime = percentDone * video.duration;
		var accuratePoint = 0;
		a = 10;
		var l = 10;
		for (x in track.points) {
			a = Math.abs(track.points[x].timestamp - (percentDone * video.duration));
			if (a < l) {
				l = a;
				accuratePoint = x;
			}
		}
		track.richMarker.setPosition(new google.maps.LatLng(track.points[accuratePoint].latitude, track.points[accuratePoint].longitude));
		currentPoint = accuratePoint;
	});
}
/**
 * Draws the points of a track in the tracks array with a given index.
 * @param {number} idx Index of the track in the tracks array
 */

function plotTrack(idx) {
	// Set Points Array
	track.routeCoords = [];
	for (var x in track.points) {
		track.routeCoords.push(new google.maps.LatLng(track.points[x].latitude, track.points[x].longitude));
	}
	latLngBounds.extend(new google.maps.LatLng(track.points[0].latitude, track.points[0].longitude));
	map.fitBounds(latLngBounds);
	track.route = new google.maps.Polyline({
		path: track.routeCoords,
		strokeColor: "rgb(48,157,230)",
		strokeOpacity: 0.73,
		strokeWeight: 5
	});
	track.route.setMap(map);
	var deg = Math.round(track.points[0].heading) - 90;
	track.richMarker = new RichMarker({
		map: map,
		flat: true,
		position: new google.maps.LatLng(track.points[0].latitude, track.points[0].longitude),
		anchor: RichMarkerPosition.MIDDLE,
		content: '<div class="marker"><div id="' + track.filename + '-marker" class="video-camera-marker" style="transform:rotate(' + deg + 'deg);-moz-transform:rotate(' + deg + 'deg);-webkit-transform:rotate(' + deg + 'deg);-o-transform:rotate(' + deg + 'deg);-ms-transform:rotate(' + deg + 'deg);" ><img src="/build/images/arrow.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/' + track.user_id + '/picture" alt="" title="' + track.name + '"/></div></div>'
	});
	track.richMarker.setMap(map);
	google.maps.event.addListener(track.richMarker, 'click', function() {
		cT = idx;
		initViewer(track.filename);
		var llb = new google.maps.LatLngBounds();
		for (var x in track.points) {
			llb.extend(new google.maps.LatLng(track.points[x].latitude, track.points[x].longitude));
		}
		map.fitBounds(llb);
	});
}

/**
 * Simple abstraction method that plays the video from the current position.
 */

function play() {
	document.getElementById('video').play();
	$('#play-pause').css("background", "url('/build/images/single-pause.png') center center no-repeat");
}
/**
 * Rotates a DOM Element by apply a CSS3 Rotation
 * @param {Element} elt The element that should be rotated.
 * @param {Number} deg The number of degrees that the element should be rotated.
 */
function domRotate(elt,deg) {
	elt.style.webkitTransform = "rotate(" + deg + "deg)";
	elt.style.MozTransform = "rotate(" + deg + "deg)";
	elt.style.transform = "rotate(" + deg + "deg)";
	elt.style.oTransform = "rotate(" + deg + "deg)";
	elt.style.msTransform = "rotate(" + deg + "deg)";
}
/**
 * Pauses the video and track playback without losing the current position in playback.
 */

function pause() {
	document.getElementById('video').pause();
	$('#play-pause').css("background", "url('/build/images/single-play.png') center center no-repeat");
}
/**
 * Resets the video and track playback and lose the current position in playback.
 */

function reset() {
	currentPoint=0;
	document.getElementById('video').pause();
	$('#play-pause').css("background", "url('/build/images/single-play.png') center center no-repeat");
}
/**
 * Main Method that is called ontimeupdate. This determines if the video is finished playing or is still playing. If finished, this will set the video to pause() mode.
 * If the video is still playing, it will update the Scrub Bar, Marker Position as well as Marker Rotation.
 */

function followRoute() {
	var percentDone = 1;
	var pointTime;
	var currentTime = video.currentTime;
	if (video.ended) { // If video is done.
		currentPoint = 0;
		$('#played').width((percentDone * 100) + "%");
		$('#play-pause').css("background", "url('/build/images/single-play.png') center center no-repeat");
		video.pause();
	} else {
		percentDone = video.currentTime / video.duration;
		if (currentPoint >= track.points.length) currentPoint = track.points.length - 1;
		pointTime = track.points[currentPoint].timestamp;
		if (currentTime > pointTime) {
			currentPoint++;
			var deg = Math.round(track.points[currentPoint].heading) - 90;
			track.richMarker.setPosition(new google.maps.LatLng(track.points[currentPoint].latitude, track.points[currentPoint].longitude));
			domRotate($('#' + track.filename + '-marker')[0], deg);
		}
		$('#played').width((percentDone * 100) + "%");
	}
}
/**
 * Draws the points of a track in the tracks array with a given index.
 * @param {number} idx Index of the track in the tracks array
 */
function plotTrack() {
	// Set Points Array
	track.routeCoords = [];
	for (var x in track.points) {
		track.routeCoords.push(new google.maps.LatLng(track.points[x].latitude, track.points[x].longitude));
	}
	latLngBounds = new google.maps.LatLngBounds();
	latLngBounds.extend(new google.maps.LatLng(track.points[0].latitude, track.points[0].longitude));
	map.fitBounds(latLngBounds);
	track.route = new google.maps.Polyline({
		path: track.routeCoords,
		strokeColor: "rgb(48,157,230)",
		strokeOpacity: 0.73,
		strokeWeight: 5
	});
	track.route.setMap(map);
	var deg = Math.round(track.points[0].heading) - 90;
	track.richMarker = new RichMarker({
		map: map,
		flat: true,
		position: new google.maps.LatLng(track.points[0].latitude, track.points[0].longitude),
		anchor: RichMarkerPosition.MIDDLE,
		content: '<div class="marker"><div id="' + track.filename + '-marker" class="video-camera-marker" style="transform:rotate(' + deg + 'deg);-moz-transform:rotate(' + deg + 'deg);-webkit-transform:rotate(' + deg + 'deg);-o-transform:rotate(' + deg + 'deg);-ms-transform:rotate(' + deg + 'deg);" ><img src="/build/images/arrow.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/' + track.user_id + '/picture" alt="" title="' + track.name + '"/></div></div>'
	});
	track.richMarker.setMap(map);
	google.maps.event.addListener(track.richMarker, 'click', function() {
		cT = idx;
		initViewer(track.filename);
		var llb = new google.maps.LatLngBounds();
		for (var x in track.points) {
			llb.extend(new google.maps.LatLng(track.points[x].latitude, track.points[x].longitude));
		}
		map.fitBounds(llb);
	});
}
$(document).ready(function() {
	currentPoint=0;
	initListeners();
	var lat = 44.00858496025453,
		lng = 286.8300942840576;
	map = new google.maps.Map($("#map")[0], {
		center: new google.maps.LatLng(lat, lng),
		zoom: 15,
		overviewMapControl: false,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	});
	plotTrack();


});
