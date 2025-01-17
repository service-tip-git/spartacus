import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguratorShowOptionsComponent } from './configurator-show-options.component';
import { I18nTestingModule } from '@spartacus/core';
import { ConfiguratorCommonsService } from '../../../core/facade/configurator-commons.service';

class MockConfiguratorCommonsService {}

describe('ConfiguratorShowOptions', () => {
  let component: ConfiguratorShowOptionsComponent;
  let fixture: ComponentFixture<ConfiguratorShowOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguratorShowOptionsComponent],
      imports: [I18nTestingModule],
      providers: [
        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguratorShowOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
