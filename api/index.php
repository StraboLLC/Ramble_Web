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
// Get your friends tracks.
// ************************************************************************************
else if(isset($_GET['friends_tracks'])) {
	


}
// ************************************************************************************
//	Pull try and calculate a location points
// ************************************************************************************
else if(isset($_GET['location'])&&isset($_COOKIE['auth_token'])) {
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
else if((isset($_GET['user_sidebar'])||isset($_GET['go_home']))&&isset($_COOKIE['auth_token'])) {
	if(isset($_GET['id'])&&isset($_GET['user_sidebar'])) { 
		$u = $facebook->api('/'.$_GET['id']); 
		$videos = get_user_videos($_GET['id']); 
	} else if(isset($_GET['go_home'])) {
		$user_friends = $facebook->api('/me/friends');
		$user_ramble_friends = get_friends($user_friends);
		$videos = get_recent_videos($user_ramble_friends);
	}
?>
	<script>
	var a;
	tracks = [];
	var heading = document.createElement("h3");
	<?php if(isset($_GET['id'])&&isset($_GET['user_sidebar'])) { ?>
		heading.setAttribute('class','sub-heading person-sub-heading');
		heading.innerHTML= '<img class="right" src="//graph.facebook.com/<?php echo $u['id']; ?>/picture" alt="<?php echo $u['name']; ?>" title="<?php echo $u['name']; ?>" /><div class="person-name"><?php echo $u['name']; ?></div><div class="clear"></div>';
	<?php } else if(isset($_GET['go_home'])) { ?>
		heading.setAttribute('class','sub-heading');
		heading.innerHTML= 'Recent Videos';
	<?php } ?> 
	var videoSection = document.createElement('div');
	videoSection.setAttribute('id','videos-section');
	videoSection.setAttribute('class','section');
	var v, img, tname, user, tvid;
	<?php $i=0; ?>
	<?php foreach( $videos as $v) { 
		$t = get_track_by_name($v['filename']);
		$ch = curl_init("http://s3.amazonaws.com/ramble/".$v['filename']."/".$v['filename'].".json");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
		$output = json_decode(curl_exec($ch));
		$output->track->title = $t['name'];
		$output->track->uploadDate = $t['date_uploaded'];	
		
	?>
		
		a = JSON.parse('<?php echo json_encode($output);?>');
		tracks.push({filename:"<?php echo $v['filename'] ?>",name:"<?php echo $v['name'] ?>",user_id:"<?php echo $v['user_id'] ?>",track:a});
		
		v = document.createElement('div');
		v.setAttribute('class', 'list-item track');
		v.setAttribute('data-name', '<?php echo $v['filename'] ?>');
		v.setAttribute('data-index', '<?php echo $i ?>');
		if("<?php echo $v['user_id']; ?>"==id) {

			var del = document.createElement('div');
			del.setAttribute('class','delete-button');
			del.innerHTML="Delete Track";
			del.setAttribute('id','delete-<?php echo $v['filename'] ?>');
			del.setAttribute('data-delete','<?php echo $v['filename'] ?>');
			document.body.appendChild(del);
			v.oncontextmenu=function(e) {
				console.log("Context Menu");
				var ab = document.getElementById('delete-'+this.getAttribute('data-name'));
				ab.setAttribute('class','delete-button showing');
				ab.style.top=e.y+"px";
				ab.style.left=e.x+"px";
				ab.onclick=function() {
					ab.setAttribute('class','delete-button');
					deleteTrack(ab.getAttribute('data-delete'));
					console.log("Deleting "+ab.getAttribute('data-delete'));
				}
				document.onclick=function(){
					buttons = $('.delete-button.showing');
					for(x in buttons) {
						buttons[x].setAttribute('class','delete-button');
					}
					document.onclick=null;
				}
				ab.onmouseout=function() {
					ab.setAttribute('class','delete-button');
				}
				return false;
			}
		} else {
			v.oncontextmenu=function(e) {return false;}
		}

		img = document.createElement('div');
		img.setAttribute('class', 'track-picture image');
		img.innerHTML='<img src="//s3.amazonaws.com/ramble/<?php echo $v['filename'] ?>/<?php echo $v['filename'] ?>.png" height="48" width="36"/>';
		v.appendChild(img);
		tname = document.createElement('div');
		tname.setAttribute('class', 'track-name name');
		tname.innerHTML="<?php echo $v['name'] ?>";
		v.appendChild(tname);
		user = document.createElement('div');
		user.setAttribute('class', 'track-author user');
		user.setAttribute('data-user-id', "<?php echo $v['user_id']; ?>");
		user.innerHTML="<?php $a=get_friend_by_id($user_ramble_friends,$v['user_id']); echo $a['name'];?>";
		v.appendChild(user);
		videoSection.appendChild(v);
		<?php $i++; ?>
	<?php } ?>
	document.getElementById('sidebar-videos').appendChild(heading);
	document.getElementById('sidebar-videos').appendChild(videoSection);
	

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
	<?php
	
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
		?>
		<script>
		var a;
		tracks = [];
		
		var heading = document.createElement("h3");
		heading.setAttribute('class','sub-heading');
		heading.innerHTML= 'Recent Videos';
		var videoSection = document.createElement('div');
		videoSection.setAttribute('id','videos-section');
		videoSection.setAttribute('class','section');
		var v, img, tname, user, tvid;
		<?php $i=0; ?>
		<?php foreach( $recent_videos as $v) { 
			$t = get_track_by_name($v['filename']);
			$ch = curl_init("http://s3.amazonaws.com/ramble/".$v['filename']."/".$v['filename'].".json");
			curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
			$output = json_decode(curl_exec($ch));
			$output->track->title = $t['name'];
			$output->track->uploadDate = $t['date_uploaded'];	
			
		?>
			
			a = JSON.parse('<?php echo json_encode($output);?>');
			tracks.push({filename:"<?php echo $v['filename'] ?>",name:"<?php echo $v['name'] ?>",user_id:"<?php echo $v['user_id'] ?>",track:a});
			
			v = document.createElement('div');
			v.setAttribute('class', 'list-item track');
			v.setAttribute('data-name', '<?php echo $v['filename'] ?>');
			v.setAttribute('data-index', '<?php echo $i ?>');
			if("<?php echo $v['user_id']; ?>"==id) {
				var del = document.createElement('div');
				del.setAttribute('class','delete-button');
				del.innerHTML="Delete Track";
				del.setAttribute('id','delete-<?php echo $v['filename'] ?>');
				del.setAttribute('data-delete','<?php echo $v['filename'] ?>');
				document.body.appendChild(del);
				v.oncontextmenu=function(e) {
					console.log("Context Menu");
					var ab = document.getElementById('delete-'+this.getAttribute('data-name'));
					ab.setAttribute('class','delete-button showing');
					ab.style.top=e.y+"px";
					ab.style.left=e.x+"px";
					ab.onclick=function() {
						ab.setAttribute('class','delete-button');
						deleteTrack(ab.getAttribute('data-delete'));
						console.log("Deleting "+ab.getAttribute('data-delete'));
					}
					document.onclick=function(){
						buttons = $('.delete-button.showing');
						for(x in buttons) {
							buttons[x].setAttribute('class','delete-button');
						}
						document.onclick=null;
					}
					ab.onmouseout=function() {
						ab.setAttribute('class','delete-button');
					}
					return false;
				}
			} else {
				v.oncontextmenu=function(e) {return false;}
			}
			img = document.createElement('div');
			img.setAttribute('class', 'track-picture image');
			img.innerHTML='<img src="//s3.amazonaws.com/ramble/<?php echo $v['filename'] ?>/<?php echo $v['filename'] ?>.png" height="48" width="36"/>';
			v.appendChild(img);
			tname = document.createElement('div');
			tname.setAttribute('class', 'track-name name');
			tname.innerHTML="<?php echo $v['name'] ?>";
			v.appendChild(tname);
			user = document.createElement('div');
			user.setAttribute('class', 'track-author user');
			user.setAttribute('data-user-id', "<?php echo $v['user_id']; ?>");
			user.innerHTML="<?php $a=get_friend_by_id($user_ramble_friends,$v['user_id']); echo $a['name'];?>";
			v.appendChild(user);
			videoSection.appendChild(v);
			<?php $i++; ?>
		<?php } ?>
		document.getElementById('sidebar-videos').appendChild(heading);
		document.getElementById('sidebar-videos').appendChild(videoSection);
		
		// Add Friends
		
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
	<?php
		} else echo "Could not delete track!";
	}
}	
