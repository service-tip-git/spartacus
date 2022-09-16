import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  AuthService,
  GlobalMessageService,
  GlobalMessageType,
  OCC_USER_ID_CURRENT,
} from '@spartacus/core';
import { User } from '@spartacus/user/account/root';
import {
  UserProfileConnector,
  UserProfileService,
  UserRegisterService,
} from '@spartacus/user/profile/core';
import { UserRegisterFacade, UserSignUp } from '@spartacus/user/profile/root';
import { CdcJsService } from 'integration-libs/cdc/root';
import { Observable, of } from 'rxjs';
import { CDCRegisterComponentService } from './cdc-register-component.service';
import createSpy = jasmine.createSpy;

const userRegisterFormData: UserSignUp = {
  titleCode: 'Mr.',
  firstName: 'firstName',
  lastName: 'lastName',
  uid: 'uid',
  password: 'password',
};

class MockUserProfileService implements Partial<UserProfileService> {
  get(): Observable<User> {
    return of({ uid: OCC_USER_ID_CURRENT });
  }
  getTitles = createSpy().and.returnValue(of([]));
}

class MockUserRegisterFacade implements Partial<UserRegisterFacade> {
  getTitles = createSpy().and.returnValue(of([]));
}

class MockUserProfileConnector implements Partial<UserProfileConnector> {
  register = createSpy().and.callFake((user: any) => of(user));
}

class MockAuthService implements Partial<AuthService> {
  loginWithCredentials = createSpy().and.returnValue(Promise.resolve());
}

class MockCDCJsService implements Partial<CdcJsService> {
  didLoad = createSpy().and.callFake(() => of(true));
  registerUserWithoutScreenSet = createSpy().and.callFake(() =>
    of({ status: 'OK' })
  );
  onLoginEventHandler = createSpy();
}

describe('CdcRegisterComponentService', () => {
  let cdcUserRegisterService: CDCRegisterComponentService;
  let connector: UserProfileConnector;
  let cdcJsService: CdcJsService;
  let globalMessageService: GlobalMessageService;
  let userRegisterFacde: UserRegisterFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Store, useValue: { dispatch: () => {} } },
        {
          provide: UserProfileConnector,
          useClass: MockUserProfileConnector,
        },
        { provide: UserProfileService, useClass: MockUserProfileService },
        { provide: CdcJsService, useClass: MockCDCJsService },
        { provide: UserRegisterFacade, useClass: MockUserRegisterFacade },
        CDCRegisterComponentService,
      ],
    });

    globalMessageService = TestBed.inject(GlobalMessageService);
    cdcUserRegisterService = TestBed.inject(CDCRegisterComponentService);
    connector = TestBed.inject(UserProfileConnector);
    cdcJsService = TestBed.inject(CdcJsService);
    userRegisterFacde = TestBed.inject(UserRegisterFacade);

    TestBed.compileComponents();
  });

  it('should be created', () => {
    expect(cdcUserRegisterService).toBeTruthy();
  });

  it('should inject UserRegisterService', inject(
    [CDCRegisterComponentService],
    (userRegisterService: UserRegisterService) => {
      expect(userRegisterService).toBeTruthy();
    }
  ));

  it('should get titles from profileService', () => {
    cdcUserRegisterService.getTitles();
    expect(userRegisterFacde.getTitles).toHaveBeenCalled();
  });

  describe('Register', () => {
    it('should be able to register user through CDC', (done) => {
      cdcUserRegisterService.register(userRegisterFormData).subscribe(() => {
        expect(connector.register).not.toHaveBeenCalled();
        expect(cdcJsService.registerUserWithoutScreenSet).toHaveBeenCalledWith({
          titleCode: 'Mr.',
          firstName: 'firstName',
          lastName: 'lastName',
          uid: 'uid',
          password: 'password',
        });
      });
      expect(cdcJsService.didLoad).toHaveBeenCalled();
      done();
    });

    it('should NOT happen without CDC, should show error', (done) => {
      spyOn(globalMessageService, 'remove');
      spyOn(globalMessageService, 'add');
      cdcJsService.didLoad = createSpy().and.callFake(() => of(false));
      cdcUserRegisterService.register(userRegisterFormData).subscribe({
        error: () => {
          expect(
            cdcJsService.registerUserWithoutScreenSet
          ).not.toHaveBeenCalled();
          expect(connector.register).not.toHaveBeenCalled();
          expect(globalMessageService.add).toHaveBeenCalledWith(
            {
              key: 'errorHandlers.scriptFailedToLoad',
            },
            GlobalMessageType.MSG_TYPE_ERROR
          );
          expect(
            cdcJsService.registerUserWithoutScreenSet
          ).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
