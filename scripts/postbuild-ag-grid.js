const fs = require('fs-extra');
const tildeImporter = require('node-sass-tilde-importer');
const path = require('path');
const sass = require('sass');

const stylesRoot = path.resolve(__dirname, '../libs/ag-grid/src/lib/styles');
const destRoot = path.resolve(__dirname, '../dist/libs/ag-grid');

function copyScss() {
  const result = sass.renderSync({
    file: path.join(stylesRoot, 'ag-grid-styles.scss'),
    importer: tildeImporter,
  });

  const target = path.join(destRoot, 'css/sky-ag-grid.css');

  fs.ensureFileSync(target);
  fs.writeFileSync(target, result.css);
}

function postBuildAgGrid() {
  console.log('Running @skyux/ag-grid postbuild step...');

  copyScss();

  console.log('Done running @skyux/ag-grid postbuild.');
}

postBuildAgGrid();
