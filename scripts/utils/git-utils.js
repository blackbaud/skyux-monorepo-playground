const getCommandOutput = require('./get-command-output');
const runCommand = require('./run-command');

async function isGitClean() {
  const result = await getCommandOutput('git', ['status']);
  return (
    result.includes('nothing to commit, working tree clean') &&
    result.includes('Your branch is up to date')
  );
}

async function getCurrentBranch() {
  return getCommandOutput('git', ['branch', '--show-current']);
}

async function fetchAll() {
  return getCommandOutput('git', ['fetch', '--all']);
}

async function checkoutNewBranch(branch) {
  const result = getCommandOutput('git', ['branch', '--list', branch]);

  if (result) {
    throw new Error(`The branch "${branch}" already exists. Aborting.`);
  }

  await runCommand('git', ['checkout', '-b', branch]);
}

module.exports = {
  checkoutNewBranch,
  fetchAll,
  isGitClean,
  getCurrentBranch,
};
