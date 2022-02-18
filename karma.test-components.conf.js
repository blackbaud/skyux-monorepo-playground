// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const getBaseKarmaConfig = require('./karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    client: {
      ...baseConfig.client,
      captureConsole: false,
    },
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: join(__dirname, './coverage/test-components'),
    },
    reporters: ['dots'],
    browsers: ['ChromeHeadless'],
  });

  // Tell karma to wait for bundle to be completed before launching browsers.
  // See: https://github.com/karma-runner/karma-chrome-launcher/issues/154#issuecomment-986661937
  config.plugins.unshift(require('./config/karma/plugins/karma.waitwebpack'));
  config.frameworks.unshift('waitwebpack');
};
