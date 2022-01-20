const { constants } = require('karma');
const { join } = require('path');

module.exports = function (config) {
  const projectName = process.argv.slice(2)[1].replace(':test', '');
  console.log('Running tests for project:', projectName);

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-browserstack-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        random: false,
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: join(__dirname, 'coverage/libs', projectName),
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' },
      ],
      check: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
    port: 9876,
    colors: true,
    logLevel: constants.LOG_INFO,
    autoWatch: false,
    restartOnFileChange: false,

    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,
    captureTimeout: 60000,

    browserStack: {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      build: 'some-build-id',
      name: `${projectName}:test`,
      project: projectName,
    },

    customLaunchers: {
      bsBrowserChrome: {
        base: 'BrowserStack',
        browser: 'Chrome',
        os: 'Windows',
        os_version: '10',
      },
      bsBrowserEdge: {
        base: 'BrowserStack',
        browser: 'Edge',
        os: 'Windows',
        os_version: '10',
      },
      bsBrowserFirefox: {
        base: 'BrowserStack',
        browser: 'Firefox',
        os: 'OS X',
        os_version: 'Big Sur',
      },
      bsBrowserSafari: {
        base: 'BrowserStack',
        browser: 'Safari',
        os: 'OS X',
        os_version: 'Big Sur',
      },
    },
    browsers: [
      'bsBrowserChrome',
      'bsBrowserEdge',
      'bsBrowserFirefox',
      'bsBrowserSafari',
    ],
    reporters: ['progress', 'BrowserStack'],
    singleRun: true,
  });
};
