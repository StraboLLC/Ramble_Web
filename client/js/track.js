/**
 * Creates a new Track
 * @param {Object} Response from the server
 * @constructor
 */

function Track(obj) {
	/**
	 * A reference to the route of this track that displays on the map.
	 * @type google.maps.Map
	 */
	this.currentRoute = obj.currentRoute;
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
	this.points = obj.points;
	/**
	 * A reference for the Marker that displays on the Google Map.
	 * @type RichMarker
	 */
	this.richMarker = obj.richMarker;
	/**
	 *
	 * 
	 */
	this.routeCoords = obj.routeCoords;
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
