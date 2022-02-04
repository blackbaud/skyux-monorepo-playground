const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
const semver = require('semver');
const standardVersion = require('standard-version');
const gitUtils = require('./utils/git-utils');
const npmUtils = require('./utils/npm-utils');

/**
 * Returns the default config to be passed to 'standard-version'.
 */
function getStandardVersionConfig(currentVersion, overrides = {}) {
  const config = {
    noVerify: true, // skip any precommit hooks
    releaseCommitMessageFormat:
      'docs: add release notes for {{currentTag}} release',
    tagPrefix: '', // don't prefix tags with 'v'
  };

  const versionExists = npmUtils.checkVersionExists(
    '@skyux/core',
    currentVersion
  );
  if (!versionExists) {
    // Don't bump the version if this is the first release.
    config.firstRelease = true;
  }

  const semverData = semver.parse(currentVersion);
  const isPrerelease = semverData.prerelease.length > 0;

  if (isPrerelease) {
    /**
     * The semver 'prerelease' value can be an array of length 1 or 2, depending on the prerelease type.
     * For example:
     *   5.0.0-alpha.5 => ['alpha', 5]
     *   5.0.0-5 => [5]
     */
    config.prerelease =
      semverData.prerelease.length === 1 ? true : semverData.prerelease[0];
  }

  return { ...config, ...overrides };
}

/**
 * Returns the bumped version generated by 'standard-version' utility.
 */
async function getNextVersion(currentVersion) {
  // This file stores the version generated by 'standard-version' since there's
  // no way to retrieve the value programmatically.
  const outVersionFile = path.join(
    'node_modules/.cache/skyux',
    '.standardversionout'
  );

  // Make sure the cached version matches the version in package.json.
  fs.writeFileSync(outVersionFile, currentVersion);

  const standardVersionConfig = getStandardVersionConfig(currentVersion, {
    bumpFiles: [
      {
        // For this step, bump the version to our temp file instead of package.json.
        filename: outVersionFile,
        type: 'plain-text',
      },
    ],
    silent: true,
    skip: {
      changelog: true,
      commit: true,
      tag: true,
    },
  });

  await standardVersion(standardVersionConfig);

  return fs.readFileSync(outVersionFile).toString().trim();
}

/**
 * Creates a 'releases/x.x.x' branch, tags it, and automatically adds release notes to CHANGELOG.md.
 */
async function release() {
  try {
    console.log('Preparing workspace for release...');

    // Ensure all remote changes are represented locally.
    gitUtils.fetchAll();

    // Ensure releases are executed against the main branch.
    if (gitUtils.getCurrentBranch() !== 'main') {
      throw new Error('Releases can only be triggered on the "main" branch.');
    }

    // Ensure local git is clean.
    if (!gitUtils.isGitClean()) {
      throw new Error(
        'Changes found on local branch. Please push (or stash) any changes before creating a release.'
      );
    }

    const packageJson = fs.readJsonSync('package.json');

    const currentVersion = packageJson.version;
    const nextVersion = await getNextVersion(currentVersion);

    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `This command will generate a tag and release notes for version "${nextVersion}". Proceed?`,
        default: true,
      },
    ]);

    if (!answer.proceed) {
      console.log('Release aborted. Thanks for playing!');
      process.exit(0);
    }

    const branch = `releases/${nextVersion}`;

    console.log(`Creating new branch "${branch}"...`);

    gitUtils.checkoutNewBranch(branch);

    console.log('Generating release artifacts...');

    const standardVersionConfig = getStandardVersionConfig(currentVersion);

    // Bump version and create changelog.
    await standardVersion(standardVersionConfig);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

release();
