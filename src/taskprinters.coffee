# require gulplike
taskPrinters =
    jshint: () ->
        pipe "jshint()"
        pipe "jshint.reporter('default')"

    uglify: (task) ->
        pipe "rename('all.min.js')"
        pipe "uglify()"
        dest path.dirname(task.dest)

    concat: (task) ->
        pipe "concat('all.js')"
        dest path.dirname(task.dest)

    wiredep: (task) ->
        pipe "wiredep()"
        dest path.dirname(task.dest)

    filerev: (task) ->
        # TODO
