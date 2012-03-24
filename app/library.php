<?php 
/*
 *	The Library of RAMBLE!
 *
 *
 */
require_once('config.php');

// required Facebook libraries
require_once('facebook/src/base_facebook.php');
require_once('facebook/src/facebook.php');
require_once('facebook/src/FBUtils.php');

// other dependencies
require_once('libs/s3/S3.php');
require_once('libs/zencoder/Zencoder.php');



require_once('functions/database.php');

require_once('models/User.php');
require_once('models/Track.php');
require_once('models/Album.php');

require_once('init.php');


?>