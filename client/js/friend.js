/**
 * Ramble Web Application
 * @author Will Potter <will@strabogis.com>
 * @license ©2012 Strabo, LLC. All Rights Reserved.
 */



/**
 * Creates a new instance of a {@link Friend}. Doesn't do much now other than old information in a dedicated object.
 * @constructor
 *
 */
function RambleFriend(obj) {
	/**
	 * First Name
	 * @type String
	 */
	this.first_name = obj.first_name;
	/**
	 * Last Name
	 * @type String
	 */
	this.last_name = obj.last_name;
	/**
	 * The facebook Identifier
	 * @type Number
	 */
	this.id = obj.id;
	/**
	 * Full Name of the User
	 * @type String
	 */
	this.name = obj.name;
	/**
	 * List of {@link Track} objects that the user has uploaded.
	 * @type Array
	 */
	this.tracks = obj.tracks;
}
