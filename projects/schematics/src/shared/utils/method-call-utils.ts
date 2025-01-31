import { findNodes } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { parseTsFileContent } from './file-utils';

interface ReplaceMethodCallArgumentParams {
  fileContent: string;
  objectName: string;
  methodName: string;
  argument: {
    position: number;
    old: string;
    new: string;
  };
}

/**
 * Replaces an argument in a method call in the given file content.
 *
 * Returns the updated file content.
 */
export function replaceMethodCallArgument({
  fileContent,
  objectName,
  methodName,
  argument,
}: ReplaceMethodCallArgumentParams): string {
  const sourceFile = parseTsFileContent(fileContent);

  const nodes = findNodes(
    sourceFile,
    ts.SyntaxKind.CallExpression,
    undefined,
    true
  );

  // Find all matching method calls
  const targetNodes = nodes.filter((node) => {
    if (!ts.isCallExpression(node)) return false;
    const expression = node.expression;
    if (!ts.isPropertyAccessExpression(expression)) return false;

    const object = expression.expression;
    const method = expression.name;

    if (!ts.isIdentifier(object) || !ts.isIdentifier(method)) return false;

    // Check if this is the method call we're looking for
    const isTargetMethod =
      object.text === objectName && method.text === methodName;
    if (!isTargetMethod) return false;

    const arg = node.arguments[argument.position];
    return ts.isIdentifier(arg) && arg.text === argument.old;
  });

  if (!targetNodes.length) {
    return fileContent;
  }

  // Process all matches
  return targetNodes.reduce((content, targetNode) => {
    if (!ts.isCallExpression(targetNode)) return content;

    // Find the argument to replace
    let argToReplace: ts.Node | undefined;
    argToReplace = targetNode.arguments[argument.position];

    if (!argToReplace) return content;

    return (
      content.slice(0, argToReplace.getStart()) +
      argument.new +
      content.slice(argToReplace.getEnd())
    );
  }, fileContent);
}
