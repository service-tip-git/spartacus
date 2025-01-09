import { normalize } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

/**
 * Finds the server.ts file in the project.
 * Checks both root and src directory locations.
 */
function findServerFile(tree: Tree): string | null {
  const possiblePaths = ['./server.ts', './src/server.ts'];

  for (const path of possiblePaths) {
    if (tree.exists(normalize(path))) {
      return path;
    }
  }
  return null;
}

/**
 * Creates a new AST node for the indexHtml assignment.
 * The new assignment will use serverDistFolder and index.server.html.
 * @param originalQuoteStyle - Whether to use single (true) or double (false) quotes
 */
function createNewIndexHtmlAssignment(
  originalQuoteStyle: boolean = true
): ts.Statement {
  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier('indexHtml'),
          undefined,
          undefined,
          ts.factory.createCallExpression(
            ts.factory.createIdentifier('join'),
            undefined,
            [
              ts.factory.createIdentifier('serverDistFolder'),
              ts.factory.createStringLiteral(
                'index.server.html',
                originalQuoteStyle
              ),
            ]
          )
        ),
      ],
      ts.NodeFlags.Const
    )
  );
}

/**
 * Determines if a string literal uses single or double quotes.
 * @param node - The string literal node to check
 * @returns true for single quotes, false for double quotes
 */
function getQuotePreference(node: ts.StringLiteral): boolean {
  return node.getText().startsWith("'");
}

interface JoinCallResult {
  isMatch: boolean;
  quotePreference?: boolean;
}

/**
 * Checks if a node is a join() call with 'index.html' as the last argument.
 * Also determines the quote style used in the original code.
 */
function isJoinCallWithIndexHtml(node: ts.Node): JoinCallResult {
  if (!ts.isCallExpression(node)) return { isMatch: false };
  if (!ts.isIdentifier(node.expression) || node.expression.text !== 'join')
    return { isMatch: false };

  const lastArg = node.arguments[node.arguments.length - 1];
  if (!ts.isStringLiteral(lastArg)) return { isMatch: false };

  if (lastArg.text === 'index.html') {
    return {
      isMatch: true,
      quotePreference: getQuotePreference(lastArg),
    };
  }

  return { isMatch: false };
}

/**
 * Updates the server.ts file content by replacing the indexHtml assignment
 * that uses browserDistFolder/index.html with serverDistFolder/index.server.html.
 * Preserves the original quote style and all other content.
 */
function updateServerContent(content: string): string {
  const sourceFile = ts.createSourceFile(
    'server.ts',
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  });

  // Create a transformer to handle nested replacements
  const transformer = (context: ts.TransformationContext) => {
    const visit = (node: ts.Node): ts.Node => {
      // Recursively visit and transform nodes
      node = ts.visitEachChild(node, visit, context);

      // Check if this node is a variable statement containing indexHtml assignment
      if (ts.isVariableStatement(node)) {
        const declarations = node.declarationList.declarations;
        if (declarations.length === 1) {
          const declaration = declarations[0];
          if (
            ts.isIdentifier(declaration.name) &&
            declaration.name.text === 'indexHtml' &&
            declaration.initializer
          ) {
            const { isMatch, quotePreference } = isJoinCallWithIndexHtml(
              declaration.initializer
            );
            if (isMatch) {
              return createNewIndexHtmlAssignment(quotePreference);
            }
          }
        }
      }

      return node;
    };

    return (node: ts.Node) => ts.visitNode(node, visit);
  };

  // Apply the transformer
  const result = ts.transform(sourceFile, [transformer]);
  const transformedSourceFile = result.transformed[0];

  const output = printer.printFile(transformedSourceFile as ts.SourceFile);
  result.dispose(); // Clean up
  return output;
}

/**
 * Creates a rule that updates the server.ts file to use index.server.html
 * instead of index.html when using the application builder.
 */
export function updateServerFile(): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    context.logger.info('🔍 Checking if server.ts needs to be updated...');
    const serverFilePath = findServerFile(tree);
    if (!serverFilePath) {
      context.logger.warn('🔍 Could not find server.ts file - skipping update');
      return;
    }

    context.logger.info(
      `🔄 Updating ${serverFilePath} to use index.server.html`
    );

    const buffer = tree.read(serverFilePath);
    if (!buffer) {
      context.logger.warn(
        `⚠️ Could not read ${serverFilePath} - skipping update`
      );
      return;
    }

    const content = buffer.toString();
    const updatedContent = updateServerContent(content);
    tree.overwrite(serverFilePath, updatedContent);
    context.logger.info(`✅ Successfully updated ${serverFilePath}`);
  };
}
