const fs = require('fs-extra');
const path = require('path');

const runCommand = require('./utils/run-command');

const LIB_PATH = path.resolve(__dirname, '../libs/i18n');

function buildSchematics() {
  console.log('Building @skyux/i18n schematics...');

  runCommand(path.resolve(__dirname, '../node_modules/.bin/tsc'), [
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

function postbuildI18n() {
  buildSchematics();
}

postbuildI18n();
