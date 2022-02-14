const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

const npmUtils = require('./utils/npm-utils');
const runCommand = require('./utils/run-command');

// Replaces any occurrence of '0.0.0-PLACEHOLDER' with a version number.
function replacePlaceholderTextWithVersion(filePath, version) {
  const contents = fs.readFileSync(filePath).toString();
  fs.writeFileSync(filePath, contents.replace(/0\.0\.0-PLACEHOLDER/g, version));
}

async function createNpmrcFile() {
  const npmFilePath = path.join(process.cwd(), '.npmrc');
  await fs.ensureFile(npmFilePath);
  fs.writeFileSync(
    npmFilePath,
    `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`
  );
}

async function buildAndPublish() {
  try {
    const packageJson = fs.readJsonSync('package.json');
    const newVersion = packageJson.version;

    fs.removeSync('dist');

    const excludeProjects = [
      'affected',
      'code-examples',
      'integration',
      'integration-e2e',
    ];

    // Build all libraries.
    await runCommand(
      'npx',
      [
        'nx',
        'run-many',
        '--target=build',
        '--all',
        '--parallel',
        '--maxParallel=2',
        `--exclude=${excludeProjects.join(',')}`,
      ],
      {
        stdio: 'inherit',
      }
    );

    // Run postbuild steps.
    await runCommand(
      'npx',
      [
        'nx',
        'run-many',
        '--target=postbuild',
        '--all',
        '--parallel',
        '--maxParallel=2',
        `--exclude=${excludeProjects.join(',')}`,
      ],
      {
        stdio: 'inherit',
      }
    );

    // Derive project names from dist directories.
    const libsDist = path.join('dist', 'libs/');
    const projectNames = fs.readdirSync(libsDist);

    for (const projectName of projectNames) {
      replacePlaceholderTextWithVersion(
        path.join(libsDist, projectName, 'package.json'),
        newVersion
      );
    }

    replacePlaceholderTextWithVersion(
      path.join(
        libsDist,
        'packages',
        'src/schematics/migrations/migration-collection.json'
      ),
      newVersion
    );

    await createNpmrcFile();

    const distTags = await npmUtils.getDistTags('@skyux/core');

    const semverData = semver.parse(newVersion);
    const isPrerelease = semverData.prerelease.length > 0;

    let npmPublishTag;
    if (isPrerelease) {
      if (semver.gt(newVersion, distTags.next)) {
        npmPublishTag = '--tag=next';
      }
    } else {
      if (semver.gt(newVersion, distTags.latest)) {
        npmPublishTag = '--tag=latest';
      }
    }

    const commandArgs = ['publish', '--access=public', '--dry-run'];
    if (npmPublishTag) {
      commandArgs.push(npmPublishTag);
    }

    for (const projectName of projectNames) {
      const projectRoot = path.join(process.cwd(), libsDist, projectName);
      await runCommand('npm', commandArgs, {
        cwd: projectRoot,
        stdio: 'inherit',
      });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

buildAndPublish();
