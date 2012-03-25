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
if(isset($_GET['track_points'])&&isset($_SESSION['auth_token'])) {
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
// Get your friends tracks.
// ************************************************************************************
else if(isset($_GET['friends_tracks'])) {
	


}
// ************************************************************************************
//	Pull try and calculate a location points
// ************************************************************************************
else if(isset($_GET['location'])&&isset($_SESSION['auth_token'])) {
	$location = $_GET['location'];
	$radius = $_GET['radius'];
	$types = isset($_GET['types']) ? $_GET['types'] : "false";
	$name = isset($_GET['name']) ? $_GET['name'] : "false"; 
	$googlePlacesApiKey = isset($_GET['key']) ? $_GET['key'] : "false";
	header("Content-type: application/json; charset=UTF-8");
	$ch = curl_init('http://https://maps.googleapis.com/maps/api/place/search/json?location=$location&radius=$radius&types=$types&name=$name&key=$key');
	$output = curl_exec($ch);
	
	
	
	
	
	
}
// ************************************************************************************
// Show a sidebar that reflects a particular user's videos.
// ************************************************************************************
else if(isset($_GET['user_sidebar'])&&isset($_SESSION['auth_token'])) {
	if(isset($_GET['id'])) { 
	$u = $facebook->api('/'.$_GET['id']); ?>
	<div class="sub-heading"><?php echo $u['name']; ?><img class="right" src="//graph.facebook.com/<?php echo $u['id']; ?>/picture" alt="<?php echo $u['name']; ?>" title="<?php echo $u['name']; ?>" /><div class="clear"></div></div>
	<div id="videos-section" class="section">
			
		<?php $user_videos = get_user_videos($_GET['id']); 
			foreach( $user_videos as $v) { ?>
			<div class="list-item track" data-name="<?php echo $v['filename'] ?>" data-index="<?php echo $i; ?>">
				<div class="track-picture image"><img src="//s3.amazonaws.com/ramble/<?php echo $v['filename'] ?>/<?php echo $v['filename'] ?>.png" height="43" width="33"/></div>
				<div class="track-name name"><?php echo $v['name'] ?></div>
			</div>
		<?php } ?>
	</div>
	<script>
		var a;
		tracks = [];
		<?php foreach( $user_videos as $v) { 
			$t = get_track_by_name($v['filename']);
			$ch = curl_init("http://s3.amazonaws.com/ramble/".$v['filename']."/".$v['filename'].".json");
			curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
			$output = json_decode(curl_exec($ch));
			$output->track->title = $t['name'];
			$output->track->uploadDate = $t['date_uploaded'];	
		
		?>
			a = JSON.parse('<?php echo json_encode($output);?>');
			tracks.push({filename:"<?php echo $v['filename'] ?>",name:"<?php echo $v['name'] ?>",user_id:"<?php echo $v['user_id'] ?>",track:a});
		<?php } ?>
		friends = [];
		<?php foreach( $user_ramble_friends as $u) { ?>
			friends.push({id:"<?php echo $u['rInfo']['fb_id'] ?>",name:"<?php echo $u['name'] ?>",first_name:"<?php echo $u['rInfo']['first_name'] ?>",last_name:"<?php echo $u['rInfo']['last_name'] ?>",tracks:[
					<?php $user_videos = get_user_videos($u['rInfo']['fb_id']); 
					foreach( $user_videos as $v) { ?>
					{filename:"<?php echo $v['filename'] ?>",name:"<?php echo $v['name'] ?>",user_id:"<?php echo $v['user_id'] ?>"},
					<?php } ?>
			]});
		<?php } ?>
	
	</script>
	<!-- <div class="sub-heading">Albums</div>
	<?php /* $albums = get_user_albums($_GET['id']); ?>
	<?php if(!empty($albums)) {
			foreach($albums as $a) { ?> 
		<div class="list-item album" data-id="<?php echo $a['id'] ?>">
			<div class="album-name name"><?php echo $a['name'] ?></div>
		</div>	
	
	<?php } 
	} else {?> 
				<div class="list-item create-album">
					<div class="name">Create an Album</div>
				</div>
	<?php }*/ ?> -->
	<?php
	}
	
}
// ************************************************************************************
// Delete a Video Track
// TODO: Add user authentication to confirm the identity and ownership of the video.
// ************************************************************************************ 
else if(isset($_GET['delete_video'])&&isset($_SESSION['auth_token'])) {
	if(isset($_GET['filename'])) { 
		delete_track($filename);
		echo "Track Delete Successfully!";
	}
	
	
	
}	
// ************************************************************************************
//
// ************************************************************************************
else if(isset($_GET['search_query'])) {
	if(isset($_GET['q'])) {
		$q = $_GET['q'];
		$user_friends = $facebook->api('/me/friends');
		$user_ramble_friends = get_friends($user_friends);
		$results=array();
		foreach($user_ramble_friends as $f) {
			if(stripos($f['rInfo']['first_name'],$q)!==false) $results[] = $f;
			else if(stripos($f['rInfo']['last_name'],$q)!==false) $results[] = $f;
			else if(stripos($f['name'],$q)!==false) $results[] = $f;
		} ?>
		<div class="sub-heading">Search Results</div>
		<div id="videos-section" class="section">

		<?php foreach($results as $r) { ?>
			<div class="list-item user" style="background:url('//graph.facebook.com/<?php echo $r['rInfo']['fb_id'] ?>/picture') center right no-repeat;" onclick="pullUserSidebar(<?php echo $r['rInfo']['fb_id'] ?>)" data-name="<?php echo $r['rInfo']['fb_id'] ?>">
				<div class="user-name name"  ><?php echo $r['name'] ?></div>
			</div>
		<?php } ?>
		</div>		
<?php	
	}
} 
// ************************************************************************************
//
// ************************************************************************************
else if(isset($_GET['go_home'])) {

		$user_friends = $facebook->api('/me/friends');
		$user_ramble_friends = get_friends($user_friends);
		$recent_videos = get_recent_videos($user_ramble_friends);

?>
	<h3 class="sub-heading">Recent Videos</h3>
	<div id="videos-section" class="section">
			<?php $i=0;
			 foreach( $recent_videos as $v) { ?>
			<div class="list-item track" data-name="<?php echo $v['filename'] ?>" data-index="<?php echo $i; ?>">
				<div class="track-picture image"><img src="//s3.amazonaws.com/ramble/<?php echo $v['filename'] ?>/<?php echo $v['filename'] ?>.png" height="43"/></div>
				<div class="track-name name"><?php echo $v['name'] ?></div>
				<div class="track-author user" data-user-id="<?php echo $v['user_id']; ?>"><?php $a=get_friend_by_id($user_ramble_friends,$v['user_id']); echo $a['name'];?></div>
			</div>
			<?php 
				$i++;
			} ?>
	
	</div>
<?php
}
// ************************************************************************************
//
// ************************************************************************************
else if(isset($_GET['going_home'])) { 
	header("Content-type: application/javascript;");
	$user_friends = $facebook->api('/me/friends');
	$user_ramble_friends = get_friends($user_friends);
	$recent_videos = get_recent_videos($user_ramble_friends);

	foreach( $recent_videos as $v) { 
		$t = get_track_by_name($v['filename']);
		$ch = curl_init("http://s3.amazonaws.com/ramble/".$v['filename']."/".$v['filename'].".json");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
		$output = json_decode(curl_exec($ch));
		$output->track->title = $t['name'];
		$output->track->uploadDate = $t['date_uploaded'];		
?>
<?php 	echo json_encode($output);			?>
{filename:"<?php echo $v['filename'] ?>",name:"<?php echo $v['name'] ?>",user_id:"<?php echo $v['user_id'] ?>",track:a}
<?php } 

	foreach( $user_ramble_friends as $u) { ?>
		{id:"<?php echo $u['rInfo']['fb_id'] ?>",name:"<?php echo $u['name'] ?>",first_name:"<?php echo $u['rInfo']['first_name'] ?>",last_name:"<?php echo $u['rInfo']['last_name'] ?>",tracks:[
		<?php $user_videos = get_user_videos($u['rInfo']['fb_id']); 
				foreach( $user_videos as $v) { ?>
				{filename:"<?php echo $v['filename'] ?>",name:"<?php echo $v['name'] ?>",user_id:"<?php echo $v['user_id'] ?>"},
				<?php } ?>
		]}
<?php 
	}
}
?>