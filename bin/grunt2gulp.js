#!/usr/bin/env node

'use strict';

var path = require('path');
var DEBUG = true;
var VERBOSE = false;

function usage() {
  console.log('grunt2gulp: converts Gruntfile.js to Gulp file, prints to stdout');
  console.log('Usage: ' + process.argv[0] + ' <gruntfiles...>');
}

// Output functions
function debug(str) {
  if (DEBUG) {
    console.error("/* DEBUG:", str, "*/");
  }
}

function verbose(str) {
  if (VERBOSE) {
    console.log("/*", str, "*/");
  }
}

function out(str) {
  console.log(str === undefined ? '' : str);
}

// Class for converting grunt files to gulp
function gruntConverter() {
  var tasks = [], taskNames = [],
  definitions = [
  ],
  requires = [
    'rename'
  ],
  gulpExcludedPackages = [
    'grunt-contrib-watch'
  ],
  taskPrinters = Object.create(null);

  // output functions
  function pipe(str) {
    out("    .pipe(" + str + ")");
  }

  function dest(str) {
    pipe("gulp.dest('" + str + "')");
  }

  // task-specific printers
  taskPrinters['jshint'] = function (task) {
    pipe("jshint()");
    pipe("jshint.reporter('default')");
  }

  taskPrinters['uglify'] = function (task) {
    pipe("rename('all.min.js')");
    pipe("uglify()");
    dest(path.dirname(task.dest));
  }

  taskPrinters['concat'] = function (task) {
    pipe("concat('all.js')");
    dest(path.dirname(task.dest));
  }

  // Processing grunt tasks
  function processGruntTask(taskName, src, dest) {
    var file, gulpTask;
    for (file in src) {
      gulpTask = Object.create(null);
      gulpTask.name = taskName;
      gulpTask.src = src[file];
      if (dest !== 'files') {
        gulpTask.dest = dest;
      }

      // check for duplicate gulp task names
      if (taskNames.indexOf(gulpTask.name) !== -1) {
        gulpTask._isDuplicate = true;
      } else {
        taskNames.push(gulpTask.name);
      }

      tasks.push(gulpTask);
    }
  }

  function processGruntConfig(taskName, options) {
    var key, option, gulpTask, src, dest;
    if (typeof options === 'object') {
      for (option in options) {
        if (option === 'options') {
          continue;
        } else {
          src = undefined;
          dest = undefined;
          if ('src' in options[option]) {
            if (typeof options[option].src === 'string') {
              src = [options[option].src];
            } else {
              src = options[option].src;
            }
            dest = options[option].dest;
          } else if ('files' in options[option]) {
            if (typeof options[option].files === 'string') {
              src = [options[option].files];
            } else {
              src = [];
              dest = [];
              for (key in options[option].files) {
                src.push(options[option].files[key]);
                dest.push(key);
              }
            }
          } else {
            // option is the destination path
            // options[option] is the list of source files
            src = [options[option]];
            dest = option;
          }
          processGruntTask(taskName, src, dest);
        }
      }
    } else if (typeof options === 'string') {
      // the task name is a variable definition
      definitions.push({ name: taskName, value: "'" + options + "'" });
    }
  }

  // printing out the gulp versions of the grunt tasks
  function printDefinition(definition) {
    out("var " + definition.name + " = " + definition.value + ";");
  }

  function printRequire(moduleName) {
    var name = moduleName;
    if (moduleName !== 'gulp') {
      name = 'gulp-' + moduleName;
    }
    out("var " + moduleName + " = require('" + name + "');");
  }

  function printTask(task) {
    var duplicate = '';
    if ('_isDuplicate' in task && task._isDuplicate) {
      duplicate = ' // WARNING: potential duplicate task';
    }
    if ('dependencies' in task) {
      out("gulp.task('" + task.name + "', " + JSON.stringify(task.dependencies) + ");");
    } else {
      out("gulp.task('" + task.name + "', function () {" + duplicate);
      out("  return gulp");
      out("    .src('" + task.src + "')");
      if (task.name in taskPrinters) {
        taskPrinters[task.name](task);
      } else if ('dest' in task && task.dest !== undefined) {
        console.log("    .pipe(gulp.dest('" + task.dest + "'))");
      }
      out("  ;");
      out("});");
    }
  }

  function printWatchTask(task) {
    out("gulp.task('" + task.name + "', function () {");
    out("  gulp.watch('" + task.src + "', [ /* dependencies */ ]);");
    out("});");
  }

  function printKarmaTask(task) {
    out("gulp.task('test', function (done) {");
    out("  karma.start(");
    out(JSON.stringify(task.src.options, null, "  "));
    out("  , done);");
    out("});");
  }

  // prints out all the require statements and tasks in gulp format
  this.print = function() {
    var i;
    printRequire('gulp');
    for (i = 0; i < requires.length; i += 1) {
      printRequire(requires[i]);
    }
    out();

    for (i = 0; i < definitions.length; i += 1) {
      printDefinition(definitions[i]);
    }
    out();

    for (i = 0; i < tasks.length; i += 1) {
      if (tasks[i].name === 'watch') {
        printWatchTask(tasks[i]);
      } else if (tasks[i].name === 'karma') {
        printKarmaTask(tasks[i]);
      } else {
        printTask(tasks[i]);
      }
      out();
    }
  }

  // Grunt API Methods
  this.file = {
    readJSON: function (path) {
    }
  }

  this.initConfig = function(config) {
    var task;
    for (task in config) {
      processGruntConfig(task, config[task]);
    }
  }

  this.loadNpmTasks = function(npmPackageName) {
    if (gulpExcludedPackages.indexOf(npmPackageName) === 0) {
    } else if (npmPackageName.indexOf('grunt-contrib-') === 0) {
      requires.push(npmPackageName.slice('grunt-contrib-'.length));
    } else if (npmPackageName.indexOf('grunt-') === 0) {
      requires.push(npmPackageName.slice('grunt-'.length));
    } else {
      requires.push(npmPackageName);
    }
  }

  this.registerTask = function(name, dependencies) {
    var task = Object.create(null);
    task.name = name;
    task.dependencies = dependencies;
    tasks.push(task);
  }

}

function convertGruntFile(filename) {
  var module = require(filename), converter = new gruntConverter();
  module(converter);
  converter.print();
}

var i, gruntFiles = process.argv.slice(2);
if (gruntFiles.length == 0) {
  usage();
} else {
  for (i = 0; i < gruntFiles.length; i += 1) {
    convertGruntFile(path.resolve(gruntFiles[i]));
  }
}
