const fs = require('fs-extra');
const path = require('path');

const getCommandOutput = require('./utils/get-command-output');
const runCommand = require('./utils/run-command');

// These projects' tests should never be executed.
const EXCLUDED_PROJECTS = ['affected'];

const TEST_ENTRY_FILE = path.join(process.cwd(), '__test-affected.ts');
const TEST_TSCONFIG_FILE = path.join(
  process.cwd(),
  '__tsconfig.test-affected.json'
);

async function getAngularJson() {
  return fs.readJson(path.join(process.cwd(), 'angular.json'));
}

/**
 * Returns affected projects for a given architect target.
 * @param {string} target One of build, test, lint, etc.
 * @returns An array of project names.
 */
async function getAffectedProjects(target) {
  const affectedStr = await getCommandOutput('npx', [
    'nx',
    'print-affected',
    `--target=${target}`,
    '--select=tasks.target.project',
    `--exclude=${EXCLUDED_PROJECTS.join(',')}`,
  ]);

  if (!affectedStr) {
    return [];
  }

  return affectedStr
    .split(', ')
    .filter((project) => !project.endsWith('-testing'));
}

async function getUnaffectedProjects(karmaProjects, angularJson) {
  return Object.keys(angularJson.projects).filter(
    (project) =>
      !karmaProjects.includes(project) &&
      !EXCLUDED_PROJECTS.includes(project) &&
      !project.endsWith('-testing')
  );
}

async function getAffectedKarmaProjects(angularJson) {
  const projects = (await getAffectedProjects('test')).filter(
    (project) =>
      angularJson.projects[project].architect.test.builder ===
      '@angular-devkit/build-angular:karma'
  );

  return projects;
}

async function createTempTestingFiles(karmaProjects, angularJson) {
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

  // Add affected projects' files to tsconfig 'include' field.
  for (const project of karmaProjects) {
    tsconfig.include.push(`${angularJson.projects[project].root}/**/*.spec.ts`);
  }

  // Generate a 'require.context' RegExp that includes only the affected projects.
  entryContents += `
const context = require.context('./', true, /(libs|apps)\\/(${karmaProjects.join(
    '|'
  )})\\/src\\/.+\\.spec\\.ts$/);
context.keys().map(context);
`;

  await fs.writeFile(TEST_ENTRY_FILE, entryContents);
  await fs.writeJson(TEST_TSCONFIG_FILE, tsconfig, { spaces: 2 });
}

async function removeTempTestingFiles() {
  if (fs.existsSync(TEST_ENTRY_FILE)) {
    await fs.removeFile(TEST_ENTRY_FILE);
  }

  if (fs.existsSync(TEST_TSCONFIG_FILE)) {
    await fs.removeFile(TEST_TSCONFIG_FILE);
  }
}

process.on('exit', async () => {
  await removeTempTestingFiles();
});

async function testAffected() {
  try {
    const argv = require('minimist')(process.argv.slice(2));

    const angularJson = await getAngularJson();

    const karmaProjects = await getAffectedKarmaProjects(angularJson);
    const unaffectedProjects = await getUnaffectedProjects(
      karmaProjects,
      angularJson
    );

    console.log('Running tests for the following projects:', karmaProjects);

    await createTempTestingFiles(karmaProjects, angularJson);

    // Exclude all other projects from code coverage.
    const codeCoverageExclude = [
      '**/fixtures/**',
      ...unaffectedProjects.map(
        (project) => `./${angularJson.projects[project].root}/**`
      ),
    ];

    const npxArgs = [
      'nx',
      'run',
      'affected:test',
      '--skipNxCache',
      '--sourceMap=false',
      '--codeCoverage',
      `--codeCoverageExclude=${codeCoverageExclude.join(',')}`,
    ];

    if (argv.karmaConfig) {
      npxArgs.push(`--karmaConfig=${argv.karmaConfig}`);
    }

    await runCommand('npx', npxArgs);

    // TODO: Run karma projects first, then run any "leftover" projects normally.
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testAffected();
