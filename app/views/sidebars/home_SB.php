<div id="sidebar-info">
	<a href="/" id="ramble-logo-button"></a>
	<a href="/" id="ramble-home-button"></a>
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
			<?php foreach( $recent_videos as $v) { ?>
			<div class="track" data-name="<?php echo $v['filename'] ?>">
				<div class="track-name"><?php echo $v['name'] ?></div>
				<div class="track-author"><?php $a=get_friend_by_id($user_ramble_friends,$v['user_id']); echo $a['name'];?></div>
			</div>
			<?php } ?>
	
	</div>
</div>
</div>
<div id="vermont-logo"></div>
