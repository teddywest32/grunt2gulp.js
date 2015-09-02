path = require 'path'
fs = require 'fs'

# Whether or not debug mode is on
DEBUG = true;

# Whether or not to be extra verbose in logging messages
VERBOSE = true;

# Displays how to use the tool
usage = () ->
    console.log 'grunt2gulp: converts Gruntfile.js to Gulp file, prints to stdout'
    console.log 'Usage: ' + process.argv[0] + ' <gruntfiles...>'

###*
* Displays a message if the debug flag is on
*
* @param {String} str The message to print
* @see [DEBUG]{@link module:grunt2gulp~DEBUG}
###
debug = (str) ->
    console.error "DEBUG:", str if DEBUG

###*
* Displays a message if the verbose flag is on
*
* @param {String} str The message to print
* @see [VERBOSE]{@link module:grunt2gulp~DEBUG}
###
verbose = (str) ->
    console.log("/*", str, "*/") if VERBOSE

###*
* Displays a message, if the parameter is undefined displays an empty
* string.
*
* @param {String} str The message to print
###
out = (str) ->
    if str is undefined
        console.log ''
    else
        console.log str

###*
* Given a string with hyphens (-), return a camel cased string
* e.g. quick-brown-fox returns quickBrownFox
*
* @param {String} input the string to camel case
* @return camel-cased string
###
camelCase = (input) ->
    input.toLowerCase().replace /-(.)/g, (match, group1) ->
        group1.toUpperCase()
