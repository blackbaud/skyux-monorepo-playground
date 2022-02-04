const spawn = require('cross-spawn');

function spawnToString(command, args) {
  const spawnResult = spawn.sync(command, args, {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  return spawnResult.stdout.toString().trim();
}

function isGitClean() {
  const result = spawnToString('git', ['status']);
  return (
    result.includes('nothing to commit, working tree clean') &&
    !result.includes('Your branch is ahead')
  );
}

function getCurrentBranch() {
  return spawnToString('git', ['branch', '--show-current']);
}

function fetchAll() {
  return spawnToString('git', ['fetch', '--all']);
}

function checkoutNewBranch(branch) {
  const result = spawnToString('git', ['branch', '--list', branch]);
  if (result) {
    throw new Error(`The branch "${branch}" already exists. Aborting.`);
  }
  spawnToString('git', ['checkout', '-b', branch]);
}

module.exports = {
  checkoutNewBranch,
  fetchAll,
  isGitClean,
  getCurrentBranch,
};
