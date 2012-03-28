<?php
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']=="on") {
  header("Location: http://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
  exit();
}
require('app/library.php');
if(isset($_GET['logout'])) {
	setcookie("auth_token", 0, time() - 3600);
	setcookie("user_id", 0, time() - 3600);
	if($user) {
		$logoutUrl = $facebook->getLogoutUrl();
		header("Location:$logoutUrl");
	} else header("Location:/");
}
if($_SERVER["HTTP_HOST"] != "rambl.it") {
	header("Location: http://rambl.it". $_SERVER["REQUEST_URI"]);
}
$ramble_user = false;
$invite_code = false;
// Determine whether to show app or not.
if ($user) {
	$logoutUrl = $facebook->getLogoutUrl();
	$code = isset($_POST['code']) ? $_POST['code'] : "invalid";
	if(!isset($_COOKIE['auth_token'])) {
		if(login($user_profile,$code)==true) {
			header("Location: $siteUrl");
		} else {
			$ramble_user = false;
			$invite_code = true;
		}
	} else {
		$ramble_user = true;
		$user_info = pullUser($user_profile['id']);
	}
} else {
	$ramble_user=false;
	$loginUrl = $facebook->getLoginUrl();
}
require_once('app/views/home.php');
?>