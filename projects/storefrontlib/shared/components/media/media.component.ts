/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnChanges,
  Output,
  Renderer2,
  TrackByFunction,
} from '@angular/core';
import { Config, Image, ImageGroup, WindowRef } from '@spartacus/core';
import { ImageLoadingStrategy, Media, MediaContainer } from './media.model';
import { MediaService } from './media.service';
import { USE_LEGACY_MEDIA_COMPONENT } from './media.token';

@Component({
  selector: 'cx-media',
  templateUrl: './media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaComponent implements OnChanges {
  /**
   * The media container can hold multiple media items, so that
   * a specific media (by format) can be used or multiple media
   * can be provided in a `srcset` so the browser will figure out
   * the best media for the device.
   */
  @Input() container:
    | MediaContainer
    | Image
    | ImageGroup
    | ImageGroup[]
    | undefined;

  /**
   * if a media format is given, a media for the given format will be rendered
   */
  @Input() format: string;

  /**
   * A specific alt text for an image, which overrules the alt text
   * from the container data.
   */
  @Input() alt: string;

  /**
   * set role of the image if different than what is intended (eg, role="presentation")
   */
  @Input() role: string;

  /**
   * Set the loading strategy of the media. Defaults to global loading strategy.
   * Use 'lazy' or 'eager' strategies.
   */
  @Input() loading: ImageLoadingStrategy | null = this.loadingStrategy;

  get SPIKE_loading(): ImageLoadingStrategy | null {
    if (this.isLCP) {
      return ImageLoadingStrategy.EAGER;
    }
    return this.loading;
  }

  /**
   * Once the media is loaded, we emit an event.
   */
  @Output() loaded: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  /**
   * The media contains the info for the UI to create the image. This media
   * object might contain more info once other media types (i.e. video) is supported.
   */
  media: Media | undefined;

  @Input() isLCP = false;

  /**
   * The `cx-media` component has an `is-initialized` class as long as the
   * media is being initialized.
   */
  @HostBinding('class.is-initialized') isInitialized = false;

  /**
   * The `cx-media` component has a `is-loading` class as long as the
   * media is loaded. Wehn the media is loaded, the `is-initialized` class
   * is added.
   */
  @HostBinding('class.is-loading') isLoading = true;

  /**
   * When there's no media provided for the content, or in case an error
   * happened during loading, we add the `is-missing` class. Visual effects
   * can be controlled by CSS.
   */
  @HostBinding('class.is-missing') isMissing = false;

  protected trackByMedia: TrackByFunction<HTMLSourceElement> = (_, item) =>
    item.media;

  protected isLegacy =
    inject(USE_LEGACY_MEDIA_COMPONENT, { optional: true }) ||
    (inject(Config) as any)['useLegacyMediaComponent'] ||
    false;

  protected renderer = inject(Renderer2);
  protected document = inject(DOCUMENT);
  protected windowRef = inject(WindowRef);
  constructor(protected mediaService: MediaService) {}

  ngOnChanges(): void {
    this.create();
  }

  /**
   * Creates the `Media` object
   */
  protected create(): void {
    this.media = this.mediaService.getMedia(
      this.container instanceof Array ? this.container[0] : this.container,
      this.format,
      this.alt,
      this.role
    );
    if (!this.media?.src) {
      this.handleMissing();
    }

    if (this.isLCP && !this.isLegacy) {
      this.createPreloadLinks();
    }
  }

  protected createPreloadLinks(): void {
    if (this.windowRef.isBrowser()) {
      return;
    }

    if (!this.media?.srcset) {
      return;
    }

    const sources = this.mediaService.getSources(this.media.srcset);

    sources
      .reverse() // SPIKE - ORDER IS IMPORTANT. IF WE insertBefore, then we have to reverse the list first
      .forEach((source, index) => {
        const preloadLink = this.renderer.createElement('link');
        this.renderer.setAttribute(preloadLink, 'rel', 'preload');
        this.renderer.setAttribute(preloadLink, 'as', 'image');
        this.renderer.setAttribute(preloadLink, 'href', source.srcset);

        // Calculate the media attribute
        let mediaQuery = '';

        // SPIKE OLD - buggy, because first source is also min-width. HOWEVER WE MIGHT WANT TO FIX IT
        // if (index === 0) {
        //   mediaQuery = `(max-width: ${source.width}px)`;
        // } else if (index === sources.length - 1) {

        // SPIKE NEW - but still buggy, because first source is also min-width
        if (index < sources.length - 1) {
          mediaQuery = `(min-width: ${source.width}px) and (max-width: ${sources[index + 1].width}px)`;
        } else {
          mediaQuery = `(min-width: ${source.width}px)`;
        }
        this.renderer.setAttribute(preloadLink, 'media', mediaQuery);

        this.document.head.insertBefore(
          preloadLink,
          this.document.head.firstChild
        );

        console.log('<cx-media> SPIKE NEW: added preloadLink', preloadLink);
      });
  }

  /**
   * This handler is called from the UI when the image is loaded.
   */
  loadHandler(): void {
    this.isLoading = false;
    this.isInitialized = true;
    this.isMissing = false;
    this.loaded.emit(true);
  }

  /**
   * Indicates whether the browser should lazy load the image.
   */
  get loadingStrategy(): ImageLoadingStrategy | null {
    return this.mediaService.loadingStrategy === ImageLoadingStrategy.LAZY
      ? ImageLoadingStrategy.LAZY
      : null;
  }

  /**
   * Whenever an error happens during load, we mark the component
   * with css classes to have a missing media.
   */
  errorHandler(): void {
    this.handleMissing();
  }

  protected handleMissing() {
    this.isLoading = false;
    this.isInitialized = true;
    this.isMissing = true;
    this.loaded.emit(false);
  }
}
