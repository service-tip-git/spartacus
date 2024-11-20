// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

var events = require('events');
events.EventEmitter.defaultMaxListeners = 20; // Increase the default max listeners globally

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-junit-reporter'),
      require('karma-spec-reporter'),
    ],
    client: {
      clearContext: true, // close Jasmine Spec Runner output in browser to avoid 'Some of your tests did a full page reload!' error when '--no-watch' is active
      jasmine: {
        random: false,
      },
    },
    reporters: ['progress', 'kjhtml', 'dots', 'junit', 'spec'],
    junitReporter: {
      outputFile: 'unit-test-storefront.xml',
      outputDir: require('path').join(__dirname, '../../unit-tests-reports'),
      useBrowserName: false,
    },
    specReporter: {
      maxLogLines: 5, // Limit the number of log lines per test suite
      suppressErrorSummary: true, // Don't log summary of errors
      suppressFailed: false, // Show failed tests
      suppressPassed: false, // Show passed tests
      showSpecTiming: true, // Show timing for each spec
      failFast: false, // Stop on the first failure
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/storefront'),
      reporters: [{ type: 'lcov', subdir: '.' }, { type: 'text-summary' }],
      check: {
        global: {
          statements: 85,
          lines: 85,
          branches: 70,
          functions: 80,
        },
      },
    },
    captureTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout: 210000,
    browserNoActivityTimeout: 210000,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--headless', '--no-sandbox', '--remote-debugging-port=9001'],
      },
    },
    singleRun: false,
  });
};
