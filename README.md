# grunt2gulp

Converts a Gruntfile.js to a gulp-compliant file. Why? Because if
you're going to create a new tool to replace an old one, why not
automate the process of porting configuration files over.

In the future, a standard for building JavaScript files should emerge
and be usable by whatever build tools exist. Maybe something like GNU
Make? Ah, but that's a mere fantasy...

## Usage

Print out a gulp file to standard output:

    grunt2gulp.js Gruntfile.js

Save the generated gulp file:

    grunt2gulp.js Gruntfile.js > gulpfile.js

## Drawbacks, Caveats

This is a very very rough tool, you will **need** to go over the
generated gulp file to ensure that it works and is correct.

To see the difference, run the `examples/simple-gruntfile.js` through
grunt2gulp and compare it to `examples/simple-gulpfile.js`. It got 90%
of the way to a complete conversion though and it took only a bit of
tweaking to get it to that state.

If there are duplicate tasks, a warning is added to the code.

# How does it work? / Hacking on grunt2gulp

It loads up the Gruntfile and emulates Grunt's API. When it's done
looping through all the tasks in the grunt config, it shoves them into
definitions or tasks. Definitions are non-objects, like strings, which
need to be declared as variables when using Gulp. Tasks are converted
into Gulp tasks but some special cases have to be handled, such as
Karma and Watch.

The code is dirty because Grunt is very permissive in its input. You
can specify files in multiple ways: as a string, as a list of strings,
or within a files property as a string or list. If Grunt were more
modular it would be possible to just rip out the parser that Grunt
uses to turn a config into a set of tasks without also importing the
task running capability and all the other stuff.

The core functions you will want to check out are `processGruntTask`
and `processGruntConfig`.

# License

Licensed under the MIT license.

Copyright (C) 2014 Rudolf Olah <omouse@gmail.com>

See [LICENSE](./LICENSE) for full text of license.
