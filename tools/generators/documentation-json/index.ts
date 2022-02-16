import { basename, normalize, Path, resolve } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { chain, Rule, SchematicsException } from '@angular-devkit/schematics';
import { logger, Tree } from '@nrwl/devkit';
import { JSONOutput } from 'typedoc';
import { readRequiredFile } from '../utility/tree';

import { runCommand } from '../../utility/run-command';

import { getProject, getWorkspace } from '../utility/workspace';

import { Schema } from './schema';
import { glob } from 'glob';

interface AnchorIds {
  [typeName: string]: string;
}

interface CodeExample {
  fileName: string;
  filePath: string;
  rawContents: string;
}

interface DocumentationJson {
  anchorIds?: AnchorIds;
  typedoc?: Partial<JSONOutput.ProjectReflection>;
  codeExamples?: CodeExample[];
}

function readNgPackagrConfig(
  tree: Tree,
  project: ProjectDefinition
): { [_: string]: any } {
  return JSON.parse(readRequiredFile(tree, `${project.root}/ng-package.json`));
}

function getDocumentationJsonPath(
  tree: Tree,
  project: ProjectDefinition
): string {
  const ngPackageJson = readNgPackagrConfig(tree, project);
  const outputPath = resolve(`${project.root}` as Path, ngPackageJson.dest);

  return `${outputPath}/documentation.json`;
}

function ensureDocumentationJson(tree: Tree, documentationJsonPath: string) {
  if (!tree.exists(documentationJsonPath)) {
    tree.write(documentationJsonPath, '{}');
  }
}

function getDocumentationJson(
  tree: Tree,
  project: ProjectDefinition
): DocumentationJson {
  const documentationJsonPath = getDocumentationJsonPath(tree, project);

  ensureDocumentationJson(tree, documentationJsonPath);

  return JSON.parse(
    readRequiredFile(tree, documentationJsonPath)
  ) as DocumentationJson;
}

/**
 * @skyux/docs-tools expects to see paths pointing to the old repo structure when doing component demo page lookups.
 * Replace the new path with the old path until we can figure out a better way to handle this.
 */
function fixSourcesPaths(
  json: Partial<JSONOutput.ProjectReflection>,
  projectName: string
) {
  if (json.children) {
    for (const child of json.children) {
      if (child.sources) {
        for (const source of child.sources) {
          source.fileName = source.fileName.replace(
            /^lib\//, // e.g. 'lib/modules/core/foobar.service.ts'
            `projects/${projectName}/src/` // becomes: 'projects/core/src/modules/core/foobar.service.ts'
          );
        }
      }

      if (child.children) {
        fixSourcesPaths(child, projectName);
      }
    }
  }
}

/**
 * Remaps the component/directive exports that use the lambda 'λ' prefix to the component's class name.
 * @example
 * ```
 * export { SkyAffixDirective as λ1 } from './modules/affix/affix.directive';
 * ```
 */
function remapComponentExports(
  json: Partial<JSONOutput.ProjectReflection>
): Partial<JSONOutput.ProjectReflection> {
  json.children
    ?.filter((child) => {
      return child.name.startsWith('λ');
    })
    .forEach((child) => {
      let originalName = child.name;

      child.children!.forEach((x) => {
        if (x.name === 'constructor') {
          // Using 'any' because TypeDoc has invalid typings.
          const signature: any = x.signatures && x.signatures[0];
          originalName = signature.type.name;
          // Fix the constructor's name.
          signature.name = originalName;
        }
      });

      // Fix the class's name.
      child.name = originalName;
    });

  return json;
}

function toFriendlyUrl(value: string): string {
  const friendly = value
    .toLowerCase()

    // Remove special characters.
    .replace(/[_~`@!#$%^&*()[\]{};:'/\\<>,.?=+|"]/g, '')

    // Replace space characters with a dash.
    .replace(/\s/g, '-')

    // Remove any double-dashes.
    .replace(/--/g, '-');

  return friendly;
}

/**
 * Returns anchor IDs to be used for same-page linking.
 */
function getAnchorIds(json: Partial<JSONOutput.ProjectReflection>): AnchorIds {
  const anchorIdMap: AnchorIds = {};

  json.children
    ?.filter((child) => {
      const kindString = child.kindString?.toLocaleUpperCase();
      return kindString && kindString !== 'VARIABLE';
    })
    .forEach((child) => {
      const kindString = toFriendlyUrl(child.kindString!);
      const friendlyName = toFriendlyUrl(child.name);
      const anchorId = `${kindString}-${friendlyName}`;
      anchorIdMap[child.name] = anchorId;
    });

  return anchorIdMap;
}

/**
 * Escapes a string value to be used in a `RegExp` constructor.
 * @see https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 */
function regexEscape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getCodeExamples(
  tree: Tree,
  projectName: string,
  packageName: string
): Promise<CodeExample[]> {
  const codeExamples: CodeExample[] = [];

  const publicApiPathNoExtension = `libs/${projectName}/index`;

  const examples = glob.sync(
    `apps/code-examples/src/app/code-examples/${projectName}/**/*`,
    {
      nodir: true,
    }
  );

  for (const filePath of examples) {
    console.log(`Processing code example: ${filePath}`);

    const rawContents = tree
      .read(filePath)
      .toString()
      .replace(
        new RegExp(
          `('|")(${regexEscape(publicApiPathNoExtension)}|${regexEscape(
            publicApiPathNoExtension.replace(/\/index$/, '')
          )})('|")`,
          'gi'
        ),
        `'${packageName}'`
      );

    // Remove the trailing `.template` extension, if it exists.
    const fileName = basename(filePath as Path);

    // @skyux/docs-tools expects to see the old repo paths when doing code example lookups.
    // Replace the new path with the old path until we can figure out a better way to handle this.
    const fixedFilePath = filePath.replace(
      `apps/code-examples/src/app/code-examples/${projectName}/`,
      `/projects/${projectName}/documentation/code-examples/`
    );

    codeExamples.push({
      fileName,
      filePath: fixedFilePath,
      rawContents,
    });
  }

  return codeExamples;
}

async function generateDocumentationJson(
  tree: Tree,
  projectName: string,
  packageName: string,
  projectRoot: string,
  publicApiPath: string
) {
  const documentationJsonPath = `dist/${projectRoot}/documentation.json`;

  await runCommand('./node_modules/.bin/typedoc', [
    publicApiPath,
    ...['--tsconfig', `${projectRoot}/tsconfig.lib.prod.json`],
    ...['--json', documentationJsonPath, '--pretty'],
    ...['--emit', 'docs'],
    ...[
      '--exclude',
      `"!**/${projectRoot}/**"`,
      '--exclude',
      '"**/(fixtures|node_modules)/**"',
      '--exclude',
      '"**/*+(.fixture|.spec).ts"',
    ],
    ...['--externalPattern', `"!**/${projectRoot}/**"`],
    '--excludeExternals',
    '--excludeInternal',
    '--excludePrivate',
    '--excludeProtected',
  ]);

  const typedocOutput = JSON.parse(
    await tree.read(documentationJsonPath).toString()
  );

  fixSourcesPaths(typedocOutput, projectName);

  const typedocJson = remapComponentExports(typedocOutput);
  const anchorIds = getAnchorIds(typedocJson);

  const documentationJson: DocumentationJson = {};
  documentationJson.anchorIds = anchorIds;
  documentationJson.typedoc = typedocJson;
  documentationJson.codeExamples = await getCodeExamples(
    tree,
    projectName,
    packageName
  );

  tree.write(
    documentationJsonPath,
    JSON.stringify(documentationJson, undefined, 2)
  );
}

export default async function (tree: Tree, options: Schema): Promise<void> {
  const { workspace } = await getWorkspace(tree);
  const { project, projectName } = await getProject(workspace, options.project);

  logger.info(
    `Attempting to generate documentation for project "${projectName}"...`
  );

  if (project.extensions.projectType !== 'library') {
    throw new SchematicsException(
      'Only library projects can generate documentation.'
    );
  }

  // const documentationJson = getDocumentationJson(tree, project);

  const ngPackageJson = readNgPackagrConfig(tree, project);
  const publicApiPath = normalize(
    `${project.root}/${ngPackageJson.lib.entryFile}`
  );

  const packageJson = JSON.parse(
    tree.read(`${project.root}/package.json`).toString()
  );

  await generateDocumentationJson(
    tree,
    projectName,
    packageJson.name,
    project.root,
    publicApiPath
  );
}
