"use strict";
var module;
module.exports = function(grunt) {
        grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-htmlmin");
	grunt.loadNpmTasks("grunt-html2js");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadNpmTasks("grunt-usemin");
	grunt.loadNpmTasks("grunt-bower-task");
        grunt.loadNpmTasks('grunt-protractor-runner');
        grunt.loadNpmTasks("grunt-protractor-webdriver");
        
	grunt.initConfig({
       
	   pkg: grunt.file.readJSON("package.json"),
        
	   clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                         ".tmp",
            "dist/"
                         ]
                }]
            },
            server: ".tmp",
            lib:'app/lib'
        },
        jshint: {
            
            all: [
                "app/**/*.js",
                "!app/library/**/**/*.js"
                
            ]
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "app/content/images",
                    src: "{,*/}*.{png,jpg,jpeg}",
                    dest: "dist/images",
                }]
            }
        },
        
	copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app/content/',
                    dest: 'dist/',
                    src: [
                        "**/*",
                        '!*/*.md',
                        
                        ]
                }

                ]
            },
            main: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app/',
                    dest: 'dist/',
                    src: [
                        '*.html',
                        '**/partials/*.html',
                        '**/*.html'
                        ]
                }

                ]
            },
            Int: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app/lib',
                    dest: 'dist/library/internal/',
                    src: [
                        'att-*/**',
                        ]
                }

                ]
            },
            Ext: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app/lib',
                    dest: 'dist/library/vendor/',
                    src: [
                        '**/**',
                        '!att-*/**'
                        ]
                }

                ]
            }
        },
        useminPrepare: {
            html: ["app/index.html","app/**/*.html","app/**/**.html"],
            options: {
                dest: "dist/"
            }
        },
        usemin: {
            html: ["dist/*.html","dist/**/*.html","dist/**/**/*.html"],
            css: ["dist/styles/{,*/}*.css"],
            options: {
                basedir: "dist/",
                dirs: ["dist/","images"],
                assetDirs:['dist/images','images/']
            }
        },
	karma: {
            unit: {
                configFile: "test/karma.conf.js",
                singleRun: true
            }
        },
       protractor_webdriver: {
        start: {
        options: {
        keepAlive:true,
        command: 'webdriver-manager start',
        }
        }
        },
        protractor: {
        e2e: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
        options: {
        configFile: "test/e2e.conf.js", 
        args: {} 
        }
        }
        },
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    "dist/js/scripts.min.js": [
                        "app/**/**/*.js",
                        "!app/**/**/*.spec.js",
                        "app/*.js",
                        "app/**/*.js",
                        "!app/**/*.spec.js",
                        "!app/library/**/**/*.js"
                    ]
                }
            }

        },
        bower: {
        install: {
        options: {
        targetDir: 'app/lib',
        layout: 'byType',
        install: true,
        copy: false,
        verbose: false,
        cleanTargetDir: false,
        cleanBowerDir: false,
        bowerOptions: {}
        }
        }
        }        
    });


    grunt.registerTask("build", [
        "karma",
        "protractor_webdriver",
        "protractor",
        "imagemin",
   //     "jshint",
        "copy:dist",
        "copy:main",
        "uglify",
	'useminPrepare',
        'usemin',
        'bower:install'        
    ]);

    grunt.registerTask("default", [
        "clean:dist",
	"build"
    ]);
};
