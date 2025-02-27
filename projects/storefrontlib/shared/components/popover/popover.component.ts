/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { WindowRef } from '@spartacus/core';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ICON_TYPE } from '../../../cms-components/misc/icon/icon.model';
import { FocusConfig } from '../../../layout/a11y/keyboard-focus/keyboard-focus.model';
import { PositioningService } from '../../services/positioning/positioning.service';
import { PopoverEvent, PopoverPosition } from './popover.model';

@Component({
  selector: 'cx-popover',
  templateUrl: './popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PopoverComponent implements OnInit, OnDestroy, AfterViewChecked {
  /**
   * String or template to be rendered inside popover wrapper component.
   */
  content: string | TemplateRef<any>;

  /**
   * Element which triggers displaying popover component.
   * This property is needed to calculate valid position for popover.
   */
  triggerElement: ElementRef;

  /**
   * Current initiated popover instance.
   */
  popoverInstance: ComponentRef<PopoverComponent>;

  /**
   * Flag which informs positioning service if popover component
   * should be appended to body. Otherwise popover is displayed right after
   * trigger element in DOM.
   */
  appendToBody?: boolean;

  /**
   * The preferred placement of the popover. Default popover position is 'top'.
   *
   * Allowed popover positions: 'auto', 'top', 'bottom', 'left', 'right',
   * 'top-left', 'top-right', 'bottom-left', 'bottom-right',
   * 'left-top', 'left-bottom', 'right-top', 'right-bottom'.
   */
  position?: PopoverPosition;

  /**
   * Flag used to define if popover should look for the best placement
   * in case if there is not enough space in viewport for preferred position.
   *
   * By default this property is set to `true`.
   *
   * Value of this flag is omitted if preferred position is set to `auto`.
   */
  autoPositioning?: boolean;

  /**
   * Custom class name passed to popover component.
   *
   * If this property is not set the default popover class is `cx-popover`.
   */
  customClass?: string;

  /**
   * Flag used to show/hide close button in popover component.
   */
  displayCloseButton?: boolean;

  /**
   * After popover component is initialized position needs to be changing dynamically
   * in case if any viewport changes happened.
   */
  resizeSub: Subscription;

  /**
   * After popover component is initialized popover should be closed in case
   * if current route has been changed.
   */
  routeChangeSub: Subscription;

  /**
   * Class name generated by positioning service indicating position of popover.
   */
  popoverClass: PopoverPosition;

  /**
   * Configuration for a11y improvements.
   */
  focusConfig: FocusConfig;

  /**
   * Flag indicates if popover should be re-positioned on scroll event.
   */
  positionOnScroll?: boolean;

  /**
   * Icon types for close button icon.
   */
  iconTypes = ICON_TYPE;

  /**
   * Subject which emits specific type of `PopoverEvent`.
   */
  eventSubject: Subject<PopoverEvent>;

  /**
   * Scroll event unlistener.
   */
  scrollEventUnlistener: () => void;

  /**
   * Binding class name property.
   */
  @HostBinding('className') baseClass: string;

  /**
   * Listens for click inside popover component wrapper.
   */
  @HostListener('click')
  insideClick() {
    this.eventSubject.next(PopoverEvent.INSIDE_CLICK);
  }

  /**
   * Listens for every document click and ignores clicks
   * inside component.
   */
  @HostListener('document:click', ['$event'])
  outsideClick(event: MouseEvent) {
    if (!this.isClickedOnPopover(event) && !this.isClickedOnDirective(event)) {
      this.eventSubject.next(PopoverEvent.OUTSIDE_CLICK);
    }
  }

  /**
   * Listens for `escape` keydown event.
   */
  @HostListener('keydown.escape')
  escapeKeydown() {
    this.eventSubject.next(PopoverEvent.ESCAPE_KEYDOWN);
  }

  protected isClickedOnPopover(event: MouseEvent) {
    return this.popoverInstance.location.nativeElement.contains(event.target);
  }

  protected isClickedOnDirective(event: MouseEvent) {
    return this.triggerElement.nativeElement.contains(event.target);
  }

  /**
   * Emits close event trigger.
   */
  close(event: MouseEvent | KeyboardEvent | Event) {
    event.preventDefault();
    if (event instanceof MouseEvent) {
      this.eventSubject.next(PopoverEvent.CLOSE_BUTTON_CLICK);
    } else {
      this.eventSubject.next(PopoverEvent.CLOSE_BUTTON_KEYDOWN);
    }
  }

  /**
   * Method uses `Renderer2` service to listen window scroll event.
   *
   * Registered only if property `positionOnScroll` is set to `true`.
   */
  triggerScrollEvent() {
    this.scrollEventUnlistener = this.renderer.listen(
      this.winRef.nativeWindow,
      'scroll',
      () => this.positionPopover()
    );
  }

  /**
   * Method uses positioning service calculation and based on that
   * updates class name for popover component instance.
   */
  positionPopover() {
    this.popoverClass = this.positioningService.positionElements(
      this.triggerElement.nativeElement,
      this.popoverInstance.location.nativeElement,
      this.positioningService.getPositioningClass(
        this.position,
        this.autoPositioning
      ),
      this.appendToBody
    );

    this.changeDetectionRef.markForCheck();
    this.baseClass = `${this.customClass} ${this.popoverClass} opened`;
  }

  ngOnInit(): void {
    if (!this.customClass) {
      this.customClass = 'cx-popover';
    }
    if (!this.position) {
      this.position = 'top';
    }
    if (this.autoPositioning === undefined) {
      this.autoPositioning = true;
    }

    this.baseClass = `${this.customClass}`;

    this.resizeSub = this.winRef.resize$.subscribe(() => {
      this.positionPopover();
    });

    this.routeChangeSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.eventSubject.next(PopoverEvent.ROUTE_CHANGE);
      });

    if (this.positionOnScroll) {
      this.triggerScrollEvent();
    }
  }

  /**
   * indicates if passed content is a TemplateRef or string.
   */
  isTemplate(content: string | TemplateRef<any>): content is TemplateRef<any> {
    return content instanceof TemplateRef;
  }

  isString(content: string | TemplateRef<any>): content is string {
    return !(content instanceof TemplateRef);
  }

  ngAfterViewChecked(): void {
    this.positionPopover();
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }

    if (this.routeChangeSub) {
      this.routeChangeSub.unsubscribe();
    }

    if (this.scrollEventUnlistener) {
      this.scrollEventUnlistener();
    }
  }

  constructor(
    protected positioningService: PositioningService,
    protected winRef: WindowRef,
    protected changeDetectionRef: ChangeDetectorRef,
    protected renderer: Renderer2,
    protected router: Router
  ) {}
}
