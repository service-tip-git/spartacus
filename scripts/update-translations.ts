import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface TranslationFile {
  name: string;
  importPath: string;
}

interface TranslationChunksConfig {
  [chunkName: string]: string[];
}

interface ValidationError {
  file: string;
  chunkName: string;
  suggestedName: string;
  fullPath: string;
}

interface ModifiedFiles {
  indexFiles: Set<string>;
  translationFiles: Set<string>;
}

function findTranslationDirs(): string[] {
  const translationDirs = glob.sync('**/assets/{,src/}translations', {
    ignore: ['**/node_modules/**', '**/dist/**'],
  });
  return translationDirs;
}

function getLanguageDirs(translationDir: string): string[] {
  return fs
    .readdirSync(translationDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function getJsonFiles(languageDir: string): TranslationFile[] {
  const jsonFiles = glob.sync('*.json', { cwd: languageDir });
  return jsonFiles.map((file) => ({
    name: path.basename(file, '.json'),
    importPath: `./${file}`,
  }));
}

function extractPrimaryKeys(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    return Object.keys(json);
  } catch (error) {
    console.error(`Error reading/parsing JSON file ${filePath}:`, error);
    return [];
  }
}

function generateChunksConfig(translationDir: string): TranslationChunksConfig {
  const enDir = path.join(translationDir, 'en');
  if (!fs.existsSync(enDir)) {
    console.warn(`Warning: 'en' directory not found in ${translationDir}`);
    return {};
  }

  const config: TranslationChunksConfig = {};
  const jsonFiles = glob.sync('*.json', { cwd: enDir });

  for (const file of jsonFiles) {
    const chunkName = path.basename(file, '.json');
    const primaryKeys = extractPrimaryKeys(path.join(enDir, file));
    if (primaryKeys.length > 0) {
      if (!isCamelOrPascalCase(chunkName)) {
        const camelCaseName = chunkName
          .split(/[-_\s]+/)
          .map((word, index) =>
            index === 0
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join('');

        const currentFile = path.relative(
          process.cwd(),
          path.join(enDir, file)
        );
        const targetFile = path.relative(
          process.cwd(),
          path.join(enDir, `${camelCaseName}.json`)
        );

        throw new Error(
          `Invalid chunk name '${chunkName}' found in file '${currentFile}'\n` +
            'Error: Chunk names should be in camelCase\n' +
            'To fix this:\n' +
            `1. Rename the file using this command:\n` +
            `   mv "${currentFile}" "${targetFile}"\n` +
            `2. Update all imports and references to use '${camelCaseName}'\n` +
            'Rules for valid names:\n' +
            '- Must start with a letter (a-z, A-Z)\n' +
            '- Can contain only letters and numbers\n' +
            '- Cannot be a JavaScript reserved word\n' +
            '- Cannot contain hyphens, underscores or special characters\n' +
            'Examples:\n' +
            '- camelCase: myAccount, userProfile, commonElements'
        );
      }
      config[chunkName] = primaryKeys;
    }
  }

  return config;
}

function generateLanguageIndex(
  languageDir: string,
  translationFiles: TranslationFile[],
  modifiedFiles: ModifiedFiles
): void {
  const imports = translationFiles
    .map((file) => `import ${file.name} from '${file.importPath}';`)
    .join('\n');

  const exportObject = `\nexport const ${path.basename(
    languageDir
  )} = {\n${translationFiles.map((file) => `  ${file.name},`).join('\n')}\n};\n`;

  const indexContent = imports + exportObject;
  const indexPath = path.join(languageDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  modifiedFiles.indexFiles.add(indexPath);
}

const RESERVED_WORDS = new Set([
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'super',
  'switch',
  'static',
  'this',
  'throw',
  'try',
  'true',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);

function isCamelOrPascalCase(str: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9]*$/.test(str) && !RESERVED_WORDS.has(str);
}

function formatChunksConfig(config: TranslationChunksConfig): string {
  const lines = [
    'export const translationChunksConfig: TranslationChunksConfig = {',
  ];

  for (const [chunk, keys] of Object.entries(config)) {
    lines.push(`  ${chunk}: [${keys.map((key) => `'${key}'`).join(', ')}],`);
  }

  lines.push('};');
  return lines.join('\n');
}

function generateMainTranslations(
  translationDir: string,
  languages: string[],
  chunksConfig: TranslationChunksConfig,
  modifiedFiles: ModifiedFiles
): void {
  const languageExports = languages
    .map((lang) => {
      const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
      return `export { ${lang} as translations${capitalizedLang} } from './${lang}/index';`;
    })
    .join('\n');

  const configContent =
    `import { TranslationChunksConfig } from '@spartacus/core';\n\n` +
    `${formatChunksConfig(chunksConfig)}\n\n` +
    languageExports +
    '\n';

  const translationsPath = path.join(translationDir, 'translations.ts');
  fs.writeFileSync(translationsPath, configContent);
  modifiedFiles.translationFiles.add(translationsPath);
}

function processTranslationDir(
  translationDir: string,
  modifiedFiles: ModifiedFiles
): void {
  console.log(`Processing translation directory: ${translationDir}`);

  const languages = getLanguageDirs(translationDir);
  const chunksConfig = generateChunksConfig(translationDir);

  for (const lang of languages) {
    const langDir = path.join(translationDir, lang);
    const translationFiles = getJsonFiles(langDir);
    generateLanguageIndex(langDir, translationFiles, modifiedFiles);
  }

  generateMainTranslations(
    translationDir,
    languages,
    chunksConfig,
    modifiedFiles
  );
}

function validateChunkNames(translationDir: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const languages = getLanguageDirs(translationDir);

  for (const lang of languages) {
    const langDir = path.join(translationDir, lang);
    const jsonFiles = glob.sync('*.json', { cwd: langDir });

    for (const file of jsonFiles) {
      const chunkName = path.basename(file, '.json');
      if (!isCamelOrPascalCase(chunkName)) {
        const camelCaseName = chunkName
          .split(/[-_\s]+/)
          .map((word, index) =>
            index === 0
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join('');

        errors.push({
          file,
          chunkName,
          suggestedName: camelCaseName,
          fullPath: path.relative(process.cwd(), path.join(langDir, file)),
        });
      }
    }
  }

  return errors;
}

function formatValidationErrors(errors: ValidationError[]): string {
  // Group errors by chunk name to avoid duplicate suggestions
  const errorsByChunk = new Map<string, ValidationError[]>();

  errors.forEach((error) => {
    const existing = errorsByChunk.get(error.chunkName) || [];
    existing.push(error);
    errorsByChunk.set(error.chunkName, existing);
  });

  const messages = ['Found invalid chunk names that need to be fixed:'];

  // First list all the issues, grouped by chunk name
  for (const [chunkName, chunkErrors] of errorsByChunk) {
    messages.push(
      `\nChunk name '${chunkName}' is invalid and appears in these filenames:`
    );

    chunkErrors.forEach(({ fullPath }) => {
      messages.push(`- ${fullPath}`);
    });

    messages.push(`Suggested name: ${chunkErrors[0].suggestedName}`);
  }

  // Then list all commands in a batch
  messages.push(
    '\nCommands to fix all files (copy-paste the whole block):',
    '```bash'
  );

  // Use Set to deduplicate commands by target path
  const commands = new Set<string>();
  errors.forEach(({ fullPath, suggestedName }) => {
    commands.add(
      `mv "${fullPath}" "${path.join(path.dirname(fullPath), suggestedName + '.json')}"`
    );
  });

  messages.push(...Array.from(commands));

  messages.push(
    '```',
    '\nAfter fixing:',
    '1. Update any imports or references in your code',
    '2. Run this script again'
  );

  return messages.join('\n');
}

async function main(): Promise<void> {
  const translationDirs = findTranslationDirs();

  if (translationDirs.length === 0) {
    console.log('No translation directories found');
    return;
  }

  // Validation phase
  const allErrors: ValidationError[] = [];
  for (const dir of translationDirs) {
    const errors = validateChunkNames(dir);
    allErrors.push(...errors);
  }

  if (allErrors.length > 0) {
    throw new Error(formatValidationErrors(allErrors));
  }

  // If validation passes, proceed with updates
  console.log('All chunk names are valid, proceeding with updates...\n');

  const modifiedFiles: ModifiedFiles = {
    indexFiles: new Set<string>(),
    translationFiles: new Set<string>(),
  };

  for (const dir of translationDirs) {
    processTranslationDir(dir, modifiedFiles);
  }

  // Run prettier on modified files
  const allModifiedFiles = [
    ...modifiedFiles.indexFiles,
    ...modifiedFiles.translationFiles,
  ];
  if (allModifiedFiles.length > 0) {
    console.log('\nRunning prettier on modified files...');
    const { exec } = require('child_process');
    const filePaths = allModifiedFiles.join(' ');

    try {
      await new Promise((resolve, reject) => {
        exec(`npm run prettier:fix -- ${filePaths}`, (error: Error | null) => {
          if (error) {
            reject(error);
          } else {
            resolve(undefined);
          }
        });
      });
      console.log('Prettier formatting complete.');
    } catch (error) {
      console.error('Error running prettier:', error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
