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
    browserDisconnectTimeout: 60000,
    browserNoActivityTimeout: 30000,
    captureTimeout: 60000,
  });

  config.client.captureConsole = false;
};
