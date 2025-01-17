import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguratorShowOptionsComponent } from './configurator-show-options.component';

describe('ConfiguratorShowOptions', () => {
  let component: ConfiguratorShowOptionsComponent;
  let fixture: ComponentFixture<ConfiguratorShowOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguratorShowOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguratorShowOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
