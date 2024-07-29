import { inject, TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import * as ngrxStore from '@ngrx/store';
import { Store, StoreModule } from '@ngrx/store';
import {
  BaseSiteService,
  SiteContextConfig,
  SiteThemeActions,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { BaseSite, Theme } from '../../model/misc.model';

import { SiteThemeStoreModule } from '../store/site-theme-store.module';
import { StateWithSiteTheme } from '../store/state';
import { SiteThemeService } from './site-theme.service';
import createSpy = jasmine.createSpy;

const mockThemes: Theme[] = [
  { i18nNameKey: 'dark', className: 'dark', default: false },
];

const mockActiveTheme = 'dark';

const mockSiteThemeConfig: SiteThemeConfig = {
  siteTheme: {
    themes: [{ i18nNameKey: 'dark', className: 'dark', default: false }],
  },
};
export abstract class SiteThemeConfig {
  siteTheme?: {
    themes?: Array<Theme>;
  };
}

class MockBaseSiteService {
  get(_siteUid?: string): Observable<BaseSite | undefined> {
    return of({ theme: 'defautlTheme' });
  }
}

describe('SiteThemeService', () => {
  const mockSelect1 = createSpy('select').and.returnValue(() => of(mockThemes));
  const mockSelect2 = createSpy('select').and.returnValue(() =>
    of(mockActiveTheme)
  );

  let service: SiteThemeService;
  let store: Store<StateWithSiteTheme>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        SiteThemeStoreModule,
      ],
      providers: [
        SiteThemeService,
        { provide: BaseSiteService, useClass: MockBaseSiteService },
        { provide: SiteContextConfig, useValue: mockSiteThemeConfig },
      ],
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
    service = TestBed.inject(SiteThemeService);
  });

  it('should SiteThemeService is injected', inject(
    [SiteThemeService],
    (Service: SiteThemeService) => {
      expect(Service).toBeTruthy();
    }
  ));

  it('should not load themes when service is constructed', () => {
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should be able to get theme', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect1);
    service.getAll().subscribe((results) => {
      expect(results).toEqual(mockThemes);
    });
  });

  it('should be able to get active theme', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect2);
    service.getActive().subscribe((results) => {
      expect(results).toEqual(mockActiveTheme);
    });
  });

  it('should not set active theme', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect1);
    service.setActive('dark_new');
    expect(store.dispatch).not.toHaveBeenCalledWith(
      new SiteThemeActions.SetActiveTheme('dark_new')
    );
  });

  it('should return TRUE if a theme is initialized', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect1);
    expect(service.isInitialized()).toBeTruthy();
  });

  it('should return TRUE if the theme is valid', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect1);
    service.isValidTheme('dark').subscribe((results) => {
      expect(results).toBeTruthy();
    });
  });

  it('should return FALSE if the theme is not valid', () => {
    spyOnProperty(ngrxStore, 'select').and.returnValues(mockSelect1);
    service.isValidTheme('light').subscribe((results) => {
      expect(results).toBeFalsy();
    });
  });
});
