const crossSpawn = require('cross-spawn');
const path = require('path');

async function runCommand(command, args = [], spawnOptions) {
  spawnOptions = {
    ...{
      stdio: 'inherit',
      cwd: path.resolve(process.cwd()),
    },
    ...spawnOptions,
  };

  console.log(
    `[runCommand] Running child process: ${command} ${args.join(' ')}`
  );

  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, spawnOptions);

    if (child.stdout) {
      child.stdout.on('data', (x) => console.log('[runCommand] stdout:', x));
    }

    if (child.stderr) {
      child.stderr.on('data', (x) => console.error('[runCommand] stderr:', x));
    }

    child.on('error', (error) => {
      console.error('[runCommand] error', error.message);
      reject(error);
    });

    child.on('exit', (code) => {
      console.log(`[runCommand] Child process exited with code ${code}.`);
      resolve();
    });
  });
}

module.exports = runCommand;
