const fs = require('fs-extra');
const path = require('path');

const getCommandOutput = require('./utils/get-command-output');
const runCommand = require('./utils/run-command');

async function testAffected() {
  try {
    const argv = require('minimist')(process.argv.slice(2));

    let entryContents = `// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true }},
);
`;

    let tsconfig = {
      extends: './tsconfig.base.json',
      compilerOptions: {
        target: 'es2015',
        declaration: true,
        declarationMap: true,
        inlineSources: true,
        outDir: './dist/out-tsc',
        types: ['jasmine', 'node'],
        lib: ['dom', 'es2018'],
      },
      files: ['./__test-affected.ts'],
      include: ['**/*.d.ts'],
      angularCompilerOptions: {
        compilationMode: 'partial',
      },
    };

    const excluded = ['affected'];

    const affectedStr = await getCommandOutput('npx', [
      'nx',
      'print-affected',
      '--target=test',
      '--select=tasks.target.project',
      `--exclude=${excluded.join(',')}`,
    ]);

    if (!affectedStr) {
      console.log('No projects are affected by changes. Aborting tests.');
      process.exit();
    }

    const projects = affectedStr
      .split(', ')
      .filter((x) => !x.endsWith('-testing'));

    console.log('Running tests for the following projects:', projects);

    const angularJson = fs.readJsonSync(
      path.join(process.cwd(), 'angular.json')
    );

    const coverageExcludes = [
      '**/fixtures/**',
      ...Object.keys(angularJson.projects)
        .filter((x) => !projects.includes(x) && !x.endsWith('-testing'))
        .map((x) => {
          const projectType =
            angularJson.projects[x].projectType === 'library' ? 'libs' : 'apps';
          return `./${projectType}/${x}/**`;
        }),
    ];

    for (const project of projects) {
      tsconfig.include.push(
        `${angularJson.projects[project].root}/**/*.spec.ts`
      );
    }

    entryContents += `
const context = require.context('./', true, /(libs|apps)\\/(${projects.join(
      '|'
    )})\\/src\\/.+\\.spec\\.ts$/);
context.keys().map(context);
`;

    fs.writeFileSync(
      path.join(process.cwd(), '__test-affected.ts'),
      entryContents
    );

    fs.writeJsonSync(
      path.join(process.cwd(), '__tsconfig.test-affected.json'),
      tsconfig,
      { spaces: 2 }
    );

    const npxArgs = [
      'nx',
      'run',
      'affected:test',
      '--skipNxCache',
      '--sourceMap=false',
      '--codeCoverage',
      `--codeCoverageExclude=${coverageExcludes.join(',')}`,
    ];

    if (argv.karmaConfig) {
      npxArgs.push(`--karmaConfig=${argv.karmaConfig}`);
    }

    await runCommand('npx', npxArgs);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testAffected();
