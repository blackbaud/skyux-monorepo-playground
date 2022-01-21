function getBrowserSet(key) {
  const bsBrowserChrome = {
    base: 'BrowserStack',
    browser: 'Chrome',
    os: 'Windows',
    os_version: '10',
  };

  const bsBrowserEdge = {
    base: 'BrowserStack',
    browser: 'Edge',
    os: 'Windows',
    os_version: '10',
  };

  const bsBrowserFirefox = {
    base: 'BrowserStack',
    browser: 'Firefox',
    os: 'OS X',
    os_version: 'Monterey',
  };

  const bsBrowserSafari = {
    base: 'BrowserStack',
    browser: 'Safari',
    os: 'OS X',
    os_version: 'Monterey',
  };

  const browserSets = {
    speedy: [bsBrowserChrome],
    quirky: [bsBrowserChrome, bsBrowserEdge],
    paranoid: [
      bsBrowserChrome,
      bsBrowserEdge,
      bsBrowserFirefox,
      bsBrowserSafari,
    ],
  };

  return browserSets[key];
}

function getBrowserStackLaunchers(browserSetKey) {
  const browserSet = getBrowserSet(browserSetKey);

  const launchers = {};
  for (const browser of browserSet) {
    // Generate a key based on the browser information.
    const key = [
      browser.os || 'osDefault',
      browser.os_version || 'osVersionDefault',
      browser.browser || 'browserDefault',
      browser.browser_version || 'browserVersionDefault',
    ].join('_');

    launchers[key] = browser;
  }

  return launchers;
}

function logBrowserStackSession(session) {
  console.log(`


  ****************************************************************************************************
  Visit the following URL to view your BrowserStack results:
  https://app.blackbaud.com/browserstack/sessions/${session}
  ****************************************************************************************************

  `);
}

module.exports = function (config) {
  const projectName = process.argv.slice(2)[1].replace(':test', '');
  console.log('Running tests for project:', projectName);

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
        random: false,
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(process.cwd(), './coverage/libs', projectName), // Angular sets this to './coverage/project-name' by default.
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }, // Add support for Codecov reports.
      ],
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false, // Angular sets this to true by default.
    browsers: ['ChromeHeadless'], // Angular sets this to 'Chrome' by default.
    singleRun: true, // Angular sets this to false by default.
    restartOnFileChange: false, // Angular sets this to true by default.
  });

  if (process.env.BROWSER_STACK_ACCESS_KEY) {
    const customLaunchers = getBrowserStackLaunchers('speedy');

    config.set({
      customLaunchers,
      browsers: Object.keys(customLaunchers),
      browserStack: {
        accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
        username: process.env.BROWSER_STACK_USERNAME,
        name: `nx run ${projectName}:test`,
        project: projectName,
        enableLoggingForApi: true,
      },
    });

    config.set({
      browserDisconnectTimeout: 60000,
      browserDisconnectTolerance: 2,
      browserNoActivityTimeout: 30000,
      captureTimeout: 60000,
    });

    config.plugins.push(require('karma-browserstack-launcher'));

    // Create a custom plugin to log the BrowserStack session.
    config.reporters.push('BrowserStack', 'blackbaud-browserstack');
    config.plugins.push({
      'reporter:blackbaud-browserstack': [
        'type',
        function (/* BrowserStack:sessionMapping */ sessions) {
          this.onBrowserComplete = (browser) =>
            logBrowserStackSession(sessions[browser.id]);
        },
      ],
    });
  }
};
