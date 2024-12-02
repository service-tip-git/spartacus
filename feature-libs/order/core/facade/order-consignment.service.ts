import { Injectable } from '@angular/core';
import { OrderEntryGroup } from '@spartacus/cart/base/root';
import {
  Consignment,
  Order,
  OrderConsignmentFacade,
} from '@spartacus/order/root';
import {
  CollapsibleNode,
  HierarchyComponentService,
  HierarchyNode,
} from '@spartacus/storefront';

@Injectable()
export class OrderConsignmentService implements OrderConsignmentFacade {
  constructor(protected hierarchyService: HierarchyComponentService) {}

  /**
   * Associates entry groups from the order with corresponding consignments.
   *
   * @param order The order containing the entry groups.
   * @param consignments The list of consignments to be enriched with entry groups.
   * @returns An updated list of consignments, each containing its related entry groups.
   */
  assignEntryGroupsToConsignments(
    order: Order,
    consignments: Consignment[]
  ): Consignment[] {
    return consignments.map((consignment) => {
      const filteredEntries = this.filterConsignmentEntries(
        consignment.entries,
        order
      );
      const entryNumbers = this.getEntryNumbersFromConsignment(consignment);

      const matchedEntryGroups = order.entryGroups
        ?.map((group) => this.findMatchingEntryGroups(group, entryNumbers))
        .filter(Boolean) as OrderEntryGroup[];

      const hierarchyTrees = this.generateHierarchyTrees(matchedEntryGroups);

      return {
        ...consignment,
        entryGroups: matchedEntryGroups,
        hierachyTrees: hierarchyTrees,
        entries: filteredEntries, // Add filtered entries here
      };
    });
  }

  /**
   * Filters the entries based on the given consignment and order.
   * @param entries The list of entries to filter.
   * @param order The order used for filtering.
   * @returns A filtered list of entries.
   */
  private filterConsignmentEntries(
    entries: any[] | undefined,
    order: Order
  ): any[] {
    if (!entries) return [];
    return entries.filter((entry) => {
      return order.entryGroups?.some((group) =>
        group.entries?.some(
          (orderEntry) => orderEntry.entryNumber === entry.orderEntry.entryNumber
        )
      );
    });
  }

  /**
   * Extracts entry numbers from a consignment.
   * @param consignment The consignment containing entries.
   * @returns A list of entry numbers from the consignment.
   */
  private getEntryNumbersFromConsignment(consignment: Consignment): number[] {
    return (
      consignment.entries
        ?.map((entry) => entry.orderEntry?.entryNumber)
        .filter((num): num is number => num !== undefined) ?? []
    );
  }

  /**
   * Recursively finds matching entry groups based on entry numbers.
   * @param group The current entry group to check.
   * @param entryNumbers A list of entry numbers to match.
   * @returns A new entry group object with matched children, or null if no match is found.
   */
  private findMatchingEntryGroups(
    group: OrderEntryGroup,
    entryNumbers: number[]
  ): OrderEntryGroup | null {
    // Check if the current group matches the entry numbers
    const matches = group.entries?.some((entry) =>
      entryNumbers.includes(entry.entryNumber || 0)
    );

    if (matches) {
      return {
        ...group,
        entryGroups: group.entryGroups
          ?.map((childGroup) =>
            this.findMatchingEntryGroups(childGroup, entryNumbers)
          )
          .filter(Boolean) as OrderEntryGroup[],
      };
    }

    // Check if any child groups match the entry numbers
    if (group.entryGroups?.length) {
      const matchedChildren = group.entryGroups
        .map((childGroup) =>
          this.findMatchingEntryGroups(childGroup, entryNumbers)
        )
        .filter(Boolean) as OrderEntryGroup[];

      if (matchedChildren.length) {
        return { ...group, entryGroups: matchedChildren };
      }
    }

    return null; // Return null if no match is found
  }
  /**
   * Generates hierarchy trees from the matched entry groups.
   *
   * @param entryGroups The list of matched entry groups.
   * @returns A list of hierarchy trees representing the entry groups.
   */
  private generateHierarchyTrees(
    entryGroups: OrderEntryGroup[]
  ): HierarchyNode[] {
    const bundles: HierarchyNode[] = [];

    entryGroups.forEach((entryGroup) => {
      if (entryGroup.type === 'CONFIGURABLEBUNDLE') {
        const root = new CollapsibleNode('ROOT', {
          children: [],
        });
        this.hierarchyService.buildHierarchyTree([entryGroup], root);
        bundles.push(root);
      }
    });

    return bundles;
  }
}
