const applySharedKarmaConfig = require('./karma.shared.conf');

module.exports = function (config) {
  applySharedKarmaConfig(config);

  config.set({
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: require('path').join(process.cwd(), './coverage/all'),
    },
  });
};
