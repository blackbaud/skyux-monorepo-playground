import fs from 'fs-extra';
import path from 'path';

import { PackageJson } from './shared/package-json';
import { SkyuxDevJson } from './shared/skyux-dev-json';

import { createDocumentationJson } from './utils/create-documentation-json';
import { getPublishableProjects } from './utils/get-publishable-projects';
import { inlineExternalResourcesPaths } from './utils/inline-external-resources-paths';
import { runCommand } from './utils/run-command';
import { verifyPackagesDist } from './utils/verify-packages-dist';

// Replaces any occurrence of '0.0.0-PLACEHOLDER' with a version number.
function replacePlaceholderTextWithVersion(
  filePath: string,
  skyuxVersion: string,
  angularVersion: string
) {
  const contents = fs
    .readFileSync(filePath)
    .toString()
    .replace(/0\.0\.0-PLACEHOLDER/g, skyuxVersion) // hard version of SKY UX
    .replace(/0\.0\.0-NG_PLACEHOLDER/g, `^${angularVersion}`); // any minor version of Angular

  fs.writeFileSync(filePath, contents);
}

async function createPackagesDist(): Promise<void> {
  try {
    const cwd = process.cwd();

    const skyuxDevJson: SkyuxDevJson = await fs.readJson(
      path.join(cwd, 'skyux-dev.json')
    );

    const packageJson: PackageJson = await fs.readJson(
      path.join(cwd, 'package.json')
    );

    const skyuxVersion = packageJson.version;
    const angularVersion = (
      await fs.readJson(path.join(cwd, 'package-lock.json'))
    ).dependencies['@angular/core'].version;

    fs.removeSync('dist');

    const distPackages = await getPublishableProjects();
    const projectNames = Object.keys(distPackages);

    console.log(
      'Creating distribution bundles for the following libraries:',
      projectNames
    );

    // Build all libraries.
    await runCommand(
      'npx',
      [
        'nx',
        'run-many',
        '--target=build',
        `--projects=${projectNames.join(',')}`,
        '--parallel',
        '--maxParallel=2',
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
        `--projects=${projectNames.join(',')}`,
        '--parallel',
        '--maxParallel=2',
      ],
      {
        stdio: 'inherit',
      }
    );

    for (const projectName in distPackages) {
      const distPackage = distPackages[projectName];

      replacePlaceholderTextWithVersion(
        path.join(distPackage.distRoot, 'package.json'),
        skyuxVersion,
        angularVersion
      );

      inlineExternalResourcesPaths(distPackage.distRoot);

      if (!skyuxDevJson.documentation.excludeProjects.includes(projectName)) {
        await createDocumentationJson(projectName, distPackage);
      }

      const migrationCollectionJsonPath = path.join(
        distPackage.distRoot,
        'src/schematics/migrations/migration-collection.json'
      );
      if (fs.existsSync(migrationCollectionJsonPath)) {
        replacePlaceholderTextWithVersion(
          migrationCollectionJsonPath,
          skyuxVersion,
          angularVersion
        );
      }
    }

    await verifyPackagesDist(distPackages, packageJson);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createPackagesDist();
