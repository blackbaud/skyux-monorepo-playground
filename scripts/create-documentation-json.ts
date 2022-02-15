import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { JSONOutput } from 'typedoc';

import { runCommand } from './utils/run-command';

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
 * Escapes a string value to be used in a `RegExp` constructor.
 * @see https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 */
function regexEscape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

async function getCodeExamples(
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

    const rawContents = (
      await fs.readFile(path.resolve(filePath), { encoding: 'utf-8' })
    )
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
    const fileName = path.basename(filePath);

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

async function createDocumentationJson() {
  try {
    const projectName = 'core';
    const packageName = '@skyux/core';

    const documentationJsonPath = `dist/libs/${projectName}/documentation.json`;

    await runCommand('./node_modules/.bin/typedoc', [
      `libs/${projectName}/src/index.ts`,
      ...['--tsconfig', `libs/${projectName}/tsconfig.lib.prod.json`],
      ...['--json', documentationJsonPath, '--pretty'],
      ...['--emit', 'docs'],
      ...[
        '--exclude',
        `"!**/libs/${projectName}/**"`,
        '--exclude',
        '"**/(fixtures|node_modules)/**"',
        '--exclude',
        '"**/*+(.fixture|.spec).ts"',
      ],
      ...['--externalPattern', `"!**/libs/${projectName}/**"`],
      '--excludeExternals',
      '--excludeInternal',
      '--excludePrivate',
      '--excludeProtected',
    ]);

    const typedocOutput = await fs.readJson(
      path.resolve(process.cwd(), documentationJsonPath)
    );

    const typedocJson = remapComponentExports(typedocOutput);
    const anchorIds = getAnchorIds(typedocJson);

    const documentationJson: DocumentationJson = {};
    documentationJson.anchorIds = anchorIds;
    documentationJson.typedoc = typedocJson;
    documentationJson.codeExamples = await getCodeExamples(
      projectName,
      packageName
    );

    await fs.writeJson(documentationJsonPath, documentationJson, { spaces: 2 });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

createDocumentationJson();
