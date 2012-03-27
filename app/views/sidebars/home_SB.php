<div id="sidebar-info">
	<a href="/" id="ramble-logo-button"></a>
	<a href="javascript:goHome()" id="ramble-home-button" data-tooltip="View recent videos by your friends"></a>
	<a href="javascript:pullUserSidebar(<?php echo $user_profile['id']; ?>)" id="ramble-user-button" data-tooltip="View your profile">
		<img src="//graph.facebook.com/<?php echo $user_profile['id']; ?>/picture" title="" alt="" height="33" width="33"/>
	</a>
	<a href="javascript:showFriends()" id="ramble-friends-button" data-tooltip="View your friends"></a>
</div>
<div id="sidebar_content">
	<input type="text" id="search" class="large-textinput" name="search-bar" placeholder="" />
	
	
	<div id="sidebar-videos"></div>
</div>
<div id="vermont-logo"></div>
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
				return false;
			}
		} else {
			v.oncontextmenu=function(e) {return false;}
		}
		img = document.createElement('div');
		img.setAttribute('class', 'track-picture image');
		img.innerHTML='<img src="//s3.amazonaws.com/ramble/<?php echo $v['filename'] ?>/<?php echo $v['filename'] ?>.png" height="43" width="33"/>';
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