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
      description:
        'Ensures declared `error` property in NgRx Failure Actions is initialized',
    },
    schema: [],
    messages: {
      missingErrorInitialization:
        '[Spartacus] NgRx Failure Action that implements `ErrorAction` interface must initialize the `error` property. You can do this in the constructor, as a property initializer, or in any other initialization logic.',
    },
    // Removing fixable since we don't want to enforce any particular initialization pattern
    fixable: undefined,
  },
  defaultOptions: [],
  create(context) {
    /**
     * Checks if the class has an `error` property declaration.
     * This function only verifies the existence of the property declaration,
     * not its initialization state.
     *
     * @param {TSESTree.ClassDeclaration} node - The class declaration node to check
     * @returns {boolean} True if the class has an `error` property declaration
     */
    function hasErrorPropertyDeclaration(
      node: TSESTree.ClassDeclaration
    ): boolean {
      return node.body.body.some(
        (member) =>
          member.type === TSESTree.AST_NODE_TYPES.PropertyDefinition &&
          member.key.type === TSESTree.AST_NODE_TYPES.Identifier &&
          member.key.name === 'error'
      );
    }

    /**
     * Checks if the `error` property is properly initialized in the class.
     * The property is considered initialized if any of the following is true:
     * 1. It has an initializer in the property declaration
     * 2. It's initialized via a constructor parameter
     * 3. It's assigned a value in the constructor body
     *
     * @param {TSESTree.ClassDeclaration} node - The class declaration node to check
     * @returns {boolean} True if the `error` property is initialized
     */
    function isErrorPropertyInitialized(
      node: TSESTree.ClassDeclaration
    ): boolean {
      // Check for property initializer
      const hasInitializer = node.body.body.some(
        (member) =>
          member.type === TSESTree.AST_NODE_TYPES.PropertyDefinition &&
          member.key.type === TSESTree.AST_NODE_TYPES.Identifier &&
          member.key.name === 'error' &&
          member.value !== null
      );

      if (hasInitializer) {
        return true;
      }

      // Check constructor
      const constructor = node.body.body.find(
        (member): member is TSESTree.MethodDefinition =>
          member.type === TSESTree.AST_NODE_TYPES.MethodDefinition &&
          member.kind === 'constructor'
      );

      if (constructor) {
        // Check constructor parameters
        const constructorParams = (
          constructor.value as TSESTree.FunctionExpression
        ).params;
        const hasErrorParam = constructorParams.some((param) => {
          if (param.type === TSESTree.AST_NODE_TYPES.TSParameterProperty) {
            return (
              param.parameter.type === TSESTree.AST_NODE_TYPES.Identifier &&
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
        return constructorBody.body.some((statement) => {
          if (statement.type === TSESTree.AST_NODE_TYPES.ExpressionStatement) {
            const expr = statement.expression;
            if (expr.type === TSESTree.AST_NODE_TYPES.AssignmentExpression) {
              const left = expr.left;
              return (
                left.type === TSESTree.AST_NODE_TYPES.MemberExpression &&
                left.object.type === TSESTree.AST_NODE_TYPES.ThisExpression &&
                left.property.type === TSESTree.AST_NODE_TYPES.Identifier &&
                left.property.name === 'error'
              );
            }
          }
          return false;
        });
      }

      return false;
    }

    return {
      'ClassDeclaration[id.name=/Fail/]'(node: TSESTree.ClassDeclaration) {
        // Only check classes that implement ErrorAction
        const implementsClause = node.implements?.[0];
        if (
          !implementsClause ||
          implementsClause.expression.type !==
            TSESTree.AST_NODE_TYPES.Identifier ||
          implementsClause.expression.name !== 'ErrorAction'
        ) {
          return;
        }

        // Only check if error property is declared but not initialized
        if (
          hasErrorPropertyDeclaration(node) &&
          !isErrorPropertyInitialized(node)
        ) {
          context.report({
            node: node.id ?? node,
            messageId: 'missingErrorInitialization',
          });
        }
      },
    };
  },
});
