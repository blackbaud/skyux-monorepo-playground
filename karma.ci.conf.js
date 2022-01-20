const { join } = require('path');
const getBaseKarmaConfig = require('./karma.conf');
// const applyBrowserStackKarmaConfig = require('./scripts/utils/apply-browserstack-karma-config');

module.exports = function (config) {
  const projectName = process.argv.slice(2)[1].replace(':test', '');
  console.log('Running tests for project:', projectName);

  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    ...{
      coverageReporter: {
        dir: join(__dirname, '../../coverage/libs', projectName),
        reporters: [
          { type: 'html' },
          { type: 'text-summary' },
          { type: 'lcovonly' },
        ],
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

  config.plugins.push(require('karma-browserstack-launcher'));

  config.set({
    browserStack: {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
    },
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '21.0',
        os: 'OS X',
        os_version: 'Mountain Lion',
      },
      bs_iphone5: {
        base: 'BrowserStack',
        device: 'iPhone 5',
        os: 'ios',
        os_version: '6.0',
      },
    },
    browsers: ['bs_firefox_mac', 'bs_iphone5'],
    reporters: ['dots', 'BrowserStack'],
  });

  // applyBrowserStackKarmaConfig(config, 'paranoid', {
  //   username: process.env.BROWSER_STACK_USERNAME,
  //   accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
  //   buildId: process.env.GITHUB_RUN_ID,
  //   project: `skyux-monorepo-${projectName}`,
  // });
};
