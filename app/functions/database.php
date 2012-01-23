<?php 
function selectDB($query) {
	global $con;
	$result = array();
	$res=mysql_query($query,$con);
	while($row=mysql_fetch_array($res)) {
		$result[]=$row;
	}
	return $result;
}
function insertDB($query) {
	global $con;
	$res=mysql_query($query,$con);
	return $res;
}
function removeDB($query) {
	global $con;
	$res=mysql_query($query,$con);
	return $res;
}
function pullUser($id) {
	global $con;
	$query = "SELECT * FROM user WHERE fb_id = '$id'";
	$result = array();
	$res=mysql_query($query,$con);
	while($row=mysql_fetch_array($res)) {
		$result[]=$row;
	}
	if(!empty($result)) {
	return $result;	
	} else return false;
}


// Code to be run
$con = mysql_connect($dbHost,$dbUser,$dbPass);
mysql_select_db($dbSchema,$con);

?>