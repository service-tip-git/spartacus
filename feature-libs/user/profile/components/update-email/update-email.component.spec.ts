import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { I18nTestingModule } from '@spartacus/core';
import {
  FormErrorsModule,
  PasswordVisibilityToggleModule,
} from '@spartacus/storefront';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { MockFeatureDirective } from 'projects/storefrontlib/shared/test/mock-feature-directive';
import { BehaviorSubject } from 'rxjs';
import { UpdateEmailComponentService } from './update-email-component.service';
import { UpdateEmailComponent } from './update-email.component';
import createSpy = jasmine.createSpy;

@Component({
  selector: 'cx-spinner',
  template: '',
})
class MockCxSpinnerComponent {}

const isBusySubject = new BehaviorSubject(false);
class MockUpdateEmailService implements Partial<UpdateEmailComponentService> {
  form: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl(),
    confirmEmail: new UntypedFormControl(),
    password: new UntypedFormControl(),
  });
  isUpdating$ = isBusySubject;
  save = createSpy().and.stub();
  resetForm = createSpy().and.stub();
}

describe('UpdateEmailComponent', () => {
  let component: UpdateEmailComponent;
  let fixture: ComponentFixture<UpdateEmailComponent>;
  let el: DebugElement;

  let service: UpdateEmailComponentService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        I18nTestingModule,
        FormErrorsModule,
        UrlTestingModule,
        PasswordVisibilityToggleModule,
      ],
      declarations: [
        UpdateEmailComponent,
        MockCxSpinnerComponent,
        MockFeatureDirective,
      ],
      providers: [
        {
          provide: UpdateEmailComponentService,
          useClass: MockUpdateEmailService,
        },
      ],
    })
      .overrideComponent(UpdateEmailComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEmailComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    service = TestBed.inject(UpdateEmailComponentService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('busy', () => {
    it('should disable the submit button when form is disabled', () => {
      component.form.disable();
      fixture.detectChanges();
      const submitBtn: HTMLButtonElement = el.query(
        By.css('button.btn-primary')
      ).nativeElement;
      expect(submitBtn.disabled).toBeTruthy();
    });

    it('should show the spinner', () => {
      isBusySubject.next(true);
      fixture.detectChanges();
      expect(el.query(By.css('cx-spinner'))).toBeTruthy();
    });
  });

  describe('idle', () => {
    it('should enable the submit button', () => {
      component.form.enable();
      fixture.detectChanges();
      const submitBtn = el.query(By.css('button.btn-primary'));
      expect(submitBtn.nativeElement.disabled).toBeFalsy();
    });

    it('should not show the spinner', () => {
      isBusySubject.next(false);
      fixture.detectChanges();
      expect(el.query(By.css('cx-spinner'))).toBeNull();
    });
  });

  describe('Form Interactions', () => {
    it('should call onSubmit() method on submit', () => {
      const request = spyOn(component, 'onSubmit');
      const form = el.query(By.css('form'));
      form.triggerEventHandler('submit', null);
      expect(request).toHaveBeenCalled();
    });

    it('should call the service method on submit', () => {
      component.onSubmit();
      expect(service.save).toHaveBeenCalled();
    });
  });
});
