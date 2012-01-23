<div id="search">
	<input type="text" id="search-bar" class="large-textinput" name="search-bar" placeholder="Search for friends or tracks…" />
</div>

<?php  
$track = isset($_GET['track']) ? $_GET['track'] : null;
if($track!=null) { ?> 
<div id="friends-list">




</div>


<?php } else { ?>


<div id="friends-list">
	<a href="<?php echo $logoutUrl; ?>">Logout</a>
	<h3>Your friends</h3>
		<?php foreach(get_friends($user_friends) as $f) { ?>
		<a href="#" class="friend"><img src="//graph.facebook.com/<?php echo $f['id']; ?>/picture" title="<?php echo $f['name'] ?>" alt="<?php echo $f['name'] ?>"/><?php echo $f['name'] ?></a>
		<?php } ?>
	<h3>Your friends videos</h3>
		<?php foreach(get_friends_videos($user_profile['id']) as $f) { ?>
		<a href="#" class="friend"><img src="//graph.facebook.com/<?php echo $f['id']; ?>/picture" title="<?php echo $f['name'] ?>" alt="<?php echo $f['name'] ?>"/><?php echo $f['name'] ?></a>
		<?php } ?>
</div>

<?php } ?>