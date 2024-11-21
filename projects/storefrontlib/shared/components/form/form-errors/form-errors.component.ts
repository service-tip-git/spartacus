/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  HostBinding,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  inject,
} from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import {
  FeatureConfigService,
  isObject,
  useFeatureStyles,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TranslatePipe } from '@spartacus/core';
import { FeatureDirective } from '@spartacus/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

/**
 * Renders translated form errors for a given form control, based on its `errors` property.
 *
 * The translation key consists of the optional input `prefix`
 * concatenated with the error key.
 *
 * And the translation params object consist of the error details
 * (if only it's an object) merged with the optional input object `translationParams`.
 */
@Component({
  selector: 'cx-form-errors',
  templateUrl: './form-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgFor, FeatureDirective, AsyncPipe, TranslatePipe],
})
export class FormErrorsComponent implements DoCheck {
  private featureConfigService = inject(FeatureConfigService);

  constructor(
    protected ChangeDetectionRef: ChangeDetectorRef,
    protected keyValueDiffers: KeyValueDiffers
  ) {
    useFeatureStyles('a11yFormErrorMuteIcon');
  }

  _control: UntypedFormControl | AbstractControl;

  /**
   * Emits an array of errors, each represented by a tuple:
   * the error key and error details.
   */
  errorsDetails$: Observable<Array<[string, string | boolean]>>;

  protected differ: KeyValueDiffer<any, any>;

  // TODO: (CXSPA-7315) Remove feature toggle in the next major
  /**
   * Prefix prepended to the translation key.
   */
  @Input() prefix = this.featureConfigService.isEnabled(
    'formErrorsDescriptiveMessages'
  )
    ? 'formErrors.labeled'
    : 'formErrors';

  /**
   * Fallback prefix prepended to the translation key.
   */
  @Input() fallbackPrefix = 'formErrors';

  /**
   * Translation params to enrich the error details object.
   */
  @Input()
  translationParams: { [key: string]: string | null };

  @Input()
  set control(control: AbstractControl | UntypedFormControl | null) {
    if (!control) {
      return;
    }

    this._control = control;

    this.differ = this.keyValueDiffers.find(this.control).create();

    this.errorsDetails$ = control?.statusChanges.pipe(
      startWith({}),
      map(() => control.errors || {}),
      map((errors) =>
        Object.entries(errors).filter(([_key, details]) => details)
      )
    );
  }

  get control(): UntypedFormControl | AbstractControl {
    return this._control;
  }

  ngDoCheck(): void {
    const changes = this.differ?.diff(this.control);
    if (changes) {
      changes.forEachChangedItem((r) => {
        if (r?.key === 'touched') {
          this.ChangeDetectionRef.markForCheck();
        }
      });
    }
  }
  /**
   * Returns translation params composed of
   * the argument `errorDetails` (if only is an object) merged with
   * the component input object `translationParams`.
   *
   * In case of a conflicting object key, the value from
   * `translationParams` takes precedence.
   */
  getTranslationParams(errorDetails?: any): object {
    errorDetails = isObject(errorDetails) ? errorDetails : {};
    return { ...errorDetails, ...this.translationParams };
  }

  @HostBinding('class.control-invalid') get invalid() {
    return this.control?.invalid;
  }
  @HostBinding('class.control-dirty') get dirty() {
    return this.control?.dirty;
  }
  @HostBinding('class.control-touched') get touched() {
    return this.control?.touched;
  }
  @HostBinding('class.cx-visually-hidden') get hidden() {
    return !(this.invalid && (this.touched || this.dirty));
  }
  @HostBinding('attr.role') role = 'alert';
}
