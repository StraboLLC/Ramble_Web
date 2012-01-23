<?php
if ($_SERVER['HTTPS']!="on") {
  header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
  exit();
}
require('app/library.php');


// Determine whether to show app or not.
if ($user) {
	if(!isset($_SESSION['auth_token'])) {
		login($user_profile);
	} else {
		$logoutUrl = $facebook->getLogoutUrl();
		$user_info = pullUser($user_profile['id']);
		require_once('app/views/home.php');
	}
} else {
	$loginUrl = $facebook->getLoginUrl();
	require_once('app/views/home.php');

}
?>

