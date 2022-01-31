const getBaseKarmaConfig = require('./karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();

  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: require('path').join(process.cwd(), './coverage/all'),
    },
    browsers: ['ChromeHeadless'],
    reporters: ['dots'],
    autoWatch: false,
    restartOnFileChange: false,
    browserDisconnectTimeout: 60000,
    browserNoActivityTimeout: 30000,
    captureTimeout: 60000,
  });

  // Tell karma to wait for bundle to be completed before launching browsers.
  // See: https://github.com/karma-runner/karma-chrome-launcher/issues/154#issuecomment-986661937
  config.plugins.unshift(require('./karma.waitwebpack'));
  config.frameworks.unshift('waitwebpack');

  config.client.captureConsole = false;
};
