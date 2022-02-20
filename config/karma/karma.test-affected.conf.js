const applySharedKarmaConfig = require('./karma.shared.conf');

module.exports = function (config) {
  applySharedKarmaConfig(config);

  config.set({
    coverageReporter: {
      ...config.coverageReporter,
      dir: require('path').join(process.cwd(), './coverage/__test-affected'),
      check: {
        global: {
          statements: 99.62,
          branches: 99.06,
          functions: 99.56,
          lines: 99.66,
        },
      },
    },
  });
};
