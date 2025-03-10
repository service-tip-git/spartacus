/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject } from '@angular/core';
import { AuthGuard, CmsConfig, FeatureToggles } from '@spartacus/core';
import {
  AdminGuard,
  UserGuard,
} from '@spartacus/organization/administration/core';
import { ROUTE_PARAMS } from '@spartacus/organization/administration/root';
import { TableConfig } from '@spartacus/storefront';
import { MAX_OCC_INTEGER_VALUE } from '../constants';
import { PermissionDetailsCellComponent } from '../permission/details-cell/permission-details-cell.component';
import { ItemService } from '../shared/item.service';
import { ListComponent } from '../shared/list/list.component';
import { ListService } from '../shared/list/list.service';
import { OrganizationTableType } from '../shared/organization.model';
import { AssignCellComponent } from '../shared/sub-list/assign-cell.component';
import { ActiveLinkCellComponent } from '../shared/table/active-link/active-link-cell.component';
import { CellComponent } from '../shared/table/cell.component';
import { RolesCellComponent } from '../shared/table/roles/roles-cell.component';
import { StatusCellComponent } from '../shared/table/status/status-cell.component';
import { UnitCellComponent } from '../shared/table/unit/unit-cell.component';
import { UserGroupDetailsCellComponent } from '../user-group/details-cell/user-group-details-cell.component';
import { UserAssignedApproverListComponent } from './approvers/assigned/user-assigned-approver-list.component';
import { UserApproverListComponent } from './approvers/user-approver-list.component';
import { UserChangePasswordFormComponent } from './change-password-form/user-change-password-form.component';
import { UserDetailsCellComponent } from './details-cell/user-details-cell.component';
import { UserDetailsComponent } from './details/user-details.component';
import { UserFormComponent } from './form/user-form.component';
import { UserAssignedPermissionListComponent } from './permissions/assigned/user-assigned-permission-list.component';
import { UserPermissionListComponent } from './permissions/user-permission-list.component';
import { UserItemService } from './services/user-item.service';
import { UserListService } from './services/user-list.service';
import { UserRoutePageMetaResolver } from './services/user-route-page-meta.resolver';
import { UserUserGroupListComponent } from './user-groups';
import { UserAssignedUserGroupListComponent } from './user-groups/assigned/user-assigned-user-group-list.component';

export const userCmsConfig: CmsConfig = {
  cmsComponents: {
    ManageUsersListComponent: {
      component: ListComponent,
      providers: [
        {
          provide: ListService,
          useExisting: UserListService,
        },
        {
          provide: ItemService,
          useExisting: UserItemService,
        },
      ],
      childRoutes: {
        parent: {
          data: {
            cxPageMeta: {
              breadcrumb: 'orgUser.breadcrumbs.list',
              resolver: UserRoutePageMetaResolver,
            },
          },
        },
        children: [
          {
            path: 'create',
            component: UserFormComponent,
            canActivate: [UserGuard],
          },
          {
            path: `:${ROUTE_PARAMS.userCode}`,
            component: UserDetailsComponent,
            data: {
              cxPageMeta: { breadcrumb: 'orgUser.breadcrumbs.details' },
            },
            children: [
              {
                path: `edit`,
                component: UserFormComponent,
                canActivate: [UserGuard],
              },
              {
                path: `change-password`,
                component: UserChangePasswordFormComponent,
                canActivate: [UserGuard],
              },
              {
                path: 'user-groups',
                data: {
                  cxPageMeta: { breadcrumb: 'orgUser.breadcrumbs.userGroups' },
                },
                children: [
                  {
                    path: '',
                    component: UserAssignedUserGroupListComponent,
                  },
                  {
                    path: 'assign',
                    component: UserUserGroupListComponent,
                  },
                ],
              },
              {
                path: 'approvers',
                data: {
                  cxPageMeta: { breadcrumb: 'orgUser.breadcrumbs.approvers' },
                },
                children: [
                  {
                    path: '',
                    component: UserAssignedApproverListComponent,
                  },
                  {
                    path: 'assign',
                    component: UserApproverListComponent,
                  },
                ],
              },
              {
                path: 'purchase-limits',
                data: {
                  cxPageMeta: { breadcrumb: 'orgUser.breadcrumbs.permissions' },
                },
                children: [
                  {
                    path: '',
                    component: UserAssignedPermissionListComponent,
                  },
                  {
                    path: 'assign',
                    component: UserPermissionListComponent,
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

export function userTableConfigFactory(): TableConfig {
  // TODO: (CXSPA-7155) - Remove feature flag and legacy config next major release
  const featureToggles = inject(FeatureToggles);
  if (featureToggles.a11yOrganizationLinkableCells) {
    return newUserTableConfig;
  }
  return userTableConfig;
}

const actions = {
  dataComponent: AssignCellComponent,
};

const pagination = {
  pageSize: MAX_OCC_INTEGER_VALUE,
};

export const newUserTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.USER]: {
      cells: ['name', 'active', 'uid', 'roles', 'unit'],
      options: {
        cells: {
          name: {
            dataComponent: ActiveLinkCellComponent,
            linkable: true,
          },
          active: {
            dataComponent: StatusCellComponent,
          },
          uid: {
            dataComponent: CellComponent,
          },
          roles: {
            dataComponent: RolesCellComponent,
          },
          unit: {
            dataComponent: UnitCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_APPROVERS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          actions,
        },
      },
    },
    [OrganizationTableType.USER_ASSIGNED_APPROVERS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          actions,
        },
        pagination,
      },
    },
    [OrganizationTableType.USER_USER_GROUPS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserGroupDetailsCellComponent,
          },
          actions,
        },
      },
    },
    [OrganizationTableType.USER_ASSIGNED_USER_GROUPS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserGroupDetailsCellComponent,
          },
          actions,
        },
        pagination,
      },
    },
    [OrganizationTableType.USER_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells: {
          code: {
            dataComponent: PermissionDetailsCellComponent,
          },
          actions,
        },
      },
    },
    [OrganizationTableType.USER_ASSIGNED_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells: {
          code: {
            dataComponent: PermissionDetailsCellComponent,
          },
          actions,
        },
        pagination,
      },
    },
  },
};

export const userTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.USER]: {
      cells: ['name', 'active', 'uid', 'roles', 'unit'],
      options: {
        cells: {
          name: {
            dataComponent: ActiveLinkCellComponent,
          },
          active: {
            dataComponent: StatusCellComponent,
          },
          uid: {
            dataComponent: CellComponent,
          },
          roles: {
            dataComponent: RolesCellComponent,
          },
          unit: {
            dataComponent: UnitCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_APPROVERS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          actions,
        },
      },
    },
    [OrganizationTableType.USER_ASSIGNED_APPROVERS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserDetailsCellComponent,
          },
          actions,
        },
        pagination,
      },
    },
    [OrganizationTableType.USER_USER_GROUPS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserGroupDetailsCellComponent,
          },
          actions,
        },
      },
    },
    [OrganizationTableType.USER_ASSIGNED_USER_GROUPS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          name: {
            dataComponent: UserGroupDetailsCellComponent,
          },
          actions,
        },
        pagination,
      },
    },
    [OrganizationTableType.USER_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells: {
          code: {
            dataComponent: PermissionDetailsCellComponent,
          },
          actions,
        },
      },
    },
    [OrganizationTableType.USER_ASSIGNED_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells: {
          code: {
            dataComponent: PermissionDetailsCellComponent,
          },
          actions,
        },
        pagination,
      },
    },
  },
};
