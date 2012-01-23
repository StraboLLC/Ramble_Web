<?php 
// curl -F "filetype=video" -F "filename=Track1" -F "videofile=@Track1.mov" -F "auth_token=a47c75460be5078f6a7dec8b4a964203" -F "id=1234440553" -F "JSONfile=@Track1.json" http://ramble.strabogis.com/mobileapi/v1/upload.php > output.txt

require_once('../../app/library.php');

$auth_token = isset($_POST['auth_token']) ? $_POST['auth_token'] : null;
$id = isset($_POST['id']) ? $_POST['id'] : null;
$u = verifyID($id,$auth_token);
$s3 = new S3(awsAccessKey, awsSecretKey);
if($u!=false && $_POST['filetype']=="video") {
	
	$json = isset($_POST['JSONfile']) ? $_POST['JSONfile'] : null;
	$video = isset($_POST['videofile']) ? $_POST['videofile'] : null;

	$addtoalbum = isset($_POST['addtoalbum']) ? $_POST['addtoalbum'] : null;
	$imagefile = isset($_POST['imagefile']) ? $_POST['imagefile'] : null;
	$filename = isset($_POST['filename']) ? $_POST['filename'] : null;
	$makepublic = isset($_POST['makepublic']) ? $_POST['makepublic'] : 0;
	$file = file_get_contents($json['tmp_name']);
	print_r($file);
	/*if($video!=null&&$json!=null&&$filename!=null) {
		//$s3->putObject($image['tmp_name'], $bucketName, $filename.'/'.$filename.'.png', S3::ACL_PUBLIC_READ);

		if(	$s3->putObject($s3->inputFile($video['tmp_name']), $bucketName, $filename.'/'.$filename.'.mov', S3::ACL_PUBLIC_READ)&&
			$s3->putObject($s3->inputFile($json['tmp_name']), $bucketName, $filename.'/'.$filename.'.json', S3::ACL_PUBLIC_READ)) {
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
						  "public": 1
						},
						{
						  "url": "s3://'.$bucketName.'/'.$filename.'/'.$filename.'.webm",
						  "label": "webm",
						  "format": "webm",
					      "video_codec": "vp8",
					      "audio_codec": "vorbis",
						  "quali	ty": 4,
						  "speed": 3,
						  "autolevel": 1,
						  "deblock": 1,
						  "public": 1				
						}
				    ]
				  }
				');	
				//$query = "INSERT INTO track"
				echo "Job ID: ".$encoding_job->id."\n";
				echo "Webm ID: ".$encoding_job->outputs['webm']->id."\n";
				echo "Mp4 ID: ".$encoding_job->outputs['mp4']->id."\n";
			} catch (Services_Zencoder_Exception $e) {
				echo "Fail :(\n\n";
				echo "Errors:\n";
				foreach ($e->errors as $error) echo $error."\n";
				echo "Full exception dump:\n\n";
				print_r($e);
			}
			
			echo "\nAll Job Attributes:\n";
			//var_dump($encoding_job);
		}
	}*/

} else if($u!=false && $_POST['filetype']=="image") {

} else {
	echo "You must be logged in!";
}

?>