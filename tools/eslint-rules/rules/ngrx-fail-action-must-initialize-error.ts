/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import {
  implementsInterface,
  isPropertyInitialized,
} from './utils/typescript-ast-utils';

export const RULE_NAME = 'ngrx-fail-action-must-initialize-error';
const ERROR_PROPERTY_NAME = 'error';
const ERROR_ACTION_INTERFACE = 'ErrorAction';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensures declared `error` property in NgRx Failure Actions is initialized',
    },
    schema: [],
    messages: {
      missingErrorInitialization:
        '[Spartacus] NgRx Failure Action that implements `ErrorAction` interface must initialize the `error` property. You can do this in the constructor or as a property initializer',
    },
    // Removing fixable since we don't want to enforce any particular initialization pattern
    fixable: undefined,
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      'ClassDeclaration[id.name=/Fail/]'(node: TSESTree.ClassDeclaration) {
        const classType = checker.getTypeAtLocation(
          services.esTreeNodeToTSNodeMap.get(node)
        );

        if (!implementsInterface(classType, ERROR_ACTION_INTERFACE, checker)) {
          return;
        }

        if (!isPropertyInitialized(classType, ERROR_PROPERTY_NAME)) {
          context.report({
            node: node.id ?? node,
            messageId: 'missingErrorInitialization',
          });
        }
      },
    };
  },
});
