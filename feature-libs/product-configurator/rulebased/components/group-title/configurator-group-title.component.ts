/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  AfterContentChecked,
} from '@angular/core';
import { ConfiguratorRouterExtractorService } from '@spartacus/product-configurator/common';
import {
  ICON_TYPE,
  HamburgerMenuService,
  BREAKPOINT,
  BreakpointService,
} from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { ConfiguratorGroupsService } from '../../core/facade/configurator-groups.service';
import { Configurator } from '../../core/model/configurator.model';
import { ConfiguratorExpertModeService } from '../../core/services/configurator-expert-mode.service';
import { ConfiguratorStorefrontUtilsService } from '../service/configurator-storefront-utils.service';

@Component({
  selector: 'cx-configurator-group-title',
  templateUrl: './configurator-group-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ConfiguratorGroupTitleComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  @HostBinding('class.ghost') ghostStyle = true;
  protected subscription = new Subscription();
  protected readonly PRE_HEADER = '.PreHeader';
  protected readonly ADD_TO_CART_BUTTON = 'cx-configurator-add-to-cart-button';
  protected focusFirstElementInMobileGroupList = false;

  displayedGroup$: Observable<Configurator.Group> =
    this.configRouterExtractorService.extractRouterData().pipe(
      switchMap((routerData) =>
        this.configuratorGroupsService.getCurrentGroup(routerData.owner).pipe(
          tap(() => {
            this.ghostStyle = false;
          })
        )
      )
    );
  iconTypes = ICON_TYPE;

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configuratorGroupsService: ConfiguratorGroupsService,
    protected configRouterExtractorService: ConfiguratorRouterExtractorService,
    protected configExpertModeService: ConfiguratorExpertModeService,
    protected breakpointService: BreakpointService,
    protected configuratorStorefrontUtilsService: ConfiguratorStorefrontUtilsService,
    protected hamburgerMenuService: HamburgerMenuService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.hamburgerMenuService.isExpanded.subscribe((isExpanded) => {
        if (!isExpanded) {
          this.configuratorStorefrontUtilsService.changeStyling(
            this.PRE_HEADER,
            'display',
            'none'
          );
          this.configuratorStorefrontUtilsService.changeStyling(
            this.ADD_TO_CART_BUTTON,
            'z-index',
            'calc(var(--cx-popover-z-index) + 10)'
          );

          this.configuratorStorefrontUtilsService.focusFirstActiveElement(
            '.cx-group-title'
          );
        } else {
          this.configuratorStorefrontUtilsService.changeStyling(
            this.PRE_HEADER,
            'display',
            'block'
          );
          this.configuratorStorefrontUtilsService.changeStyling(
            this.ADD_TO_CART_BUTTON,
            'z-index',
            '0'
          );
          this.focusFirstElementInMobileGroupList = true;
        }
      })
    );
  }

  ngAfterContentChecked(): void {
    if (this.focusFirstElementInMobileGroupList) {
      this.configuratorStorefrontUtilsService.focusFirstActiveElement(
        'cx-configurator-group-menu'
      );
      this.focusFirstElementInMobileGroupList = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.configuratorStorefrontUtilsService.removeStyling(
      this.PRE_HEADER,
      'display'
    );
  }

  getGroupTitle(group: Configurator.Group): string | undefined {
    let title = group.description;
    if (group.groupType !== Configurator.GroupType.CONFLICT_GROUP) {
      this.configExpertModeService
        .getExpModeActive()
        .pipe(take(1))
        .subscribe((expMode) => {
          if (expMode) {
            title += ` / [${group.name}]`;
          }
        });
    }
    return title;
  }

  /**
   * Verifies whether the current screen size equals or is smaller than breakpoint `BREAKPOINT.md`.
   *
   * @returns {Observable<boolean>} - If the given breakpoint equals or is smaller than`BREAKPOINT.md` returns `true`, otherwise `false`.
   */
  isMobile(): Observable<boolean> {
    return this.breakpointService.isDown(BREAKPOINT.md);
  }
}
