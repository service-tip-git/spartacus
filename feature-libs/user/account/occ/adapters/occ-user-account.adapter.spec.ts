import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BaseOccUrlProperties,
  ConverterService,
  DynamicAttributes,
  OccConfig,
  OccEndpointsService,
} from '@spartacus/core';
import {
  USER_ACCOUNT_NORMALIZER,
  VERIFICATION_TOKEN_NORMALIZER,
} from '@spartacus/user/account/core';
import {
  User,
  VerificationToken,
  VerificationTokenCreation,
} from '@spartacus/user/account/root';
import { OccUserAccountAdapter } from './occ-user-account.adapter';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

export const mockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
    },
  },

  context: {
    baseSite: [''],
  },
};

export class MockOccEndpointsService {
  buildUrl(
    endpoint: string,
    _attributes?: DynamicAttributes,
    _propertiesToOmit?: BaseOccUrlProperties
  ) {
    return this.getEndpoint(endpoint);
  }
  getEndpoint(endpoint: string) {
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    return endpoint;
  }
  getBaseUrl() {
    return '';
  }
}

const username = 'mockUsername';
const password = '1234';

const user: User = {
  customerId: username,
  displayUid: password,
};

const verificationTokenCreation: VerificationTokenCreation = {
  purpose: 'LOGIN',
  loginId: 'test@email.com',
  password: password,
};

const verificationToken: VerificationToken = {
  expiresIn: '300',
  tokenId: 'mockTokenId',
};

describe('OccUserAccountAdapter', () => {
  let occUserAccountAdapter: OccUserAccountAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let occEndpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OccUserAccountAdapter,
        { provide: OccConfig, useValue: mockOccModuleConfig },
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    occUserAccountAdapter = TestBed.inject(OccUserAccountAdapter);
    httpMock = TestBed.inject(HttpTestingController);
    converter = TestBed.inject(ConverterService);
    occEndpointsService = TestBed.inject(OccEndpointsService);
    spyOn(converter, 'pipeableMany').and.callThrough();
    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(converter, 'convert').and.callThrough();
    spyOn(occEndpointsService, 'buildUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('load user details', () => {
    it('should load user details for given username and access token', () => {
      occUserAccountAdapter.load(username).subscribe((result) => {
        expect(result).toEqual(user);
      });

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'GET';
      });

      expect(occEndpointsService.buildUrl).toHaveBeenCalledWith('user', {
        urlParams: { userId: user.customerId },
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(user);
    });

    it('should use converter', () => {
      occUserAccountAdapter.load(username).subscribe();
      httpMock
        .expectOne((req) => {
          return req.method === 'GET';
        })
        .flush(user);
      expect(converter.pipeable).toHaveBeenCalledWith(USER_ACCOUNT_NORMALIZER);
    });
  });

  describe('create verification token', () => {
    it('should create verification token for given email and password', () => {
      occUserAccountAdapter
        .createVerificationToken(verificationTokenCreation)
        .subscribe((result) => {
          expect(result).toEqual(verificationToken);
        });

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'POST';
      });

      expect(occEndpointsService.buildUrl).toHaveBeenCalledWith(
        'createVerificationToken'
      );
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(verificationToken);
    });

    it('should use converter', () => {
      occUserAccountAdapter
        .createVerificationToken(verificationTokenCreation)
        .subscribe();
      httpMock
        .expectOne((req) => {
          return req.method === 'POST';
        })
        .flush(verificationToken);
      expect(converter.pipeable).toHaveBeenCalledWith(
        VERIFICATION_TOKEN_NORMALIZER
      );
    });
  });
});
