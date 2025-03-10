/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import {
  ProjectType,
  WorkspaceProject,
  WorkspaceSchema,
  WorkspaceTargets,
} from '@schematics/angular/utility/workspace-models';
import { parse } from 'jsonc-parser';
import { Schema as SpartacusOptions } from '../../add-spartacus/schema';
import {
  SPARTACUS_CONFIGURATION_MODULE,
  SPARTACUS_CORE,
  SPARTACUS_FEATURES_MODULE,
  SPARTACUS_MODULE,
} from '../libs-constants';
import { debugLogRule } from './logger-utils';
import { ensureModuleExists } from './new-module-utils';

const DEFAULT_POSSIBLE_PROJECT_FILES = ['/angular.json', '/.angular.json'];

export function getSourceRoot(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined } = {}
): string {
  const workspace = getWorkspace(host).workspace;

  if (!options.project) {
    options.project = getDefaultProjectNameFromWorkspace(host);
  }

  const sourceRoot = workspace.projects[options.project].sourceRoot;
  if (!sourceRoot) {
    throw new SchematicsException('No default project found');
  }

  return sourceRoot;
}

export function getWorkspace(
  host: Tree,
  files = DEFAULT_POSSIBLE_PROJECT_FILES
): { path: string; workspace: WorkspaceSchema } {
  const angularJson = getAngularJsonFile(host, files);
  const path = files.filter((filePath) => host.exists(filePath))[0];

  return {
    path,
    workspace: angularJson,
  };
}

export function getAngularJsonFile(
  tree: Tree,
  possibleProjectFiles = DEFAULT_POSSIBLE_PROJECT_FILES
): WorkspaceSchema {
  const path = possibleProjectFiles.filter((filePath) =>
    tree.exists(filePath)
  )[0];
  if (!path) {
    throw new SchematicsException(`Could not find Angular`);
  }

  const configBuffer = tree.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }

  const angularJsonContent = configBuffer.toString();
  return parse(angularJsonContent, undefined, { allowTrailingComma: true });
}

export function getProjectFromWorkspace<
  TProjectType extends ProjectType.Application,
>(
  tree: Tree,
  options: SpartacusOptions,
  files = DEFAULT_POSSIBLE_PROJECT_FILES
): WorkspaceProject<TProjectType> {
  const { workspace } = getWorkspace(tree, files);

  if (!options.project) {
    throw new SchematicsException('Option "project" is required.');
  }

  const project = workspace.projects[options.project];
  if (!project) {
    throw new SchematicsException(`Project is not defined in this workspace.`);
  }

  if (project.projectType !== 'application') {
    throw new SchematicsException(
      `Spartacus requires a project type of "application".`
    );
  }

  return project as WorkspaceProject<ProjectType.Application>;
}

export function getDefaultProjectNameFromWorkspace(tree: Tree): string {
  const workspace = getWorkspace(tree).workspace;

  return Object.keys(workspace.projects)[0];
}

export function getProjectTargets(project: WorkspaceProject): WorkspaceTargets;
export function getProjectTargets(
  workspaceOrHost: WorkspaceSchema | Tree,
  projectName: string
): WorkspaceTargets;
export function getProjectTargets(
  projectOrHost: WorkspaceProject | Tree | WorkspaceSchema,
  projectName = ''
): WorkspaceTargets {
  const project = isWorkspaceProject(projectOrHost)
    ? projectOrHost
    : getProject(projectOrHost, projectName);

  const projectTargets = project.targets || project.architect;
  if (!projectTargets) {
    throw new Error('Project target not found.');
  }

  return projectTargets;
}

/**
 * Build a default project path for generating.
 * @param project The project to build the path for.
 */
export function buildDefaultPath(project: WorkspaceProject): string {
  const root = project.sourceRoot
    ? `/${project.sourceRoot}/`
    : `/${project.root}/src/`;

  const projectDirName =
    project.projectType === ProjectType.Application ? 'app' : 'lib';

  return `${root}${projectDirName}`;
}

export function getProject<
  TProjectType extends ProjectType = ProjectType.Application,
>(
  workspaceOrHost: WorkspaceSchema | Tree,
  projectName: string
): WorkspaceProject<TProjectType> {
  const workspace = isWorkspaceSchema(workspaceOrHost)
    ? workspaceOrHost
    : getWorkspace(workspaceOrHost).workspace;

  return workspace.projects[projectName] as WorkspaceProject<TProjectType>;
}

export function isWorkspaceSchema(
  workspace: any
): workspace is WorkspaceSchema {
  return !!(workspace && (workspace as WorkspaceSchema).projects);
}

export function isWorkspaceProject(project: any): project is WorkspaceProject {
  return !!(project && (project as WorkspaceProject).projectType);
}

export function validateSpartacusInstallation(packageJson: any): void {
  if (!packageJson.dependencies.hasOwnProperty(SPARTACUS_CORE)) {
    throw new SchematicsException(
      `Spartacus is not detected. Please first install Spartacus by running: 'ng add @spartacus/schematics'.
    To see more options, please check our documentation: https://sap.github.io/spartacus-docs/schematics/`
    );
  }
}

export function scaffoldStructure(options: SpartacusOptions): Rule {
  const APP_PATH = 'app/spartacus';
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      debugLogRule(`⌛️ Scaffolding Spartacus file structure...`, options.debug),

      ensureModuleExists({
        name: SPARTACUS_MODULE,
        path: APP_PATH,
        module: 'app',
        project: options.project,
      }),
      ensureModuleExists({
        name: SPARTACUS_FEATURES_MODULE,
        path: APP_PATH,
        module: 'spartacus',
        project: options.project,
      }),
      ensureModuleExists({
        name: SPARTACUS_CONFIGURATION_MODULE,
        path: APP_PATH,
        module: 'spartacus',
        project: options.project,
      }),

      debugLogRule(`✅ Spartacus file structure scaffolded.`, options.debug),
    ]);
  };
}

/**
 * Creates the `silenceDeprecations` option for the `sass` preprocessor options.
 *
 * This is needed because Sass `@import` is used in Spartacus and Bootstrap 4 styles,
 * and since Angular v19, all apps would have a wall of deprecation warnings
 * in the console when running `ng serve`.
 *
 * @param context - The schematic context.
 */
export function createSassSilenceDeprecations(
  context: SchematicContext,
  originalStylePreprocessorOptions: {
    sass?: { silenceDeprecations?: string[] };
    [key: string]: any;
  } = {}
): { sass: { silenceDeprecations: string[] } } {
  const DEFAULT_SILENCE_DEPRECATIONS = [
    // We need to silence the deprecation warning for the `@import` directive
    // because `@import` is used in the Spartacus styles and in the Bootstrap 4 styles
    // (which are imported by the Spartacus styles).
    // Otherwise, since Angular v19, all apps would have a wall of deprecation warnings
    // in the console when running `ng serve`.
    //
    // CXSPA-447: Eventually we should remove all the `@import` directives from the Spartacus styles
    // and drop the usage of Bootstrap 4, and then we can remove the `silenceDeprecations` option.
    'import',
  ];

  context.logger.warn(
    `⚠️ Warnings about the Sass '@import' usage were silenced, because Sass '@import' is used in Spartacus and Bootstrap 4 styles. To enable warnings back, in your 'angular.json' file remove the item "import" from the array at section 'architect.build.options.stylePreprocessorOptions.sass.silenceDeprecations'. For more, see: https://sass-lang.com/blog/import-is-deprecated and https://angular.dev/reference/configs/workspace-config#style-preprocessor-options`
  );

  return {
    sass: {
      ...(originalStylePreprocessorOptions.sass || {}),
      silenceDeprecations: Array.from(
        new Set([
          ...(originalStylePreprocessorOptions.sass?.silenceDeprecations || []),
          ...DEFAULT_SILENCE_DEPRECATIONS,
        ])
      ),
    },
  };
}
