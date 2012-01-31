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
</div>
</div>
<div id="vermont-logo"></div>
<script>
	tracks = [];
	<?php foreach( $recent_videos as $v) { ?>
		tracks.push({filename:"<?php echo $v['filename'] ?>",name:"<?php echo $v['name'] ?>",user_id:"<?php echo $v['user_id'] ?>"});
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