import fs from 'fs-extra';
import path from 'path';

function copyFilesToDist() {
  const pathsToCopy = [
    ['collection.json'],
    ['/src/schematics/migrations/migration-collection.json'],
    ['/src/schematics/ng-add/schema.json'],
  ];

  pathsToCopy.forEach((pathArr) => {
    const sourcePath = path.join('libs/packages', ...pathArr);
    const distPath = path.join('dist/libs/packages', ...pathArr);
    if (fs.existsSync(sourcePath)) {
      fs.copySync(sourcePath, distPath);
      console.log(`Successfully copied ${sourcePath} to ${distPath}`);
    } else {
      throw `File not found: ${sourcePath}`;
    }
  });
}

copyFilesToDist();
