<?php 
// curl -F "filetype=video" -F "filename=F83FF6A9-93D7-43C9-8439-4B1C0F612D89-1327694353" -F "videofile=@F83FF6A9-93D7-43C9-8439-4B1C0F612D89-1327694353.mov" -F "auth_token=a47c75460be5078f6a7dec8b4a964203" -F "id=1234440553" -F "JSONfile=@F83FF6A9-93D7-43C9-8439-4B1C0F612D89-1327694353.json" -k https://ramble.strabogis.com/mobileapi/v1/upload.php > output.txt

require_once('../../app/library.php');

$auth_token = isset($_POST['auth_token']) ? $_POST['auth_token'] : null;
$id = isset($_POST['id']) ? $_POST['id'] : null;
mobile_login($id,$auth_token);
$u = verifyID($id,$auth_token);
//$u = true;
if($u!=false && $_POST['filetype']=="video") {

	$json = isset($_FILES['JSONfile']) ? $_FILES['JSONfile'] : null;
	$video = isset($_FILES['videofile']) ? $_FILES['videofile'] : null;
	$imagefile = isset($_FILES['imagefile']) ? $_FILES['imagefile'] : null;
	
	if($json==null||$video==null||$imagefile==null) echo '{"errors":["true","JSON or Video or Image is not included!"]}';
	
	$addtoalbum = isset($_POST['addtoalbum']) ? $_POST['addtoalbum'] : null;
	$filename = isset($_POST['filename']) ? $_POST['filename'] : null;
	$makepublic = isset($_POST['makepublic']) ? $_POST['makepublic'] : 0;
	$file_data = json_decode(file_get_contents($json['tmp_name']));
	
	if($video!=null&&$json!=null&&$filename!=null&&$imagefile!=null) {

		if(	$s3->putObject($s3->inputFile($video['tmp_name']), $bucketName, $filename.'/'.$filename.'.mov', S3::ACL_PUBLIC_READ)&&
			$s3->putObject($s3->inputFile($json['tmp_name']), $bucketName, $filename.'/'.$filename.'.json', S3::ACL_PUBLIC_READ)&&
			$s3->putObject($s3->inputFile($imagefile['tmp_name']), $bucketName, $filename.'/'.$filename.'.png', S3::ACL_PUBLIC_READ)) {
			try {
				$zencoder = new Services_Zencoder($apikey);
				$encoding_job = $zencoder->jobs->create('
				  {
				    "api_key": "'.$apikey.'",
				    "region": "us",
				    "input": "s3://'.$bucketName.'/'.$filename.'/'.$filename.'.mov",
				    "outputs": [
						{
						  "url": "s3://'.$bucketName.'/'.$filename.'/'.$filename.'.mp4",
						  "label": "mp4",
						  "format": "mp4",
					      "video_codec": "h264",
					      "audio_codec": "aac",
						  "quality": 4,
						  "speed": 3,
						  "autolevel": 1,
						  "deblock": 1,
						  "public": 1,
						  "notifications": [
							{
								"url": "https://ramble.strabogis.com/api/zencoder.php",
								"format": "json"
							}]
						},
						{
						  "url": "s3://'.$bucketName.'/'.$filename.'/'.$filename.'.webm",
						  "label": "webm",
						  "format": "webm",
					      "video_codec": "vp8",
					      "audio_codec": "vorbis",
						  "quality": 4,
						  "speed": 3,
						  "autolevel": 1,
						  "deblock": 1,
						  "public": 1,	
						  "notifications": [
							{
								"url": "https://ramble.strabogis.com/api/zencoder.php",
								"format": "json"
							}]			
						}
				    ]
				  }
				');	
				// Parse the JSON File to fill out the database
				$name = ($file_data->track->title!="") ? $file_data->track->title : date('M j, Y');
				$date_taken = $file_data->track->captureDate;
				$date_uploaded = time();
				$permissions = 0;
				$starting_lat = $file_data->track->points[0]->latitude;
				$starting_long = $file_data->track->points[0]->longitude;
				$starting_heading = $file_data->track->points[0]->heading;
				$user_id = $id;
				$jobid = $encoding_job->id;
				$webmid = $encoding_job->outputs['webm']->id;
				$mp4id = $encoding_job->outputs['mp4']->id;

				$query = "INSERT INTO track (name,filename,date_taken,date_uploaded,starting_lat,starting_long,starting_heading,user_id,jobid,webmid,mp4id) VALUES ('$name','$filename','$date_taken','$date_uploaded','$starting_lat','$starting_long','$starting_heading','$user_id','$jobid','$webmid','$mp4id')";
				mysql_query($query,$con) or die("Query ".$query." failed because: ".mysql_error());
				echo '{"errors":["false"';
				echo ',"Video uploaded successfully!"';
				echo "]}";
			} catch (Services_Zencoder_Exception $e) {
				echo '{"errors":["true"';
				foreach ($e->errors as $error) echo ',"'.$error.'"';
				echo "]}";
			}
		}
	}

} else if($u!=false && $_POST['filetype']=="image") {

} else {
	echo '{"errors" : [ "true" , "Token Invalid" ]}';
}
?>