const getCommandOutput = require('./get-command-output');

async function getVersions(packageName) {
  const versions = await getCommandOutput('npm', [
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
async function checkVersionExists(packageName, version) {
  const versions = await getVersions(packageName);
  return versions.includes(version);
}

async function getDistTags(packageName) {
  const distTags = await getCommandOutput('npm', [
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
