<div id="ramble-logo"></div>
<div id="login-button">
<div id="fb-login" class="fb-login-button"></div>
</div>

<div id="fb-root"></div>
<script>
	window.fbAsyncInit = function() {
		FB.init({
			appId: '<?php echo $facebook->getAppID() ?>',
			cookie: true,
			xfbml: true,
			oauth: true
		});
		FB.Event.subscribe('auth.login', function(response) {
			window.location.reload();
		});
		FB.Event.subscribe('auth.logout', function(response) {
			window.location.reload();
		});
	};
	(function() {
		var e = document.createElement('script'); e.async = true;
		e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
		document.getElementById('fb-root').appendChild(e);
	}());
</script>