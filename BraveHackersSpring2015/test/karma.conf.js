// Karma configuration

basePath = '';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  '../app/library/vendor/test-lib/angular.js',
  '../app/library/vendor/test-lib/angular-mocks.js',
  '../app/library/vendor/test-lib/helpers.js',
  '../app/library/vendor/test-lib/jquery.js',
  '../app/login/*.js',
  '../app/**/*.spec.js',
  '../app/**/**/*.spec.js'  
  
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 10000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
