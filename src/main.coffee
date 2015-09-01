gruntFiles = process.argv[2..]
if gruntFiles.length is 0
    usage
else
    checkModuleNameError = (error) ->
        moduleNameRegex = /Cannot find module '(.*)'/i
        moduleName = moduleNameRegex.exec error.message
        # TODO