/**
 * Ramble Web Application
 * @author Will Potter <will@strabogis.com>
 * @license ©2012 Strabo, LLC. All Rights Reserved.
 */



/**
 * A reference to the Video Element that is embedded on the page.
 * @type HTMLElement
 */
var video;
/**
 * A reference to the Google Map
 * @type google.maps.Map
 */
var map;
/**
 * The index of the current track in the tracks array.
 * @type number
 */
var cT;
/**
 * The index of the current point in the points array of the current track.
 * @type number
 */
var currentPoint;
/**
 * A reference to the marker of the current track.
 * @type google.maps.Marker
 */
var currentMarker;
/**
 * A reference to the path line of the current track.
 * @type google.maps.Polyline
 */
var route;
/**
 * A reference bounds of the map element.
 * @type google.maps.LatLngBounds
 */
var latLngBounds;
/**
 * An array of tracks to be displayed on the page.
 * @type Array
 */
var tracks;
/**
 * An array of a user's friends.
 * @type Array
 */
var friends;


/**
 * Initialize Dom Listeners For UI Elements
 */

function initListeners() {
	video = $('#video')[0];
	if (video.addEventListener) {
		video.addEventListener("timeupdate", followRoute, false);
	} else if (vid.attachEvent) {
		video.attachEvent("ontimeupdate", followRoute);
	}
	if (video.addEventListener) {
		video.addEventListener("ended", pause, false);
	} else if (vid.attachEvent) {
		video.attachEvent("ended", pause);
	}
	document.oncontextmenu = function(e) {
		return false;
	};
	$("ramble-logo-button").click(function(e) {
		showHomeSidebar();
	});
	$("ramble-user-button").click(function(e) {
		showUserSidebar(id);
	});
	$("ramble-friends-button").click(function(e) {
		showFriendSidebar();
	});
	$('#video_container').draggable({
		containment: "parent"
	});
	$('#video_container').resizable({
		containment: "parent",
		aspectRatio: true
	});
	$('video').dblclick(function() {
		if (this.paused === true) {
			play();
		} else {
			pause();
		}
	});
	$('#popup-close').click(function() {
		$('#popup').css('display', 'none');
	});
	$('#close-vid').click(function() {
		closeViewer();
	});
	$('#search').keypress(function(event) {
		if (event.which == 13) {
			pullSearchQuery(this.value);
		}
	});

}
/**
 * Initializes the map viewer. Calls getTrack on vidName.
 * @param {string} vidName The unique file identifier of a video
 */

function initViewer(vidName) {
	currentPoint = 0;
	document.getElementById('played').style.width = "0px";
	getTrack(vidName);
	$('#video_container').css("display", "block");

}
/**
 * Closes the viewer and pauses the video.
 *
 */

function closeViewer() {
	document.getElementById('video').pause();
	$('#play-pause').css("url('/build/images/play.png') center center no-repeat");
	$('.track').removeClass('selected');
	$('#video_container').css("display", "none");
	$('#video_container').css("height", "368px");
}
/**
 * Adds event listeners to the track elements in the sidebar. Must be called immediately after each new sidebar is generated.
 *
 */

function initSidebar() {
	$('.track').click(function() {
		cT = this.getAttribute('data-index');
		initViewer(tracks[cT].filename);
		var llb = new google.maps.LatLngBounds();
		for (var x in tracks[cT].points) {
			llb.extend(new google.maps.LatLng(tracks[cT].points[x].latitude, tracks[cT].points[x].longitude));
		}
		map.fitBounds(llb);
	});
}
/**
 * Draws the points of a track in the tracks array with a given index.
 * @param {number} idx Index of the track in the tracks array
 */
function plotTrack(idx) {
	// Set Points Array
	tracks[idx].routeCoords = [];
	for (var x in tracks[idx].points) {
		tracks[idx].routeCoords.push(new google.maps.LatLng(tracks[idx].points[x].latitude, tracks[idx].points[x].longitude));
	}
	latLngBounds.extend(new google.maps.LatLng(tracks[idx].points[0].latitude, tracks[idx].points[0].longitude));
	map.fitBounds(latLngBounds);
	tracks[idx].route = new google.maps.Polyline({
		path: tracks[idx].routeCoords,
		strokeColor: "rgb(48,157,230)",
		strokeOpacity: 0.73,
		strokeWeight: 5
	});
	tracks[idx].route.setMap(map);
	var deg = Math.round(tracks[idx].points[0].heading) - 90;
	tracks[idx].richMarker = new RichMarker({
		map: map,
		flat: true,
		position: new google.maps.LatLng(tracks[idx].points[0].latitude, tracks[idx].points[0].longitude),
		anchor: RichMarkerPosition.MIDDLE,
		content: '<div class="marker"><div id="' + tracks[idx].filename + '-marker" class="video-camera-marker" style="transform:rotate(' + deg + 'deg);-moz-transform:rotate(' + deg + 'deg);-webkit-transform:rotate(' + deg + 'deg);-o-transform:rotate(' + deg + 'deg);-ms-transform:rotate(' + deg + 'deg);" ><img src="/build/images/arrow.png" alt="" /></div><div class="tooltip"><img src="//graph.facebook.com/' + tracks[idx].user_id + '/picture" alt="" title="' + tracks[idx].name + '"/></div></div>'
	});
	tracks[idx].richMarker.setMap(map);
	google.maps.event.addListener(tracks[idx].richMarker, 'click', function() {
		cT = idx;
		initViewer(tracks[idx].filename);
		var llb = new google.maps.LatLngBounds();
		for (var x in tracks[idx].points) {
			llb.extend(new google.maps.LatLng(tracks[idx].points[x].latitude, tracks[idx].points[x].longitude));
		}
		map.fitBounds(llb);
	});
}
/**
 *
 * @param {string} vidName The unique file identifier of a video
 */

function getTrack(videoName) {
	if (tracks[cT].orientation === "vertical") {
		$('#video_container').height("368px");
		$('#video_container').width("250px");
		$('#video_container').removeClass('landscape');
	} else {
		$('#video_container').height("250px");
		$('#video_container').width("368px");
		$('#video_container').addClass('landscape');
	}
	if (video.canPlayType("video/webm")) video.src = "http://s3.amazonaws.com/ramble/" + videoName + "/" + videoName + ".webm";
	else if (video.canPlayType("video/mp4")) video.src = "http://s3.amazonaws.com/ramble/" + videoName + "/" + videoName + ".mp4";
	else video.innerHTML = "Sorry, your browser does not support HTML5 Video. Please try using a compatible browser. We recommend <a href=\"http://chrome.google.com\">Google Chrome</a>.";
	$('#video-title').html(tracks[cT].name);
	$('#play-pause').click(function() {
		if (video.paused === true) {
			play();
		} else {
			pause();
		}
	});
	$('#scrub-bar').click(function(event) {
		var x = event.pageX - $(this).offset().left;
		var percentDone = x / $(this).width();
		$('#played').width((percentDone * 100) + "%");
		video.currentTime = percentDone * video.duration;
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
		tracks[cT].richMarker.setPosition(new google.maps.LatLng(tracks[cT].points[accuratePoint].latitude, tracks[cT].points[accuratePoint].longitude));
		currentPoint = accuratePoint;
	});
}
/**
 * Simple abstraction method that plays the video from the current position.
 */

function play() {
	document.getElementById('video').play();
	$('#play-pause').css("background", "url('/build/images/pause.png') center center no-repeat");
}
/**
 * Pauses the video and track playback without losing the current position in playback.
 */

function pause() {
	document.getElementById('video').pause();
	$('#play-pause').css("background", "url('/build/images/play.png') center center no-repeat");
}
/**
 * Will reset the given track to its first point.
 * @param {string} vidName The unique file identifier of a video
 */

function reset(vidName) {
	getTrack(vidName);
}

/**
 * Main Method that is called ontimeupdate. This determines if the video is finished playing or is still playing. If finished, this will set the video to pause() mode.
 * If the video is still playing, it will update the Scrub Bar, Marker Position as well as Marker Rotation.
 */

function followRoute() {
	var percentDone = 1;
	var pointTime;
	var currentTime = video.currentTime;
	if (currentTime >= video.duration) { // If video is done.
		currentPoint = 0;
		$('#played').width((percentDone * 100) + "%");
		$('#play-pause').css("background", "url('/build/images/play.png') center center no-repeat");
		video.pause();
	} else {
		percentDone = video.currentTime / video.duration;
		if (currentPoint >= tracks[cT].points.length) currentPoint = tracks[cT].points.length - 1;
		pointTime = tracks[cT].points[currentPoint].timestamp;
		if (currentTime > pointTime) {
			currentPoint++;
			var deg = Math.round(tracks[cT].points[currentPoint].heading) - 90;
			tracks[cT].richMarker.setPosition(new google.maps.LatLng(tracks[cT].points[currentPoint].latitude, tracks[cT].points[currentPoint].longitude));
			domRotate($('#' + tracks[cT].filename + '-marker')[0], deg);
		}
		if (document.getElementById('video_container').style.width === "") document.getElementById('video_container').style.width = "250px";
		$('#played').width((percentDone * 100) + "%");
	}
}
/**
 * Moves a track and its markers back to its initial points. (Not in use)
 * @param {Track} trk A track that should be reset on the map. Moves the marker as well as rotating the marker back to its original position.
 */

function resetTrack(trk) {
	var deg = Math.round(aTrack.points[0].heading) - 90;
	trk.richMarker.setPosition(new google.maps.LatLng(aTrack.points[0].latitude, aTrack.points[0].longitude));
	domRotate($('#' + tracks[cT].filename + '-marker')[0], deg);
}

/**
 * Removes any delete menus that are showing on the sidebar.
 *
 */
function removeMenus() {
	$('.delete-button').remove();
}
/**
 * Queries the server to pull the videos that a user has uploaded from the database. Then parses the response.
 * @param {number} id A user's facebook id.
 */

function showUserSidebar(id) {
	removeMenus();
	clearMap();
	document.getElementById('sidebar-videos').innerHTML = "";
	$("#sidebar-videos").addClass('loading');
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "/api/index.php?user_sidebar&id=" + id);
	ajax.onreadystatechange = function(oEvent) {
		if (ajax.readyState === 4) {
			if (ajax.status === 200) {
				parseResponse(ajax.responseText);
				$("#sidebar-videos").removeClass('loading');
				initSidebar();
				fillMap();
			} else {
				console.log("Error", ajax.statusText);
			}
		}
	};
	ajax.send(null);
}
/**
 * Searches the friends array for a given query.
 * @param {string} query A search query for a name
 */

function pullSearchQuery(query) {
	var results = [];
	$('.delete-button').remove();
	$("#sidebar-videos").html(null);
	$("#sidebar-videos").addClass('loading');
	var re = new RegExp("[A-Z\ ]*" + query + "[A-Z\ ]*", "gi");
	for (var x in friends) {
		if (friends[x].name.match(re) !== null) results.push(friends[x]);
		else if (friends[x].first_name.match(re) !== null) results.push(friends[x]);
		else if (friends[x].last_name.match(re) !== null) results.push(friends[x]);
	}
	//TODO: Turn into DOM Elements rather than appending a string.
	var html = '<div class="sub-heading">Search Results</div><div id="videos-section">';
	for (x in results) {
		html += '<div class="list-item user" onclick="showUserSidebar(' + results[x].id + ')" data-name="' + results[x].id + '">';
		html += '<div class="user-image image"><img src="//graph.facebook.com/' + results[x].id + '/picture" height="43" alt="" title="' + results[x].name + '"/></div>';
		html += '<div class="user-name name">' + results[x].name + '</div></div>';
	}
	html += '</div>';

	$('#sidebar-videos').html(html);
	$("#sidebar-videos").removeClass('loading');
}
/**
 * Shows a list of a user's friends in the sidebar.
 */

function showFriendSidebar() {
	$('.delete-button').remove();
	var html = '<div class="sub-heading">Friends List</div><div id="videos-section">';
	for (var x in friends) {

		html += '<div class="list-item user" onclick="showUserSidebar(' + friends[x].id + ')" data-name="' + friends[x].id + '">';
		html += '<div class="user-image image"><img src="//graph.facebook.com/' + friends[x].id + '/picture" height="43" alt="" title="' + friends[x].name + '"/></div>';
		html += '<div class="user-name name">' + friends[x].name + '</div></div>';
	}
	html += '</div>';
	$('#sidebar-videos').html(html);
}
/**
 * Pulls the Home sidebar with the most recent videos
 *
 */

function showHomeSidebar() {
	$('.delete-button').remove();
	clearMap();
	$("#sidebar-videos").html(null);
	$("#sidebar-videos").addClass('loading');
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "/api/index.php?go_home");
	ajax.onreadystatechange = function(oEvent) {
		if (ajax.readyState === 4) {
			if (ajax.status === 200) {
				parseResponse(ajax.responseText);
				$("#sidebar-videos").removeClass('loading');
				initSidebar();
				fillMap();
			} else {
				console.log("Error", ajax.statusText);
			}
		}
	};
	ajax.send(null);
}
/**
 * Sends a request to the server to delete a track and then pulls a new, updated sidebar.
 * TODO: Optimize to avoid the need to wait for a response.
 *
 */

function deleteTrack(filename) {
	$('.delete-button').remove();
	$("#sidebar-videos").html(null);
	$("#sidebar-videos").addClass('loading');
	closeViewer();
	clearMap();
	var fd = new FormData();
	fd.append('filename', filename);
	var ajax = new XMLHttpRequest();
	ajax.open("POST", "/api/index.php?delete_video");
	ajax.onreadystatechange = function(oEvent) {
		if (ajax.readyState === 4) {
			if (ajax.status === 200) {
				parseResponse(ajax.responseText);
				$("#sidebar-videos").removeClass('loading');
				initSidebar();
				fillMap();

			} else {
				console.log("Error", ajax.statusText);
			}
		}
	};
	ajax.send(fd);
}

/**
 * Removes all markers and routes from the map. It pulls the markers and routes from
 * the tracks array.
 */

function clearMap() {
	closeViewer();
	for (var x in tracks) {
		tracks[x].richMarker.setMap(null);
		tracks[x].route.setMap(null);
	}
}
/**
 * Draw all tracks in the tracks array on the map. Additionally, this sets the frames the map according to the
 * tracks that are visible on the map.
 */

function fillMap() {
	map.setZoom(15);
	latLngBounds = new google.maps.LatLngBounds();
	for (var x in tracks) {
		plotTrack(x);
	}
}
/**
 * Simply shows all tracks in the tracks array (markers and routes).
 */

function reFillMap() {
	for (var x in tracks) {
		tracks[x].richMarker.setMap(map);
		tracks[x].route.setMap(map);
	}
}
/**
 * Parses the response that comes from the server when requesting track and friend information.
 * @param {Object} response A response from the server
 */

function parseResponse(response) {
	response = JSON.parse(response);
	var a;
	if (response.errors === "false") {
		tracks = [], friends = [];
		for (var x in response.tracks) {
			tracks.push(new RambleTrack(response.tracks[x]));
		}
		for (x in response.friends) {
			friends.push(new RambleFriend(response.friends[x]));
		}
		var heading = document.createElement("h3");

		if (response.is_user === true) {
			heading.setAttribute('class', 'sub-heading person-sub-heading');
			heading.innerHTML = '<img class="right" src="//graph.facebook.com/' + response.user_id + '/picture" alt="' + response.name + '" title="' + response.name + '" /><div class="person-name">' + response.name + '</div><div class="clear"></div>';
		} else {
			heading.setAttribute('class', 'sub-heading');
			heading.innerHTML = 'Recent Videos';
		}
		var videoSection = document.createElement('div');
		videoSection.setAttribute('id', 'videos-section');
		videoSection.setAttribute('class', 'section');
		var v, img, tname, user, tvid;

		for (var i in response.tracks) {
			v = document.createElement('div');
			v.setAttribute('class', 'list-item track');
			v.setAttribute('data-name', response.tracks[i].filename);
			v.setAttribute('data-index', i);
			if (response.tracks[i].user_id === id) {

				var del = document.createElement('div');
				del.setAttribute('class', 'delete-button');
				del.innerHTML = "Delete Track";
				del.setAttribute('id', 'delete-' + response.tracks[i].filename);
				del.setAttribute('data-delete', response.tracks[i].filename);
				document.body.appendChild(del);
				v.oncontextmenu = function(e) {
					console.log("Context Menu");
					var ab = document.getElementById('delete-' + this.getAttribute('data-name'));
					ab.setAttribute('class', 'delete-button showing');
					ab.style.top = e.y + "px";
					ab.style.left = e.x + "px";
					ab.onclick = function() {
						ab.setAttribute('class', 'delete-button');
						deleteTrack(ab.getAttribute('data-delete'));
						console.log("Deleting " + ab.getAttribute('data-delete'));
					};
					document.onclick = function() {
						$('.delete-button').removeClass('showing');
						document.onclick = null;
					};
					ab.onmouseout = function() {
						ab.setAttribute('class', 'delete-button');
					};
					return false;
				};
			} else {
				v.oncontextmenu = function(e) {
					return false;
				};
			}

			img = document.createElement('div');
			img.setAttribute('class', 'track-picture image');
			img.innerHTML = '<img src="//s3.amazonaws.com/ramble/' + response.tracks[i].filename + '/' + response.tracks[i].filename + '.png" height="48" width="36"/>';
			v.appendChild(img);
			tname = document.createElement('div');
			tname.setAttribute('class', 'track-name name');
			tname.innerHTML = response.tracks[i].name;
			v.appendChild(tname);
			user = document.createElement('div');
			user.setAttribute('class', 'track-author user');
			user.setAttribute('data-user-id', response.tracks[i].user_id);
			user.innerHTML = response.tracks[i].user_name;
			v.appendChild(user);
			videoSection.appendChild(v);
		}
		$('#sidebar-videos')[0].appendChild(heading);
		$('#sidebar-videos')[0].appendChild(videoSection);
	}
}
/**
 * Main Method
 *
 */
$(document).ready(function() {
	showHomeSidebar();
	initListeners();

	// Default Lat/Lng Coordinates
	var lat = 44.00858496025453,
		lng = 286.8300942840576;
	map = new google.maps.Map($("#map")[0], {
		center: new google.maps.LatLng(lat, lng),
		zoom: 15,
		overviewMapControl: false,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	});
	latLngBounds = new google.maps.LatLngBounds();
	for (var x in tracks) {
		plotTrack(x);
	}

	initSidebar();
});
