import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  CmsBannerCarouselComponent,
  CmsBannerCarouselEffect,
  CmsComponent,
  CmsService,
} from '@spartacus/core';
import { of } from 'rxjs';
import {
  CmsComponentData,
  ComponentWrapperDirective,
} from '../../../cms-structure/index';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';
import { IconComponent } from '../../misc';
import { BannerCarouselComponent } from './banner-carousel.component';

const componentData: CmsBannerCarouselComponent = {
  uid: 'SiteLogoComponent',
  typeCode: 'SimpleBannerCarouselComponent',
  name: 'Site Logo Component',
  banners: 'Test Banner',
  effect: CmsBannerCarouselEffect.CURTAIN,
};

const MockCmsComponentData = <CmsComponentData<CmsComponent>>{
  data$: of(componentData),
  uid: 'test',
};

class MockCmsService {}

describe('CreateComponent', () => {
  let bannerCarouselComponent: BannerCarouselComponent;
  let fixture: ComponentFixture<BannerCarouselComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        BannerCarouselComponent,
        CarouselComponent,
        ComponentWrapperDirective,
        IconComponent,
      ],
      providers: [
        { provide: CmsComponentData, useValue: MockCmsComponentData },
        { provide: CmsService, useClass: MockCmsService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerCarouselComponent);
    bannerCarouselComponent = fixture.componentInstance;
  });

  it('should create', () => {
    expect(bannerCarouselComponent).toBeTruthy();
  });

  it('should get items', () => {
    expect(bannerCarouselComponent.getItems()).toBeTruthy();
  });
});
