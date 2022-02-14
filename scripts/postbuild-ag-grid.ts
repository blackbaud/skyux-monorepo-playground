import tildeImporter from 'node-sass-tilde-importer';
import fs from 'fs-extra';
import path from 'path';
import sass from 'sass';

const STYLES_ROOT = path.resolve(__dirname, '../libs/ag-grid/src/lib/styles');
const DEST_ROOT = path.resolve(__dirname, '../dist/libs/ag-grid');

function copyScss() {
  const result = sass.renderSync({
    file: path.join(STYLES_ROOT, 'ag-grid-styles.scss'),
    importer: tildeImporter,
  });

  const target = path.join(DEST_ROOT, 'css/sky-ag-grid.css');

  fs.ensureFileSync(target);
  fs.writeFileSync(target, result.css);
}

function postBuildAgGrid() {
  console.log('Running @skyux/ag-grid postbuild step...');

  copyScss();

  console.log('Done running @skyux/ag-grid postbuild.');
}

postBuildAgGrid();
