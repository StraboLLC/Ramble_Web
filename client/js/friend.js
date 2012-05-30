/**
 * Creates a new instance of a Friend. Doesn't do much now other than old information in a dedicated object.
 * @constructor
 *
 */
function Friend(obj) {
	/**
	 * First Name
	 * @type DOMString
	 */
	this.first_name = obj.first_name;
	/**
	 * Last Name
	 * @type DOMString
	 */
	this.last_name = obj.last_name;
	/**
	 * The facebook Identifier
	 * @type Number
	 */
	this.id = obj.id;
	/**
	 * Full Name of the User
	 * @type DOMString
	 */
	this.name = obj.name;
	/**
	 * List of tracks that the user has uploaded.
	 * @type Array
	 */
	this.tracks = obj.tracks;
}
