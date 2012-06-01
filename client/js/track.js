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


/*

Object
currentRoute: Lh
filename: "69D4B90C-7B13-4B3B-8BC9-BF291C58EF21-1338387452"
name: "GMD Testtrack"
points: Array[75]
richMarker: c
routeCoords: Array[75]
track: Object
	captureDate: "1338387452"
	compass: "mode"
	deviceModel: "iPhone"
	deviceName: "Thomas N Beatty’s iPhone"
	orientation: "vertical"
	points: Array[75]
	softwareVersion: "5.1.1"
	taggedPeople: Array[1]
	taggedPlaces: Array[1]
	title: "GMD Testtrack"
	tracktype: "video"
	uploadDate: "1338388148"
	__proto__: Object
user_id: "552425536"
user_name: "Nate Beatty"
__proto__: Object

*/
