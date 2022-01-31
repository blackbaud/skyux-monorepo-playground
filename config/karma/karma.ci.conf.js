const getBaseKarmaConfig = require('../../karma.conf');

function getBrowserSet(key) {
  const bsBrowserEdge = {
    base: 'BrowserStack',
    browser: 'Edge',
    os: 'Windows',
    os_version: '10',
  };

  const bsBrowserFirefox = {
    base: 'BrowserStack',
    browser: 'Firefox',
    browser_version: '95',
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
    paranoid: [bsBrowserEdge, bsBrowserFirefox, bsBrowserSafari],
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
  const baseConfig = getBaseKarmaConfig();

  config.set({
    ...baseConfig,
    client: {
      ...baseConfig.client,
      captureConsole: false,
    },
    reporters: ['dots'],
    autoWatch: false,
    browsers: ['ChromeHeadless'], // Fallback browser in case env variables not set.
    singleRun: true,
    restartOnFileChange: false,
  });

  delete config.coverageReporter;

  if (process.env.BROWSER_STACK_ACCESS_KEY) {
    const tunnelIdentifier = `browserstack_tunnel_${new Date().getTime()}`;
    const customLaunchers = getBrowserStackLaunchers('paranoid');

    config.set({
      customLaunchers,
      browsers: Object.keys(customLaunchers),

      browserStack: {
        accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
        username: process.env.BROWSER_STACK_USERNAME,
        name: 'nx run all:test',
        project: 'all',
        enableLoggingForApi: true,
        startTunnel: true,
        forceLocal: true,
        timeout: 1800,
        tunnelIdentifier,
        video: false,
      },

      // Try Websocket for a faster transmission first. Fallback to polling if necessary.
      transports: ['websocket', 'polling'],

      browserDisconnectTolerance: 2,
    });

    config.plugins.push(require('karma-browserstack-launcher'));

    // Create a custom plugin to log the BrowserStack session.
    config.reporters.push('blackbaud-browserstack');
    config.plugins.push({
      'reporter:blackbaud-browserstack': [
        'type',
        function (/* BrowserStack:sessionMapping */ sessions) {
          this.onBrowserComplete = (browser) =>
            logBrowserStackSession(sessions[browser.id]);
        },
      ],
    });

    // Tell karma to wait for bundle to be completed before launching browsers.
    // See: https://github.com/karma-runner/karma-chrome-launcher/issues/154#issuecomment-986661937
    config.plugins.unshift(require('./plugins/karma.waitwebpack'));
    config.frameworks.unshift('waitwebpack');
  }
};
