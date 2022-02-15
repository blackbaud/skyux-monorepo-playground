import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';

interface PackageJson {
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
  peerDependencies?: { [packageName: string]: string };
}

function verifyDependencySection(
  section: 'dependencies' | 'peerDependencies',
  projectName: string,
  projectPackageJson: PackageJson,
  workspacePackageJson: PackageJson
): string[] {
  const errors: string[] = [];

  for (const packageName in projectPackageJson[section]) {
    // Skip @skyux packages, except for @skyux/icons.
    if (/^@skyux\/((?!icons).)*$/.test(packageName)) {
      continue;
    }

    const targetVersion = projectPackageJson[section]![packageName];
    const minTargetVersion = semver.minVersion(targetVersion)!.version;

    const workspaceVersion =
      workspacePackageJson.dependencies![packageName] ||
      workspacePackageJson.devDependencies![packageName];

    if (!workspaceVersion) {
      errors.push(
        `The package "${packageName}" listed in the \`${section}\` section of 'libs/${projectName}/package.json' ` +
          `was not found in the root 'package.json' \`dependencies\` section. Install the package at the root level and try again.`
      );
      continue;
    }

    const minWorkspaceVersion = semver.minVersion(workspaceVersion)!.version;

    if (workspaceVersion !== minWorkspaceVersion) {
      errors.push(
        `The version listed in the workspace 'package.json' for "${packageName}@${workspaceVersion}" must be set to a specific version ` +
          `(without a semver range character), and set to the minimum version satisfied by the range defined in the \`${section}\` ` +
          `section of 'libs/${projectName}/package.json' (wanted "${packageName}@${targetVersion}"). To address this problem, set ` +
          `"${packageName}" to (${minTargetVersion}) in the workspace 'package.json'.`
      );
    } else if (workspaceVersion !== minTargetVersion) {
      errors.push(
        `The version (${workspaceVersion}) of the package "${packageName}" in the \`dependencies\` section of 'package.json' ` +
          `does not meet the minimum version requirements of the range defined in the \`${section}\` section of ` +
          `'libs/${projectName}/package.json' (wanted "${packageName}@${targetVersion}"). Either increase the minimum ` +
          `supported version in 'libs/${projectName}/package.json' to (^${minWorkspaceVersion}), or downgrade the ` +
          `version installed in the root 'package.json' to (${minTargetVersion}).`
      );
    }
  }

  return errors;
}

export async function verifyPackagesDist(
  libsDist: string,
  projectNames: string[]
) {
  console.log('Validating library dependencies...');

  const errors: string[] = [];

  const workspacePackageJson = fs.readJsonSync(
    path.join(process.cwd(), 'package.json')
  );

  for (const projectName of projectNames) {
    const projectPackageJson = fs.readJsonSync(
      path.join(libsDist, projectName, 'package.json')
    );

    // Validate peer dependencies.
    if (projectPackageJson.peerDependencies) {
      errors.push(
        ...verifyDependencySection(
          'peerDependencies',
          projectName,
          projectPackageJson,
          workspacePackageJson
        )
      );
    }

    // Validate dependencies.
    if (projectPackageJson.dependencies) {
      errors.push(
        ...verifyDependencySection(
          'dependencies',
          projectName,
          projectPackageJson,
          workspacePackageJson
        )
      );
    }
  }

  if (errors.length > 0) {
    errors.forEach((error) => {
      console.error(` ✘ ${error}`);
    });

    throw new Error('Errors found with library dependencies.');
  }

  console.log(' ✔ Done validating dependencies. OK.');
}
