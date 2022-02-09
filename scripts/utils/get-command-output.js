const crossSpawn = require('cross-spawn');

async function getCommandOutput(command, args = [], spawnOptions = {}) {
  spawnOptions = {
    ...spawnOptions,
    ...{
      stdio: 'pipe', // <-- required to get output
    },
  };

  console.log(`Running child process: ${command} ${args.join(' ')}`);

  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, spawnOptions);

    let output = '';
    child.stdout.on('data', (x) => (output += x));

    child.on('error', (error) => {
      console.error(`[getCommandOutput] error: ${error.message}`);
      reject(error);
    });

    child.on('exit', () => {
      resolve(output.trim());
    });
  });
}

module.exports = getCommandOutput;
