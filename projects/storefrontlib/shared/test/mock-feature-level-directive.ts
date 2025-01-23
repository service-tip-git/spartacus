/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[cxFeatureLevel]',
  standalone: false,
})
export class MockFeatureLevelDirective {
  constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef
  ) {}

  @Input() set cxFeatureLevel(_feature: string | number) {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }
}
