import {
  HttpClient,
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  TestRequest,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import {
  CurrencyService,
  LanguageService,
  OccConfig,
  SiteContextConfig,
  defaultOccConfig,
} from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SiteContextInterceptor } from './site-context.interceptor';

const Url = `https://localhost:9002/assistedservicewebservices/electronics/`;
class MockCurrencyService {
  isocode = new BehaviorSubject('');

  getActive(): Observable<string> {
    return this.isocode;
  }

  setActive(isocode: string) {
    this.isocode.next(isocode);
  }
}

class MockLanguageService {
  isocode = new BehaviorSubject('');

  getActive(): Observable<string> {
    return this.isocode;
  }

  setActive(isocode: string) {
    this.isocode.next(isocode);
  }
}

class MockSiteContextModuleConfig {
  server = {
    baseUrl: 'https://localhost:9002',
    occPrefix: defaultOccConfig?.backend?.occ?.prefix,
  };

  context = {
    baseSite: ['electronics'],
    language: [''],
    currency: [''],
  };
}

describe('SiteContextInterceptor', () => {
  const languageDe = 'de';
  const currencyJpy = 'JPY';

  let httpMock: HttpTestingController;
  let currencyService: CurrencyService;
  let languageService: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: LanguageService,
          useClass: MockLanguageService,
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService,
        },
        {
          provide: SiteContextConfig,
          useClass: MockSiteContextModuleConfig,
        },
        {
          provide: OccConfig,
          useClass: MockSiteContextModuleConfig,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SiteContextInterceptor,
          multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    currencyService = TestBed.inject(CurrencyService);
    languageService = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not add parameters: lang and curr to a request', inject(
    [HttpClient],
    (http: HttpClient) => {
      http.get('/xxx').subscribe((result) => {
        expect(result).toBeTruthy();
      });
      const mockReq: TestRequest = httpMock.expectOne((req) => {
        return req.method === 'GET';
      });

      expect(mockReq.request.params.get('lang')).toEqual(null);
      expect(mockReq.request.params.get('curr')).toEqual(null);

      mockReq.flush('somedata');
    }
  ));

  it('should add parameters: lang and curr to a request', inject(
    [HttpClient],
    (http: HttpClient) => {
      languageService.setActive(languageDe);
      currencyService.setActive(currencyJpy);
      http.get(Url).subscribe((result) => {
        expect(result).toBeTruthy();
      });

      const mockReq: TestRequest = httpMock.expectOne((req) => {
        return req.method === 'GET';
      });
      expect(mockReq.request.params.get('lang')).toEqual(languageDe);
      expect(mockReq.request.params.get('curr')).toEqual(currencyJpy);

      mockReq.flush('somedata');
    }
  ));
});
