const crossSpawn = require('cross-spawn');

function spawnToString(command, args = [], spawnOptions) {
  const result = crossSpawn.sync(command, args, {
    ...{
      cwd: process.cwd(),
      stdio: 'pipe',
    },
    ...(spawnOptions || {}),
  });

  if (result.stdout) {
    return result.stdout.toString().trim();
  }

  if (result.error) {
    throw result.error;
  }

  return result.toString();
}

module.exports = spawnToString;
