const spawn = require('cross-spawn');

function spawnToString(command, args) {
  const spawnResult = spawn.sync(command, args, {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  return spawnResult.stdout.toString().trim();
}

function isGitClean() {
  const result = spawnToString('git', ['status', '--porcelain']);
  return result.trim().length === 0;
}

function getCurrentBranch() {
  return spawnToString('git', ['branch', '--show-current']);
}

function fetchAll() {
  return spawnToString('git', ['fetch', '--all']);
}

module.exports = {
  fetchAll,
  isGitClean,
  getCurrentBranch,
};
