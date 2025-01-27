import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  I18nTestingModule,
  ImageType,
  Product,
  ProductService,
} from '@spartacus/core';

import { AsmCustomer360ProductListingComponent } from '../../asm-customer-360-product-listing/asm-customer-360-product-listing.component';
import { AsmCustomer360SectionContextSource } from '../asm-customer-360-section-context-source.model';
import { AsmCustomer360SectionContext } from '../asm-customer-360-section-context.model';
import { AsmCustomer360SavedCartComponent } from './asm-customer-360-saved-cart.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  AsmCustomer360SavedCart,
  AsmCustomer360Type,
} from '@spartacus/asm/customer-360/root';
import { BREAKPOINT, BreakpointService } from '@spartacus/storefront';

import { AsmCustomer360ProductItemComponent } from '../../asm-customer-360-product-item/asm-customer-360-product-item.component';

describe('AsmCustomer360SavedCartComponent', () => {
  let component: AsmCustomer360SavedCartComponent;
  let fixture: ComponentFixture<AsmCustomer360SavedCartComponent>;
  let el: DebugElement;
  let contextSource: AsmCustomer360SectionContextSource<AsmCustomer360SavedCart>;

  const breakpointSubject = new BehaviorSubject<BREAKPOINT>(BREAKPOINT.xl);

  const mockProduct1: Product = {
    code: '553637',
    name: 'NV10',
    images: {
      PRIMARY: {
        thumbnail: {
          altText: 'NV10',
          format: 'thumbnail',
          imageType: ImageType.PRIMARY,
          url: 'image-url',
        },
      },
    },
    price: {
      formattedValue: '$264.69',
    },
    stock: {
      stockLevel: 0,
      stockLevelStatus: 'outOfStock',
    },
  };

  const mockProduct2: Product = {
    code: '553638',
    name: 'NV11',
    images: {
      PRIMARY: {
        thumbnail: {
          altText: 'NV11',
          format: 'thumbnail',
          imageType: ImageType.PRIMARY,
          url: 'image-url',
        },
      },
    },
    price: {
      formattedValue: '$188.69',
    },
    stock: {
      stockLevel: 0,
      stockLevelStatus: 'outOfStock',
    },
    baseOptions: [
      {
        selected: {
          variantOptionQualifiers: [
            {
              name: 'color',
              value: 'red',
            },
            {
              name: 'size',
              value: 'XL',
            },
          ],
        },
      },
    ],
  };

  class MockBreakpointService {
    get breakpoint$(): Observable<BREAKPOINT> {
      return breakpointSubject.asObservable();
    }
  }

  const mockCart: AsmCustomer360SavedCart = {
    type: AsmCustomer360Type.SAVED_CART,
    savedCart: {
      code: '00000001',
      totalPrice: '$100.00',
      totalItemCount: 1,
      entries: [
        {
          quantity: 1,
          basePrice: '$10.00',
          totalPrice: '$10.00',
          productCode: '553637',
        },
        {
          quantity: 3,
          basePrice: '$10.00',
          totalPrice: '$30.00',
          productCode: '553638',
        },
      ],
    },
  };

  const productService = jasmine.createSpyObj('ProductService', ['get']);
  @Component({
    template: '',
    selector: 'cx-media',
    standalone: false,
  })
  class MockMediaComponent {
    @Input() container: any;
    @Input() format: any;
    @Input() alt: any;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        AsmCustomer360SavedCartComponent,
        AsmCustomer360ProductListingComponent,
        AsmCustomer360ProductItemComponent,
        MockMediaComponent,
      ],
      providers: [
        AsmCustomer360SectionContextSource,
        {
          provide: AsmCustomer360SectionContext,
          useExisting: AsmCustomer360SectionContextSource,
        },
        { provide: ProductService, useValue: productService },
        {
          provide: BreakpointService,
          useClass: MockBreakpointService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsmCustomer360SavedCartComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    const mockProductService = TestBed.inject(ProductService);

    (<jasmine.Spy>mockProductService.get).and.callFake((code: string) => {
      switch (code) {
        case '553637':
          return of(mockProduct1);
        case '553638':
          return of(mockProduct2);
      }
    });
    contextSource = TestBed.inject(AsmCustomer360SectionContextSource);
    contextSource.data$.next(mockCart);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a header', () => {
    const productListing = el.query(
      By.css('cx-asm-customer-360-product-listing')
    );
    const title = productListing.query(By.css('.title-link'));
    expect(title.nativeElement.textContent).toBe(
      ' asmCustomer360.savedCart.header '
    );

    const titleLink = productListing.query(By.css('.cx-overview-title-link'));
    expect(titleLink.nativeElement.textContent).toContain(
      mockCart.savedCart?.code
    );

    const totalItems = productListing.query(By.css('.cart-total-no-items'));
    expect(totalItems.nativeElement.textContent).toContain(
      mockCart.savedCart?.totalItemCount
    );

    const totalPrice = productListing.query(By.css('.cart-total-price'));
    expect(totalPrice.nativeElement.textContent).toContain(
      mockCart.savedCart?.totalPrice
    );
  });
  it('should render products', () => {
    breakpointSubject.next(BREAKPOINT.lg);
    fixture.detectChanges();
    expect(el.queryAll(By.css('cx-asm-customer-360-product-item')).length).toBe(
      2
    );

    breakpointSubject.next(BREAKPOINT.md);

    fixture.detectChanges();
    expect(el.queryAll(By.css('cx-asm-customer-360-product-item')).length).toBe(
      1
    );

    const productItem = el.queryAll(
      By.css('cx-asm-customer-360-product-item')
    )[0];
    expect(
      productItem.query(By.css('.cx-asm-customer-360-product-item-name'))
        .nativeElement.textContent
    ).toContain(mockProduct1.name);

    expect(
      productItem.query(By.css('.cx-asm-customer-360-product-item-code'))
        .nativeElement.textContent
    ).toContain(mockProduct1.code);
  });

  it('should navigate Product Detail', () => {
    spyOn(contextSource.navigate$, 'next').and.stub();
    const productName = el.queryAll(
      By.css(
        'cx-asm-customer-360-product-item .cx-asm-customer-360-product-item-name'
      )
    )[0];
    productName.nativeElement.click();
    expect(contextSource.navigate$.next).toHaveBeenCalledWith({
      cxRoute: 'product',
      params: {
        ...mockProduct1,
        quantity: mockCart?.savedCart?.entries?.[0]?.quantity,
        basePrice: mockCart?.savedCart?.entries?.[0]?.basePrice,
        totalPrice: mockCart?.savedCart?.entries?.[0]?.totalPrice,
      },
    });
  });

  it('should navigate saved cart detail', () => {
    spyOn(contextSource.navigate$, 'next').and.stub();
    const header = el.queryAll(
      By.css('.product-listing-header .cx-overview-title-link')
    )[0];
    header.nativeElement.click();
    expect(contextSource.navigate$.next).toHaveBeenCalledWith({
      cxRoute: 'savedCartsDetails',
      params: {
        savedCartId: mockCart.savedCart?.code,
      },
    });
  });
});
