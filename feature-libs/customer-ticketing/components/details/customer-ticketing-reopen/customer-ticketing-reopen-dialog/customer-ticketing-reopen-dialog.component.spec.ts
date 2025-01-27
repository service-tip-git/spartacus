import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nTestingModule, RoutingService } from '@spartacus/core';
import {
  CustomerTicketingFacade,
  STATUS,
  STATUS_NAME,
  TicketEvent,
} from '@spartacus/customer-ticketing/root';
import {
  FileUploadModule,
  FocusConfig,
  FormErrorsModule,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import { EMPTY, of } from 'rxjs';
import { CustomerTicketingReopenDialogComponent } from './customer-ticketing-reopen-dialog.component';
import createSpy = jasmine.createSpy;

class MockLaunchDialogService implements Partial<LaunchDialogService> {
  closeDialog(_reason: string): void {}
}

class MockCustomerTicketingFacade implements Partial<CustomerTicketingFacade> {
  createTicketEvent = createSpy().and.returnValue(EMPTY);
  uploadAttachment = createSpy().and.returnValue(EMPTY);
}

class MockRoutingService implements Partial<RoutingService> {
  go = () => Promise.resolve(true);
}

@Directive({
  selector: '[cxFocus]',
  standalone: false,
})
export class MockKeyboadFocusDirective {
  @Input('cxFocus') config: FocusConfig = {};
}

@Component({
  selector: 'cx-icon',
  template: '',
  standalone: false,
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

describe('CustomerTicketingReopenDialogComponent', () => {
  let component: CustomerTicketingReopenDialogComponent;
  let fixture: ComponentFixture<CustomerTicketingReopenDialogComponent>;
  let customerTicketingFacade: CustomerTicketingFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
        ReactiveFormsModule,
        FormErrorsModule,
        FileUploadModule,
      ],
      declarations: [
        CustomerTicketingReopenDialogComponent,
        MockKeyboadFocusDirective,
        MockCxIconComponent,
      ],
      providers: [
        { provide: LaunchDialogService, useClass: MockLaunchDialogService },
        {
          provide: CustomerTicketingFacade,
          useClass: MockCustomerTicketingFacade,
        },
        { provide: RoutingService, useClass: MockRoutingService },
      ],
    }).compileComponents();

    customerTicketingFacade = TestBed.inject(CustomerTicketingFacade);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTicketingReopenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form', () => {
    expect(component.form.get('message')?.value).toBeDefined();
    expect(component.form.get('file')?.value).toBeDefined();
  });

  describe('reopenRequest', () => {
    it('should not call createTicketEvent if the form is invalid', () => {
      component.form.get('message')?.setValue('');
      component.reopenRequest();

      expect(customerTicketingFacade.createTicketEvent).not.toHaveBeenCalled();
    });

    describe('when the form is valid', () => {
      beforeEach(() => {
        component.form.get('message')?.setValue('mockMessage');
      });

      it('should call createTicketEvent if the form is valid', () => {
        const mockEvent = {
          message: 'mockMessage',
          toStatus: {
            id: STATUS.INPROCESS,
            name: STATUS_NAME.INPROCESS,
          },
        };
        const mustWaitForAttachment = false;

        component.reopenRequest();

        expect(customerTicketingFacade.createTicketEvent).toHaveBeenCalledWith(
          mockEvent,
          mustWaitForAttachment
        );
      });

      it('should upload attachements after creating ticket', () => {
        const mockFileList: File[] = [
          new File(['foo'], 'foo.txt', {
            type: 'text/plain',
          }),
        ];
        (mockFileList as any).item = (i: number) => mockFileList[i]; // mock FileList's accessor
        component.form.get('file')?.setValue(mockFileList);
        const mockTicketEvent: TicketEvent = {
          code: 'code-000001',
          createdAt: 'mock-create-date',
          author: 'mock-author',
          message: 'mock-message',
          addedByAgent: true,
          ticketEventAttachments: [{}],
        };
        (
          customerTicketingFacade.createTicketEvent as jasmine.Spy
        ).and.returnValue(of(mockTicketEvent));

        component.reopenRequest();

        expect(customerTicketingFacade.uploadAttachment).toHaveBeenCalled();
      });
    });
  });
});
