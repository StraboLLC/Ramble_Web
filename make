#!/usr/bin/python

import os
import sys


def clean():
	print "Removing old files"
	os.system('rm -rf build/login.js build/app.js build/style.css build/doc build/images/ build/fonts/ doc')
	
def js():
	print "Generating Login JS File" 

	# Login Screen
	os.system("uglifyjs client/js/libs/modernizr.js | cat >> build/login.js") 
	os.system("uglifyjs client/js/libs/jquery.js | cat >> build/login.js") 
	os.system("uglifyjs client/js/libs/jquery-ui.js | cat >> build/login.js") 
	os.system("uglifyjs client/js/libs/richmarker-compiled.js | cat >> build/login.js") 
	os.system("uglifyjs client/js/init.js | cat >> build/login.js") 

	print "Generating Main App JS File" 

	# Main App File
	os.system("uglifyjs client/js/libs/modernizr.js | cat >> build/login.js") 
	os.system("uglifyjs client/js/libs/jquery.js | cat >> build/app.js") 
	os.system("uglifyjs client/js/libs/jquery-ui.js | cat >> build/app.js")
	os.system("uglifyjs client/js/libs/richmarker-compiled.js | cat >> build/app.js") 

	#os.system("uglifyjs client/js/ramble.js | cat >> build/app.js")
	os.system("cat client/js/ramble.js >> build/app.js")	


def css():
	print "Generating Master CSS File File" 
	# Compress CSS
	os.system("java -jar tools/yui.jar --type css client/css/jquery-ui.css | cat >> build/style.css")
	os.system("java -jar tools/yui.jar --type css client/css/fonts.css | cat >> build/style.css")
	os.system("java -jar tools/yui.jar --type css client/css/global.css | cat >> build/style.css")
	os.system("java -jar tools/yui.jar --type css client/css/login.css | cat >> build/style.css")


def images():
	# Copy Images Directory
	print "Copying Images"
	os.system("cp -r client/images build/images")
	os.system("cp -r client/fonts build/fonts")
	os.system("cp client/css/images/* build/images")
	# Optimizing Images
	print "Optimzing Images"
	os.system("optipng -quiet -o5 build/images/*")

def doc():
	#Generate JS Documentation
	print "Generating JSDoc Files" 
	os.system("tools/jsdoc/jsdoc client/js/ramble.js -d doc")

# Concatenate Local Scripts
# Write App Files to build/
print "Files will be built into build/. This script requires:"
print "\tuglifyjs"
print "\tJava"
print "\tOptipng\n"

if (len(sys.argv)>1):
	for command in sys.argv:
		if (command=="clean"):
			clean()
		elif (command=="js"):
			js()
		elif (command=="css"):
			css()
		elif (command=="images"):
			images()
		elif (command=="doc"):
			doc()
		elif (command!=sys.argv[0]):
			print "usage: ./build <clean|js|css|images|doc|>(optional)"
else:
	clean()
	js()
	css()
	images()
	doc()

