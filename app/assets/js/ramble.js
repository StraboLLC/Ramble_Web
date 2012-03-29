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
	goHome();
	document.oncontextmenu=function(e){return false;};
	document.getElementById("ramble-logo-button").onclick=function() {goHome();};
	document.getElementById("ramble-user-button").onclick=function() {pullUserSidebar(id);};
	document.getElementById("ramble-friends-button").onclick=function() {showFriends();};

	
	video=document.getElementById('video');

	var lat=44.00858496025453,lng=286.8300942840576;
	var myOptions = {
		center: new google.maps.LatLng(lat,lng),
		zoom: 15,
		overviewMapControl: false,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("map"), myOptions);
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
	initSidebar();
	$('#popup-close').click(function() {
		$('#popup').css('display','none');
	});
	$('#close-vid').click(function() {
		closeViewer();
	});
	$('#search').keypress(function(event) {
		if ( event.which == 13 ) {
			pullSearchQuery(this.value);
		}
	});
});

function initViewer(vidName) {
	currentPoint=0;
	document.getElementById('video_container').style.height="368px";
	document.getElementById('played').style.width="0px";
	getTrack(vidName);
}
function closeViewer() {
	video.pause();
	document.getElementById('play-pause').style.background = "url('/app/assets/images/play.png') center center no-repeat";
	$('.track').removeClass('selected');
	document.getElementById('video_container').style.display="none";
	document.getElementById('video_container').style.height="368px";
}
function initSidebar() {
	$('.track').click(function(){
		cT = this.getAttribute('data-index');
		initViewer(tracks[cT].filename);
		console.log(cT);
		//pullUserSidebar(tracks[cT].user_id);
		var llb = new google.maps.LatLngBounds();
		for(var x in tracks[cT].points) {
			llb.extend(new google.maps.LatLng(tracks[cT].points[x].latitude,tracks[cT].points[x].longitude));
		}
		map.fitBounds(llb);
	});
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
		strokeOpacity: 0.73,
		strokeWeight: 5
	});
	tracks[idx].currentRoute.setMap(map);
	var deg = Math.round(tracks[idx].points[0].heading)-90;
	tracks[idx].richMarker = new RichMarker({
		map: map,
		flat: true,
		position: new google.maps.LatLng(tracks[idx].points[0].latitude,tracks[idx].points[0].longitude),
		anchor: RichMarkerPosition.MIDDLE,
		content: '<div class="marker"><div id="'+idx+'-marker" class="video-camera-marker" style="transform:rotate('+deg+'deg);-moz-transform:rotate('+deg+'deg);-webkit-transform:rotate('+deg+'deg);-o-transform:rotate('+deg+'deg);-ms-transform:rotate('+deg+'deg);" ><img src="/app/assets/images/arrow.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/'+tracks[idx].user_id+'/picture" alt="" title="'+tracks[idx].name+'"/></div></div>'
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
			this.style.background = "url('/app/assets/images/pause.png') center center no-repeat";
		} else {
			pause();
			this.style.background = "url('/app/assets/images/play.png') center center no-repeat";
		}
	};
	$('#scrub-bar').click(function(event) {
		var pos = findPos(this);
		var a = (event.pageX-pos.x);
		document.getElementById('played').style.width=a+"px";
		var percentDone = a/(convertCssPxToInt(document.getElementById('video_container').style.width)-60);
		video.currentTime=percentDone*video.duration;
		var accuratePoint=0;
		a=10;
		var l=10;
		for(var x in tracks[cT].points) {
			a=Math.abs(tracks[cT].points[x].timestamp-(percentDone*video.duration));
			//console.log(a);
			if(a<l){l=a;accuratePoint=x;}
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
	var scrubBarWidth;
	currentTime=video.currentTime;
	if(currentTime>=video.duration) { // If video is done.
		currentPoint=0;
		playInt = window.clearInterval(playInt);
		//var scrubBarWidth=(convertCssPxToInt(document.getElementById('video_container').style.width)-60);
		scrubBarWidth=(convertCssPxToInt(document.getElementById('video_container').style.width)-60);
		document.getElementById('played').style.width=scrubBarWidth+"px";
		document.getElementById('play-pause').style.background = "url('/app/assets/images/play.png') center center no-repeat";
		video.pause();
		
	} else {
		percentDone=currentTime/video.duration;
		if(currentPoint>=tracks[cT].points.length)currentPoint=tracks[cT].points.length-1;
		pointTime = tracks[cT].points[currentPoint].timestamp;
		if(currentTime>pointTime) {
			currentPoint++;
			var deg = Math.round(tracks[cT].points[currentPoint].heading)-90;
			tracks[cT].richMarker.setPosition(new google.maps.LatLng(tracks[cT].points[currentPoint].latitude,tracks[cT].points[currentPoint].longitude));
			document.getElementById(cT+'-marker').style.webkitTransform = "rotate("+deg+"deg)";
			document.getElementById(cT+'-marker').style.MozTransform = "rotate("+deg+"deg)";
			document.getElementById(cT+'-marker').style.transform = "rotate("+deg+"deg)";
			document.getElementById(cT+'-marker').style.oTransform = "rotate("+deg+"deg)";
			document.getElementById(cT+'-marker').style.msTransform = "rotate("+deg+"deg)";
		}
		if(document.getElementById('video_container').style.width==="")document.getElementById('video_container').style.width="250px";
		scrubBarWidth=(convertCssPxToInt(document.getElementById('video_container').style.width)-60)*percentDone;
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

/* Sidebar Stuff */


/************************************************************************************************

TRACK MANAGEMENT FUNCTIONS

************************************************************************************************/
function removeMenus() {
	$('.delete-button').remove();
}
function pullUserSidebar(id) {
	$('.delete-button').remove();
	clearMap();
	document.getElementById('sidebar-videos').innerHTML = "";
	$("#sidebar-videos").addClass('loading');
	var oXHR = new XMLHttpRequest();
	oXHR.open("GET", "/api/index.php?user_sidebar&id="+id);
	oXHR.onreadystatechange = function (oEvent) {
		if (oXHR.readyState === 4) {
			if (oXHR.status === 200) {
				document.getElementById('sidebar-videos').innerHTML = oXHR.responseText;
				//console.log(oXHR.responseText);
				$("#sidebar-videos").removeClass('loading');
				loadScripts(document.getElementById('sidebar-videos'));
				initSidebar();
				fillMap();
			} else {
				console.log("Error", oXHR.statusText);
			}
		}
	};
	oXHR.send(null);
}

function pullSearchQuery(query) {
	$('.delete-button').remove();
	var	results=[];
	$("#sidebar-videos").html(null);
	$("#sidebar-videos").addClass('loading');
	var re = new RegExp("[A-Z\ ]*"+query+"[A-Z\ ]*","gi");
	for(var x in friends) {
		if(friends[x].name.match(re)!==null) results.push(friends[x]);
		else if(friends[x].first_name.match(re)!==null) results.push(friends[x]);
		else if(friends[x].last_name.match(re)!==null) results.push(friends[x]);
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
function showFriends() {
	$('.delete-button').remove();
	var html = '<div class="sub-heading">Friends List</div><div id="videos-section">';
	for(var x in friends) {
		
		html += '<div class="list-item user" onclick="pullUserSidebar('+friends[x].id+')" data-name="'+friends[x].id+'">';
		html += '<div class="user-image image"><img src="//graph.facebook.com/'+friends[x].id+'/picture" height="43" alt="" title="'+friends[x].name+'"/></div>';
		html += '<div class="user-name name">'+friends[x].name+'</div></div>';
	}
	html += '</div>';
	$('#sidebar-videos').html(html);
}

function goHome() {
	$('.delete-button').remove();
	clearMap();
	$("#sidebar-videos").html(null);
	$("#sidebar-videos").addClass('loading');
	var oXHR = new XMLHttpRequest();
	oXHR.open("GET", "/api/index.php?go_home");
	oXHR.onreadystatechange = function (oEvent) {
		if (oXHR.readyState === 4) {
			if (oXHR.status === 200) {
				// CODE TO BE EXECUTED ON RESPONSE
				$('#sidebar-videos').html(oXHR.responseText);
				//console.log(oXHR.responseText);
				$("#sidebar-videos").removeClass('loading');
				loadScripts(document.getElementById('sidebar-videos'));
				initSidebar();
				fillMap();
			} else {
				console.log("Error", oXHR.statusText);
			}
		}
	};
	oXHR.send(null);
}


function deleteTrack(filename) {
	$('.delete-button').remove();
	$("#sidebar-videos").html(null);
	$("#sidebar-videos").addClass('loading');
	closeViewer();
	clearMap();
	var fd = new FormData();
	fd.append('filename',filename);
	var oXHR = new XMLHttpRequest();
	oXHR.open("POST", "/api/index.php?delete_video");
	oXHR.onreadystatechange = function (oEvent) {
		if (oXHR.readyState === 4) {
			if (oXHR.status === 200) {
				// CODE TO BE EXECUTED ON RESPONSE
				$('#sidebar-videos').html(oXHR.responseText);
				$("#sidebar-videos").removeClass('loading');
				loadScripts(document.getElementById('sidebar-videos'));
				initSidebar();
				fillMap();

			} else {
				console.log("Error", oXHR.statusText);
			}
		}
	};
	oXHR.send(fd);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
Supporting Functions
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function loadScripts(elt) {
	var scripts = elt.getElementsByTagName('script');
	for(var x in scripts) {
		eval(scripts[x].innerHTML);
		console.log("Reloaded Tracks array!");
	}
}
function clearMap() {
	closeViewer();
	for(var x in tracks) {
		tracks[x].richMarker.setMap(null);
		tracks[x].currentRoute.setMap(null);
	}
}
function fillMap() {
	map.setZoom(15);
	latLngBounds = new google.maps.LatLngBounds();
	for(var x in tracks) {
		plotTrack(x);
	}
}
function reFillMap() {
	for(var x in tracks) {
		tracks[x].richMarker.setMap(map);
		tracks[x].currentRoute.setMap(map);
	}
}


/************************************************************************************************

PLAYBACK FUNCTIONS

************************************************************************************************/



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
Supporting Functions
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
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
	var curleft = 0, curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj == obj.offsetParent);
	}
	var a={x:curleft,y:curtop};
	return a;
}