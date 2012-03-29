#Ramble by Strabo
##Web Application
Author: [Will Potter](mailto:will@strabogis.com)


### Site Structure	
View site at [ramble.strabogis.com](http://ramble.strabogis.com)

* `/api` => Handles all AJAX Web App Requests
* `/app` => Stores principle application files
 	* `/assets` => Stores all static assets, like Images, CSS and Javascript.
	* `/facebook` => Stores the PHP Facebook SDK.
	* `/functions` => Stores the functions that get run.
	* `/library.php` => Master Library File that controls a majority of the backend code. Must be included on all pages.
	* `/libs` => Stores other PHP 3rd Party Libraries.
	* `/models` => Stores code relating to database objects.
	* `/views` => Stores the html/php views that get displayed on the page.
* `/db` => Stores related Database files. **Note** This is not ever executed, it is merely for documentation purposes.
* `/index.php` => Primary PHP Script
* `/mobileapi` => Handles all Mobile Application Requests
* `/tmp` => Temporary Folder to Handle All Uploads. Files are deleted/moved from this folder when they are done with.

### TODO
* Start refining the Javascript files to make it more object oriented.




 &copy; 2012, Strabo LLC. All rights reserved.
