// build/jsdoc/jsdoc app/assets/js/ramble-obj.js -d build/doc
/* Global Variables */
var map;
/**
 * A Ramble Track.
 * @constructor
 */
function Track(name,json,map) {
	this.name=name;
	this.points=json.track.track.points;
	this.map=map;
	this.strokeColor="rgb(48,157,230)";
	this.strokeOpacity=0.73;
	this.strokeWeight=5;
	this.currentPoint=0;
	this.listItem = document.createElement('div');

	this.routeCoords = [];
	for(var x in this.points) {
		this.routeCoords.push(new google.maps.LatLng(this.points[x].latitude,this.points[x].longitude));
	}
	latLngBounds.extend(new google.maps.LatLng(this.points[0].latitude,this.points[0].longitude));
	map.map.fitBounds(latLngBounds);
	this.route = new google.maps.Polyline({
		path: this.routeCoords,
		strokeColor: "rgb(48,157,230)",
		strokeOpacity: 0.73,
		strokeWeight: 5
	});
	this.route.setMap(map.map);
	this.deg = Math.round(this.points[0].heading)-90;
	this.marker = new RichMarker({
		map: map.map,
		flat: true,
		position: new google.maps.LatLng(this.points[0].latitude,this.points[0].longitude),
		anchor: RichMarkerPosition.MIDDLE,
		content: '<div class="marker"><div id="'+name.filename+'-marker" class="video-camera-marker" style="transform:rotate('+this.deg+'deg);-moz-transform:rotate('+this.deg+'deg);-webkit-transform:rotate('+this.deg+'deg);-o-transform:rotate('+this.deg+'deg);-ms-transform:rotate('+this.deg+'deg);" ><img src="/app/assets/images/arrow.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/'+this.user_id+'/picture" alt="" title="'+this.name+'"/></div></div>'
	});
	this.marker.setMap(map.map);
	google.maps.event.addListener(this.marker, 'click', function() {
		initViewer(this.filename);
		var llb = new google.maps.LatLngBounds();
		for(var x in this.points) {
			llb.extend(new google.maps.LatLng(this.points[x].latitude,this.points[x].longitude));
		}
		map.map.fitBounds(llb);
	});
}
/**
 * Shows the track Marker and Route on its Map object.
 */
Track.prototype.show=function() {
	this.marker.setMap(this.map.map);
	this.route.setMap(this.map.map);
};
/**
 * Hides the track Marker and Route from its Map object.
 */
Track.prototype.hide=function() {
	this.marker.setMap(null);
	this.route.setMap(null);
};
/**
 * Shows the track Route on its Map object.
 */
Track.prototype.showRoute=function() {
	this.route.setMap(this.map.map);
};
/**
 * Hides the track Route from its Map object.
 */
Track.prototype.hideRoute=function() {
	this.route.setMap(null);
};
/**
 * Queries the server to delete the Track from the database.
 */
Track.prototype.deleteTrack=function() {
	var fd = new FormData();
	fd.append('filename',this.name);
	var oXHR = new XMLHttpRequest();
	oXHR.open("POST", "/api/index.php?delete_video");
	oXHR.onreadystatechange = function (oEvent) {
		if (oXHR.readyState === 4) {
			if (oXHR.status === 200) {
				//Do on completion
			} else {
				console.log("Error", oXHR.statusText);
			}
		}
	};
	oXHR.send(fd);
};
/**
 * A list of Ramble Tracks.
 * @constructor
 */
function TrackList(elt) {
	this.elt=elt;
	this.count=0;
	this.data=[];
}
/**
 * Adds a Track object as the last item in the list.
 * @param {Track}
 */
TrackList.prototype.add=function(track) {
	this.count=this.data.push(track);
};
/**
 * Removes an element from the list at the given index.
 * @param {number}
 */
TrackList.prototype.remove=function(index) {
	return this.data.splice(index,1);
};
/**
 * Shows all tracks in the list on their respective maps.
 */
TrackList.prototype.show=function() {
	for(var x in this.data) {
		this.data[x].show();
	}
};
/**
 * Hides all tracks in the list on their respective maps.
 */
TrackList.prototype.hide=function() {
	for(var x in this.data) {
		this.data[x].hide();
	}
};
/**
 * Shows all track routes in the list on their respective maps.
 */
TrackList.prototype.showRoutes=function() {
	for(var x in this.data) {
		this.data[x].showRoute();
	}
};
/**
 * Hides all track routes in the list on their respective maps.
 */
TrackList.prototype.hideRoutes=function() {
	for(var x in this.data) {
		this.data[x].hideRoute();
	}
};
/**
 * Shows all track markers in the list on their respective maps.
 */
TrackList.prototype.showMarkers=function() {
	for(var x in this.data) {
		this.data[x].showMarker();
	}
};
/**
 * Hides all track markers in the list on their respective maps.
 */
TrackList.prototype.hideMarkers=function() {
	for(var x in this.data) {
		this.data[x].hideMarker();
	}
};
/**
 * The Map that builds upon a Google Maps Map.
 * @constructor
 */
function Map(elt) {
	this.elt=elt;
	var mapOptions = {
		center: new google.maps.LatLng(44.00858496025453,286.8300942840576),
		zoom: 15,
		overviewMapControl: false,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	this.map = new google.maps.Map(this.elt, mapOptions);
}
/**
 * The Player object for Ramble videos.
 * @param {Element} elt The element where the player is to be rendered.
 * @constructor
 */
function VideoPlayer(elt) {
	this.currentTrack=null;
	this.elt=elt;
	this.EMPTY=true;

	this.elt.innerHTML="";
	// Create Element Structure
	// Container Div
	var cont = document.createElement('div');
	cont.setAttribute('class','video_container');
	cont.setAttribute('id','video_container');
	this.container=cont;
	var topBar = document.createElement('div');
	topBar.setAttribute('class','video-top-bar');
	topBar.setAttribute('id','video-top-bar');
	var closeButton = document.createElement('div');
	closeButton.setAttribute('class','close-vid');
	closeButton.setAttribute('id','close-vid');
	var videoTitle = document.createElement('div');
	videoTitle.setAttribute('class','video-title');
	videoTitle.setAttribute('id','video-title');
	this.videoTitle=videoTitle;
	topBar.appendChild(closeButton);
	topBar.appendChild(videoTitle);
	var video = document.createElement('video');
	video.setAttribute('class','video');
	video.setAttribute('id','video');
	this.video=video;
	var videoControls = document.createElement('div');
	videoControls.setAttribute('class','video-controls');
	videoControls.setAttribute('id','video-controls');
	var playPause = document.createElement('div');
	playPause.setAttribute('class','play-pause');
	playPause.setAttribute('id','play-pause');
	this.playPause=playPause;
	var scrubBar = document.createElement('div');
	scrubBar.setAttribute('class','scrub-bar');
	scrubBar.setAttribute('id','scrub-bar');
	var loaded = document.createElement('div');
	loaded.setAttribute('class','loaded');
	loaded.setAttribute('id','loaded');
	var played = document.createElement('div');
	played.setAttribute('class','played');
	played.setAttribute('id','played');
	scrubBar.appendChild(loaded);
	scrubBar.appendChild(played);
	videoControls.appendChild(playPause);
	videoControls.appendChild(scrubBar);
	cont.appendChild(topBar);
	cont.appendChild(video);
	cont.appendChild(videoControls);
	this.elt.appendChild(cont);
}
/**
 * Sets the track to be viewed.
 * @param {Track} track The track that is viewed in the video player.
 */
VideoPlayer.prototype.setTrack=function(track) {
	this.currentTrack=track;
	if(video.canPlayType("video/webm")) this.video.src="http://s3.amazonaws.com/ramble/"+this.currentTrack.name+"/"+this.currentTrack.name+".webm";
	else if(video.canPlayType("video/mp4")) this.video.src="http://s3.amazonaws.com/ramble/"+this.currentTrack.name+"/"+this.currentTrack.name+".mp4";
	else video.innerHTML = 'Sorry, your browser does not support HTML5 Video. Please try using a compatible browser. We recommend <a href="http://chrome.google.com">Google Chrome</a>.';
	this.EMPTY=false;
};
/**
 * Removes the current track from the viewer, restoring an empty state.
 */
VideoPlayer.prototype.clearTrack=function() {
	this.currentTrack=null;
	this.video.src=null;
	this.container.style.display="none";
	this.EMPTY=true;
};
/**
 * Starts playing the video and the track.
 */
VideoPlayer.prototype.play=function() {
	if(!this.EMPTY) {
		this.video.play();
	}
};
/**
 * Pauses playback of the video and the track.
 */
VideoPlayer.prototype.pause=function() {
	if(!this.EMPTY) {
		this.video.pause();
	}
};
/**
 * Closes the video player on screen. Stops and resets playback if playing.
 */
VideoPlayer.prototype.close=function() {
	if(!this.EMPTY) {
		this.video.restart();
	}
};
/**
 * Opens the video player on screen.
 */
VideoPlayer.prototype.open=function() {

};
/**
 * Unmutes and Shows the video player.
 */
VideoPlayer.prototype.show=function() {

};
/**
 * Mutes and Hides the video player.
 */
VideoPlayer.prototype.hide=function() {

};
/**
 * Pauses playback of the video and seeks to the beginning of the video.
 */
VideoPlayer.prototype.restart=function() {
	if(!this.EMPTY) {
		this.video.currentTime=0;
		this.video.pause();
	}
};
/**
 * Move to a specific time in the video. The given time must be between 0 and the duration of the video.
 * @param {number} time A specific time in the video.
 */
VideoPlayer.prototype.jumpTo=function(time) {

};



