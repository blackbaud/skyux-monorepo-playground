import {
  ProjectDefinition,
  readWorkspace,
  WorkspaceDefinition,
  WorkspaceHost,
} from '@angular-devkit/core/src/workspace';
import { SchematicsException } from '@angular-devkit/schematics';
import { Tree } from '@nrwl/devkit';

import { readRequiredFile } from './tree';

/**
 * Creates a workspace host.
 * Taken from: https://angular.io/guide/schematics-for-libraries#get-the-project-configuration
 */
function createHost(tree: Tree): WorkspaceHost {
  return {
    /* istanbul ignore next */
    async readFile(path: string): Promise<string> {
      return readRequiredFile(tree, path);
    },
    /* istanbul ignore next */
    async writeFile(path: string, data: string): Promise<void> {
      return tree.write(path, data);
    },
    /* istanbul ignore next */
    async isDirectory(path: string): Promise<boolean> {
      // approximate a directory check
      return !tree.exists(path) && tree.children(path).length > 0;
    },
    /* istanbul ignore next */
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

/**
 * Returns the workspace host and project config (angular.json).
 */
export async function getWorkspace(tree: Tree): Promise<{
  host: WorkspaceHost;
  workspace: WorkspaceDefinition;
}> {
  const host = createHost(tree);
  const { workspace } = await readWorkspace('/', host);
  return { host, workspace };
}

export async function getProject(
  workspace: WorkspaceDefinition,
  projectName: string
): Promise<{ project: ProjectDefinition; projectName: string }> {
  const project = workspace.projects.get(projectName);
  /* istanbul ignore next */
  if (!project) {
    throw new SchematicsException(
      `The "${projectName}" project is not defined in angular.json. Provide a valid project name.`
    );
  }

  return { project, projectName };
}
