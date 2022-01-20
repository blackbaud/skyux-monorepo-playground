const { join } = require('path');
const getBaseKarmaConfig = require('./karma.conf');
const applyBrowserStackKarmaConfig = require('./scripts/utils/apply-browserstack-karma-config');

module.exports = function (config) {
  const projectName = process.argv.slice(2)[1].replace(':test', '');
  console.log('Running tests for project:', projectName);

  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    ...{
      coverageReporter: {
        dir: join(__dirname, '../../coverage/libs', projectName),
        check: {
          global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
          },
        },
      },
      autoWatch: false,
      browserDisconnectTolerance: 3,
      browsers: ['ChromeHeadless'],
      singleRun: true,
    },
  });

  // Add support for Codecov reports.
  config.coverageReporter.reporters.push({ type: 'lcovonly' });

  applyBrowserStackKarmaConfig(config, 'paranoid', {
    username: process.env.BROWSER_STACK_USERNAME,
    accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
    buildId: process.env.GITHUB_RUN_ID,
    project: `skyux-monorepo-${projectName}`,
  });
};
