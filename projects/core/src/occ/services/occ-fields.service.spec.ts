import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  OccFieldsModel,
  OccFieldsService,
  ScopedDataWithUrl,
} from './occ-fields.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('OccFieldsService', () => {
  let service: OccFieldsService;
  const models: ScopedDataWithUrl[] = [
    {
      url: 'https://test/url?fields=ala',
      scopedData: { scope: 'scope1' },
    },
    {
      url: 'https://test/url?fields=ma,kota',
      scopedData: { scope: 'scope2' },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(OccFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOptimalUrlGroups', () => {
    it('should nor merge same ULRs with different fields parameters', () => {
      expect(service.getOptimalUrlGroups(models)).toEqual({
        'https://test/url?fields=ala,ma,kota': {
          scope1: {
            fields: { ala: {} },
            scopedData: { scope: 'scope1' },
            url: 'https://test/url?fields=ala',
          },
          scope2: {
            fields: {
              ma: {},
              kota: {},
            },
            scopedData: {
              scope: 'scope2',
            },
            url: 'https://test/url?fields=ma,kota',
          },
        },
      });
    });

    it('should nor merge distinct ULRs', () => {
      const distinctModels: OccFieldsModel[] = [
        {
          url: 'https://test/url?fields=ala&c=a',
          scopedData: { scope: 'scope1' },
          fields: {},
        },
        {
          url: 'https://test/url?fields=ma,kota',
          scopedData: { scope: 'scope2' },
          fields: {},
        },
      ];
      expect(service.getOptimalUrlGroups(distinctModels)).toEqual({
        'https://test/url?c=a&fields=ala': {
          scope1: {
            fields: { ala: {} },
            scopedData: { scope: 'scope1' },
            url: 'https://test/url?fields=ala&c=a',
          },
        },
        'https://test/url?fields=ma,kota': {
          scope2: {
            fields: {
              ma: {},
              kota: {},
            },
            scopedData: {
              scope: 'scope2',
            },
            url: 'https://test/url?fields=ma,kota',
          },
        },
      });
    });
  });
});
