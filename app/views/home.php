<?php 
	if($ramble_user==true&&isset($_COOKIE['auth_token'])) {
		$recent_videos = get_recent_videos($user_ramble_friends);
	}
?>
<!DOCTYPE html>
<html lang="en" xmlns:fb="http://www.facebook.com/2008/fbml">
  <head>
    <meta charset="utf-8">


    <!-- We get the name of the app out of the information fetched -->
    <title><?php echo $siteTitle; ?></title>
    
    <link rel="shortcut icon" href="app/assets/images/favicon.ico">	
	<link href="//fonts.googleapis.com/css?family=Telex" rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="app/assets/css/jquery-ui-1.8.17.custom.css" type="text/css" />
	<?php if($ramble_user) { ?>
	<link rel="stylesheet" href="app/assets/css/global.css" type="text/css" />
	<?php } else { ?>
	<link rel="stylesheet" href="app/assets/css/login.css" type="text/css" />
	<?php } ?>

    <!-- <link rel="stylesheet" href="stylesheets/screen.css" media="screen"> -->
	<meta name="author" content="Strabo"/>
    <meta property="og:title" content="Ramble"/>
    <meta property="og:type" content="Application"/>
    <meta property="og:url" content="https://ramble.strabogis.com"/>
    <meta property="og:image" content=""/>
    <meta property="og:site_name" content="Ramble"/>
    <meta property="og:locality" content="Middlebury"/>
    <meta property="og:email" content="support@strabogis.com"/>
    <meta property="og:region" content="VT"/>
	<?php if($ramble_user) { ?>
	<script type="text/javascript">
		var id = "<?php echo $user ?>";
	</script>
	<?php } ?>

  </head>
  <body>
		<div id="popup">
			<div id="popup-close"></div>
			<div id="popup-content"></div>
		</div>
		<div id="sidebar">
			<?php 	if($ramble_user==true) require('sidebars/home_SB.php'); 
					else if($invite_code==true) require('sidebars/invite_SB.php');
					else require('sidebars/login_SB.php'); ?>
		</div>
		<div id="map_container">
			<?php if($ramble_user==true) { ?>
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
		<!-- Defer Javascript Parsing until after Page Body Loads -->
		<script type="text/javascript" src="app/assets/js/jquery.js"></script>
		<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?sensor=false"></script>
	
		<script type="text/javascript" src="app/assets/js/richmarker-compiled.js"></script>
		<script type="text/javascript" src="app/assets/js/jquery-ui-1.8.17.custom.min.js"></script>
		<?php if($ramble_user) { ?>
		<script type="text/javascript" src="app/assets/js/ramble.js" defer="defer"></script>
		<?php } else { ?>
		<script type="text/javascript" src="app/assets/js/init.js" defer="defer"></script>
		<?php } ?>
		<?php if($ramble_user==true) { ?>
			<script>
			
			</script>
		<?php } else { ?>
		
		<?php } ?> 
		<script type="text/javascript">
		
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-20023247-15']);
		_gaq.push(['_trackPageview']);
		
		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
		
		</script>
  </body>
</html>