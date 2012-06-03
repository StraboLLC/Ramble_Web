<?php
require_once('../app/library.php');

if(isset($_GET['f'])&&$_GET['f']!="") {


	publish($_GET['id'],$_GET['f']);
	echo "Done";
}

?>