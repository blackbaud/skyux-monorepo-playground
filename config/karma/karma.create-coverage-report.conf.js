const applySharedKarmaConfig = require('./karma.shared.conf');

module.exports = function (config) {
  applySharedKarmaConfig(config);

  config.set({
    coverageReporter: {
      ...config.coverageReporter,
      dir: require('path').join(process.cwd(), './coverage'),
      check: {
        global: {
          statements: 99.61,
          branches: 99.05,
          functions: 99.55,
          lines: 99.66,
        },
      },
    },
  });
};
