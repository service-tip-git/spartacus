import { inject, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { UserRegisterFacade } from '@spartacus/user/profile/root';
import { of } from 'rxjs';

import createSpy = jasmine.createSpy;
import { OneTimePasswordLoginRegisterComponentService } from './otp-register-component.service';

class MockUserRegisterFacade implements Partial<UserRegisterFacade> {
  getTitles = createSpy().and.returnValue(of([]));
}

describe('OneTimePasswordLoginRegisterComponentService', () => {
  let service: OneTimePasswordLoginRegisterComponentService;
  let userRegisterFacade: UserRegisterFacade;
  let fb: UntypedFormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OneTimePasswordLoginRegisterComponentService,
        UntypedFormBuilder,
        { provide: UserRegisterFacade, useClass: MockUserRegisterFacade },
      ],
    });

    userRegisterFacade = TestBed.inject(UserRegisterFacade);
    fb = TestBed.inject(UntypedFormBuilder);
    service = TestBed.inject(OneTimePasswordLoginRegisterComponentService);
  });

  it('should inject OneTimePasswordLoginRegisterComponentService', inject(
    [OneTimePasswordLoginRegisterComponentService],
    (
      oneTimePasswordLoginRegisterComponentService: OneTimePasswordLoginRegisterComponentService
    ) => {
      expect(oneTimePasswordLoginRegisterComponentService).toBeTruthy();
    }
  ));

  it('should get titles from UserRegisterService', () => {
    service.getTitles().subscribe().unsubscribe();
    expect(userRegisterFacade.getTitles).toHaveBeenCalled();
  });

  it('generateAdditionalConsentsFormControl', () => {
    spyOn(fb, 'array').and.callThrough();
    service.generateAdditionalConsentsFormControl();
    expect(fb.array).toHaveBeenCalled();
  });

  it('getAdditionalConsents', () => {
    let result = service.getAdditionalConsents();
    expect(result).toEqual([]);
  });
});
