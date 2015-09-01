# require utils
pipe = (str) ->
    out "    .pipe(" + str + ")"

dest = (str) ->
    pipe "gulp.dest('" + str + "')"

# Prints out the gulp versions of the grunt tasks
printDefinition = (definition) ->
    out "var " + definition.name + " = " + definition.value + ";"

# Prints out a require statement for a gulp module. Prefixes the
# module name with 'gulp'.
printRequire = (moduleName) ->
    name = if moduleName is 'gulp' then moduleName else 'gulp-' + moduleName
    out "var " + camelCase(moduleName) + " = require('" + name + "');"
