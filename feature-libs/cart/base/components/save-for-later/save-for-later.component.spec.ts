import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActiveCartFacade,
  Cart,
  CartItemComponentOptions,
  OrderEntry,
  PromotionLocation,
  SelectiveCartFacade,
} from '@spartacus/cart/base/root';
import { CmsService, I18nTestingModule } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { SaveForLaterComponent } from './save-for-later.component';
@Component({
  template: '',
  selector: 'cx-cart-item-list',
  standalone: false,
})
class MockCartItemListComponent {
  @Input() readonly = false;
  @Input() items: OrderEntry[];
  @Input() cartIsLoading: Observable<boolean>;
  @Input() promotionLocation: PromotionLocation;
  @Input() options: CartItemComponentOptions = {
    isSaveForLater: false,
    optionalBtn: null,
  };
}

describe('SaveForLaterComponent', () => {
  let component: SaveForLaterComponent;
  let fixture: ComponentFixture<SaveForLaterComponent>;

  const mockActiveCartService = jasmine.createSpyObj('ActiveCartService', [
    'addEntry',
    'isStable',
    'getActive',
  ]);

  const mockSelectiveCartService = jasmine.createSpyObj(
    'SelectiveCartService',
    ['getCart', 'isStable', 'removeEntry', 'getEntries']
  );

  const mockCmsService = jasmine.createSpyObj('CmsService', [
    'getComponentData',
  ]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SaveForLaterComponent, MockCartItemListComponent],
      imports: [I18nTestingModule],
      providers: [
        { provide: CmsService, useValue: mockCmsService },
        { provide: ActiveCartFacade, useValue: mockActiveCartService },
        { provide: SelectiveCartFacade, useValue: mockSelectiveCartService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveForLaterComponent);
    component = fixture.componentInstance;

    mockSelectiveCartService.isStable.and.returnValue(of(true));
    mockActiveCartService.isStable.and.returnValue(of(true));
    mockActiveCartService.getActive.and.returnValue(
      of({ code: '00001', totalItems: 0 } as Cart)
    );
    mockCmsService.getComponentData.and.returnValue(of({ content: 'content' }));
    mockSelectiveCartService.getCart.and.returnValue(
      of({ code: '123' } as Cart)
    );
    mockSelectiveCartService.getEntries.and.returnValue(
      of([{}] as OrderEntry[])
    );
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display save for later text with items', () => {
    mockSelectiveCartService.getCart.and.returnValue(
      of({
        code: '123',
        totalItems: 5,
      } as Cart)
    );
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.cx-total'));
    const cartHead = el.nativeElement.innerText;
    expect(cartHead).toEqual('saveForLaterItems.itemTotal count:5');
  });

  it('should display empty cart info when cart is empty and save for later has items', () => {
    mockSelectiveCartService.getCart.and.returnValue(
      of({
        code: '123',
        totalItems: 5,
      } as Cart)
    );
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.cx-empty-cart-info')).nativeElement
        .innerText
    ).toEqual('content');
  });

  it('should move to cart', () => {
    const mockItem = {
      quantity: 5,
      product: {
        code: 'PR0000',
      },
    };
    component.moveToCart(mockItem);
    expect(mockSelectiveCartService.removeEntry).toHaveBeenCalledWith(mockItem);
    expect(mockActiveCartService.addEntry).toHaveBeenCalledWith(
      mockItem.product.code,
      mockItem.quantity
    );
  });
});
