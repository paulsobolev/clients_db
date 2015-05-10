module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["build"],

        copy: {
            main: {
                files: [{
                        expand: true,
                        src: ['src/data.json'],
                        dest: 'build/',
                        flatten: true,
                        filter: 'isFile',
                    },

                    {
                        expand: true,
                        src: ['core/fontawesome/fonts/**'],
                        dest: 'build/fonts/',
                        flatten: true,
                        filter: 'isFile',
                    },
                ]
            },
        },

        concat: {
            dist: {
                src: [
                    'core/jquery/dist/jquery.js',
                    'core/bootstrap-sass/assets/javascripts/bootstrap.js',
                    'core/underscore/underscore.js',
                    'core/backbone/backbone.js',
                    'core/marionette/lib/backbone.marionette.js',
                    'src/js/*.js'
                ],
                dest: 'build/js/main.js'
            }
        },

        uglify: {
            build: {
                src: 'build/js/main.js',
                dest: 'build/js/main.min.js'
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'build/css/style.css': 'src/css/global.scss'
                }
            }
        },

        htmlbuild: {
            dist: {
                src: 'src/index.html',
                dest: 'build/',
                options: {
                    relative: true,
                    scripts: {
                        main: 'build/js/main.min.js'
                    },
                    styles: {
                        main: 'build/css/style.css'
                    }
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            },

            css: {
                files: ['src/css/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            },

            html: {
                files: ['src/index.html'],
                tasks: ['htmlbuild'],
                options: {
                    spawn: false,
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-html-build');

    grunt.registerTask('build', ['clean', 'copy', 'concat', 'uglify', 'sass', 'htmlbuild']);

    grunt.registerTask('default', ['build']);
};
