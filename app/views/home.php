<?php 
	if($user) {
		$recent_videos = get_recent_videos($user_ramble_friends);
	}
?>
<!DOCTYPE html>
<html lang="en" xmlns:fb="http://www.facebook.com/2008/fbml">
  <head>
    <meta charset="utf-8">

    <!-- We get the name of the app out of the information fetched -->
    <title><?php echo $siteTitle; ?></title>
	<link href='//fonts.googleapis.com/css?family=Telex' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="css/jquery-ui-1.8.17.custom.css" type="text/css" />
	<?php if($user) { ?>
	<link rel="stylesheet" href="css/global.css" type="text/css" />
	<?php } else { ?>
	<link rel="stylesheet" href="css/login.css" type="text/css" />
	<?php } ?>

    <!-- <link rel="stylesheet" href="stylesheets/screen.css" media="screen"> -->

    <meta property="og:title" content="Ramble"/>
    <meta property="og:type" content="Application"/>
    <meta property="og:url" content="https://ramble.strabogis.com"/>
    <meta property="og:image" content=""/>
    <meta property="og:site_name" content="Ramble"/>
    <meta property="og:locality" content="Middlebury"/>
    <meta property="og:email" content="support@strabogis.com"/>
    <meta property="og:region" content="VT"/>

	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?sensor=false"></script>

	<script type="text/javascript" src="js/richmarker-compiled.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.8.17.custom.min.js"></script>
	<?php if($user) { ?>
	<script type="text/javascript" src="js/ramble.js"></script>
	<?php } else { ?>
	<script type="text/javascript" src="js/init.js"></script>
	<?php } ?>

  </head>
  <body>
		<div id="popup">
			<div id="popup-close"></div>
			<div id="popup-content"></div>
		</div>
		<div id="sidebar">
			<?php 	if($user) require('sidebars/home_SB.php'); 
					else require('sidebars/login_SB.php'); ?>
		</div>
		<div id="map_container">
			<?php if($user) { ?>
			<div id="video_container">
				<div id="video-top-bar">
					<div id="close-vid"></div>
					<div id="video-title"></div>
				</div>
				<video id="video"></video>
				<div id="video-controls">
					<div id="play-pause"></div>
					<!-- <div id="volume"></div> -->
					<div id="scrub-bar">
						<div id="loaded"></div>
						<div id="played"></div>
					</div>
				</div>
			</div>
			<div id="map_loading"></div>
			<?php } ?>
			<div id="map"></div>
		</div>
		<?php if($user) { ?>
			<script>
			
			</script>
		<?php } else { ?>
		
		<?php } ?> 
  </body>
</html>