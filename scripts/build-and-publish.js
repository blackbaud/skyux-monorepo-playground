const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

const npmUtils = require('./utils/npm-utils');
const runCommand = require('./utils/run-command');

// Replaces '0.0.0-PLACEHOLDER' with the new version in project package.json files.
function updateProjectPackageJson(projectRootPath, newVersion) {
  const packageJsonPath = path.join(projectRootPath, 'package.json');
  const contents = fs.readFileSync(packageJsonPath).toString();
  fs.writeFileSync(
    packageJsonPath,
    contents.replace(/"0\.0\.0-PLACEHOLDER"/g, `"${newVersion}"`)
  );
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
      'all',
      'code-examples',
      'integration',
      'integration-e2e',
    ];

    // Build all libraries.
    runCommand(
      'npx',
      [
        'nx',
        'run-many',
        '--target=build',
        '--all',
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
      updateProjectPackageJson(path.join(libsDist, projectName), newVersion);
    }

    await createNpmrcFile();

    const distTags = npmUtils.getDistTags('@skyux/core');
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
      runCommand('npm', commandArgs, {
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