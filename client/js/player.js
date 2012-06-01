/**
 * Ramble Web Application
 * @author Will Potter <will@strabogis.com>
 * @license ©2012 Strabo,  LLC. All Rights Reserved.
 */



/**
 * Creates an Instance of the Video Player
 * @param {Element} element A DOM Element that is to be created into a player.
 * @param {RambleMap} map The {@link RambleMap} that the player should draw on.
 * @constructor
 */

function RamblePlayer(element, map) {
	/**
	 * The track data for the video playing.
	 * @type Track
	 * @default Null
	 */
	this.playingTrack = null;
	/**
	 * The DOM Element for the Video Container
	 * @type Element
	 */
	this.container = element;
	/**
	 * A reference to the initialized RambleMap instance.
	 * @type RambleMap
	 */
	this.map = map

	this.currentPoint=0;
}
RamblePlayer.prototype.buildDOM = function() {
	this.element.addClassName('video_container');
	var topBar = document.createElement('div');
	topBar.setAttribute('id', 'video-top-bar');
	topBar.setAttribute('class', 'ramble-video-top-bar');
	this.closeVid = document.createElement('div');
	this.closeVid.setAttribute('id', 'close-vid');
	this.closeVid.setAttribute('class', 'ramble-close-vid');
	this.videoTitle = document.createElement('div');
	this.videoTitle.setAttribute('id', 'video-title');
	this.videoTitle.setAttribute('class', 'ramble-video-title');
	topBar.appendChild(this.closeVid);
	topBar.appendChild(this.videoTitle);
	this.container.appendChild(topBar);
	this.video = document.createElement('video');
	this.video.setAttribute('id', 'video');
	this.video.setAttribute('class', 'video');
	this.container.appendChild(this.video);
	var videoControls = document.createElement('div');
	videoControls.setAttribute('id', 'video-controls');
	videoControls.setAttribute('class', 'ramble-video-controls');
	this.playPause = document.createElement('div');
	this.playPause.setAttribute('id', 'play-pause');
	this.playPause.setAttribute('class', 'ramble-play-pause');
	videoControls.appendChild(playPause);
	this.scrubBar = document.createElement('div');
	this.scrubBar.setAttribute('id', 'scrub-bar');
	this.scrubBar.setAttribute('class', 'ramble-scrub-bar');
	this.played = document.createElement('div');
	this.played.setAttribute('id', 'played');
	this.played.setAttribute('class', 'ramble-played');
	this.scrubBar.appendChild(this.played);
	videoControls.appendChild(this.scrubBar);
	this.container.appendChild(videoControls);
};
/**
 * Plays the Video and Follow's the Route
 */
RamblePlayer.prototype.play = function() {
	this.video.play();
};
/**
 * Pauses the video.
 */
RamblePlayer.prototype.pause = function() {
	this.video.pause();
};
/**
 * Stops the video and jumps to the beginning. {@link this.video.currentTime}=0.
 */
RamblePlayer.prototype.reset = function() {
	this.video.pause();
	this.video.currentTime = 0;
	this.currentPoint=0;
};
/**
 * Returns the current time of the video.
 * @returns {Number} time The current time of the Video
 */
RamblePlayer.prototype.getTime = function() {
	return this.video.currentTime;
};
/**
 * Sets thte Video's Time to a specified number.
 * @param {Number} time The desired time of the video.
 */
RamblePlayer.prototype.setTime = function(time) {
	if (time > this.video.duration || time < 0) console.error("Invalid Time Specified. The desired input time must fall within the valid range of the video.");
	else this.video.currentTime = time;
};
/**
 * Hides the viewer and pauses the video.
 */
RamblePlayer.prototype.close = function() {
	this.pause();
	$(this.playPause).css("url('/build/images/play.png') center center no-repeat");
	$('.track').removeClass('selected');
	$(this.element).css("display", "none");
	$(this.element).css("height", "368px");
};
RamblePlayer.prototype.setTrack = function(track) {
	this.track = track;
	if (this.track.orientation === "vertical") {
		$(this.element).height("368px");
		$(this.element).width("250px");
		$(this.element).removeClass('landscape');
	} else {
		$(this.element).height("250px");
		$(this.element).width("368px");
		$(this.element).addClass('landscape');
	}
	if (this.video.canPlayType("video/webm")) video.src = "http://s3.amazonaws.com/ramble/" + videoName + "/" + videoName + ".webm";
	else if (this.video.canPlayType("video/mp4")) video.src = "http://s3.amazonaws.com/ramble/" + videoName + "/" + videoName + ".mp4";
	else this.video.innerHTML = 'Sorry, your browser does not support HTML5 Video. Please try using a compatible browser. We recommend <a href=\"http://chrome.google.com\">Google Chrome</a>.';
	$(this.videoTitle).html(this.track.name);
	$(this.playPause).click(function() {
		if (this.video.paused === true) {
			this.play();
			console.log(this);
			$(this.playPause).css("url('build/images/pause.png') center center no-repeat");
		} else {
			this.pause();
			console.log(this);
			$(this.playPause).css("url('build/images/play.png') center center no-repeat");
		}
	});
	$(this.scrubBar).click(function(event) {
		var x = event.pageX - $(this).offset().left;
		var percentDone = x / $(this).width();
		$(this.played).width((percentDone * 100) + "%");
		this.video.currentTime = percentDone * this.video.duration;
		var accuratePoint = 0;
		a = 10;
		var l = 10;
		for (x in tracks[cT].points) {
			a = Math.abs(tracks[cT].points[x].timestamp - (percentDone * video.duration));
			if (a < l) {
				l = a;
				accuratePoint = x;
			}
		}
		this.track.richMarker.setPosition(new google.maps.LatLng(this.track.points[accuratePoint].latitude, this.track.points[accuratePoint].longitude));
		this.currentPoint = accuratePoint;
	});
};
