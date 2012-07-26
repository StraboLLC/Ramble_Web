<?php
require_once('../app/library.php');

if(isset($_GET['f'])&&$_GET['f']!="") {


	print_r(publish($_GET['id'],$_GET['f']));
	echo "Done";
}

?>