const fs = require('fs-extra');
const path = require('path');
const standardVersion = require('standard-version');

const runCommand = require('./utils/run-command');

function updateProjectFiles(projectRootPath, packageLockJson) {
  const packageJsonPath = path.join(projectRootPath, 'package.json');
  const packageJson = fs.readJsonSync(packageJsonPath);

  const projectRootRelative = projectRootPath.replace(
    path.join(process.cwd()),
    ''
  );

  packageJson.version = packageLockJson.version;

  for (const packageName in packageJson.peerDependencies) {
    if (/^@skyux\//.test(packageName)) {
      packageJson.peerDependencies[packageName] = packageLockJson.version;
      console.log(
        `[${projectRootRelative}] Update peerDependency version ${packageName} to ${packageLockJson.version}`
      );
    } else if (packageLockJson.dependencies[packageName]) {
      const newVersion = `^${packageLockJson.dependencies[packageName].version}`;
      packageJson.peerDependencies[packageName] = newVersion;
      console.log(
        `[${projectRootRelative}] Update peerDependency version ${packageName} to ${newVersion}`
      );
    }
  }

  for (const packageName in packageJson.dependencies) {
    if (packageName === 'tslib') {
      continue;
    }
    const newVersion = packageLockJson.dependencies[packageName].version;
    packageJson.dependencies[packageName] = newVersion;
    console.log(
      `[${projectRootRelative}] Update dependency version ${packageName} to ${newVersion}`
    );
  }

  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
}

async function release() {
  try {
    fs.removeSync('dist');

    const excludeProjects = [
      'all',
      'code-examples',
      'integration',
      'integration-e2e',
    ];

    // Build all libraries.
    await runCommand('npx', [
      'nx',
      'run-many',
      '--target=build',
      '--all',
      `--exclude=${excludeProjects.join(',')}`,
      '--parallel',
      '--maxParallel=2',
    ]);

    // Bump version and create changelog.
    await standardVersion({
      prerelease: 'alpha',
      skip: {
        commit: true, // temporary
        tag: true, // temporary
      },
    });

    const packageLockJson = fs.readJsonSync(path.join('package-lock.json'));

    // Derive project names from dist directories.
    const libsDist = path.join('dist', 'libs/');
    const projectNames = fs.readdirSync(libsDist);

    for (const projectName of projectNames) {
      updateProjectFiles(path.join(libsDist, projectName), packageLockJson);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

release();
