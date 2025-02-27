import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AddOrderEntriesContext,
  GetOrderEntriesContext,
  OrderEntriesSource,
  OrderEntry,
  ProductData,
  ProductImportInfo,
  ProductImportStatus,
} from '@spartacus/cart/base/root';
import { ContextService, PageComponentModule } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { ImportExportOrderEntriesComponent } from './import-export-order-entries.component';
import createSpy = jasmine.createSpy;

const mockLoadProduct: ProductImportInfo = {
  productCode: '123456',
  statusCode: ProductImportStatus.SUCCESS,
};

class MockImportExportContext
  implements AddOrderEntriesContext, GetOrderEntriesContext
{
  getEntries = () => entries$.asObservable();
  addEntries = (_products: ProductData[]) => loadProducts$.asObservable();
  readonly type: OrderEntriesSource;
}

const loadProducts$: BehaviorSubject<ProductImportInfo> = new BehaviorSubject(
  mockLoadProduct
);

const mockEntries: OrderEntry[] = [
  {
    quantity: 1,
    product: { name: 'mockProduct', code: 'mockCode' },
  },
];

const entries$ = new BehaviorSubject<OrderEntry[]>(mockEntries);

const importExportContext = new BehaviorSubject<
  Partial<AddOrderEntriesContext & GetOrderEntriesContext>
>(new MockImportExportContext());

class MockContextService implements Partial<ContextService> {
  get = createSpy().and.returnValue(importExportContext.asObservable());
}

@Component({
  selector: 'cx-import-order-entries',
  template: '',
  standalone: false,
})
export class MockImportOrderEntriesComponent {
  @ViewChild('open') element: ElementRef;

  @Input()
  context: AddOrderEntriesContext | GetOrderEntriesContext;
}

@Component({
  selector: 'cx-export-order-entries',
  template: '',
  standalone: false,
})
export class MockExportOrderEntriesComponent {
  @Input()
  entries: OrderEntry[];
}

describe('ImportExportComponent', () => {
  let component: ImportExportOrderEntriesComponent;
  let fixture: ComponentFixture<ImportExportOrderEntriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageComponentModule],
      providers: [{ provide: ContextService, useClass: MockContextService }],
      declarations: [
        ImportExportOrderEntriesComponent,
        MockExportOrderEntriesComponent,
        MockImportOrderEntriesComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportOrderEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
