<?php 
/*	
 *	Model: User
 *	Description: Outlines the functionality for a user.
 *	
 */
function login($user_profile, $code="invalid") {
	global $salt;
	$bool = false;
	global $con;
	$id = $user_profile['id'];
	$email = isset($user_profile['email']) ? $user_profile['email'] : null;
	$firstname = isset($user_profile['first_name']) ? $user_profile['first_name'] : null;
	$lastname = isset($user_profile['last_name']) ? $user_profile['last_name'] : null; 
	$username = isset($user_profile['username']) ? $user_profile['username'] : null;
	$query = "SELECT * FROM user WHERE fb_id = '$id'";
	$res = mysql_query($query,$con) or die("Query ".$query."Failed because: ".mysql_error());
	while($row=mysql_fetch_array($res)) {
		$bool = true;
		setcookie("auth_token", $row['auth_token'], time()+(3600*24*31));  /* expire in 1 hour */
		setcookie("user_id", $row['fb_id'], time()+(3600*24*31));  /* expire in 1 hour */
		return true;
	}
	if($bool == false) {
		$query = "SELECT * FROM user WHERE invite_code = '$code'";
		$res = mysql_query($query,$con) or die("Query ".$query."Failed because: ".mysql_error());
		if(mysql_num_rows($res)>0) { 
			$auth_token = md5($id.$salt);
			//$query = "INSERT INTO user (fb_id, fb_user, fb_username, auth_token, email, first_name, last_name) VALUES ('$id','1','$username','$auth_token','$email','$firstname','$lastname')";
			$query = "UPDATE user SET fb_id='$id', fb_user='1', fb_username='$username', auth_token='$auth_token', email='$email', first_name='$firstname', last_name='$lastname', invite_code=null WHERE invite_code='$code'";
			mysql_query($query,$con) or die("Query ".$query."Failed because: ".mysql_error());
			setcookie("auth_token", $row['auth_token'], time()+(3600*24*31));  /* expire in 1 hour */
			setcookie("user_id", $row['fb_id'], time()+(3600*24*31));  /* expire in 1 hour */
			return true;
		}
		return false;
	}
}
function generate_token() {
	global $con;
	$code = md5(time() + rand());
	$query = "INSERT INTO user (invite_code) VALUES ('$code')";
	$res = mysql_query($query,$con);
	return $code;
}
function mobile_login($user_id, $auth_token) {
	$bool = false;
	global $salt, $facebook, $con;
	$atoken = md5($user_id.$salt);
	if($atoken==$auth_token) {
		$user_profile = $facebook->api('/'.$user_id);
		$id = $user_profile['id'];
		$email = isset($user_profile['email']) ? $user_profile['email'] : null;
		$firstname = isset($user_profile['first_name']) ? $user_profile['first_name'] : null;
		$lastname = isset($user_profile['last_name']) ? $user_profile['last_name'] : null; 
		$username = isset($user_profile['username']) ? $user_profile['username'] : null;
		$query = "SELECT * FROM user WHERE fb_id = '$id'";
		$res = mysql_query($query,$con) or die("Query ".$query."Failed because: ".mysql_error());
		while($row=mysql_fetch_array($res)) {
			$bool = true;
			setcookie("auth_token", $row['auth_token'], time()+(3600*24*31));  /* expire in 1 hour */
			setcookie("user_id", $row['fb_id'], time()+(3600*24*31));  /* expire in 1 hour */
			return true;
		}
		if($bool == false) {
			$auth_token = md5($id.$salt);
			$query = "INSERT INTO user (fb_id, fb_user, fb_username, auth_token, email, first_name, last_name) VALUES ('$id','1','$username','$auth_token','$email','$firstname','$lastname')";
			mysql_query($query,$con) or die("Query ".$query."Failed because: ".mysql_error());
			setcookie("auth_token", $row['auth_token'], time()+(3600*24*31));  /* expire in 1 hour */
			setcookie("user_id", $row['fb_id'], time()+(3600*24*31));  /* expire in 1 hour */
		}
	}
}
function verifyID($id,$auth_token) {
	global $salt;
	$return = false;
	$auth_token = md5($id.$salt);
	global $con;
	$query = "SELECT * FROM user WHERE fb_id='$id' AND auth_token = '$auth_token'";
	$res = mysql_query($query,$con);
	while($row=mysql_fetch_array($res)) {
		$return = true;
	}
	return $return;
}
function get_friends($friends) {
	global $con;
	$result = array();
	foreach($friends as $g) {
		foreach($g as $f) {
			$query = "SELECT * FROM user WHERE fb_id = '".$f['id']."' ORDER BY last_name DESC";
			$res = mysql_query($query,$con);
			while($row=mysql_fetch_array($res)) {
				$f['rInfo'] = $row;
				$result[] = $f;				
			}
		}
	}
	if(!empty($result)) return $result;
	else return array();
}
function me() {
	global $con, $facebook;
	return $facebook->api('/me');
}
function get_friend_by_id($friends,$id) {
	$f=false;
	foreach($friends as $f) {
		if($f['id']==$id) {
			$friend = $f;
		}
	}
	if($id==$_COOKIE['user_id']) $friend = me();
	return $friend;
}
?>