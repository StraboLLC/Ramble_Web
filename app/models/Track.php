<?php 
/*	
 *	Model: Track
 *	Description: Outlines the functionality for a track.
 *	
 */

function get_track($id) { // Param Track ID
	global $con;
	$query = "SELECT * FROM track WHERE id='$id' AND finished='1'";
	$res=mysql_query($query,$con);
	$result=array();
	while($row=mysql_fetch_array($res)) {
		$result=$row;
	}
	return $result;
}
function get_user_videos($id) { // Param User ID
	global $con;
	$query = "SELECT * FROM track WHERE user_id='$id' AND finished='1'";
	$res=mysql_query($query,$con);
	$result=array();
	while($row=mysql_fetch_array($res)) {
		$result[]=$row;
	}
	return $result;
}
function get_friends_videos($friends) { // Param Main User ID
	global $con;
	$result = array();
	foreach($friends as $f) {
		$query = "SELECT * FROM track WHERE user_id='".$f['id']."' AND finished='1'";
		$res=mysql_query($query,$con);
		while($row=mysql_fetch_array($res)) {
			$result[]=$row;
		}
	}
	return $result;
}
function get_track_by_name($filename) {
	global $con;
	$query = "SELECT * FROM track WHERE filename='$filename' AND finished='1'";
	$res=mysql_query($query,$con);
	$result=array();
	while($row=mysql_fetch_array($res)) {
		$result=$row;
	}
	return $result;
}

function get_recent_videos($friends) {
	$time = time();
	$starttime = $time-(60*60*24*14);
	global $con;
	$query = "SELECT * FROM track WHERE date_uploaded BETWEEN '$starttime' AND '$time' AND finished='1' AND (";
	foreach($friends as $f) {
		$query .= "user_id='".$f['id']."' OR ";
	}	
	$query .= " user_id='".$_SESSION['user_id']."') ORDER BY date_uploaded DESC"; 
	$result = array();
	$res=mysql_query($query,$con) or die($query." failed because ".mysql_error());
	while($row=mysql_fetch_array($res)) {
		$result[]=$row;
	}
	return $result;
}
function toggle_job_state($num,$jobid) {
	global $con;
	$query = "UPDATE track SET finished='$num' WHERE jobid='$jobid'";
	$res=mysql_query($query,$con) or die($query." failed because ".mysql_error());
	return $res;	
}
function change_track_name($filename,$name) {
	global $con;
	$query = "UPDATE track SET name='$name' WHERE filename='$filename'";
	$res=mysql_query($query,$con) or die($query." failed because ".mysql_error());
	return $res;	
}
?>