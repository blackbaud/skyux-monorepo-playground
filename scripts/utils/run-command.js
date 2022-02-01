const crossSpawn = require('cross-spawn');
const path = require('path');

async function runCommand(command, args, spawnOptions) {
  const defaults = {
    stdio: 'pipe',
    cwd: path.resolve(process.cwd()),
  };

  console.log(`Running child process: ${command} ${args.join(' ')}...`);

  const childProcess = crossSpawn(command, args, {
    ...defaults,
    ...spawnOptions,
  });

  return new Promise((resolve, reject) => {
    let output = '';
    if (childProcess.stdout) {
      childProcess.stdout.on('data', (data) => {
        if (data) {
          const fragment = data.toString('utf8').trim();
          if (fragment) {
            console.log(fragment);
            output += fragment;
          }
        }
      });
    }

    let errorMessage = '';
    if (childProcess.stderr) {
      childProcess.stderr.on('data', (data) => {
        errorMessage += data.toString('utf8');
      });
    }

    childProcess.on('error', (err) => reject(err));

    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(errorMessage);
      }
    });
  });
}

module.exports = runCommand;
