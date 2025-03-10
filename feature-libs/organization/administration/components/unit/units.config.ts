/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject } from '@angular/core';
import { AuthGuard, CmsConfig, FeatureToggles } from '@spartacus/core';
import {
  AdminGuard,
  OrgUnitGuard,
  UserGuard,
} from '@spartacus/organization/administration/core';
import { ROUTE_PARAMS } from '@spartacus/organization/administration/root';
import { BREAKPOINT, TableConfig, TableLayout } from '@spartacus/storefront';
import { MAX_OCC_INTEGER_VALUE } from '../constants';
import { CostCenterDetailsCellComponent } from '../cost-center/details-cell/cost-center-details-cell.component';
import { ItemService } from '../shared/item.service';
import { ListService } from '../shared/list/list.service';
import { OrganizationTableType } from '../shared/organization.model';
import { AssignCellComponent } from '../shared/sub-list/assign-cell.component';
import { CellComponent } from '../shared/table/cell.component';
import { StatusCellComponent } from '../shared/table/status/status-cell.component';
import { UnitCellComponent } from '../shared/table/unit/unit-cell.component';
import { UserDetailsCellComponent } from '../user/details-cell/user-details-cell.component';
import { UnitDetailsCellComponent } from './details-cell/unit-details-cell.component';
import { UnitDetailsComponent } from './details/unit-details.component';
import { UnitFormComponent } from './form/unit-form.component';
import { UnitAddressDetailsComponent } from './links/addresses/details/unit-address-details.component';
import { UnitAddressFormComponent } from './links/addresses/form/unit-address-form.component';
import { LinkCellComponent } from './links/addresses/list/link-cell.component';
import { UnitAddressListComponent } from './links/addresses/list/unit-address-list.component';
import { UnitAssignedApproverListComponent } from './links/approvers/assigned/unit-assigned-approver-list.component';
import { UnitApproverListComponent } from './links/approvers/unit-approver-list.component';
import { UnitChildCreateComponent } from './links/children/create/unit-child-create.component';
import { UnitChildrenComponent } from './links/children/unit-children.component';
import { UnitCostCenterListComponent } from './links/cost-centers/unit-cost-centers.component';
import {
  UnitCostCenterCreateComponent,
  UnitUserCreateComponent,
} from './links/index';
import { UnitUserRolesCellComponent } from './links/users/list/unit-user-link-cell.component';
import { UnitUserListComponent } from './links/users/list/unit-user-list.component';
import { UnitUserRolesFormComponent } from './links/users/roles/unit-user-roles.component';
import { ToggleLinkCellComponent } from './list/toggle-link/toggle-link-cell.component';
import { UnitListComponent } from './list/unit-list.component';
import { UnitAddressRoutePageMetaResolver } from './services/unit-address-route-page-meta.resolver';
import { UnitItemService } from './services/unit-item.service';
import { UnitListService } from './services/unit-list.service';
import { UnitRoutePageMetaResolver } from './services/unit-route-page-meta.resolver';

export const unitsCmsConfig: CmsConfig = {
  cmsComponents: {
    ManageUnitsListComponent: {
      component: UnitListComponent,
      providers: [
        {
          provide: ListService,
          useExisting: UnitListService,
        },
        {
          provide: ItemService,
          useExisting: UnitItemService,
        },
      ],
      childRoutes: {
        parent: {
          data: {
            cxPageMeta: {
              breadcrumb: 'orgUnit.breadcrumbs.list',
              resolver: UnitRoutePageMetaResolver,
            },
          },
        },
        children: [
          {
            path: 'create',
            component: UnitFormComponent,
            canActivate: [OrgUnitGuard],
          },
          {
            path: `:${ROUTE_PARAMS.unitCode}`,
            component: UnitDetailsComponent,
            data: {
              cxPageMeta: { breadcrumb: 'orgUnit.breadcrumbs.details' },
            },
            children: [
              {
                path: 'edit',
                component: UnitFormComponent,
                canActivate: [OrgUnitGuard],
              },
              {
                path: 'children',
                component: UnitChildrenComponent,
                canActivate: [OrgUnitGuard],
                data: {
                  cxPageMeta: { breadcrumb: 'orgUnit.breadcrumbs.children' },
                },
                children: [
                  {
                    path: 'create',
                    component: UnitChildCreateComponent,
                  },
                ],
              },
              {
                path: 'approvers',
                data: {
                  cxPageMeta: { breadcrumb: 'orgUnit.breadcrumbs.approvers' },
                },
                children: [
                  {
                    path: '',
                    component: UnitAssignedApproverListComponent,
                  },
                  {
                    path: 'assign',
                    component: UnitApproverListComponent,
                  },
                ],
              },
              {
                path: 'users',
                component: UnitUserListComponent,
                data: {
                  cxPageMeta: { breadcrumb: 'orgUnit.breadcrumbs.users' },
                },
                children: [
                  {
                    path: 'create',
                    component: UnitUserCreateComponent,
                    canActivate: [UserGuard],
                  },
                  {
                    path: `:${ROUTE_PARAMS.userCode}/roles`,
                    component: UnitUserRolesFormComponent,
                    canActivate: [UserGuard],
                  },
                ],
              },
              {
                path: 'cost-centers',
                component: UnitCostCenterListComponent,
                data: {
                  cxPageMeta: { breadcrumb: 'orgUnit.breadcrumbs.costCenters' },
                },
                children: [
                  {
                    path: 'create',
                    component: UnitCostCenterCreateComponent,
                  },
                ],
              },
              {
                path: 'addresses',
                component: UnitAddressListComponent,
                data: {
                  cxPageMeta: {
                    breadcrumb: 'orgUnit.breadcrumbs.addresses',
                    resolver: UnitAddressRoutePageMetaResolver,
                  },
                },
                children: [
                  {
                    path: 'create',
                    component: UnitAddressFormComponent,
                  },
                  {
                    path: `:${ROUTE_PARAMS.addressCode}`,
                    data: {
                      cxPageMeta: {
                        breadcrumb: 'orgUnit.breadcrumbs.addressDetails',
                      },
                    },
                    children: [
                      {
                        path: '',
                        component: UnitAddressDetailsComponent,
                      },
                      {
                        path: 'edit',
                        component: UnitAddressFormComponent,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      guards: [AuthGuard, AdminGuard],
    },
  },
};

export function unitsTableConfigFactory(): TableConfig {
  // TODO: (CXSPA-7155) - Remove feature flag and legacy config next major release
  const featureToggles = inject(FeatureToggles);
  if (featureToggles.a11yOrganizationLinkableCells) {
    return newUnitsTableConfig;
  }
  return unitsTableConfig;
}

export const newUnitsTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.UNIT]: {
      cells: ['name'],
      options: {
        layout: TableLayout.VERTICAL,
        cells: {
          name: {
            dataComponent: ToggleLinkCellComponent,
            linkable: true,
          },
          active: {
            dataComponent: StatusCellComponent,
          },
          uid: {
            dataComponent: CellComponent,
          },
        },
      },
      [BREAKPOINT.lg]: {
        cells: ['name', 'active', 'uid'],
      },
    },
    [OrganizationTableType.UNIT_USERS]: {
      cells: ['name', 'roles'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          roles: {
            dataComponent: UnitUserRolesCellComponent,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_CHILDREN]: {
      cells: ['name', 'active'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          name: {
            dataComponent: UnitDetailsCellComponent,
          },
          active: {
            dataComponent: StatusCellComponent,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_APPROVERS]: {
      cells: ['name', 'orgUnit', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          actions: {
            dataComponent: AssignCellComponent,
          },
          orgUnit: {
            dataComponent: UnitCellComponent,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_ASSIGNED_APPROVERS]: {
      cells: ['name', 'orgUnit', 'actions'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          actions: {
            dataComponent: AssignCellComponent,
          },
          orgUnit: {
            dataComponent: UnitCellComponent,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_COST_CENTERS]: {
      cells: ['name'],
      options: {
        cells: {
          name: {
            dataComponent: CostCenterDetailsCellComponent,
          },
        },
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
      },
    },

    [OrganizationTableType.UNIT_ADDRESS]: {
      cells: ['formattedAddress'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          formattedAddress: {
            dataComponent: LinkCellComponent,
            linkable: true,
          },
        },
      },
    },
  },
};

export const unitsTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.UNIT]: {
      cells: ['name'],
      options: {
        layout: TableLayout.VERTICAL,
        cells: {
          name: {
            dataComponent: ToggleLinkCellComponent,
          },
          active: {
            dataComponent: StatusCellComponent,
          },
          uid: {
            dataComponent: CellComponent,
          },
        },
      },
      [BREAKPOINT.lg]: {
        cells: ['name', 'active', 'uid'],
      },
    },
    [OrganizationTableType.UNIT_USERS]: {
      cells: ['name', 'roles'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          roles: {
            dataComponent: UnitUserRolesCellComponent,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_CHILDREN]: {
      cells: ['name', 'active'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          name: {
            dataComponent: UnitDetailsCellComponent,
          },
          active: {
            dataComponent: StatusCellComponent,
            linkable: false,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_APPROVERS]: {
      cells: ['name', 'orgUnit', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          actions: {
            dataComponent: AssignCellComponent,
          },
          orgUnit: {
            dataComponent: UnitCellComponent,
            linkable: false,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_ASSIGNED_APPROVERS]: {
      cells: ['name', 'orgUnit', 'actions'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          actions: {
            dataComponent: AssignCellComponent,
          },
          orgUnit: {
            dataComponent: UnitCellComponent,
            linkable: false,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_COST_CENTERS]: {
      cells: ['name'],
      options: {
        cells: {
          name: {
            dataComponent: CostCenterDetailsCellComponent,
          },
        },
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
      },
    },

    [OrganizationTableType.UNIT_ADDRESS]: {
      cells: ['formattedAddress'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          formattedAddress: {
            dataComponent: LinkCellComponent,
          },
        },
      },
    },
  },
};
