/**
 * Ramble Web Application
 * @author Will Potter <will@strabogis.com>
 * ©2012 Strabo, LLC. All Rights Reserved.
 */
/**
 * A Utility Class for Holding Ramble-Related Methods.
 *
 */
function RambleUtil() {

}
/**
 * Rotates a DOM Element by apply a CSS3 Rotation
 * @param {Element} elt The element that should be rotated.
 * @param {Number} deg The number of degrees that the element should be rotated.
 */
RambleUtil.prototype.domRotate = function(elt,deg) {
	elt.style.webkitTransform = "rotate(" + deg + "deg)";
	elt.style.MozTransform = "rotate(" + deg + "deg)";
	elt.style.transform = "rotate(" + deg + "deg)";
	elt.style.oTransform = "rotate(" + deg + "deg)";
	elt.style.msTransform = "rotate(" + deg + "deg)";
}
function domRotate (elt,deg) {
	elt.style.webkitTransform = "rotate(" + deg + "deg)";
	elt.style.MozTransform = "rotate(" + deg + "deg)";
	elt.style.transform = "rotate(" + deg + "deg)";
	elt.style.oTransform = "rotate(" + deg + "deg)";
	elt.style.msTransform = "rotate(" + deg + "deg)";
}