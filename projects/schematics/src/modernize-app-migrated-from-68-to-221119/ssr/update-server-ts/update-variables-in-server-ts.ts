import { replaceMethodCallArgument } from '../../../shared/utils/method-call-utils';
import { replaceVariableDeclaration } from '../../../shared/utils/variable-utils';

/**
 * Updates variables and method calls in server.ts file.
 */
export function updateVariablesInServerTs(updatedContent: string): string {
  /*
   * Removes `distFolder` variable declaration and replaces with 2 new variables:
   * `serverDistFolder` and `browserDistFolder`
   *
   *   ```diff
   *   - const distFolder = join(process.cwd(), 'dist/<APP-NAME>/browser');
   *   +  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
   *   +  const browserDistFolder = resolve(serverDistFolder, '../browser');
   *   ```
   */
  updatedContent = replaceVariableDeclaration({
    fileContent: updatedContent,
    variableName: 'distFolder',
    newDeclaration: `const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');`,
  });

  /*
   * Replace `indexHtml` variable declaration to use `browserDistFolder`
   *   ```diff
   *   - const indexHtml = existsSync(join(distFolder, 'index.original.html'))
   *   -   ? 'index.original.html'
   *   -   : 'index';
   *   +  const indexHtml = join(browserDistFolder, 'index.html');
   *   ```
   */
  updatedContent = replaceVariableDeclaration({
    fileContent: updatedContent,
    variableName: 'indexHtml',
    newDeclaration: `const indexHtml = join(browserDistFolder, 'index.html');`,
  });

  /*
   * Change `server.set(_, distFolder)` to `server.set(_, browserDistFolder)`
   *
   *   ```diff
   *   -  server.set('views', distFolder);
   *   +  server.set('views', browserDistFolder);
   *   ```
   */
  updatedContent = replaceMethodCallArgument({
    fileContent: updatedContent,
    objectName: 'server',
    methodName: 'set',
    argument: {
      position: 1,
      newText: 'browserDistFolder',
    },
  });

  /*
   * Change `express.static(distFolder, { ... })` to `express.static(browserDistFolder, { ... })`
   *
   *   ```diff
   *   server.get(
   *     '*.*',
   *   -    express.static(distFolder, {
   *   +    express.static(browserDistFolder, {
   *   ```
   */
  updatedContent = replaceMethodCallArgument({
    fileContent: updatedContent,
    objectName: 'express',
    methodName: 'static',
    argument: {
      position: 0,
      newText: 'browserDistFolder',
    },
  });

  return updatedContent;
}
