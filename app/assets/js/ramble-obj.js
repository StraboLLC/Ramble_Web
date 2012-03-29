function Track(filename,json,map) {
	this.filename=filename;
	this.points=json.track.track.points;
	this.map=map;
	this.strokeColor="rgb(48,157,230)";
	this.strokeOpacity=0.73;
	this.strokeWeight=5;
	this.currentPoint=0;
}
Track.prototype.initialize = function() {

	this.points=tracks[idx].track.track.points;
	this.routeCoords = [];
	var llb = new google.maps.LatLngBounds();
	for(var x in this.points) {
		this.routeCoords.push(new google.maps.LatLng(this.points[x].latitude,this.points[x].longitude));
	}
	llb.extend(new google.maps.LatLng(this.points[0].latitude,this.points[0].longitude));
	this.map.fitBounds(llb);
	this.currentRoute = new google.maps.Polyline({
		path: this.routeCoords,
		strokeColor: this.strokeColor,
		strokeOpacity: this.strokeOpacity,
		strokeWeight: this.strokeWeight
	});
	this.currentRoute.setMap(this.map);
	var deg = Math.round(this.points[0].heading)-90;
	this.richMarker = new RichMarker({
		map: this.map,
		flat: true,
		position: new google.maps.LatLng(this.points[0].latitude,this.points[0].longitude),
		anchor: RichMarkerPosition.MIDDLE,
		content: '<div class="marker"><div id="'+idx+'-marker" class="video-camera-marker" style="transform:rotate('+deg+'deg);-moz-transform:rotate('+deg+'deg);-webkit-transform:rotate('+deg+'deg);-o-transform:rotate('+deg+'deg);-ms-transform:rotate('+deg+'deg);" ><img src="/app/assets/images/arrow.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/'+tracks[idx].user_id+'/picture" alt="" title="'+tracks[idx].name+'"/></div></div>'
	});
	this.richMarker.setMap(this.map);
	google.maps.event.addListener(this.richMarker, 'click', function() {
		cT = idx;
		initViewer(tracks[idx].filename);
		var llb = new google.maps.LatLngBounds();
		for(var x in tracks[idx].points) {
			llb.extend(new google.maps.LatLng(tracks[idx].points[x].latitude,tracks[idx].points[x].longitude));
		}
		map.fitBounds(llb);
	});
};
Track.prototype.initViewer = function(video_element) {
	$('#scrub-bar').currentTrack=this;
	video_element.currentTrack=this;
	currentPoint=0;
	document.getElementById('video_container').style.height="368px";
	document.getElementById('played').style.width="0px";
	if(video_element.canPlayType("video/webm")) video.src="http://s3.amazonaws.com/ramble/"+this.filename+"/"+this.filename+".webm";
	else if(video_element.canPlayType("video/mp4")) video.src="http://s3.amazonaws.com/ramble/"+this.filename+"/"+this.filename+".mp4";
	else video_element.innerHTML = "Sorry, your browser does not support HTML5 Video. Please try using a compatible browser. We recommend <a href=\"http://chrome.google.com\">Google Chrome</a>.";
	document.getElementById('video-title').innerHTML = tracks[cT].name;
	//video_element.currentTime=0;
	document.getElementById('play-pause').onclick = function() {
		if(video_element.paused===true) {
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
		for(var x in this.currentTrack.points) {
			a=Math.abs( this.currentTrack.points[x].timestamp-(percentDone*video.duration));
			//console.log(a);
			if(a<l){l=a;accuratePoint=x;}
		}

		tracks[cT].richMarker.setPosition(new google.maps.LatLng(this.currentTrack.points[accuratePoint].latitude,this.currentTrack.points[accuratePoint].longitude));
		currentPoint=accuratePoint;
	});
	document.getElementById('video_container').style.display="block";


};