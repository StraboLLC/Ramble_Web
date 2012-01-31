<?php
require_once('../app/library.php');


// Initialize the Services_Zencoder class
$zencoder = new Services_Zencoder($apikey);

// Catch notification
$notification = $zencoder->notifications->parseIncoming();

// Check output/job state
if($notification->output->state == "finished") {
	if($notification->job->state == "finished") {
		toggle_job_state(1,$notification->job->id)
	}
} elseif ($notification->output->state == "cancelled") {
	echo "{state:'cancelled'}";
} else {
	echo "{state:'failed'}";
	echo $notification->output->error_message."\n";
	echo $notification->output->error_link;
}



?>