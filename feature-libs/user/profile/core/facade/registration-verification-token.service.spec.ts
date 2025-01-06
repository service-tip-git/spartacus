import { TestBed } from '@angular/core/testing';
import { CommandService } from '@spartacus/core';

import { of } from 'rxjs';
import createSpy = jasmine.createSpy;
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenCreation,
} from '../../root/model';
import { UserProfileConnector } from '../connectors';
import { RegistrationVerificationTokenService } from './registration-verification-token.service';

const registrationVerificationTokenCreation: RegistrationVerificationTokenCreation =
  {
    purpose: 'REGISTRATION',
    loginId: 'test@email.com',
  };

const registrationVerificationToken: RegistrationVerificationToken = {
  expiresIn: '300',
  tokenId: 'mockTokenId',
};

class MockUserProfileConnector implements Partial<UserProfileConnector> {
  createRegistrationVerificationToken = createSpy().and.callFake(() =>
    of(registrationVerificationToken)
  );
}

describe('RegistrationVerificationTokenService', () => {
  let service: RegistrationVerificationTokenService;
  let connector: UserProfileConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserProfileConnector, useClass: MockUserProfileConnector },
        CommandService,
        RegistrationVerificationTokenService,
      ],
    });

    service = TestBed.inject(RegistrationVerificationTokenService);
    connector = TestBed.inject(UserProfileConnector);
  });

  it('should inject RegistrationVerificationTokenService', () => {
    expect(service).toBeTruthy();
  });

  describe('create registration verification token', () => {
    it('should create registration verification token for given email', () => {
      let result: RegistrationVerificationToken | undefined;
      service
        .createRegistrationVerificationToken(
          registrationVerificationTokenCreation
        )
        .subscribe((data) => {
          result = data;
        })
        .unsubscribe();
      expect(result).toEqual(registrationVerificationToken);
      expect(
        connector.createRegistrationVerificationToken
      ).toHaveBeenCalledWith(registrationVerificationTokenCreation);
    });
  });
});
