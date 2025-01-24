import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchoutComponent } from './punchout.component';

describe('PunchoutComponent', () => {
  let component: PunchoutComponent;
  let fixture: ComponentFixture<PunchoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunchoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunchoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
