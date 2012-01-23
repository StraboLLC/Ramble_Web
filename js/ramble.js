// Global Vars
var map;
var viewer;
var points;
var vidName;


// OnLoad Stuff
$(document).ready(function() {
	
	// Initializing some map stuff
	var myOptions = {
		center: new google.maps.LatLng(44.00858496025453, 286.8300942840576),
		zoom: 15,
		overviewMapControl: false,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	$('#video_container').draggable({containment:"parent"});
	$('#video_container').resizable({containment:"parent",aspectRatio:true});
	$('video').dblclick(function() { 
		if(this.paused==true) {
			this.play();
		} else {
			this.pause();
		}
	});
	vidName="Track1";
	initViewer();
	
});

function initViewer() {
	points=getPoints(vidName);
	document.getElementById('video').src="http://s3.amazonaws.com/ramble/"+vidName+"/"+vidName+".webm";
	document.getElementById('video-title').innerHTML = vidName;
	document.getElementById('play-pause').onclick = function() {
		if(document.getElementById('video').paused==true) {
			document.getElementById('video').play();
		} else {
			document.getElementById('video').pause();
		}
	}
	document.getElementById('video_container').style.display="block";
}
function closeViewer() {
	document.getElementById('video').src=null;
	document.getElementById('video_container').style.display="block";
}
function getPoints(videoName) {
	var oXHR = new XMLHttpRequest();  
	oXHR.open("GET", "/api/index.php?track_points=true&name="+videoName, true);  
	oXHR.onreadystatechange = function (oEvent) {  
	  if (oXHR.readyState === 4) {  
	    if (oXHR.status === 200) {  
	      points=JSON.parse(oXHR.responseText);
	    } else {  
	      console.log("Error", oXHR.statusText);  
	    }  
	  }  
	};  
	oXHR.send(null);  
}