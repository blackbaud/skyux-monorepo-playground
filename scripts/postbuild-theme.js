const fs = require('fs-extra');
const tildeImporter = require('node-sass-tilde-importer');
const path = require('path');
const sass = require('sass');

const stylesRoot = path.resolve(__dirname, '../libs/theme/src/lib/styles');
const destRoot = path.resolve(__dirname, '../dist/libs/theme');

const skyScssPath = path.join(stylesRoot, 'sky.scss');

function validateSkyuxIconVersionMatch() {
  console.log('Validating SKY UX icon font version...');

  const scssContents = fs.readFileSync(skyScssPath, 'utf8').toString();

  const packageJson = fs.readJsonSync(
    path.resolve(__dirname, '../libs/theme/package.json')
  );

  const scssVersionMatches = scssContents.match(
    /@import url\('https:\/\/sky\.blackbaudcdn\.net\/static\/skyux-icons\/([A-z0-9\-.]+)\/assets\/css\/skyux-icons\.min\.css'\)/
  );

  if (!scssVersionMatches || scssVersionMatches.length !== 2) {
    console.error('Could not find the SKY UX icon font version in sky.scss.');
    process.exit(1);
  }

  const scssVersion = scssVersionMatches[1];

  const packageVersion = packageJson.dependencies['@skyux/icons'];
  if (!packageVersion) {
    console.error('Could not find the @skyux/icons dependency in package.json');
    process.exit(1);
  }

  if (scssVersion !== packageVersion) {
    console.error(
      'sky.scss references SKY UX icon font version ' +
        scssVersion +
        ', but package.json references @skyux/icons version ' +
        packageVersion +
        '. These versions should match.'
    );
    process.exit(1);
  }

  console.log('Done.');
}

function renderScss(file, target) {
  const result = sass.renderSync({
    file: file,
    importer: tildeImporter,
    quietDeps: true,
  });

  fs.ensureFileSync(target);
  fs.writeFileSync(target, result.css);
}

function copyScss() {
  console.log('Preparing SCSS and CSS files...');

  renderScss(skyScssPath, path.join(destRoot, 'css/sky.css'));

  renderScss(
    path.join(stylesRoot, 'themes/modern/styles.scss'),
    path.join(destRoot, 'css/themes/modern/styles.css')
  );

  console.log('Done.');
}

function copyDesignTokens() {
  console.log('Copying design tokens...');

  fs.copySync(
    path.join(stylesRoot, '_mixins-public.scss'),
    path.join(destRoot, 'scss/mixins.scss')
  );

  fs.copySync(
    path.join(stylesRoot, '_variables-public.scss'),
    path.join(destRoot, 'scss/variables.scss')
  );

  console.log('Done.');
}

function copyCompatMixins() {
  console.log('Copying compatibility mixins...');

  fs.copySync(
    path.join(stylesRoot, '_compat'),
    path.join(destRoot, 'scss/_compat')
  );

  fs.copySync(
    path.join(stylesRoot, 'themes/modern/_compat'),
    path.join(destRoot, 'scss/themes/modern/_compat')
  );

  console.log('Done.');
}

function postBuildTheme() {
  console.log('Running @skyux/theme postbuild step...');

  validateSkyuxIconVersionMatch();
  copyScss();
  copyDesignTokens();
  copyCompatMixins();

  console.log('Done running @skyux/theme postbuild.');
}

postBuildTheme();
