// Tests for an Angular app where ng-app is not on the body.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'e2e/*.spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
    
  },

  rootElement: 'html',

  baseUrl: 'http://localhost:8000/app/index.html', // add your host url here
  framework: 'jasmine',
  allScriptsTimeout: 11000,
  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
  }
};
