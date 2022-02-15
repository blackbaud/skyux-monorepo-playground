import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';

import { getDistTags } from './utils/npm-utils';
import { runCommand } from './utils/run-command';

async function createNpmrcFile(): Promise<void> {
  const npmFilePath = path.join(process.cwd(), '.npmrc');

  await fs.ensureFile(npmFilePath);

  fs.writeFileSync(
    npmFilePath,
    `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`
  );
}

async function publishNpmPackages(): Promise<void> {
  try {
    await createNpmrcFile();

    const version = (
      await fs.readJson(path.join(process.cwd(), 'package.json'))
    ).version;

    const distTags = await getDistTags('@skyux/core');

    const semverData = semver.parse(version);
    const isPrerelease = semverData ? semverData.prerelease.length > 0 : false;

    let npmPublishTag;
    if (isPrerelease) {
      if (semver.gt(version, distTags.next)) {
        npmPublishTag = '--tag=next';
      }
    } else {
      if (semver.gt(version, distTags.latest)) {
        npmPublishTag = '--tag=latest';
      }
    }

    const commandArgs = ['publish', '--access=public', '--dry-run'];
    if (npmPublishTag) {
      commandArgs.push(npmPublishTag);
    }

    const libsDist = path.join(process.cwd(), 'dist', 'libs/');
    const projectNames = fs.readdirSync(libsDist);

    for (const projectName of projectNames) {
      const projectRoot = path.join(libsDist, projectName);
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

publishNpmPackages();
