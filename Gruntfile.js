/*
* Copyright (c) 2015, Yahoo! Inc. All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    execute: {
      target21: {
        options: {
          args: ['src/y/css-parser.21.y', 'src/l/css.21.l', '--outfile', 'src/css-parser.21.js']
        },
        src: ['node_modules/jison/lib/cli.js']
      },
      target21_core: {
        options: {
          args: ['src/y/css-parser.21.core.y', 'src/l/css.21.core.l', '--outfile', 'src/css-parser.21.core.js']
        },
        src: ['node_modules/jison/lib/cli.js']
      },
      target21_attr: {
        options: {
          args: ['src/y/css-parser.21.attr.y', 'src/l/css.21.l', '--outfile', 'src/css-parser.21.attr.js']
        },
        src: ['node_modules/jison/lib/cli.js']
      },
      target3: {
        options: {
          args: ['src/y/css-parser.3.y', 'src/l/css.3.l', '--outfile', 'src/css-parser.3.js']
        },
        src: ['node_modules/jison/lib/cli.js']
      },
      targetstrict: {
        options: {
          args: ['src/y/css-parser.strict.attr.y', 'src/l/css.strict.l', '--outfile', 'src/css-parser.strict.attr.js']
        },
        src: ['node_modules/jison/lib/cli.js']
      },
    },
    mocha_istanbul: {
      target: {
        src: 'tests/unit/*.js',
        options: {
          excludes: [
            'src/css-parser.21.attr.js',
            'src/css-parser.21.core.js',
            'src/css-parser.21.js',
            'src/css-parser.3.js',
            'src/css-parser.strict.attr.js'
          ],
          coverage:true,
          check: {
            lines: 80,
            statements: 80
          }
        }
      }
    },
    clean: {
      all: ['xunit.xml', 'artifacts', 'coverage', 'node_modules'],
      buildResidues: ['xunit.xml', 'artifacts', 'coverage']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('test', ['clean:buildResidues', 'mocha_istanbul']);
  grunt.registerTask('default', ['execute', 'test']);
};
