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
  const sourceFile = parseTsFileContent(fileContent);

  // Get all method calls
  const nodes = findNodes(
    sourceFile,
    ts.SyntaxKind.CallExpression,
    undefined,
    true
  );

  // Find a method call by name of object and name of method
  // and the presence of some argument at the expected position
  const targetNodes = nodes.filter((node): node is ts.CallExpression => {
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

    if (node.arguments.length <= argument.position) {
      return false;
    }

    return object.text === objectName && method.text === methodName;
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
    .forEach((targetNode) => {
      const argumentToReplace = targetNode.arguments[argument.position];
      updatedContent =
        updatedContent.slice(0, argumentToReplace.getStart()) +
        argument.newText +
        updatedContent.slice(argumentToReplace.getEnd());
    });

  return updatedContent;
}
