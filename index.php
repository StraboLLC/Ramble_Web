<?php
//if ($_SERVER['HTTPS']!="on") {
//  header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
//  exit();
//}
require('app/library.php');

$ramble_user = false;
// Determine whether to show app or not.
if ($user) {
	if(!isset($_COOKIE['auth_token'])) {
		login($user_profile);
		$ramble_user = true;
		$user_info = pullUser($user_profile['id']);
		require_once('app/views/home.php');
	} else {
		$logoutUrl = $facebook->getLogoutUrl();
		$ramble_user = true;
		$user_info = pullUser($user_profile['id']);
		require_once('app/views/home.php');
	}
} else {
	$ramble_user=false;
	$loginUrl = $facebook->getLoginUrl();
	require_once('app/views/home.php');

}
?>