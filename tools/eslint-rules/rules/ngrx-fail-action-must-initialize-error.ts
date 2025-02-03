/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

export const RULE_NAME = 'ngrx-fail-action-must-initialize-error';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures NgRx Failure Actions initialize error property',
    },
    schema: [],
    messages: {
      missingErrorProperty:
        '[Spartacus] NgRx Failure Action must initialize the error property. You can do this in the constructor, as a property initializer, or in any other initialization logic.',
    },
    // Removing fixable since we don't want to enforce any particular initialization pattern
    fixable: undefined,
  },
  defaultOptions: [],
  create(context) {
    function hasInitializedErrorProperty(
      node: TSESTree.ClassDeclaration
    ): boolean {
      const constructor = node.body.body.find(
        (member): member is TSESTree.MethodDefinition =>
          member.type === 'MethodDefinition' && member.kind === 'constructor'
      );

      // Check constructor parameters
      if (constructor) {
        const constructorParams = (
          constructor.value as TSESTree.FunctionExpression
        ).params;
        const hasErrorParam = constructorParams.some((param) => {
          if (param.type === 'TSParameterProperty') {
            return (
              param.parameter.type === 'Identifier' &&
              param.parameter.name === 'error'
            );
          }
          return false;
        });

        if (hasErrorParam) {
          return true;
        }

        // Check constructor body
        const constructorBody = (
          constructor.value as TSESTree.FunctionExpression
        ).body;
        const hasErrorAssignment = constructorBody.body.some((statement) => {
          if (statement.type === 'ExpressionStatement') {
            const expr = statement.expression;
            if (expr.type === 'AssignmentExpression') {
              const left = expr.left;
              return (
                left.type === 'MemberExpression' &&
                left.object.type === 'ThisExpression' &&
                left.property.type === 'Identifier' &&
                left.property.name === 'error'
              );
            }
          }
          return false;
        });

        if (hasErrorAssignment) {
          return true;
        }
      }

      // Check for class property initializers
      return node.body.body.some(
        (member) =>
          member.type === 'PropertyDefinition' &&
          member.key.type === 'Identifier' &&
          member.key.name === 'error' &&
          member.value !== null
      );
    }

    return {
      'ClassDeclaration[id.name=/Fail/]'(node: TSESTree.ClassDeclaration) {
        // Only check classes that implement ErrorAction
        const implementsClause = node.implements?.[0];
        if (
          !implementsClause ||
          implementsClause.expression.type !== 'Identifier' ||
          implementsClause.expression.name !== 'ErrorAction'
        ) {
          return;
        }

        if (!hasInitializedErrorProperty(node)) {
          context.report({
            node: node.id ?? node,
            messageId: 'missingErrorProperty',
          });
        }
      },
    };
  },
});
