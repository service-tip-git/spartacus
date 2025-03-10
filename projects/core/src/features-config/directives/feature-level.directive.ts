/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureConfigService } from '../services/feature-config.service';

@Directive({
  selector: '[cxFeatureLevel]',
  standalone: false,
})
export class FeatureLevelDirective {
  constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    protected featureConfig: FeatureConfigService
  ) {}

  private hasView = false;

  @Input() set cxFeatureLevel(level: string | number) {
    if (this.featureConfig.isLevel(level.toString()) && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!this.featureConfig.isLevel(level.toString()) && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
