import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  Address,
  GlobalMessageService,
  I18nTestingModule,
  User,
} from '@spartacus/core';
import { CardModule, SpinnerModule } from '@spartacus/storefront';
import { MockFeatureDirective } from 'projects/storefrontlib/shared/test/mock-feature-directive';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AddressBookComponent } from './address-book.component';
import { AddressBookComponentService } from './address-book.component.service';

class MockGlobalMessageService {
  add = jasmine.createSpy();
}

const mockAddress: Address = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  titleCode: 'mr',
  line1: 'Toyosaki 2 create on cart',
  line2: 'line2',
  town: 'town',
  region: { isocode: 'JP-27' },
  postalCode: 'zip',
  country: { isocode: 'JP' },
  defaultAddress: false,
};

const mockUser: User = {
  uid: '1234',
};

const isLoading = new BehaviorSubject<boolean>(false);

class MockComponentService {
  loadAddresses = jasmine.createSpy();
  addUserAddress = jasmine.createSpy();
  updateUserAddress = jasmine.createSpy();
  deleteUserAddress = jasmine.createSpy();
  setAddressAsDefault = jasmine.createSpy();
  getAddressesStateLoading(): Observable<boolean> {
    return isLoading.asObservable();
  }
  getAddresses(): Observable<Address[]> {
    return of([mockAddress, mockAddress, mockAddress]);
  }
  getUserId(): Observable<string> {
    return of(mockUser.uid || '');
  }
}

@Component({
  selector: 'cx-address-form',
  template: '',
  standalone: false,
})
class MockAddressFormComponent {
  @Input()
  addressData: Address;

  @Input()
  actionBtnLabel: string;

  @Input()
  cancelBtnLabel: string;

  @Input()
  setAsDefaultField: boolean;

  @Input()
  showTitleCode: boolean;

  @Input()
  showCancelBtn: boolean;

  @Output()
  submitAddress = new EventEmitter<any>();

  @Output()
  backToAddress = new EventEmitter<any>();
}

describe('AddressBookComponent', () => {
  let component: AddressBookComponent;
  let fixture: ComponentFixture<AddressBookComponent>;
  let el: DebugElement;
  let addressBookComponentService: AddressBookComponentService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerModule, I18nTestingModule, CardModule],
      providers: [
        {
          provide: AddressBookComponentService,
          useClass: MockComponentService,
        },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
      ],
      declarations: [
        AddressBookComponent,
        MockAddressFormComponent,
        MockFeatureDirective,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookComponent);
    component = fixture.componentInstance;
    spyOn(component, 'addAddressButtonHandle');
    el = fixture.debugElement;
    addressBookComponentService = TestBed.inject(AddressBookComponentService);

    isLoading.next(false);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner if addresses are loading', () => {
    isLoading.next(true);
    fixture.detectChanges();
    expect(el.query(By.css('cx-spinner'))).toBeTruthy();
  });

  it('should show address cards after loading', () => {
    expect(el.query(By.css('cx-card'))).toBeTruthy();
  });

  it('should address cards number to be equal with addresses count', () => {
    expect(el.queryAll(By.css('cx-card')).length).toEqual(3);
  });

  it('should be able to add new address', () => {
    el.query(By.css('.btn-secondary')).nativeElement.click();
    expect(component.addAddressButtonHandle).toHaveBeenCalled();
  });

  it('should call addAddressButtonHandle()', () => {
    component.addAddressButtonHandle();

    expect(component.addAddressButtonHandle).toHaveBeenCalledWith();
  });

  it('should call editAddressButtonHandle(address: Address)', () => {
    spyOn(component, 'editAddressButtonHandle');
    component.editAddressButtonHandle(mockAddress);

    expect(component.editAddressButtonHandle).toHaveBeenCalledWith(mockAddress);
  });

  it('should call addAddressSubmit(address: Address)', () => {
    spyOn(component, 'addAddressSubmit');
    component.addAddressSubmit(mockAddress);

    expect(component.addAddressSubmit).toHaveBeenCalledWith(mockAddress);
  });

  it('should call addAddressCancel()', () => {
    spyOn(component, 'addAddressCancel');
    component.addAddressCancel();

    expect(component.addAddressCancel).toHaveBeenCalledWith();
  });

  it('should call editAddressSubmit(address: Address)', () => {
    spyOn(component, 'editAddressSubmit');
    component.editAddressSubmit(mockAddress);

    expect(component.editAddressSubmit).toHaveBeenCalledWith(mockAddress);
  });

  it('should call editAddressCancel()', () => {
    spyOn(component, 'editAddressCancel');
    component.editAddressCancel();

    expect(component.editAddressCancel).toHaveBeenCalledWith();
  });

  it('should display address data', () => {
    const element = el.query(By.css('cx-card'));
    expect(element.nativeElement.textContent).toContain(
      mockAddress.firstName &&
        mockAddress.lastName &&
        mockAddress.line1 &&
        mockAddress.line2 &&
        mockAddress.town &&
        mockAddress.country?.isocode &&
        mockAddress.postalCode
    );
  });

  it('should display default label on address default', () => {
    mockAddress.defaultAddress = true;
    fixture.detectChanges();
    const element = el.query(By.css('.card-header'));
    expect(element.nativeElement.textContent).toContain(
      ' ✓ addressCard.default '
    );
  });

  it('should cancel card', () => {
    component.cancelCard();
    expect(component.editCard).toEqual(null);
  });

  it('should cancel edit', () => {
    component.editAddressCancel();
    expect(component.showEditAddressForm).toBeFalsy();
  });

  it('should cancel add', () => {
    component.addAddressCancel();
    expect(component.showAddAddressForm).toBeFalsy();
  });

  it('should handle edit on card', () => {
    spyOn(component, 'deleteAddress');

    component.setEdit(mockAddress.id || '1');
    expect(component.editCard).toEqual(mockAddress.id);
    component.setEdit(mockAddress.id || '1');
    expect(component.deleteAddress).toHaveBeenCalledWith(mockAddress.id);
  });

  describe('setAddressAsDefault', () => {
    it('should set Address as default', () => {
      component.setAddressAsDefault(mockAddress);
      expect(
        addressBookComponentService.setAddressAsDefault
      ).toHaveBeenCalledWith(mockAddress.id);
    });
  });

  describe('deleteAddress', () => {
    it('should set delete user Address', () => {
      component.deleteAddress('1');
      expect(
        addressBookComponentService.deleteUserAddress
      ).toHaveBeenCalledWith('1');
    });
  });

  describe('Header', () => {
    it('should set correct header for add new address', () => {
      component.showEditAddressForm = false;
      component.showAddAddressForm = true;
      fixture.detectChanges();

      expect(el.query(By.css('h2')).nativeElement.innerText).toEqual(
        'addressBook.addNewDeliveryAddress'
      );
    });
    it('should set correct header for edit address', () => {
      component.editAddressButtonHandle(mockAddress);
      fixture.detectChanges();

      expect(el.query(By.css('h2')).nativeElement.innerText).toEqual(
        'addressBook.editDeliveryAddress'
      );
    });
  });
});
