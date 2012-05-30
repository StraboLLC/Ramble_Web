/**
 * Creates a new Track
 * @param {Object} Response from the server
 * @constructor
 */
function Track(obj) {

	this.currentRoute = obj.currentRoute;
	this.filename = obj.filename;
	this.name = obj.name;
	this.points: obj.points;
	this.richMarker: obj.richMarker;
	this.routeCoords: obj.routeCoords;
	this.captureDate = obj.track.captureDate;
	this.compass = obj.track.compass
	this.deviceModel = obj.track.deviceModel;
	this.deviceName = obj.track.deviceName;
	this.orientation = obj.track.orientation;
	this.softwareVersion = obj.track.softwareVersion;
	this.taggedPeople = obj.track.taggedPeople;
	this.taggedPlaces = obj.track.taggedPlaces;
	this.title = obj.track.title;
	this.tracktype = obj.track.tracktype;
	this.uploadDate = obj.track.uploadDate;
	this.user_id = obj.user_id;
	this.user_name = obj.user_name;

}

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