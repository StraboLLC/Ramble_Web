<?php 

?>
<!DOCTYPE html>
<html lang="en" xmlns:fb="http://www.facebook.com/2008/fbml">
  <head>
    <meta charset="utf-8">

    <!-- We get the name of the app out of the information fetched -->
    <title><?php echo $siteTitle; ?></title>
	<link rel="stylesheet" href="css/jquery-ui-1.8.17.custom.css" type="text/css" />
	<link rel="stylesheet" href="css/global.css" type="text/css" />
    <!-- <link rel="stylesheet" href="stylesheets/screen.css" media="screen"> -->

    <meta property="og:title" content="Ramble"/>
    <meta property="og:type" content="Application"/>
    <meta property="og:url" content=""/>
    <meta property="og:image" content=""/>
    <meta property="og:site_name" content="Ramble"/>
    <meta property="og:locality" content="Middlebury"/>
    <meta property="og:email" content="support@strabogis.com"/>
    <meta property="og:region" content="VT"/>

	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?sensor=false"></script>

	<script type="text/javascript" src="js/jquery-ui-1.8.17.custom.min.js"></script>
	<script type="text/javascript" src="js/ramble.js"></script>

  </head>
  <body>

		<div id="sidebar">
			<?php 	if($user) require('sidebars/home_SB.php'); 
					else require('sidebars/login_SB.php'); ?>
		</div>
		<div id="map_container">
			<div id="video_container">
				<video id="video"></video>
				<div id="video-title"></div>
				<div id="video-controls">
					<div id="play-pause"></div>
					<div id="volume"></div>
					<div id="scrub-bar"></div>
				</div>
			</div>
			<div id="map"></div>
		</div>
  </body>
</html>