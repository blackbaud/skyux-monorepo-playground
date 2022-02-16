import fs from 'fs-extra';
import path from 'path';

import { createDocumentationJson } from './utils/create-documentation-json';
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

    const skyuxDevJson = await fs.readJson(path.join(cwd, 'skyux-dev.json'));
    const packageJson = await fs.readJson(path.join(cwd, 'package.json'));

    const skyuxVersion = packageJson.version;
    const angularVersion = (
      await fs.readJson(path.join(cwd, 'package-lock.json'))
    ).dependencies['@angular/core'].version;

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
    // (Trailing slash is necessary to return only directories.)
    const libsDist = path.join(cwd, 'dist', 'libs/');
    const projectNames = fs.readdirSync(libsDist);

    for (const projectName of projectNames) {
      replacePlaceholderTextWithVersion(
        path.join(libsDist, projectName, 'package.json'),
        skyuxVersion,
        angularVersion
      );

      inlineExternalResourcesPaths(projectName);

      if (!skyuxDevJson.documentation.excludeProjects.includes(projectName)) {
        await createDocumentationJson(projectName);
      }
    }

    replacePlaceholderTextWithVersion(
      path.join(
        libsDist,
        'packages',
        'src/schematics/migrations/migration-collection.json'
      ),
      skyuxVersion,
      angularVersion
    );

    await verifyPackagesDist(libsDist, projectNames);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createPackagesDist();
