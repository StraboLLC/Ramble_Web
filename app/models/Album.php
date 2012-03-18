<?php 
/*	
 *	Model: Track
 *	Description: Outlines the functionality for a track.
 *	
 */
 
function get_album($id) {
	global $con;
	$query = "SELECT * FROM album WHERE id='$id'";
	$res=mysql_query($query,$con);
	$result=array();
	while($row=mysql_fetch_array($res)) {
		$result=$row;
	}
	$query = "SELECT * FROM track WHERE album_id='".$row['id']."'";
	while($row=mysql_fetch_array($res)) {
		$result['tracks'][] = $row;
	}
	return $result;
}
function get_user_albums($id) {
	global $con;
	$query = "SELECT * FROM album WHERE user_id='$id'";
	$res=mysql_query($query,$con);
	$results=array();
	while($row=mysql_fetch_array($res)) {
		$results[]=get_album($row['id']);
	}
	return $results;
	
} 
 
 
 
 
 
 
 
?>