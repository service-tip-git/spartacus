/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICON_TYPE } from '../../../cms-components/misc/icon/icon.model';

export interface CardAction {
  event: string;
  name: string;
}

export interface CardLinkAction {
  link: string;
  name: string;
  ariaLabel?: string;
  target?: string;
}

export interface Card {
  header?: string;
  title?: string;
  textBold?: string;
  text?: Array<string>;
  paragraphs?: Array<{ title?: string; text?: Array<string> }>;
  img?: string;
  imgLabel?: string;
  actions?: Array<CardAction | CardLinkAction>;
  deleteMsg?: string;
  label?: string;
  role?: string;
  customClass?: string;
}

@Component({
  selector: 'cx-card',
  templateUrl: './card.component.html',
  standalone: false,
})
export class CardComponent implements OnInit {
  iconTypes = ICON_TYPE;

  @Output()
  deleteCard: EventEmitter<number> = new EventEmitter();
  @Output()
  setDefaultCard: EventEmitter<number> = new EventEmitter();
  @Output()
  sendCard: EventEmitter<number> = new EventEmitter();
  @Output()
  editCard: EventEmitter<number> = new EventEmitter();
  @Output()
  cancelCard: EventEmitter<number> = new EventEmitter();

  @Input()
  border = false;

  @Input()
  editMode = false;

  @Input()
  isDefault = false;

  @Input()
  content: Card | null;

  @Input()
  fitToContainer = false;

  @Input()
  truncateText = false;

  @Input()
  truncateParagraphText = false;

  @Input()
  charactersLimit = 100;

  @Input()
  index: number;

  @Input()
  role?: string;

  // ACTIONS

  setEditMode(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.cancelCard.emit(5);
  }

  delete(): void {
    this.deleteCard.emit(1);
  }

  setDefault(): void {
    this.isDefault = true;
    this.setDefaultCard.emit(2);
  }

  send(): void {
    this.sendCard.emit(3);
  }

  edit(): void {
    this.editCard.emit(4);
  }

  isCardAction(action: CardAction | CardLinkAction): action is CardAction {
    return (action as CardAction).event !== undefined;
  }

  isCardLinkAction(
    action: CardAction | CardLinkAction
  ): action is CardLinkAction {
    return (action as CardLinkAction).link !== undefined;
  }

  trackByIndex(index: number): number {
    return index;
  }

  constructor() {
    // Intentional empty constructor
  }

  /* eslint @angular-eslint/no-empty-lifecycle-method: 1 */
  ngOnInit() {
    // Intentional empty method
  }

  /**
   * ariaDescribedBy: Computes the value for the 'aria-describedby' attribute.
   * If `content` has a `title`, it returns a string including the title and container IDs, with index if available.
   * If no title, it returns only the container ID with the index if available.
   *
   * @returns {string} The 'aria-describedby' value.
   */
  protected get ariaDescribedBy() {
    if (this.content && this.content.title) {
      return `${this.getLabel('content-title')} ${this.getLabel('cx-card-container')}`;
    }

    return `${this.getLabel('cx-card-container')}`;
  }

  /**
   * getLabel: Computes a label string by concatenating the provided prefix with the index.
   * If the index is greater than or equal to 0, it appends the index to the prefix; otherwise, it just returns the prefix.
   *
   * @param {string} prefix - The string to prefix to the label.
   * @returns {string} The computed label, including the index if it's available.
   */
  protected getLabel(prefix: string): string {
    return prefix + (this.index >= 0 ? '-' + this.index : '');
  }
}
