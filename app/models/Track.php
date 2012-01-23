<?php 
/*	
 *	Model: Track
 *	Description: Outlines the functionality for a track.
 *	
 */

function get_track($id) { // Param Track ID
	global $con;
	$query = "SELECT * FROM track WHERE id='$id'";
	$res=mysql_query($query,$con);
	$result=array();
	while($row=mysql_fetch_row($res)) {
		$result=$row;
	}
	return $result;
}
function get_user_videos($id) { // Param User ID
	global $con;
	$query = "SELECT * FROM track WHERE user_id='$id'";
	$res=mysql_query($query,$con);
	$result=array();
	while($row=mysql_fetch_row($res)) {
		$result=get_track($row['id']);
	}
	return $result;
}
function get_friends_videos($id) { // Param Main User ID
	global $con;
	$query = "SELECT * FROM track WHERE user_id='$id'";
	$res=mysql_query($query,$con);
	$result=array();
	while($row=mysql_fetch_row($res)) {
		$result=get_user_videos($row['fb_id']);
	}
	return $result;
}







?>




