<?php 
// Facebook Init Stuff
$facebook = new Facebook(array(
	'appId'  => $fbAppID,
	'secret' => $fbAppSecret
));
$user = $facebook->getUser();
if ($user) {
	try {
		// Proceed knowing you have a logged in user who's authenticated.
		$user_profile = $facebook->api('/me');
		$user_friends = $facebook->api('/me/friends');
		$user_ramble_friends = get_friends($user_friends);
	} catch (FacebookApiException $e) {		
		error_log($e);
		$user = null;
	}
}



?>