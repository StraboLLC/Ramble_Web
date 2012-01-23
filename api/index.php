<?php
/*
 * The AJAX Api for pulling Data from Various Sources
 *
 *
 */ 
 
/*
 *	Pull track points
 */
// Variables
$googlePlacesApiKey ="AIzaSyAiAbzDbciUezEApEJ4L-vYHIAzwwgR28Q";
if(isset($_GET['track_points'])) {
	if(isset($_GET['name'])) {
		header("Content-type: application/json; charset=UTF-8");
		$n =$_GET['name'];
		$ch = curl_init("http://s3.amazonaws.com/ramble/$n/$n.json");
		$output = curl_exec($ch);
	}

/*
 *	Pull try and calculate a location points
 */
} else if(isset($_GET['location'])) {
	$location = $_GET['location'];
	$radius = $_GET['radius'];
	$types = isset($_GET['types']) ? $_GET['types'] : "false";
	$name = isset($_GET['name']) ? $_GET['name'] : "false"; 
	$googlePlacesApiKey = isset($_GET['key']) ? $_GET['key'] : "false";
	header("Content-type: application/json; charset=UTF-8");
	$ch = curl_init('http://https://maps.googleapis.com/maps/api/place/search/json?location=$location&radius=$radius&types=$types&name=$name&key=$key');
	$output = curl_exec($ch);
}
?>