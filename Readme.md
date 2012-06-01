#Ramble by Strabo
##Web Application
Author: [Will Potter](mailto:will@strabogis.com)


### Site Structure	
View site at [rambl.it](http://rambl.it/)

* `/api` => Handles all AJAX Web App Requests
* `/app` => Stores Primary Server-Side Code and Important Config/Functions
	* `/facebook` => Stores the PHP Facebook SDK.
	* `/functions` => Stores the functions that get run.
	* `/library.php` => Master Library File that controls a majority of the backend code. Must be included on all pages.
	* `/libs` => Stores other PHP 3rd Party Libraries.
	* `/models` => Stores code relating to database objects.
	* `/views` => Stores the html/php views that get displayed on the page.
* `/build` => Stores Generated Client Side Code (JS, CSS)
* `/client` => Holds Client Side Source Code
* `/db` => Stores related Database files. **Note** This is not ever executed, it is merely for documentation purposes.
* `/doc` => Stores Generated Documentation from ./make
* `/index.php` => Primary PHP Script
* `/mobileapi` => Handles all Mobile Application Requests
* `/tmp` => Temporary Folder to Handle All Uploads. Files are deleted/moved from this folder when they are done with.

* 
### TODO
* Start refining the Javascript files to make it more object oriented.


###Build & Install
1. Clone Repository
1. Run the below command to build the site.
	./make
1. Upload the app, api, build and mobileapi folders to the server. Also upload 404.html, index.php.	


 &copy; 2012, Strabo LLC. All rights reserved.
