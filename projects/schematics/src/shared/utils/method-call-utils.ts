import { findNodes } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { parseTsFileContent } from './file-utils';

interface ReplaceMethodCallArgumentParams {
  fileContent: string;
  objectName: string;
  methodName: string;
  argument: {
    position: number;
    newText: string;
  };
  throwErrorIfNotFound?: boolean;
}

interface RemoveMethodCallParams {
  fileContent: string;
  objectName: string;
  methodName: string;
  throwErrorIfNotFound?: boolean;
}

interface FindMethodCallsParams {
  fileContent: string;
  objectName: string;
  methodName: string;
}

/**
 * Finds all method calls in the given file content.
 *
 * Returns the method calls.
 */
export function findMethodCalls({
  fileContent,
  objectName,
  methodName,
}: FindMethodCallsParams): ts.CallExpression[] {
  const sourceFile = parseTsFileContent(fileContent);

  // Get all method calls
  const nodes = findNodes(
    sourceFile,
    ts.SyntaxKind.CallExpression,
    undefined,
    true
  );

  return nodes.filter((node): node is ts.CallExpression => {
    if (!ts.isCallExpression(node)) {
      return false;
    }
    const expression = node.expression;
    if (!ts.isPropertyAccessExpression(expression)) {
      return false;
    }

    const object = expression.expression;
    const method = expression.name;

    if (!ts.isIdentifier(object) || !ts.isIdentifier(method)) {
      return false;
    }

    return object.text === objectName && method.text === methodName;
  });
}

export function removeMethodCalls({
  fileContent,
  objectName,
  methodName,
  throwErrorIfNotFound = false,
}: RemoveMethodCallParams): string {
  const targetNodes = findMethodCalls({
    fileContent,
    objectName,
    methodName,
  });

  if (!targetNodes.length) {
    if (throwErrorIfNotFound) {
      throw new Error(
        `Could not remove ${objectName}.${methodName}() method call`
      );
    }
    return fileContent;
  }

  let updatedContent = fileContent;

  targetNodes
    // Remove occurrences from last to first to not interfere with positions
    .reverse()
    .forEach((targetNode) => {
      let start = targetNode.getStart();
      let end = targetNode.getEnd();

      // If the parent is an ExpressionStatement, remove the entire statement including semicolon
      if (ts.isExpressionStatement(targetNode.parent)) {
        start = targetNode.parent.getStart();
        end = targetNode.parent.getEnd();
      }

      updatedContent =
        updatedContent.slice(0, start) + updatedContent.slice(end);
    });

  return updatedContent;
}

/**
 * Replaces an argument in a method call in the given file content.
 * Works for multiple occurrences of the method call.
 *
 * Returns the updated file content.
 */
export function replaceMethodCallArgument({
  fileContent,
  objectName,
  methodName,
  argument,
  throwErrorIfNotFound = false,
}: ReplaceMethodCallArgumentParams): string {
  const targetNodes = findMethodCalls({
    fileContent,
    objectName,
    methodName,
  });

  if (!targetNodes.length) {
    if (throwErrorIfNotFound) {
      throw new Error(
        `Could not replace ${objectName}.${methodName}() method call argument on position ${argument.position}`
      );
    }
    return fileContent;
  }

  // Replace all occurrences of the method call
  let updatedContent = fileContent;

  targetNodes
    // Replace occurrences from last to first - to not interfere with
    // the already calculated start and end positions of the other occurrences
    .reverse()
    .forEach((methodCallNode) => {
      const argumentToReplace = methodCallNode.arguments[argument.position];
      updatedContent =
        updatedContent.slice(0, argumentToReplace.getStart()) +
        argument.newText +
        updatedContent.slice(argumentToReplace.getEnd());
    });

  return updatedContent;
}
