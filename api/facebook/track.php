<?php
/**
 * Ramble Facebook API
 * TODO: Add Object that will be embedded in the open graph
 * //69D4B90C-7B13-4B3B-8BC9-BF291C58EF21-1338387452
 */

require_once('../../app/library.php');

if(isset($_GET['f'])&&$_GET['f']!="") {

	$filename = $_GET['f'];
	$track = get_track_by_filename($filename);
	$obj = json_encode($track);
	$latitude=$track['starting_lat'];
	$longitude=$track['starting_long'];
	$name=$track['name'];

	?>
	<html>
	<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# strabo-ramble: http://ogp.me/ns/fb/strabo-ramble#">
		<title>Ramble | <?php echo $track['name']; ?></title>
		<meta property="fb:app_id" content="303445329701888" /> 
		<meta property="og:type"   content="strabo-ramble:track" /> 
		<meta property="og:url"    content="http://rambl.it/v/<?php echo $filename ?>" /> 
		<meta property="og:title"  content="<?php echo $name; ?>" /> 
		<meta property="og:image"  content="http://s3.amazonaws.com/ramble/<?php echo $filename; ?>/<?php echo $filename; ?>.png" /> 
		<meta property="strabo-ramble:filename" content="<?php echo $filename ?>" />
		<meta property="strabo-ramble:location:latitude"  content="<?php echo $latitude; ?>"> 
		<meta property="strabo-ramble:location:longitude" content="<?php echo $longitude; ?>">

		<link rel="stylesheet" type="text/css" href="/client/css/single.css" media="all">
		<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?sensor=false"></script>
		<script type="text/javascript" src="/client/js/libs/richmarker-compiled.js"></script>
		<script type="text/javascript" src="/client/js/libs/jquery.js"></script>
		<script type="text/javascript" src="/client/js/single.js"></script>
		<script type="text/javascript">

		var track = new RambleTrack(JSON.parse('<?php echo $obj; ?>'));

		</script>
	</head>
	<body>
		<div id="container" class="container">

			<div id="main" class="main">
				<header id="main-header" class="header">
					<?php if($user) { ?>
					<div id="user" class="user">
						<span class="user-image"><img src="//graph.facebook.com/<?php echo $user_profile['id']; ?>/picture" alt="<?php echo $user_profile['name']; ?>" /></span>
						<span class="user-name"><?php echo $user_profile['name']; ?></span>
					</div>
					<?php } ?>
					<a id="logo" class="logo"></a>
				</header>
				<div id="map_container"><div id="map"></div></div>
				<div id="video_container">
					<video id="video">
						<source src="http://s3.amazonaws.com/ramble/<?php echo $filename; ?>/<?php echo $filename; ?>.mp4" type="video/mp4">  
							<source src="http://s3.amazonaws.com/ramble/<?php echo $filename; ?>/<?php echo $filename; ?>.webm" type="video/webm">  
								<p>Sorry, your browser does not support HTML5 Video. Please try upgrading to <a href="http://google.com/chrome">Google Chrome</a>.</p>
							</video>
						</div>
						<div id="video-controls" class="controls clear">
							<div id="play-pause"></div>
							<!-- <div id="volume"></div> -->
							<div id="scrub-bar">
								<!-- <div id="loaded"></div>-->
								<div id="played"></div>
							</div>
							<a id="join" href="http://rambl.it/" target="_blank">Join <?php $a= $facebook->api($track['user_id']); echo $a['first_name']; ?> on Ramble</a>
							<div class="clear"></div>
							<!-- 					<div><pre><?php // print_r($track); ?></pre></div>-->	
						</div>
					</div>
					<footer id="main-footer" class="footer">&copy; 2012 Strabo, LLC</footer>
				</div>
			</body>
			</html>
			<?php
		} else {
			header('Location: /');

		} ?>