<div id="sidebar-info">
	<a href="/" id="ramble-logo-button"></a>
	<a href="javascript:goHome()" id="ramble-home-button"></a>
	<a href="javascript:pullUserSidebar(<?php echo $user_profile['id']; ?>)" id="ramble-user-button">
		<img src="//graph.facebook.com/<?php echo $user_profile['id']; ?>/picture" title="" alt="" height="33" width="33"/>
	</a>
	<a href="/" id="ramble-prefs-button"></a>
</div>
<div id="sidebar_content">
<input type="text" id="search" class="large-textinput" name="search-bar" placeholder="" />


<div id="sidebar-videos">
	<h3 class="sub-heading">Recent Videos</h3>
	<div id="videos-section" class="section">
			<?php $i=0;
			 foreach( $recent_videos as $v) { ?>
			<div class="list-item track" data-name="<?php echo $v['filename'] ?>" data-index="<?php echo $i; ?>">
				<div class="track-picture"><img src="//s3.amazonaws.com/ramble/<?php echo $v['filename'] ?>/<?php echo $v['filename'] ?>.png" height="40"/></div>
				<div class="track-name name"><?php echo $v['name'] ?></div>
				<div class="track-author user" data-user-id="<?php echo $v['user_id']; ?>"><?php $a=get_friend_by_id($user_ramble_friends,$v['user_id']); echo $a['name'];?></div>
			</div>
			<?php 
				$i++;
			} ?>
	
	</div>
</div>
</div>
<div id="vermont-logo"></div>
<script>
	var a;
	tracks = [];
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