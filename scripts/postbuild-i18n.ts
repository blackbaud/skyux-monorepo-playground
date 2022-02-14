import fs from 'fs-extra';
import path from 'path';
import { runCommand } from 'utils/run-command';

const LIB_PATH = path.resolve(__dirname, '../libs/i18n');

async function buildSchematics() {
  console.log('Building @skyux/i18n schematics...');

  await runCommand(path.resolve(__dirname, '../node_modules/.bin/tsc'), [
    '--project',
    'libs/i18n/tsconfig.schematics.json',
  ]);

  // Copy collection.json.
  fs.copySync(
    path.join(LIB_PATH, 'schematics/collection.json'),
    path.join('dist/libs/i18n/schematics/collection.json')
  );

  // Copy schemas.
  fs.copySync(
    path.join(
      LIB_PATH,
      'schematics/ng-generate/lib-resources-module/schema.json'
    ),
    path.join(
      'dist/libs/i18n/schematics/ng-generate/lib-resources-module/schema.json'
    )
  );

  // Copy template files.
  fs.copySync(
    path.join(LIB_PATH, 'schematics/ng-generate/lib-resources-module/files'),
    path.join(
      'dist/libs/i18n/schematics/ng-generate/lib-resources-module/files'
    )
  );

  console.log('Done.');
}

async function postbuildI18n() {
  try {
    await buildSchematics();
  } catch (err) {
    console.error('[postbuild-i18n error]', err);
    process.exit(1);
  }
}

postbuildI18n();
