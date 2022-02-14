import { SpawnOptions } from 'child_process';
import crossSpawn from 'cross-spawn';

export async function getCommandOutput(
  command: string,
  args: string[] = [],
  spawnOptions: SpawnOptions = {}
): Promise<string> {
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
    if (child.stdout) {
      child.stdout.on('data', (x) => (output += x));
    }

    child.on('error', (error) => {
      console.error(`[getCommandOutput] error: ${error.message}`);
      reject(error);
    });

    child.on('exit', () => {
      resolve(output.trim());
    });
  });
}
