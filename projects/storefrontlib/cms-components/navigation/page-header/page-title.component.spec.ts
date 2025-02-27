import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nTestingModule, PageMeta, PageMetaService } from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { PageTitleComponent } from './page-title.component';

class MockPageMetaService {
  getMeta(): Observable<PageMeta> {
    return of(<PageMeta>{
      title: 'Test title',
      description: 'Test description',
    });
  }
}

describe('PageTitleComponent', () => {
  let component: PageTitleComponent;
  let fixture: ComponentFixture<PageTitleComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [PageTitleComponent],
      providers: [
        { provide: PageMetaService, useClass: MockPageMetaService },
        {
          provide: CmsComponentData,
          useValue: {
            data$: of({}),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTitleComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('title$', () => {
    it('should set title in ngOnInit', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(
        el.query(By.css('h1.cx-visually-hidden')).nativeElement.innerText
      ).toEqual('Test title');
    });
  });
});
