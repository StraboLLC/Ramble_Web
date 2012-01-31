<?php
/*
 * The AJAX Api for pulling Data from Various Sources
 *
 *
 */ 
require_once('../app/library.php');

// Variables
$googlePlacesApiKey ="AIzaSyAiAbzDbciUezEApEJ4L-vYHIAzwwgR28Q";
/*
 *	Pull track points
 */
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

/*
 * Get KML track
 */
} else if(isset($_GET['kml_track'])) {
	if(isset($_GET['name'])&&$_GET['name']!=null) {
		$name = $_GET['name'];
		$th = get_track_by_name($_GET['name']);
		$ch = curl_init("http://s3.amazonaws.com/ramble/".$th['filename']."/".$th['filename'].".json");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
		$track = json_decode(curl_exec($ch));
		header("Content-type: application/vnd.google-earth.kml+xml");
		$output = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name><?php echo $name; ?></name><description></description><Style id=\"track\"><LineStyle><color>7f00ffff</color><width>20</width></LineStyle><PolyStyle><color>7f00ff00</color></PolyStyle></Style><Placemark>
		      <name>$name</name><description></description><styleUrl>#track</styleUrl>
		      <LineString><extrude>1</extrude><tessellate>1</tessellate><altitudeMode>absolute</altitudeMode>
		        <coordinates>";
				foreach($track->track->points as $p) {
					$output .= $p->longitude.",".$p->latitude.",17\n";
				}
		      	
		        $output .= "</coordinates></LineString></Placemark></Document></kml>";
		        echo $output;
		
	} else {
		header("Content-type: application/json; charset=UTF-8");
		echo '{error:[true,"You must submit a track name!"]}';
	}

/*
 * Get your friends tracks.
 */
} else if(isset($_GET['friends_tracks'])) {
	



/*
 *	Pull try and calculate a location points
 */
} else if(isset($_GET['location'])&&isset($_SESSION['auth_token'])) {
	$location = $_GET['location'];
	$radius = $_GET['radius'];
	$types = isset($_GET['types']) ? $_GET['types'] : "false";
	$name = isset($_GET['name']) ? $_GET['name'] : "false"; 
	$googlePlacesApiKey = isset($_GET['key']) ? $_GET['key'] : "false";
	header("Content-type: application/json; charset=UTF-8");
	$ch = curl_init('http://https://maps.googleapis.com/maps/api/place/search/json?location=$location&radius=$radius&types=$types&name=$name&key=$key');
	$output = curl_exec($ch);
	
	
	
	
	
	
} else if(isset($_GET['user_sidebar'])) {
	if(isset($_GET['id'])) { 
	$u = $facebook->api('/'.$_GET['id']); ?>
	<div class="sub-heading"><?php echo $u['name']; ?><img class="right" src="//graph.facebook.com/<?php echo $u['id']; ?>/picture" alt="<?php echo $u['name']; ?>" title="<?php echo $u['name']; ?>" /><div class="clear"></div></div>
	<div id="videos-section">
			
			<?php $user_videos = get_user_videos($_GET['id']); 
				foreach( $user_videos as $v) { ?>
			<div class="list-item track" data-name="<?php echo $v['filename'] ?>">
				<div class="track-name"><?php echo $v['name'] ?></div>
			</div>
			<?php } ?>
	
	</div>
	
	<?php
	}
} else if(isset($_GET['search_query'])) {
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
		<div id="videos-section">

		<?php foreach($results as $r) { ?>
			<div class="list-item user" style="background:url('//graph.facebook.com/<?php echo $r['rInfo']['fb_id'] ?>/picture') center right no-repeat;" onclick="pullUserSidebar(<?php echo $r['rInfo']['fb_id'] ?>)" data-name="<?php echo $r['rInfo']['fb_id'] ?>">
				<div class="user-name"  ><?php echo $r['name'] ?></div>
			</div>
		<?php } ?>
		</div>		
<?php	
	}
} else if(isset($_GET['go_home'])) {

		$user_friends = $facebook->api('/me/friends');
		$user_ramble_friends = get_friends($user_friends);
		$recent_videos = get_recent_videos($user_ramble_friends);

?>
	<h3 class="sub-heading">Recent Videos</h3>
	<div id="videos-section">
			<?php $i=0;
			 foreach( $recent_videos as $v) { ?>
			<div class="list-item track" data-name="<?php echo $v['filename'] ?>" data-index="<?php echo $i; ?>">
				<div class="track-name"><?php echo $v['name'] ?></div>
				<div class="track-author user" data-user-id="<?php echo $v['user_id']; ?>"><?php $a=get_friend_by_id($user_ramble_friends,$v['user_id']); echo $a['name'];?></div>
			</div>
			<?php 
				$i++;
			} ?>
	
	</div>
<?php
}

?>