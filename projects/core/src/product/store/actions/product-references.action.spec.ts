import { ErrorModel } from '../../../model/misc.model';
import { ProductReference } from '../../../model/product.model';
import { ProductActions } from './index';

const productCode = 'productCode';
const product = {
  code: productCode,
  name: 'testProduct',
};

describe('Product References Actions', () => {
  describe('LoadProductReferences Actions', () => {
    describe('LOAD_PRODUCT_REFERENCES', () => {
      it('should create the action', () => {
        const action = new ProductActions.LoadProductReferences({
          productCode,
        });
        expect({ ...action }).toEqual({
          type: ProductActions.LOAD_PRODUCT_REFERENCES,
          payload: { productCode },
        });
      });
    });

    describe('LOAD_PRODUCT_REFERENCES_FAIL', () => {
      it('should create the action', () => {
        const error: ErrorModel = { message: 'Load Error' };
        const action = new ProductActions.LoadProductReferencesFail(error);
        expect({ ...action }).toEqual({
          type: ProductActions.LOAD_PRODUCT_REFERENCES_FAIL,
          payload: error,
          error,
        });
      });
    });

    describe('LOAD_PRODUCT_REFERENCES_SUCCESS', () => {
      it('should create the action', () => {
        const list: ProductReference[] = [
          {
            referenceType: 'SIMILAR',
            target: product,
          },
          {
            referenceType: 'ACCESSORIES',
            target: product,
          },
        ];

        const action = new ProductActions.LoadProductReferencesSuccess({
          productCode,
          list,
        });
        expect({ ...action }).toEqual({
          type: ProductActions.LOAD_PRODUCT_REFERENCES_SUCCESS,
          payload: { productCode, list },
        });
      });
    });

    describe('CLEAN_PRODUCT_REFERENCES', () => {
      it('should create the action', () => {
        const action = new ProductActions.CleanProductReferences();
        expect({ ...action }).toEqual({
          type: ProductActions.CLEAN_PRODUCT_REFERENCES,
        });
      });
    });
  });
});
