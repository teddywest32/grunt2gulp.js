# require utils
# require gulplike
# require taskprinters
class GruntConverter
    constructor: () ->
        @tasks = []
        @taskNames = []
        @definitions = []
        @requires = ["rename"]
        @gulpExcludedPackages = ["grunt-contrib-watch"]
        @log = {}
        @file =
            readJSON: () ->

    processGruntTask: (taskName, src, dest) ->
        tasks = []
        for own file, module of src
            gulpTask =
                name: taskName
                src: module
            if dest isnt "files"
                gulpTask.dest = dest
            # check for duplicate gulp task names
            if taskNames.indexOf gulpTask.name isnt -1
                gulpTask._isDuplicate = true
            else
                taskNames.push gulpTask.name
            tasks.push gulpTask
        tasks

    initConfig = (config) ->
        processGruntConfig name, task for own name, task of config

    loadNpmTasks = (npmPackageName) ->
        contains = (s) ->
            npmPackageName.indexOf(s) is 0
        slices = (s) ->
            npmPackageName.slice(s.length)
        if @gulpExcludedPackages.indexOf(npmPackageName) is 0
        else if contains 'grunt-contrib-'
            requires.push slices('grunt-contrib-')
        else if contains 'grunt-'
            requires.push slices('grunt-')
        else
            requires.push npmPackageName

    registerTask: (name, dependencies, body) ->
        task =
            name: name
            dependencies: dependencies
            body: body
        tasks.push task

lintGruntFile = (gruntFilename) ->
    data = fs.readFileSync gruntFilename, 'utf-8'
    requireTimerRegex = /require.*(time-grunt|grunt-timer).*/
    requireTimer = requireTimerRegex.exec data
    if requireTimer
        console.log "Please remove \"#{requireTimer[1]\" from the Gruntfile"
        process.exit 10

convertGruntFile = (filename) ->
    module = require(filename)
    converter = new GruntConverter
    module(converter)
    converter.print
