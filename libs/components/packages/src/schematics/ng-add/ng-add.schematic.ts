import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import fs from 'fs-extra';
import getLatestVersion from 'latest-version';
import path from 'path';

import { readRequiredFile } from '../utility/tree';

async function ensureLatestVersions(
  context: SchematicContext,
  dependencies: {
    [_: string]: string;
  },
  packageGroup: {
    [_: string]: string;
  }
): Promise<void> {
  for (const packageName in dependencies) {
    const version = packageGroup[packageName];

    if (version) {
      // Get the latest version from NPM.
      const latestVersion = await getLatestVersion(packageName, { version });

      if (latestVersion !== dependencies[packageName]) {
        context.logger.info(
          `Updated "${packageName}" from version (${dependencies[packageName]}) to (${latestVersion}).`
        );

        dependencies[packageName] = latestVersion;
      } else {
        context.logger.info(
          `Skipped "${packageName}" because it is already on the latest version.`
        );
      }
    }
  }
}

export default function ngAdd(): Rule {
  return async (tree, context) => {
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(readRequiredFile(tree, packageJsonPath));

    const { packageGroup } = fs.readJsonSync(
      path.resolve(__dirname, '../../../package.json')
    )['ng-update'];

    await ensureLatestVersions(context, packageJson.dependencies, packageGroup);
    await ensureLatestVersions(
      context,
      packageJson.devDependencies,
      packageGroup
    );

    tree.overwrite(packageJsonPath, JSON.stringify(packageJson, undefined, 2));

    context.addTask(new NodePackageInstallTask());
  };
}
