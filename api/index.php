<?php
/*
 * The AJAX Api for pulling Data from Various Sources
 *
 *
 */ 
require_once('../app/library.php');

// ************************************************************************************
// Variables
// ************************************************************************************
$googlePlacesApiKey ="AIzaSyAiAbzDbciUezEApEJ4L-vYHIAzwwgR28Q";


// ************************************************************************************
//	Pull track points
// ************************************************************************************
if(isset($_GET['track_points'])&&isset($_COOKIE['auth_token'])) {
	if(isset($_GET['name'])) {
		header("Content-type: application/json; charset=UTF-8");
		$n =$_GET['name'];
		$t = get_track_by_name($n);
		$ch = curl_init("http://s3.amazonaws.com/ramble/$n/$n.json");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
		$output = json_decode(curl_exec($ch));
		$output->track->title = $t['name'];
		$output->track->uploadDate = $t['date_uploaded'];
		echo json_encode($output);
	}
}
// ************************************************************************************
// Show a sidebar that reflects a particular user's videos.
// ************************************************************************************
//else if((isset($_GET['user_sidebar'])||isset($_GET['go_home']))&&isset($_COOKIE['auth_token'])) {
else if((isset($_GET['user_sidebar'])||isset($_GET['go_home']))) {
	if(isset($_GET['id'])&&isset($_GET['user_sidebar'])) { 
		$u = $facebook->api('/'.$_GET['id']); 
		$videos = get_user_videos($_GET['id']); 
		$user_friends = $facebook->api('/me/friends');
		$user_ramble_friends = get_friends($user_friends);
	} else if(isset($_GET['go_home'])) {
		$user_friends = $facebook->api('/me/friends');
		$user_ramble_friends = get_friends($user_friends);
		$videos = get_recent_videos($user_ramble_friends);
	}

	//Generate Output
	if(isset($_GET['id'])&&isset($_GET['user_sidebar'])) {
		$response->is_user=true;
		$response->user_id=$u['id'];
		$response->name=$u['name'];
	} else if(isset($_GET['go_home'])) {
		$response->is_user=false;
	}
	$response->tracks=array();
	foreach( $videos as $v) { 
		$t = get_track_by_name($v['filename']);
		$ch = curl_init("http://s3.amazonaws.com/ramble/".$v['filename']."/".$v['filename'].".json");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
		$output = json_decode(curl_exec($ch));
		$output->track->title = $t['name'];
		$output->track->uploadDate = $t['date_uploaded'];	
		$output->filename=$v['filename'];
		$output->name=$v['name'];
		$output->user_id=$v['user_id'];
		$a=get_friend_by_id($user_ramble_friends,$v['user_id']); 
		$output->user_name=$a['name'];
		array_push($response->tracks, $output);
	}

	$response->friends=array();
	foreach( $user_ramble_friends as $u) { 
		$friend = (object)null;
		$friend->id=$u['rInfo']['fb_id'];
		$friend->name=$u['name'];
		$friend->first_name=$u['rInfo']['first_name'];
		$friend->last_name=$u['rInfo']['last_name'];
		$friend->tracks=array();
		$user_videos = get_user_videos($u['rInfo']['fb_id']); 
		foreach( $user_videos as $v) {
			$new_track=(object)null;
			$new_track->filename=$v['filename'];
			$new_track->name=$v['name'];
			$new_track->user_id=$v['user_id'];
			array_push($friend->tracks,$new_track);
		}
		$response->friends[]=$friend;
	}
	$response->errors="false";
	echo json_encode($response);
}
// ************************************************************************************
// Delete a Video Track
// TODO: Add user authentication to confirm the identity and ownership of the video.
// ************************************************************************************ 
else if(isset($_GET['delete_video'])&&isset($_COOKIE['auth_token'])) {
	if(isset($_POST['filename'])) {
		$p = $_POST['filename']; 
		if(delete_track($p)) { 
			$recent_videos = get_recent_videos($user_ramble_friends);

			$response->is_user=false;
			$response->tracks=array();
			foreach( $recent_videos as $v) { 
				$t = get_track_by_name($v['filename']);
				$ch = curl_init("http://s3.amazonaws.com/ramble/".$v['filename']."/".$v['filename'].".json");
				curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
				$output = json_decode(curl_exec($ch));
				$output->track->title = $t['name'];
				$output->track->uploadDate = $t['date_uploaded'];	
				$output->filename=$v['filename'];
				$output->name=$v['name'];
				$output->user_id=$v['user_id'];
				$a=get_friend_by_id($user_ramble_friends,$v['user_id']); 
				$output->user_name=$a['name'];
				array_push($response->tracks, $output);
			}

			$response->friends=array();
			foreach( $user_ramble_friends as $u) { 
				$friend = (object)null;
				$friend->id=$u['rInfo']['fb_id'];
				$friend->name=$u['name'];
				$friend->first_name=$u['rInfo']['first_name'];
				$friend->last_name=$u['rInfo']['last_name'];
				$friend->tracks=array();
				$user_videos = get_user_videos($u['rInfo']['fb_id']); 
				foreach( $user_videos as $v) {
					$new_track=(object)null;
					$new_track->filename=$v['filename'];
					$new_track->name=$v['name'];
					$new_track->user_id=$v['user_id'];
					array_push($friend->tracks,$new_track);
				}
				array_push($response->friends,$friend);
			}
			$response->errors="false";
			echo json_encode($response);
		} else echo "Could not delete track!";
	}
}	
