const runCommand = require('./run-command');

function getVersions(packageName) {
  const versions = runCommand('npm', [
    'view',
    packageName,
    'versions',
    '--json',
  ]);

  return JSON.parse(versions);
}

/**
 * Checks if a given version exists for an NPM package.
 */
function checkVersionExists(packageName, version) {
  const versions = getVersions(packageName);
  return versions.includes(version);
}

function getDistTags(packageName) {
  const distTags = runCommand('npm', [
    'view',
    packageName,
    'dist-tags',
    '--json',
  ]);
  return JSON.parse(distTags);
}

module.exports = {
  checkVersionExists,
  getDistTags,
};
