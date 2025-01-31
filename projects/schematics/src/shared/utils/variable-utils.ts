import { findNodes } from '@schematics/angular/utility/ast-utils';
import { parseTsFileContent } from './file-utils';
import * as ts from 'typescript';

interface ReplaceVariableDeclarationParams {
  fileContent: string;
  variableName: string;
  newDeclaration: string;
}

interface RemoveVariableDeclarationParams {
  fileContent: string;
  variableName: string;
}

/**
 * Replaces a variable declaration in the given file content.
 *
 * Returns the updated file content.
 */
export function replaceVariableDeclaration({
  fileContent,
  variableName,
  newDeclaration,
}: ReplaceVariableDeclarationParams): string {
  const sourceFile = parseTsFileContent(fileContent);

  // Get all variables
  const nodes = findNodes(sourceFile, ts.SyntaxKind.VariableDeclaration);

  // Find variable by name
  const targetNode = nodes.find((node) => {
    if (!ts.isVariableDeclaration(node)) return false;
    const name = node.name;
    return ts.isIdentifier(name) && name.text === variableName;
  });

  if (!targetNode) {
    return fileContent;
  }

  // Get the parent VariableStatement - to include the `const` keyword
  const statement = targetNode.parent.parent;
  const start = statement.getStart();
  const end = statement.getEnd();

  // Replace the whole statement
  return fileContent.slice(0, start) + newDeclaration + fileContent.slice(end);
}

/**
 * Removes a variable declaration in the given file content.
 *
 * Returns the updated file content.
 */
export function removeVariableDeclaration({
  fileContent,
  variableName,
}: RemoveVariableDeclarationParams): string {
  return replaceVariableDeclaration({
    fileContent,
    variableName,
    newDeclaration: '',
  });
}
