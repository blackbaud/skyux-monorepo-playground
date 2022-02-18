/**
 * This file is responsible for generating a code coverage report for all library projects.
 * Application unit tests are handled in another step.
 */

import {
  existsSync,
  readJson,
  removeSync,
  writeFile,
  writeJson,
} from 'fs-extra';
import { join } from 'path';
import { getCommandOutput, runCommand } from './utils/spawn';

const TEST_ENTRY_FILE = join(process.cwd(), '__create-coverage-report.ts');
const TEST_TSCONFIG_FILE = join(
  process.cwd(),
  '__tsconfig.create-coverage-report.json'
);

async function getAngularJson() {
  return readJson(join(process.cwd(), 'angular.json'));
}

/**
 * Returns affected projects for a given architect target.
 * @param {string} target One of build, test, lint, etc.
 * @returns An array of project names.
 */
async function getAffectedProjects(target: string) {
  const affectedStr = await getCommandOutput('npx', [
    'nx',
    'print-affected',
    `--target=${target}`,
    '--select=tasks.target.project',
  ]);

  if (!affectedStr) {
    return [];
  }

  return affectedStr
    .split(', ')
    .filter((project) => !project.endsWith('-testing'));
}

async function getUnaffectedProjects(
  affectedProjects: string[],
  angularJson: any
) {
  return Object.keys(angularJson.projects).filter(
    (project) =>
      !affectedProjects.includes(project) && !project.endsWith('-testing')
  );
}

async function getAffectedLibrariesForTest(angularJson: any) {
  const projects = await getAffectedProjects('test');

  const karma: string[] = [];
  const other: string[] = [];

  projects.forEach((project) => {
    if (angularJson.projects[project].projectType === 'library') {
      if (
        angularJson.projects[project].architect.test.builder ===
        '@angular-devkit/build-angular:karma'
      ) {
        karma.push(project);
      } else {
        other.push(project);
      }
    }
  });

  return {
    karma,
    other,
  };
}

async function createTempTestingFiles(
  karmaProjects: string[],
  angularJson: any
) {
  let entryContents = `import 'zone.js';
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

  // Generate a 'require.context' RegExp that includes only the affected projects.
  entryContents += `
const context = require.context('./', true, /libs\\/(.+\\/)?(${karmaProjects.join(
    '|'
  )})\\/src\\/.+\\.spec\\.ts$/);
context.keys().map(context);
`;

  await writeFile(TEST_ENTRY_FILE, entryContents);

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
    files: ['./__create-coverage-report.ts'],
    include: ['libs/**/*.d.ts'],
    angularCompilerOptions: {
      compilationMode: 'partial',
    },
  };

  // Add affected projects' files to tsconfig 'include' field.
  for (const project of karmaProjects) {
    tsconfig.include.push(`${angularJson.projects[project].root}/**/*.spec.ts`);
  }

  await writeJson(TEST_TSCONFIG_FILE, tsconfig, { spaces: 2 });
}

function removeTempTestingFiles() {
  console.log('Removing temporary test files...');
  if (existsSync(TEST_ENTRY_FILE)) {
    removeSync(TEST_ENTRY_FILE);
  }

  if (existsSync(TEST_TSCONFIG_FILE)) {
    removeSync(TEST_TSCONFIG_FILE);
  }
  console.log('Done removing temp test files.');
}

process.on('SIGINT', () => process.exit());
process.on('uncaughtException', () => process.exit());
process.on('exit', () => removeTempTestingFiles());

async function testAffected() {
  try {
    const argv = require('minimist')(process.argv.slice(2));

    const angularJson = await getAngularJson();

    const affectedProjects = await getAffectedLibrariesForTest(angularJson);

    if (
      affectedProjects.karma.length === 0 &&
      affectedProjects.other.length === 0
    ) {
      console.log('No affected projects. Aborting tests.');
      process.exit(0);
    }

    const unaffectedProjects = await getUnaffectedProjects(
      affectedProjects.karma.concat(affectedProjects.other),
      angularJson
    );

    if (affectedProjects.karma.length > 0) {
      console.log(
        `Running karma tests for the following projects:
 - ${affectedProjects.karma.join('\n - ')}
 `
      );
    }

    if (affectedProjects.other.length > 0) {
      console.log(
        `Running jest tests for the following projects:
 - ${affectedProjects.other.join('\n - ')}
`
      );
    }

    console.log(
      `The following projects will be ignored for code coverage: ${unaffectedProjects.join(
        ', '
      )}`
    );

    await createTempTestingFiles(affectedProjects.karma, angularJson);

    const codeCoverageExclude = ['**/fixtures/**', '*.fixture.ts'];

    const npxArgs = [
      'nx',
      'run',
      'ci:create-coverage-report',
      '--codeCoverage',
      `--codeCoverageExclude=${codeCoverageExclude.join(',')}`,
    ];

    if (argv.karmaConfig) {
      npxArgs.push(`--karmaConfig=${argv.karmaConfig}`);
    }

    await runCommand('npx', npxArgs);

    // Abort if only running components.
    if (argv.onlyComponents) {
      return;
    }

    if (affectedProjects.other.length > 0) {
      console.log(
        'Running tests for the following non-components projects:',
        affectedProjects.other
      );

      await runCommand('npx', [
        'nx',
        'run-many',
        '--target=test',
        `--projects=${affectedProjects.other.join(',')}`,
        '--codeCoverage',
      ]);
    }

    // Run posttest steps.
    await runCommand('npx', ['nx', 'affected', '--target=posttest']);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testAffected();
