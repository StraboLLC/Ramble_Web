<?php 
require_once('../app/library.php');

setcookie("auth_token", 0, time() - 3600);  /* expire in 1 hour */
setcookie("user_id", 0, time() - 3600);  /* expire in 1 hour */
if($user) {
	$logoutUrl = $facebook->getLogoutUrl();
	header("Location:$logoutUrl");
}

?>