import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getLastValueSync } from '@spartacus/core';
import {
  LoadStatus,
  OrganizationItemStatus,
} from '@spartacus/organization/administration/core';
import {
  OutletContextData,
  TableDataOutletContext,
} from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { filter, first, switchMap, take } from 'rxjs/operators';
import { ItemService } from '../item.service';
import { ListService } from '../list/list.service';
import { MessageService } from '../message/services/message.service';
import { CellComponent } from '../table/cell.component';
import { SubListService } from './sub-list.service';

@Component({
  selector: 'cx-org-assign-cell',
  template: `
    <button type="button" *ngIf="hasItem" (click)="toggleAssign()" class="link">
      {{ isAssigned ? 'unassign' : 'assign' }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignCellComponent<T> extends CellComponent {
  constructor(
    protected outlet: OutletContextData<TableDataOutletContext>,
    protected organizationItemService: ItemService<T>,
    protected messageService: MessageService,
    protected organizationSubListService: ListService<T>
  ) {
    super(outlet);
  }

  get isAssigned(): boolean {
    return (this.item as any)?.selected;
  }

  toggleAssign() {
    const isAssigned = this.isAssigned;
    this.organizationItemService.key$
      .pipe(
        first(),
        switchMap((key) =>
          isAssigned
            ? this.unassign?.(key, this.link)
            : this.assign(key, this.link)
        ),
        take(1),
        filter(
          (data: OrganizationItemStatus<T>) =>
            data.status === LoadStatus.SUCCESS
        )
      )
      .subscribe((data) =>
        this.notify(data.item, isAssigned ? 'unassigned' : 'assigned')
      );
  }

  protected assign(
    key: string,
    linkKey: string
  ): Observable<OrganizationItemStatus<T>> {
    return (
      (this.organizationSubListService as SubListService<T>).assign?.(
        key,
        linkKey
      ) ?? of()
    );
  }

  protected unassign(
    key: string,
    linkKey: string
  ): Observable<OrganizationItemStatus<T>> {
    return (
      (this.organizationSubListService as SubListService<T>).unassign?.(
        key,
        linkKey
      ) ?? of()
    );
  }

  /**
   * Returns the key for the linked object.
   *
   * At the moment, we're using a generic approach to assign objects,
   * but the object do not have a normalized shape. Therefor, we need
   * to evaluate the context to return the right key for the associated
   * item.
   */
  protected get link(): string {
    const context = getLastValueSync(this.outlet.context$);
    return context?.code ?? context?.customerId ?? context?.uid;
  }

  protected notify(item: any, state: string) {
    this.messageService.add({
      message: {
        key: `${this.organizationSubListService.viewType}.${state}`,
        params: {
          item,
        },
      },
    });
  }
}
