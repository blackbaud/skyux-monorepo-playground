const crossSpawn = require('cross-spawn');
const path = require('path');

function runCommand(command, args = [], spawnOptions) {
  spawnOptions = {
    ...{
      stdio: 'pipe',
      cwd: path.resolve(process.cwd()),
    },
    ...spawnOptions,
  };

  if (spawnOptions.stdio === 'inherit') {
    console.log(`Running child process: ${command} ${args.join(' ')}...`);
  }

  const result = crossSpawn.sync(command, args, spawnOptions);

  if (result.stdout) {
    return result.stdout.toString().trim();
  }
}

module.exports = runCommand;
