const getBaseKarmaConfig = require('./karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();

  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: require('path').join(process.cwd(), './coverage/all'),
    },
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    reporters: ['dots'],
    autoWatch: false,
    logLevel: constants.LOG_DEBUG,
    // browserDisconnectTimeout: 60000,
    // browserNoActivityTimeout: 30000,
    // captureTimeout: 60000,
    // customLaunchers: {
    //   ChromeHeadlessCustom: {
    //     base: 'ChromeHeadless',
    //     flags: [
    //       '--no-sandbox',
    //       '--headless',
    //       '--disable-gpu',
    //       '--disable-translate',
    //       '--disable-extensions',
    //       '--disable-web-security',
    //       '--disable-site-isolation-trials',
    //     ],
    //   },
    //   FirefoxHeadlessCustom: {
    //     base: 'FirefoxHeadless',
    //     flags: ['--headless'],
    //     prefs: {
    //       'media.navigator.permission.disabled': true,
    //       'network.proxy.type': 0,
    //       'toolkit.telemetry.reportingpolicy.firstRun': false,
    //       'extensions.enabledScopes': 0,
    //       'app.update.disabledForTesting': true,
    //     },
    //   },
    // },
  });

  // config.client.captureConsole = false;
};
