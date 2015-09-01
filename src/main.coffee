checkModuleNameError = (error) ->
        logAndExit = (code, message) ->
            console.log "#{message}: #{moduleName[1]}"
            process.exit code
        switch
            when moduleName[1].indexOf('./') isnt -1
                logAndExit 2, "Please move any files imported with a relative path into the same directory as the Gruntfile"
            when moduleName[1].indexOf('.json') isnt -1
                logAndExit 3, "Please create this JSON file"
            else
                logAndExit 4, "Please install this module"

gruntFiles = process.argv[2..]
if gruntFiles.length is 0
    usage
    process.exit 0
try
    lintAndConvert = (file) ->
        lintGruntFile file
        convertGruntFile file
    lintAndConvert file for file in gruntFiles
catch error
    moduleNameRegex = /Cannot find module '(.*)'/i
    moduleName = moduleNameRegex.exec error.message
    if moduleName
        checkModuleNameError error
    else
        throw error
