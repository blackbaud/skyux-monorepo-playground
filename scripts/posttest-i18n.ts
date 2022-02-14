import path from 'path';
import { runCommand } from 'utils/run-command';

async function posttestI18n() {
  console.log('Testing library schematics...');

  await runCommand(
    'nyc',
    [
      'ts-node',
      '--project',
      'tsconfig.schematics.json',
      '../../node_modules/jasmine/bin/jasmine.js',
      '--config=jasmine.json',
    ],
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../libs/i18n'), // Must run in context of lib folder to pick up tsconfig.json.
    }
  );

  console.log('Done.');
}

posttestI18n();
