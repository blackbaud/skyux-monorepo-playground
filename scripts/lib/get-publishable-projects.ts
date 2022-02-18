import fs from 'fs-extra';
import path from 'path';

import { DistPackages } from '../shared/dist-packages';

export async function getPublishableProjects() {
  const angularJson = await fs.readJson(
    path.join(process.cwd(), 'angular.json')
  );

  const distPackages: DistPackages = {};

  for (const projectName in angularJson.projects) {
    const projectConfig = angularJson.projects[projectName];
    if (
      projectConfig.projectType === 'library' &&
      projectConfig.architect.build
    ) {
      distPackages[projectName] = {
        distRoot:
          projectConfig.architect.build.options.outputPath ||
          projectConfig.architect.build.outputs[0],
        root: projectConfig.root,
      };
    }
  }

  return distPackages;
}
