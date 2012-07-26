#!/usr/bin/python

import os
import sys


def js():
    os.system('rm -rf build/login.js build/app.js build/single.js')
    # Add Global Files
    print "Adding Global Files to both JS files..."
    js_command = "java -jar tools/closure.jar --warning_level QUIET"
    print("Adding modernizr...")
    js_command += " --js=client/js/libs/modernizr.js"
    print("Adding jQuery...")
    js_command += " --js=client/js/libs/jquery.js"
    print("Adding jQuery UI...")
    js_command += " --js=client/js/libs/jquery-ui.js"

    print "Generating Login JS File..."
    # Login Specific Files
    login_command = js_command
    print("Adding login.js...")
    login_command += " --js=client/js/login.js"
    print("Write to login.js...")
    login_command += " --js_output_file=build/login.js"
    os.system(login_command)
    print "Minifying build/login.js With YUI Compressor..."
    os.system("java -jar tools/yui.jar --type js build/login.js -o build/login.js")
    print "Generating Main App JS File..."
    # Main Specific Files
    app_command = js_command
    app_command += " --js=client/js/libs/richmarker.js"
    app_command += " --js=client/js/functions.js"
    app_command += " --js=client/js/track.js"
    app_command += " --js=client/js/player.js"
    app_command += " --js=client/js/map.js"
    app_command += " --js=client/js/friend.js"
    app_command += " --js=client/js/ramble.js"
    app_command += " --js_output_file=build/app.js"
    os.system(app_command)
    print "Minifying build/app.js With YUI Compressor..."
    os.system("java -jar tools/yui.jar --type js build/app.js -o build/app.js")
    print "Preparing One Off Viewer Script"
    single_command = js_command
    single_command += " --js=client/js/libs/richmarker.js"
    single_command += " --js=client/js/track.js"
    single_command += " --js=client/js/single.js"
    single_command += " --js_output_file=build/single.js"
    os.system(single_command)
    print "Minifying build/single.js With YUI Compressor..."
    os.system("java -jar tools/yui.jar build/single.js -o build/single.js")

    # os.system('rm -rf build/login.js build/app.js')
    # print "Generating Login JS File"
    # print "adding modernizr..."
    # os.system("java -jar tools/yui.jar --type js client/js/libs/modernizr.js | cat >> build/login.js")
    # print "adding jquery..."
    # os.system("java -jar tools/yui.jar --type js client/js/libs/jquery.js | cat >> build/login.js")
    # print "adding jquery-ui..."
    # os.system("java -jar tools/yui.jar --type js client/js/libs/jquery-ui.js | cat >> build/login.js")
    # print "adding richmarker-compiled..."
    # os.system("java -jar tools/yui.jar --type js client/js/libs/richmarker.js | cat >> build/login.js")
    # print "adding init..."
    # os.system("java -jar tools/yui.jar --type js client/js/login.js | cat >> build/login.js")

    # print "Generating Main App JS File"
    # print "adding modernizr..."
    # os.system("java -jar tools/yui.jar --type js client/js/libs/modernizr.js | cat >> build/login.js")
    # print "adding jquery..."
    # os.system("java -jar tools/yui.jar --type js client/js/libs/jquery.js | cat >> build/app.js")
    # print "adding jquery-ui..."
    # os.system("java -jar tools/yui.jar --type js client/js/libs/jquery-ui.js | cat >> build/app.js")
    # print "adding richmarker-compiled..."
    # os.system("java -jar tools/yui.jar --type js client/js/libs/richmarker.js | cat >> build/app.js")

    # print "adding track..."
    # # os.system("java -jar tools/yui.jar --type js client/js/track.js | cat >> build/app.js")
    # os.system("cat client/js/track.js >> build/app.js")
    # print "adding functions..."
    # # os.system("java -jar tools/yui.jar --type js client/js/functions.js | cat >> build/app.js")
    # os.system("cat client/js/functions.js >> build/app.js")
    # print "adding friend..."
    # # os.system("java -jar tools/yui.jar --type js client/js/friend.js | cat >> build/app.js")
    # os.system("cat client/js/friend.js >> build/app.js")
    # print "adding ramble..."
    # # os.system("java -jar tools/yui.jar --type js client/js/ramble.js | cat >> build/app.js")
    # os.system("cat client/js/ramble.js >> build/app.js")
    # #os.system("cat client/js/ramble.js >> build/app.js")
    # os.system("cp client/js/single.js build/single.js")


def css():
    print "Generating Master CSS File File..."
    # Compress CSS
    os.system("rm -rf build/style.css")
    os.system("java -jar tools/yui.jar client/css/jquery-ui.css | cat >> build/style.css")
    os.system("java -jar tools/yui.jar client/css/fonts.css | cat >> build/style.css")
    os.system("java -jar tools/yui.jar client/css/global.css | cat >> build/style.css")
    os.system("java -jar tools/yui.jar client/css/login.css | cat >> build/style.css")

    os.system("java -jar tools/yui.jar client/css/single.css -o build/single.css")


def images():
    # Copy Images Directory
    print "Copying Images..."
    os.system("rm -rf build/images/ build/fonts/")
    os.system("cp -r client/images build/images")
    os.system("cp -r client/fonts build/fonts")
    os.system("cp client/css/images/* build/images")
    # Optimizing Images
    print "Optimizing Images..."
    os.system("optipng -quiet -o5 build/images/*")


def doc():
    #Generate JS Documentation
    print "Generating JSDoc Files"
    os.system("rm -rf doc")
    os.system("mkdir doc")
    os.system("mkdir doc/js")
    #doc_command = "java -jar tools/jsdoc-tk/jsrun.jar tools/jsdoc-tk/app/run.js -a -t=tools/jsdoc-tk/templates/jsdoc -d=doc/js/ "
    # doc_command += "client/js/"
    doc_command = "jsduck --builtin-classes --categories=tools/jsduck/classes.json --welcome=tools/jsduck/js-doc.html --output doc/js client/js/*.js client/js/libs/richmarker.js"
    # doc_command = "yuidoc ."
    # doc_command += "client/js/ramble.js client/js/track.js client/js/friend.js "
    #os.system("tools/jsdoc/jsdoc client/js/ramble.js -d doc")
    os.system(doc_command)
    # os.system("panino --skin tools/panino/skins/goose --path client/js/ -o doc/")
    # print "Generating PHP Doc Files..."
    # os.system("doxygen Doxyfile")
    os.system("markdown tools/markdown/home.md > doc/index.html")


# Concatenate Local Scripts
# Write App Files to build/

print "Files will be built into build. This script requires:"
print "\tJava"
print "\tOptipng"
print "\tNode"
print "\tNPM"
print "\tYUIDocJS"

if (len(sys.argv) > 1):
    for command in sys.argv:
        if (command == "js"):
            js()
        elif (command == "css"):
            css()
        elif (command == "images"):
            images()
        elif (command == "doc"):
            doc()
        elif (command != sys.argv[0]):
            print "usage: ./build <js|css|images|doc|>(optional)"
else:
    js()
    css()
    images()
    doc()
