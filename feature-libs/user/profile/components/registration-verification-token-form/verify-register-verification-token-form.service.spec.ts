import { inject, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  FeatureConfigService,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';
import { UserRegisterFacade, UserSignUp } from '@spartacus/user/profile/root';
import { of } from 'rxjs';

import createSpy = jasmine.createSpy;
import { RegistrationVerificationTokenFormComponentService } from './verify-register-verification-token-form.service';

class MockUserRegisterFacade implements Partial<UserRegisterFacade> {
  getTitles = createSpy().and.returnValue(of([]));
  register = createSpy().and.callFake((user: any) => of(user));
}
class MockGlobalMessageService implements Partial<GlobalMessageService> {
  add = createSpy();
}

class MockFeatureConfigService {
  isEnabled() {
    return true;
  }
}

describe('RegistrationVerificationTokenFormComponentService', () => {
  let service: RegistrationVerificationTokenFormComponentService;
  let userRegisterFacade: UserRegisterFacade;
  let globalMessageService: GlobalMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegistrationVerificationTokenFormComponentService,
        UntypedFormBuilder,
        { provide: UserRegisterFacade, useClass: MockUserRegisterFacade },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
        { provide: FeatureConfigService, useClass: MockFeatureConfigService },
      ],
    });

    globalMessageService = TestBed.inject(GlobalMessageService);
    userRegisterFacade = TestBed.inject(UserRegisterFacade);
    service = TestBed.inject(RegistrationVerificationTokenFormComponentService);
  });

  it('should inject RegistrationVerificationTokenFormComponentService', inject(
    [RegistrationVerificationTokenFormComponentService],
    (
      registrationVerificationTokenFormComponentService: RegistrationVerificationTokenFormComponentService
    ) => {
      expect(registrationVerificationTokenFormComponentService).toBeTruthy();
    }
  ));

  it('should be able to register user from UserRegisterService', () => {
    const userRegisterFormData: UserSignUp = {
      titleCode: 'Mr.',
      firstName: 'firstName',
      lastName: 'lastName',
      uid: 'uid',
      password: 'password',
    };
    service.register(userRegisterFormData);
    expect(userRegisterFacade.register).toHaveBeenCalledWith({
      titleCode: 'Mr.',
      firstName: 'firstName',
      lastName: 'lastName',
      uid: 'uid',
      password: 'password',
    });
  });

  describe('postRegisterMessage', () => {
    it('should delegate to globalMessageService.add', () => {
      service.postRegisterMessage();
      expect(globalMessageService.add).toHaveBeenCalledWith(
        { key: 'register.postRegisterSuccessMessage' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    });
  });
});
