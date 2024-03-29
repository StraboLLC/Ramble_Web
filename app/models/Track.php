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
function get_track_by_filename($filename) {
	global $con;
	$query = "SELECT * FROM track WHERE filename='$filename' AND finished='1'";
	$res=mysql_query($query,$con);
	$result=array();
	while($row=mysql_fetch_array($res)) {
		$result=$row;
	}
	$ch = curl_init("http://s3.amazonaws.com/ramble/".$filename."/".$filename.".json");
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
	$result['track']=json_decode(curl_exec($ch));
	$result['track']=$result['track']->track;
	return $result;
}
function publish($id,$filename) {
	global $facebook;
	$access_token = 'AAAETZB18V7AABALT4mFzcZCmdBEG4I0JSgdqikGMHOcwLqoiN5VEp9b0gRYXVMcrO9Kf5AZBTF2O8kaQVMZCOUSVuqG2dFrNiZBrUHgHlv4bWZCfjDv8xy';
	$app_namespace = "strabo-ramble";
	$url = "http://rambl.it/v/$filename";
	$ret_obj = $facebook->api('/'.$id.'/'.$app_namespace.':upload', 'post', array('track' => $url));
	return $ret_obj;
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
	//$query = "SELECT * FROM track WHERE date_uploaded BETWEEN '$starttime' AND '$time' AND finished='1' AND (";
	$query = "SELECT * FROM track WHERE finished='1' AND (";
	foreach($friends as $f) {
		$query .= "user_id='".$f['id']."' OR ";
	}	
	$query .= " user_id='".$_COOKIE['user_id']."') ORDER BY date_uploaded DESC LIMIT 15"; 
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
	$query = "SELECT * FROM track WHERE jobid='$jobid'";
	$res=mysql_query($query,$con) or die($query." failed because ".mysql_error());
	while($row=mysql_fetch_array($res)) {
		$result=$row;
	}
	if($result['uploadfb']==true) {
		publish($result['user_id'],$result['filename']);
		$query = "UPDATE track SET uploadfb='0' WHERE jobid='$jobid'";
		$res=mysql_query($query,$con) or die($query." failed because ".mysql_error());
	}
	return $res;	
}
function change_track_name($filename,$name) {
	global $con;
	$query = "UPDATE track SET name='$name' WHERE filename='$filename'";
	$res=mysql_query($query,$con) or die($query." failed because ".mysql_error());
	return $res;	
}
//2E232F21-833F-4B34-A10B-D9D633D1DB0C-1329014725
function delete_track($filename) {
	global $con, $s3;
	if($s3->deleteObject("ramble", $filename."/".$filename.".mp4")&&
	$s3->deleteObject("ramble", $filename."/".$filename.".webm")&&
	$s3->deleteObject("ramble", $filename."/".$filename.".json")&&
	$s3->deleteObject("ramble", $filename."/".$filename.".mov")&&
	$s3->deleteObject("ramble", $filename."/".$filename.".png")) {
		$query = "DELETE FROM track WHERE filename='$filename'";
		$res=mysql_query($query,$con) or die($query." failed because ".mysql_error());
		return true;
	} else return false;
}
?>