/**
 * Ramble Web Application
 * @author Will Potter <will@strabogis.com>
 * @license ©2012 Strabo, LLC. All Rights Reserved.
 */



/**
 * Creates a new Map. This extends on the google.maps.Map implementation.
 * @param {Object} options An object with information for initializing the map. Follow google.maps.MapOptions.
 * @extends {google.maps.Map}
 * @constructor
 */
function RambleMap(options,tracks) {
	/**
	 * A reference to the Google Map.
	 * @type google.maps.Map
	 */
	this.map = new google.maps.Map(options);

	/**
	 * A reference to the Tracks that will be displayed on the map.
	 * @type Array
	 */
	this.tracks=tracks;
	this.latLngBounds = new google.maps.LatLngBounds();

}

RambleMap.prototype.clear = function() {
	for (var x in this.tracks) {
		this.tracks[x].richMarker.setMap(null);
		this.tracks[x].currentRoute.setMap(null);
	}
};
RambleMap.prototype.fill = function() {
	map.setZoom(15);
	latLngBounds = new google.maps.LatLngBounds();
	for (var x in this.tracks) {
		this.tracks[x].plot();
	}
};
RambleMap.prototype.reFill = function() {
	for (var x in this.tracks) {
		this.tracks[x].richMarker.setMap(this.map);
		this.tracks[x].currentRoute.setMap(this.map);
	}
};