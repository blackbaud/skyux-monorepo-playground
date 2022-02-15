import { SpawnOptions } from 'child_process';

import crossSpawn from 'cross-spawn';
import path from 'path';

export async function runCommand(
  command: string,
  args: string[] = [],
  spawnOptions: SpawnOptions = {}
): Promise<void> {
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
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}
