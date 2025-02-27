import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import {
  I18nTestingModule,
  RoutingConfigService,
  RoutingService,
} from '@spartacus/core';
import { AmendOrderActionsComponent } from './amend-order-actions.component';

@Pipe({
  name: 'cxUrl',
  standalone: false,
})
class MockUrlPipe implements PipeTransform {
  transform(): any {}
}

class MockRoutingConfigService {
  getRouteConfig() {}
}

class MockRoutingService {
  go = jasmine.createSpy('go');
}

describe('AmendOrderActionsComponent', () => {
  let component: AmendOrderActionsComponent;
  let fixture: ComponentFixture<AmendOrderActionsComponent>;
  let routingService: RoutingService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, StoreModule.forRoot({})],
      declarations: [MockUrlPipe, AmendOrderActionsComponent],
      providers: [
        {
          provide: RoutingConfigService,
          useClass: MockRoutingConfigService,
        },
        { provide: RoutingService, useClass: MockRoutingService },
      ],
    }).compileComponents();

    routingService = TestBed.inject(RoutingService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendOrderActionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have row class', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.nativeElement;
    expect(el.classList).toContain('row');
  });

  it('should proceed to forward route if control is valid', () => {
    const orderCode = 'test1';
    const forwardRoute = 'my-test';
    const formControl = new UntypedFormGroup({
      test: new UntypedFormControl(),
    });
    const ev = {
      stopPropagation() {},
    };

    component.orderCode = orderCode;
    component.forwardRoute = forwardRoute;
    component.amendOrderForm = formControl;

    formControl.controls['test'].setErrors({ incorrect: true });
    component.continue(ev as Event);
    expect(routingService.go).not.toHaveBeenCalled();
    expect(formControl.invalid).toEqual(true);

    formControl.controls['test'].setErrors(null);
    component.continue(ev as Event);
    expect(routingService.go).toHaveBeenCalledWith({
      cxRoute: forwardRoute,
      params: { code: orderCode },
    });
  });
});
