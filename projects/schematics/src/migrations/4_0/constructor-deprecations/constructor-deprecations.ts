/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { ConstructorDeprecation } from '../../../shared/utils/file-utils';
import { migrateConstructorDeprecation } from '../../mechanism/constructor-deprecations/constructor-deprecations';
import { ABSTRACT_STORE_ITEM_COMPONENT_MIGRATION } from './data/abstract-store-item.component.migration';
import {
  ADD_TO_SAVED_CART_COMPONENT_MIGRATION_V1,
  ADD_TO_SAVED_CART_COMPONENT_MIGRATION_V2,
} from './data/add-to-saved-cart.component.migration';
import { ADDED_TO_CART_DIALOG_COMPONENT_MIGRATION } from './data/added-to-cart-dialog.component.migration';
import { ADDRESS_BOOK_COMPONENT_MIGRATION } from './data/address-book.component.migration';
import { ADDRESS_BOOK_COMPONENT_SERVICE_MIGRATION } from './data/address-book.component.service.migration';
import {
  ADDRESS_FORM_COMPONENT_MIGRATION_V1,
  ADDRESS_FORM_COMPONENT_MIGRATION_V2,
} from './data/address-form.component.migration';
import {
  ANONYMOUS_CONSENT_MANAGEMENT_BANNER_COMPONENT_MIGRATION_V1,
  ANONYMOUS_CONSENT_MANAGEMENT_BANNER_COMPONENT_MIGRATION_V2,
} from './data/anonymous-consent-management-banner.component.migration';
import {
  ANONYMOUS_CONSENT_OPEN_DIALOG_COMPONENT_MIGRATION_V1,
  ANONYMOUS_CONSENT_OPEN_DIALOG_COMPONENT_MIGRATION_V2,
} from './data/anonymous-consent-open-dialog.component.migration';
import { ASM_AUTH_HTTP_HEADER_SERVICE_MIGRATION } from './data/asm-auth-http-header.service.migration';
import { AUTH_HTTP_HEADER_SERVICE_MIGRATION } from './data/auth-http-header.service.migration';
import { AUTH_REDIRECT_SERVICE_MIGRATION } from './data/auth-redirect.service.migration';
import { BASE_PAGE_META_RESOLVER_MIGRATION } from './data/base-page-meta.resolver.migration';
import { CART_DETAILS_COMPONENT_MIGRATION } from './data/cart-details.component.migration';
import { CART_ITEM_LIST_COMPONENT_MIGRATIONS } from './data/cart-item-list.component.migration';
import { CART_ITEM_COMPONENT_MIGRATION } from './data/cart-item.component.migration';
import {
  CART_LIST_ITEM_COMPONENT_MIGRATION_V1,
  CART_LIST_ITEM_COMPONENT_MIGRATION_V2,
  CART_LIST_ITEM_COMPONENT_MIGRATION_V3,
} from './data/cart-list-item.component.migration';
import {
  CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V1,
  CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V2,
} from './data/cart-page-event.builder.migration';
import { CATEGORY_PAGE_META_RESOLVER_MIGRATION } from './data/category-page-meta.resolver.migration';
import { CDC_LOGOUT_GUARD_CONSTRUCTOR_MIGRATION } from './data/cdc-logout.guard.migration';
import { CHECKOUT_AUTH_GUARD_MIGRATION } from './data/checkout-auth.guard';
import { CHECKOUT_EVENT_MODULE_MIGRATION } from './data/checkout-event.module.migration';
import { CHECKOUT_PAGE_META_RESOLVER_MIGRATION } from './data/checkout-page-meta.resolver.migration';
import {
  CMS_COMPONENTS_SERVICE_MIGRATION_1,
  CMS_COMPONENTS_SERVICE_MIGRATION_2,
  CMS_COMPONENTS_SERVICE_MIGRATION_3,
} from './data/cms-components.service.migration';
import { COMPONENT_WRAPPER_CONSTRUCTOR_MIGRATION } from './data/component-wrapper.directive.migration';
import { CONFIGURATION_SERVICE_MIGRATION } from './data/configuration.service.migration';
import { CONFIGURATOR_ATTRIBUTE_CHECKBOX_LIST_COMPONENT_MIGRATION } from './data/configurator-attribute-checkbox-list.component.migration';
import { CONFIGURATOR_ATTRIBUTE_DROP_DOWN_COMPONENT_MIGRATION } from './data/configurator-attribute-drop-down.component.migration';
import { CONFIGURATOR_ATTRIBUTE_INPUT_FIELD_COMPONENT_MIGRATION } from './data/configurator-attribute-input-field.component.migration';
import { CONFIGURATOR_ATTRIBUTE_NUMERIC_INPUT_FIELD_COMPONENT_MIGRATION } from './data/configurator-attribute-numeric-input-field.component.migration';
import { CONFIGURATOR_ATTRIBUTE_RADIO_BUTTON_COMPONENT_MIGRATION } from './data/configurator-attribute-radio-button.component.migration';
import { CONFIGURATOR_CART_ENTRY_INFO_COMPONENT_MIGRATION } from './data/configurator-cart-entry-info.component.migration';
import { CONFIGURATOR_CART_SERVICE_MIGRATION } from './data/configurator-cart.service.migration';
import { CONFIGURATOR_FORM_COMPONENT_MIGRATION } from './data/configurator-form.component.migration';
import { CONFIGURATOR_GROUP_MENU_COMPONENT_MIGRATION } from './data/configurator-group-menu.component.migration';
import { CONFIGURATOR_ISSUES_NOTIFICATION_COMPONENT_MIGRATION } from './data/configurator-issues-notification.component.migration';
import { CONFIGURATOR_OVERVIEW_ATTRIBUTE_COMPONENT_MIGRATION } from './data/configurator-overview-attribute.component.migration';
import { CONFIGURATOR_STOREFRONT_UTILS_SERVICE_MIGRATION } from './data/configurator-storefront-utils.service.migration';
import { CONFIGURATOR_UPDATE_MESSAGE_COMPONENT_MIGRATION } from './data/configurator-update-message.component.migration';
import {
  CONTENT_PAGE_META_RESOLVER_MIGRATION_V1,
  CONTENT_PAGE_META_RESOLVER_MIGRATION_V2,
} from './data/content-page-meta.resolver.migration';
import { CURRENCY_SERVICE_MIGRATION } from './data/currency.service.migration';
import { DELETE_ITEM_COMPONENT_MIGRATION } from './data/delete-item.component.migration';
import { DYNAMIC_ATTRIBUTE_SERVICE_MIGRATION } from './data/dynamic-attribute.service.migration';
import { EVENT_SERVICE_CONSTRUCTOR_DEPRECATION } from './data/event.service.migration';
import { EXPRESS_CHECKOUT_SERVICE_MIGRATION } from './data/express-checkout.service.migration';
import {
  GOOGLE_MAP_RENDERER_SERVICE_MIGRATION_V1,
  GOOGLE_MAP_RENDERER_SERVICE_MIGRATION_V2,
} from './data/google-map-renderer.service.migration';
import { GUEST_REGISTER_FORM_COMPONENT_MIGRATION } from './data/guest-register-form.component.migration';
import { HOME_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION } from './data/home-page-event.builder.migration';
import { LANGUAGE_SERVICE_MIGRATION } from './data/language.service.migration';
import { LOGIN_REGISTER_COMPONENT_MIGRATION } from './data/login-register.component.migration';
import { LOGOUT_GUARD_CONSTRUCTOR_MIGRATION } from './data/logout.guard.migration';
import { MEDIA_SERVICE_MIGRATION } from './data/media.service.migration';
import {
  MODAL_SERVICE_MIGRATION_V1,
  MODAL_SERVICE_MIGRATION_V2,
} from './data/modal.service.migration';
import { NAVIGATION_UI_COMPONENT_MIGRATION } from './data/navigation-ui.component.migration';
import { ON_NAVIGATE_FOCUS_SERVICE_MIGRATION } from './data/on-navigate-focus.service.migration';
import { ORDER_DETAIL_ITEMS_COMPONENT_MIGRATION } from './data/order-detail-items.component.migration';
import { ORGANIZATION_PAGE_META_RESOLVER_MIGRATION } from './data/organization-page-meta.resolver.migration';
import { PAGE_META_SERVICE_MIGRATION } from './data/page-meta.service.migration';
import { POPOVER_DIRECTIVE_CONSTRUCTOR_MIGRATION } from './data/popover.directive.migration';
import { PRODUCT_GRID_ITEM_COMPONENT_MIGRATION } from './data/product-grid-item.component.migration';
import { PRODUCT_LIST_COMPONENT_SERVICE_MIGRATION } from './data/product-list-component.service.migration';
import { PRODUCT_LIST_ITEM_COMPONENT_MIGRATION } from './data/product-list-item.component.migration';
import { PRODUCT_LOADING_SERVICE_MIGRATION } from './data/product-loading.service.migration';
import { PRODUCT_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION } from './data/product-page-event.builder.migration';
import {
  PRODUCT_PAGE_META_RESOLVER_MIGRATION_V1,
  PRODUCT_PAGE_META_RESOLVER_MIGRATION_V2,
} from './data/product-page-meta.resolver.migration';
import { PROTECTED_ROUTES_SERVICE_MIGRATION } from './data/protected-routes.service.migration';
import { QUALTRICS_LOADER_SERVICE_MIGRATION } from './data/qualtrics-loader.service.migration';
import {
  REPLENISHMENT_ORDER_CANCELLATION_COMPONENT_MIGRATION_V1,
  REPLENISHMENT_ORDER_CANCELLATION_COMPONENT_MIGRATION_V2,
} from './data/replenishment-order-cancellation.component.migration';
import {
  REPLENISHMENT_ORDER_HISTORY_COMPONENT_MIGRATION_V1,
  REPLENISHMENT_ORDER_HISTORY_COMPONENT_MIGRATION_V2,
} from './data/replenishment-order-history.component.migration';
import {
  ROUTING_SERVICE_MIGRATION_V1,
  ROUTING_SERVICE_MIGRATION_V2,
} from './data/routing.service.migration';
import {
  SAVED_CART_DETAILS_ACTION_COMPONENT_MIGRATION_V1,
  SAVED_CART_DETAILS_ACTION_COMPONENT_MIGRATION_V2,
  SAVED_CART_DETAILS_ACTION_COMPONENT_MIGRATION_V3,
} from './data/saved-cart-details-action.component.migration';
import {
  SAVED_CART_DETAILS_OVERVIEW_COMPONENT_MIGRATION_V1,
  SAVED_CART_DETAILS_OVERVIEW_COMPONENT_MIGRATION_V2,
} from './data/saved-cart-details-overview.component.migration';
import { SAVED_CART_FORM_DIALOG_COMPONENT_MIGRATION } from './data/saved-cart-form-dialog.component.migration';
import {
  SAVED_CART_LIST_COMPONENT_MIGRATION_V1,
  SAVED_CART_LIST_COMPONENT_MIGRATION_V2,
} from './data/saved-cart-list.component.migration';
import { SCHEDULE_COMPONENT_MIGRATION } from './data/schedule.component.migration';
import { SEARCH_BOX_COMPONENT_SERVICE_MIGRATION } from './data/search-box-component.service.migration';
import { SEARCH_BOX_COMPONENT_MIGRATION } from './data/search-box.component.migration';
import { SEARCH_PAGE_META_RESOLVER_MIGRATION } from './data/search-page-meta.resolver.migration';
import { STORE_FINDER_LIST_ITEM_COMPONENT_MIGRATION } from './data/store-finder-list-item.component.migration';
import { STORE_FINDER_LIST_COMPONENT_MIGRATION } from './data/store-finder-list.component.migration';
import { STORE_FINDER_STORE_DESCRIPTION_COMPONENT_MIGRATION } from './data/store-finder-store-description.component.migration';
import { STORE_FINDER_SERVICE_MIGRATION } from './data/store-finder.service.migration';
import {
  TAB_PARAGRAPH_CONTAINER_COMPONENT_CONSTRUCTOR_DEPRECATION,
  TAB_PARAGRAPH_CONTAINER_COMPONENT_CONSTRUCTOR_DEPRECATION_2,
} from './data/tab-paragraph-container.component.migration';
import {
  TOGGLE_STATUS_COMPONENT_MIGRATION_V1,
  TOGGLE_STATUS_COMPONENT_MIGRATION_V2,
} from './data/toggle-status.component.migration';
import { UNIT_ADDRESS_FORM_SERVICE_MIGRATION } from './data/unit-address-form.service.migration';
import { UNIT_CHILDREN_COMPONENT_MIGRATION } from './data/unit-children.component.migration';
import { UNIT_COST_CENTERS_COMPONENT_MIGRATION } from './data/unit-cost-centers.component.migration';
import { UNIT_USER_LIST_COMPONENT_MIGRATION } from './data/unit-user-list.component.migration';
import { UPDATE_EMAIL_COMPONENT_SERVICE_MIGRATION } from './data/update-email-component.service.migration';
import { USER_ADDRESS_SERVICE_MIGRATION } from './data/user-address-service.migration';
import { USER_GROUP_USER_LIST_COMPONENT_MIGRATION } from './data/user-group-user-list.component.migration';
import { WINDOW_REF_MIGRATION } from './data/window-ref.migration';

export const CONSTRUCTOR_DEPRECATION_DATA: ConstructorDeprecation[] = [
  CONFIGURATION_SERVICE_MIGRATION,
  MEDIA_SERVICE_MIGRATION,
  UNIT_CHILDREN_COMPONENT_MIGRATION,
  UNIT_COST_CENTERS_COMPONENT_MIGRATION,
  UNIT_USER_LIST_COMPONENT_MIGRATION,
  CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V1,
  CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V2,
  HOME_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION,
  EVENT_SERVICE_CONSTRUCTOR_DEPRECATION,
  PRODUCT_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION,
  SEARCH_BOX_COMPONENT_SERVICE_MIGRATION,
  CURRENCY_SERVICE_MIGRATION,
  LANGUAGE_SERVICE_MIGRATION,
  PAGE_META_SERVICE_MIGRATION,
  BASE_PAGE_META_RESOLVER_MIGRATION,
  CONTENT_PAGE_META_RESOLVER_MIGRATION_V1,
  CONTENT_PAGE_META_RESOLVER_MIGRATION_V2,
  PRODUCT_PAGE_META_RESOLVER_MIGRATION_V1,
  PRODUCT_PAGE_META_RESOLVER_MIGRATION_V2,
  SEARCH_PAGE_META_RESOLVER_MIGRATION,
  CHECKOUT_PAGE_META_RESOLVER_MIGRATION,
  CATEGORY_PAGE_META_RESOLVER_MIGRATION,
  ORGANIZATION_PAGE_META_RESOLVER_MIGRATION,
  ROUTING_SERVICE_MIGRATION_V1,
  ROUTING_SERVICE_MIGRATION_V2,
  COMPONENT_WRAPPER_CONSTRUCTOR_MIGRATION,
  STORE_FINDER_SERVICE_MIGRATION,
  ABSTRACT_STORE_ITEM_COMPONENT_MIGRATION,
  SCHEDULE_COMPONENT_MIGRATION,
  STORE_FINDER_LIST_ITEM_COMPONENT_MIGRATION,
  STORE_FINDER_LIST_COMPONENT_MIGRATION,
  STORE_FINDER_STORE_DESCRIPTION_COMPONENT_MIGRATION,
  GOOGLE_MAP_RENDERER_SERVICE_MIGRATION_V1,
  GOOGLE_MAP_RENDERER_SERVICE_MIGRATION_V2,
  CONFIGURATOR_CART_SERVICE_MIGRATION,
  ADDRESS_BOOK_COMPONENT_SERVICE_MIGRATION,
  ADDRESS_BOOK_COMPONENT_MIGRATION,
  ADDRESS_FORM_COMPONENT_MIGRATION_V1,
  ADDRESS_FORM_COMPONENT_MIGRATION_V2,
  USER_ADDRESS_SERVICE_MIGRATION,
  CHECKOUT_EVENT_MODULE_MIGRATION,
  SAVED_CART_LIST_COMPONENT_MIGRATION_V1,
  SAVED_CART_LIST_COMPONENT_MIGRATION_V2,
  SAVED_CART_FORM_DIALOG_COMPONENT_MIGRATION,
  QUALTRICS_LOADER_SERVICE_MIGRATION,
  LOGIN_REGISTER_COMPONENT_MIGRATION,
  ADD_TO_SAVED_CART_COMPONENT_MIGRATION_V1,
  ADD_TO_SAVED_CART_COMPONENT_MIGRATION_V2,
  ANONYMOUS_CONSENT_MANAGEMENT_BANNER_COMPONENT_MIGRATION_V1,
  ANONYMOUS_CONSENT_MANAGEMENT_BANNER_COMPONENT_MIGRATION_V2,
  ANONYMOUS_CONSENT_OPEN_DIALOG_COMPONENT_MIGRATION_V1,
  ANONYMOUS_CONSENT_OPEN_DIALOG_COMPONENT_MIGRATION_V2,
  REPLENISHMENT_ORDER_CANCELLATION_COMPONENT_MIGRATION_V1,
  REPLENISHMENT_ORDER_CANCELLATION_COMPONENT_MIGRATION_V2,
  REPLENISHMENT_ORDER_HISTORY_COMPONENT_MIGRATION_V1,
  REPLENISHMENT_ORDER_HISTORY_COMPONENT_MIGRATION_V2,
  SAVED_CART_DETAILS_ACTION_COMPONENT_MIGRATION_V1,
  SAVED_CART_DETAILS_ACTION_COMPONENT_MIGRATION_V2,
  SAVED_CART_DETAILS_ACTION_COMPONENT_MIGRATION_V3,
  SAVED_CART_DETAILS_OVERVIEW_COMPONENT_MIGRATION_V1,
  SAVED_CART_DETAILS_OVERVIEW_COMPONENT_MIGRATION_V2,
  DYNAMIC_ATTRIBUTE_SERVICE_MIGRATION,
  WINDOW_REF_MIGRATION,
  CONFIGURATOR_ATTRIBUTE_CHECKBOX_LIST_COMPONENT_MIGRATION,
  CONFIGURATOR_ATTRIBUTE_DROP_DOWN_COMPONENT_MIGRATION,
  CONFIGURATOR_ATTRIBUTE_NUMERIC_INPUT_FIELD_COMPONENT_MIGRATION,
  CONFIGURATOR_ATTRIBUTE_INPUT_FIELD_COMPONENT_MIGRATION,
  CONFIGURATOR_ATTRIBUTE_RADIO_BUTTON_COMPONENT_MIGRATION,
  CONFIGURATOR_GROUP_MENU_COMPONENT_MIGRATION,
  CONFIGURATOR_STOREFRONT_UTILS_SERVICE_MIGRATION,
  NAVIGATION_UI_COMPONENT_MIGRATION,
  CONFIGURATOR_FORM_COMPONENT_MIGRATION,
  CONFIGURATOR_UPDATE_MESSAGE_COMPONENT_MIGRATION,
  CART_LIST_ITEM_COMPONENT_MIGRATION_V1,
  CART_LIST_ITEM_COMPONENT_MIGRATION_V2,
  CART_LIST_ITEM_COMPONENT_MIGRATION_V3,
  SEARCH_BOX_COMPONENT_MIGRATION,
  USER_GROUP_USER_LIST_COMPONENT_MIGRATION,
  TOGGLE_STATUS_COMPONENT_MIGRATION_V1,
  TOGGLE_STATUS_COMPONENT_MIGRATION_V2,
  DELETE_ITEM_COMPONENT_MIGRATION,
  CMS_COMPONENTS_SERVICE_MIGRATION_1,
  CMS_COMPONENTS_SERVICE_MIGRATION_2,
  CMS_COMPONENTS_SERVICE_MIGRATION_3,
  ASM_AUTH_HTTP_HEADER_SERVICE_MIGRATION,
  AUTH_HTTP_HEADER_SERVICE_MIGRATION,
  AUTH_REDIRECT_SERVICE_MIGRATION,
  PROTECTED_ROUTES_SERVICE_MIGRATION,
  PRODUCT_LIST_ITEM_COMPONENT_MIGRATION,
  PRODUCT_LIST_COMPONENT_SERVICE_MIGRATION,
  PRODUCT_GRID_ITEM_COMPONENT_MIGRATION,
  CART_ITEM_COMPONENT_MIGRATION,
  ...CART_ITEM_LIST_COMPONENT_MIGRATIONS,
  CONFIGURATOR_CART_ENTRY_INFO_COMPONENT_MIGRATION,
  CONFIGURATOR_ISSUES_NOTIFICATION_COMPONENT_MIGRATION,
  CONFIGURATOR_OVERVIEW_ATTRIBUTE_COMPONENT_MIGRATION,
  LOGOUT_GUARD_CONSTRUCTOR_MIGRATION,
  CDC_LOGOUT_GUARD_CONSTRUCTOR_MIGRATION,
  UPDATE_EMAIL_COMPONENT_SERVICE_MIGRATION,
  ADDED_TO_CART_DIALOG_COMPONENT_MIGRATION,
  CART_DETAILS_COMPONENT_MIGRATION,
  ORDER_DETAIL_ITEMS_COMPONENT_MIGRATION,
  EXPRESS_CHECKOUT_SERVICE_MIGRATION,
  MODAL_SERVICE_MIGRATION_V1,
  MODAL_SERVICE_MIGRATION_V2,
  TAB_PARAGRAPH_CONTAINER_COMPONENT_CONSTRUCTOR_DEPRECATION,
  TAB_PARAGRAPH_CONTAINER_COMPONENT_CONSTRUCTOR_DEPRECATION_2,
  CHECKOUT_AUTH_GUARD_MIGRATION,
  UNIT_ADDRESS_FORM_SERVICE_MIGRATION,
  GUEST_REGISTER_FORM_COMPONENT_MIGRATION,
  PRODUCT_LOADING_SERVICE_MIGRATION,
  POPOVER_DIRECTIVE_CONSTRUCTOR_MIGRATION,
  ON_NAVIGATE_FOCUS_SERVICE_MIGRATION,
];

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return migrateConstructorDeprecation(
      tree,
      context,
      CONSTRUCTOR_DEPRECATION_DATA
    );
  };
}
