/// <reference types="jest" />

import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import {
  generateDefaultWorkspace,
  LibraryOptions as PDFInvoicesOptions,
  PDF_INVOICES_FEATURE_NAME,
  pdfInvoicesFeatureModulePath,
  SPARTACUS_PDF_INVOICES,
  SPARTACUS_SCHEMATICS,
} from '@spartacus/schematics';
import * as path from 'path';
import { peerDependencies } from '../../package.json';

const collectionPath = path.join(__dirname, '../collection.json');
const scssFilePath = 'src/styles/spartacus/pdf-invoices.scss';

describe('Spartacus PDF Invoices schematics: ng-add', () => {
  const schematicRunner = new SchematicTestRunner(
    SPARTACUS_PDF_INVOICES,
    collectionPath
  );

  let appTree: UnitTestTree;

  const libraryNoFeaturesOptions: PDFInvoicesOptions = {
    project: 'schematics-test',
    lazy: true,
    features: [],
  };

  const rddOptions: PDFInvoicesOptions = {
    ...libraryNoFeaturesOptions,
    features: [PDF_INVOICES_FEATURE_NAME],
  };

  describe('Without features', () => {
    beforeAll(async () => {
      appTree = await generateDefaultWorkspace(schematicRunner, appTree);
      appTree = await schematicRunner.runSchematic(
        'ng-add',
        libraryNoFeaturesOptions,
        appTree
      );
    });

    it('should not create any of the feature modules', () => {
      expect(appTree.exists(pdfInvoicesFeatureModulePath)).toBeFalsy();
    });

    it('should install necessary Spartacus libraries', () => {
      const packageJson = JSON.parse(appTree.readContent('package.json'));
      let dependencies: Record<string, string> = {};
      dependencies = { ...packageJson.dependencies };
      dependencies = { ...dependencies, ...packageJson.devDependencies };

      for (const toAdd in peerDependencies) {
        // skip the SPARTACUS_SCHEMATICS, as those are added only when running by the Angular CLI, and not in the testing environment
        if (
          !peerDependencies.hasOwnProperty(toAdd) ||
          toAdd === SPARTACUS_SCHEMATICS
        ) {
          continue;
        }
        // TODO: after 4.0: use this test, as we'll have synced versions between lib's and root package.json
        // const expectedVersion = (peerDependencies as Record<
        //   string,
        //   string
        // >)[toAdd];
        const expectedDependency = dependencies[toAdd];
        expect(expectedDependency).toBeTruthy();
      }
    });
  });

  describe('PDF Invoices feature', () => {
    describe('general setup', () => {
      beforeAll(async () => {
        appTree = await generateDefaultWorkspace(schematicRunner, appTree);
        appTree = await schematicRunner.runSchematic(
          'ng-add',
          rddOptions,
          appTree
        );
      });

      it('should add the feature using the lazy loading syntax', async () => {
        const module = appTree.readContent(pdfInvoicesFeatureModulePath);
        expect(module).toMatchSnapshot();
      });

      describe('styling', () => {
        it('should create a proper scss file', () => {
          const scssContent = appTree.readContent(scssFilePath);
          expect(scssContent).toMatchSnapshot();
        });

        it('should update angular.json', async () => {
          const content = appTree.readContent('/angular.json');
          expect(content).toMatchSnapshot();
        });
      });
    });

    describe('eager loading', () => {
      beforeAll(async () => {
        appTree = await generateDefaultWorkspace(schematicRunner, appTree);
        appTree = await schematicRunner.runSchematic(
          'ng-add',
          { ...rddOptions, lazy: false },
          appTree
        );
      });

      it('should import appropriate modules', async () => {
        const module = appTree.readContent(pdfInvoicesFeatureModulePath);
        expect(module).toMatchSnapshot();
      });
    });
  });
});
