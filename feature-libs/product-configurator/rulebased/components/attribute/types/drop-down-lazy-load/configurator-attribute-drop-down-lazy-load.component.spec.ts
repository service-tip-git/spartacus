import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguratorAttributeDropDownLazyLoadComponent } from './configurator-attribute-drop-down-lazy-load.component';

describe('ConfiguratorAttributeDropDownLazyLoadComponent', () => {
  let component: ConfiguratorAttributeDropDownLazyLoadComponent;
  let fixture: ComponentFixture<ConfiguratorAttributeDropDownLazyLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguratorAttributeDropDownLazyLoadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ConfiguratorAttributeDropDownLazyLoadComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
