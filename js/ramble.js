// Global Vars
var video;
var map;
var viewer;
var track;

//var vidName;
var viewerOn;
var mainTrackMarker;

var tracks;
var playInt;

var cT;
var currentPoint;
var currentMarker;
var currentRoute;
var currentTime;
var pointTime;
var latLngBounds;

var friends;

var cameras;

// OnLoad Stuff
$(document).ready(function() {
	/*cameras=[];
	for(var i=0;i<361;i++) {
		cameras[i] = rotationArrow(i);
	}*/
	video=document.getElementById('video');

	// Initializing some map stuff
	var mapOpts = {
		center: new google.maps.LatLng(42.35265666027262, -71.0605521736145),
		zoom: 15,
		overviewMapControl: false,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("map"), mapOpts);
	latLngBounds = new google.maps.LatLngBounds();
	for(var x in tracks) {
		plotTrack(x);
	}
	$('#video_container').draggable({containment:"parent"});
	$('#video_container').resizable({containment:"parent",aspectRatio:true});
	$('video').dblclick(function() { 
		if(this.paused===true) {
			play();
		} else {
			pause();
		}
	});
	$('.track').click(function(){
		cT = this.getAttribute('data-index');
		initViewer(tracks[cT].filename);
		//pullUserSidebar(tracks[cT].user_id);
		var llb = new google.maps.LatLngBounds();
		for(var x in tracks[cT].points) {
			llb.extend(new google.maps.LatLng(tracks[cT].points[x].latitude,tracks[cT].points[x].longitude));
		}
		map.fitBounds(llb);
	});
	$('#popup-close').click(function() {
		$('#popup').css('display','none');
	});
  	$('#close-vid').click(function() {
		closeViewer();
	});
	$('.create-album').click(function() {
		$('#popup-content').html();
		$('#popup').css('display','block');
	});
	$('#search').keypress(function(event) {
		if ( event.which == 13 ) {
			pullSearchQuery(this.value);
		}
	});
});

function initViewer(vidName) {
	currentPoint=0;
	document.getElementById('played').style.width="0px";
	getTrack(vidName);
}
function closeViewer() {
	video.pause();
	$('.track').removeClass('selected');
	document.getElementById('video_container').style.display="none";
}
function plotTrack(idx) {
	// Set Points Array
	tracks[idx].points=tracks[idx].track.track.points;
	tracks[idx].routeCoords = [];
	for(var x in tracks[idx].points) {
		tracks[idx].routeCoords.push(new google.maps.LatLng(tracks[idx].points[x].latitude,tracks[idx].points[x].longitude));
	}
	latLngBounds.extend(new google.maps.LatLng(tracks[idx].points[0].latitude,tracks[idx].points[0].longitude));
	map.fitBounds(latLngBounds);
	tracks[idx].currentRoute = new google.maps.Polyline({
		path: tracks[idx].routeCoords,
		strokeColor: "rgb(48,157,230)",
		strokeOpacity: .73,
		strokeWeight: 5
	});
	//		strokeOpacity: .83,
	tracks[idx].currentRoute.setMap(map);
	var deg = Math.round(tracks[idx].points[0].heading)-90;
	/*tracks[idx].markerImage = new google.maps.MarkerImage(
								rotationArrow(deg),
								new google.maps.Size(40,40),
								new google.maps.Point(0,0),
								new google.maps.Point(20,20));
	tracks[idx].marker = new google.maps.Marker({
		icon:tracks[idx].markerImage,
		position: new google.maps.LatLng(tracks[idx].points[0].latitude,tracks[idx].points[0].longitude),
		title:tracks[idx].name
	});
	tracks[idx].marker.setMap(map);*/
	tracks[idx].richMarker = new RichMarker({
		map: map,
		flat: true,
		position: new google.maps.LatLng(tracks[idx].points[0].latitude,tracks[idx].points[0].longitude),
		anchor: RichMarkerPosition.MIDDLE,
		content: '<div class="marker"><div id="'+idx+'-marker" class="video-camera-marker" style="transform:rotate('+deg+'deg);-moz-transform:rotate('+deg+'deg);-webkit-transform:rotate('+deg+'deg);-o-transform:rotate('+deg+'deg);-ms-transform:rotate('+deg+'deg);" ><img src="/images/videocamera.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/'+tracks[idx].user_id+'/picture" alt="" title="'+tracks[idx].name+'"/></div></div>'
	});
	tracks[idx].richMarker.setMap(map);
	google.maps.event.addListener(tracks[idx].richMarker, 'click', function() {
		cT = idx;
		initViewer(tracks[idx].filename);
		var llb = new google.maps.LatLngBounds();
		for(var x in tracks[idx].points) {
			llb.extend(new google.maps.LatLng(tracks[idx].points[x].latitude,tracks[idx].points[x].longitude));
		}
		map.fitBounds(llb);
	});
		
}
function getTrack(videoName) {
	vidName = videoName;
	document.getElementById('video_container').style.width="250px";
	if(video.canPlayType("video/webm")) video.src="http://s3.amazonaws.com/ramble/"+videoName+"/"+videoName+".webm";
	else if(video.canPlayType("video/mp4")) video.src="http://s3.amazonaws.com/ramble/"+videoName+"/"+videoName+".mp4";
	else video.innerHTML = "Sorry, your browser does not support HTML5 Video. Please try using a compatible browser. We recommend <a href=\"http://chrome.google.com\">Google Chrome</a>.";
	document.getElementById('video-title').innerHTML = tracks[cT].name;
	//video.currentTime=0;
	document.getElementById('play-pause').onclick = function() {
		if(video.paused===true) {
			play();
			this.style.background = "url('/images/pause.png') center center no-repeat";
		} else {
			pause();
			this.style.background = "url('/images/play.png') center center no-repeat";
		}
	};
	$('#scrub-bar').click(function(event) {
		var pos = findPos(this);
		var a = (event.pageX-pos.x);
		document.getElementById('played').style.width=a+"px";

		var percentDone = a/(convertCssPxToInt(document.getElementById('video_container').style.width)-60);

		video.currentTime=percentDone*video.duration;

		var accuratePoint=0;
		var a=10,l=10;
		for(x in tracks[cT].points) {

			a=Math.abs(tracks[cT].points[x].timestamp-(percentDone*video.duration));
			//console.log(a);
			if(a<l){l=a;accuratePoint=x}
		}

		tracks[cT].richMarker.setPosition(new google.maps.LatLng(tracks[cT].points[accuratePoint].latitude,tracks[cT].points[accuratePoint].longitude));
		currentPoint=accuratePoint;
	});
	document.getElementById('video_container').style.display="block";


}


function play() {
	video.play();
	playInt = window.setInterval(followRoute,10);
}
function followRoute() {
	var percentDone;
	currentTime=video.currentTime;
	if(currentTime>=video.duration) { // If video is done.
		currentPoint=0;
		playInt = window.clearInterval(playInt);
		//var scrubBarWidth=(convertCssPxToInt(document.getElementById('video_container').style.width)-60);
		var scrubBarWidth=(convertCssPxToInt(document.getElementById('video_container').style.width)-40);
		document.getElementById('played').style.width=scrubBarWidth+"px";
		document.getElementById('play-pause').style.background = "url('/images/play.png') center center no-repeat";
		video.pause();
		
	} else {		
		percentDone=currentTime/video.duration;
		if(currentPoint>=tracks[cT].points.length)currentPoint=tracks[cT].points.length-1;
		pointTime = tracks[cT].points[currentPoint].timestamp;
		if(currentTime>pointTime) {
			currentPoint++;
			var deg = Math.round(tracks[cT].points[currentPoint].heading)-90;
			/*tracks[cT].markerImage = new google.maps.MarkerImage(
											rotationArrow(deg),
											new google.maps.Size(40,40),
											new google.maps.Point(0,0),
											new google.maps.Point(20,20));
			tracks[cT].marker = new google.maps.Marker({
				icon:tracks[cT].markerImage,
				position: new google.maps.LatLng(tracks[cT].points[currentPoint].latitude,tracks[cT].points[currentPoint].longitude),
				title:tracks[cT].name
			});	

			tracks[cT].marker.setMap(map);*/
			tracks[cT].richMarker.setPosition(new google.maps.LatLng(tracks[cT].points[currentPoint].latitude,tracks[cT].points[currentPoint].longitude));
			document.getElementById(cT+'-marker').style.webkitTransform = "rotate("+deg+"deg)";
			document.getElementById(cT+'-marker').style.MozTransform = "rotate("+deg+"deg)";
			document.getElementById(cT+'-marker').style.transform = "rotate("+deg+"deg)";
			document.getElementById(cT+'-marker').style.oTransform = "rotate("+deg+"deg)";
			document.getElementById(cT+'-marker').style.msTransform = "rotate("+deg+"deg)";
		}
		if(document.getElementById('video_container').style.width=="")document.getElementById('video_container').style.width="250px";
		var scrubBarWidth=(convertCssPxToInt(document.getElementById('video_container').style.width)-60)*percentDone;
		document.getElementById('played').style.width=scrubBarWidth+"px";
		//console.log(scrubBarWidth+" "+video.currentTime+" "+video.duration);
	}
}
function resetTrack(aTrack) {
	var deg = Math.round(aTrack.points[0].heading)-90;
	aTrack.richMarker.setPosition(new google.maps.LatLng(aTrack.points[0].latitude,aTrack.points[0].longitude));
	document.getElementById(cT+'-marker').style.webkitTransform = "rotate("+deg+"deg)";
	document.getElementById(cT+'-marker').style.MozTransform = "rotate("+deg+"deg)";
	document.getElementById(cT+'-marker').style.transform = "rotate("+deg+"deg)";
	document.getElementById(cT+'-marker').style.oTransform = "rotate("+deg+"deg)";
	document.getElementById(cT+'-marker').style.msTransform = "rotate("+deg+"deg)";
}
function pause() {
	video.pause();
	playInt = window.clearInterval(playInt);
}
function reset() {
	getTrack(vidName);
}
function rotationArrow(deg) {
	var canvas, context, image;
	deg = -(deg-90) * Math.PI / 180;

	var image;
	image = new Image();
	image.src='data:image/png;base64,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';
	//image.src="/images/videocamera.png";
	canvas = document.createElement('canvas');
	//canvas = document.getElementById(id+'-marker');
	context = canvas.getContext("2d");
	canvas.width = 40;
	canvas.height = 40;
	context.translate(20,20);	
	context.scale(1,-1);  
	context.rotate(deg);
	context.drawImage(image,-10,-8);
	//context.fillStyle="rgb(255,0,0)";
	//context.fillRect(-2,-2,4,4);
	return canvas.toDataURL();
}


/* Sidebar Stuff */
function pullUserSidebar(id) {
	document.getElementById('sidebar-videos').innerHTML = "";
	$("#sidebar-videos").addClass('loading');
	var oXHR = new XMLHttpRequest();  
	oXHR.open("GET", "/api/index.php?user_sidebar&id="+id);  
	oXHR.onreadystatechange = function (oEvent) {  
		if (oXHR.readyState === 4) {  
			if (oXHR.status === 200) {  
				document.getElementById('sidebar-videos').innerHTML = oXHR.responseText;
				$("#sidebar-videos").removeClass('loading');
				$('.track').click(function(){
					initViewer(this.getAttribute('data-name'));
					//if(!$(this).hasClass('selected')) $(this).addClass('selected');
				});
			} else {  
				console.log("Error", oXHR.statusText);  
			}  
		}  
	};  
	oXHR.send(null);  
}
function clearMap() {
	for(x in tracks) {
		tracks[x].marker.setMap(null);
		tracks[x].currentRoute.setMap(null);
	}
}
function fillMap() {
	for(x in tracks) {
		tracks[x].marker.setMap(map);
		tracks[x].currentRoute.setMap(map);
	}
}
function pullSearchQuery(query) {
	var	results=[];
	$("#sidebar-videos").html(null);
	$("#sidebar-videos").addClass('loading');
	var re = new RegExp("[A-Z\ ]*"+query+"[A-Z\ ]*","gi");
	for(var x in friends) {
		if(friends[x].name.match(re)!=null) results.push(friends[x]);
		else if(friends[x].first_name.match(re)!=null) results.push(friends[x]);
		else if(friends[x].last_name.match(re)!=null) results.push(friends[x]);
	}
	var html = '<div class="sub-heading">Search Results</div><div id="videos-section">';
	for(x in results) {
		
		html += '<div class="list-item user" onclick="pullUserSidebar('+results[x].id+')" data-name="'+results[x].id+'">';
		html += '<div class="user-image image"><img src="//graph.facebook.com/'+results[x].id+'/picture" height="43" alt="" title="'+results[x].name+'"/></div>';
		html += '<div class="user-name name">'+results[x].name+'</div></div>';
	}
	html += '</div>';

	$('#sidebar-videos').html(html);
	$("#sidebar-videos").removeClass('loading');
}
function goHome() {
	$("#sidebar-videos").html(null);
	$("#sidebar-videos").addClass('loading');
	var oXHR = new XMLHttpRequest();  
	oXHR.open("GET", "/api/index.php?go_home");  
	oXHR.onreadystatechange = function (oEvent) {  
		if (oXHR.readyState === 4) {  
			if (oXHR.status === 200) {  
				// CODE TO BE EXECUTED ON RESPONSE
				$('#sidebar-videos').html(oXHR.responseText);
				$("#sidebar-videos").removeClass('loading');

			} else {  
				console.log("Error", oXHR.statusText);  
			}  
		}  
	};  
	oXHR.send(null);  	
}
function setEventListeners() {

}
// Generic Functions
function convertCssPxToInt(cssPxValueText) {

    // Set valid characters for numeric number.
    var validChars = "0123456789.";

    // If conversion fails return 0.
    var convertedValue = 0;

    // Loop all characters of
    for (i = 0; i < cssPxValueText.length; i++) {

        // Stop search for valid numeric characters,  when a none numeric number is found.
        if (validChars.indexOf(cssPxValueText.charAt(i)) == -1) {

            // Start conversion if at least one character is valid.
            if (i > 0) {
                // Convert validnumbers to int and return result.
                convertedValue = parseInt(cssPxValueText.substring(0, i));
                return convertedValue;
            }
        }
    }

    return convertedValue;
}
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	var a={x:curleft,y:curtop};
	return a;
}
