/*
 * Copyright Google LLC All Rights Reserved.
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { normalize } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from './workspace-utils';

/**
 * Gets all tsconfig paths (or only for specific project) from a CLI project by reading the workspace configuration
 * and looking for common tsconfig locations.
 */
export function getProjectTsConfigPaths(
  tree: Tree,
  project?: string
): { buildPaths: string[]; testPaths: string[] } {
  const buildPaths = new Set<string>([]);
  const testPaths = new Set<string>([]);

  // Add any tsconfig directly referenced in a build or test task of the angular.json workspace.
  const { workspace } = getWorkspace(tree);

  if (workspace) {
    if (project) {
      if (workspace.projects[project]) {
        const buildPath = getTargetTsconfigPath(
          workspace.projects[project],
          'build'
        );
        const testPath = getTargetTsconfigPath(
          workspace.projects[project],
          'test'
        );

        addBuildPath(buildPath);
        addTestPath(testPath);
      }
    } else {
      const projects = Object.keys(workspace.projects).map(
        (name) => workspace.projects[name]
      );
      for (const workspaceProject of projects) {
        const buildPath = getTargetTsconfigPath(workspaceProject, 'build');
        const testPath = getTargetTsconfigPath(workspaceProject, 'test');

        addBuildPath(buildPath);
        addTestPath(testPath);
      }
    }
  }

  // Filter out tsconfig files that don't exist in the CLI project.
  return {
    buildPaths: Array.from(buildPaths).filter((p) => tree.exists(p)),
    testPaths: Array.from(testPaths).filter((p) => tree.exists(p)),
  };

  function addBuildPath(path: string | null) {
    if (path) {
      buildPaths.add(path);
    }
  }

  function addTestPath(path: string | null) {
    if (path) {
      testPaths.add(path);
    }
  }
}

/** Gets the tsconfig path from the given target within the specified project. */
function getTargetTsconfigPath(
  project: WorkspaceProject,
  targetName: string
): string | null {
  if (
    project.targets &&
    project.targets[targetName] &&
    project.targets[targetName].options?.tsConfig
  ) {
    return normalize(project.targets[targetName].options.tsConfig);
  }

  if (
    project.architect &&
    project.architect[targetName] &&
    project.architect[targetName].options?.tsConfig
  ) {
    return normalize(project.architect[targetName].options.tsConfig);
  }
  return null;
}
