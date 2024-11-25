/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ImageGroup, isNotNullable } from '@spartacus/core';
import { ThumbnailsGroup } from '@spartacus/product/image-zoom/root';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NgIf, AsyncPipe } from '@angular/common';
import { CarouselComponent } from '../../../../../../projects/storefrontlib/shared/components/carousel/carousel.component';
import { FeatureDirective } from '../../../../../../projects/core/src/features-config/directives/feature.directive';
import { MediaComponent } from '../../../../../../projects/storefrontlib/shared/components/media/media.component';
import { FocusableCarouselItemDirective } from '../../../../../../projects/storefrontlib/shared/components/carousel/focusable-carousel-item/focusable-carousel-item.directive';

@Component({
    selector: 'cx-product-image-zoom-thumbnails',
    templateUrl: './product-image-zoom-thumbnails.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        CarouselComponent,
        FeatureDirective,
        MediaComponent,
        FocusableCarouselItemDirective,
        AsyncPipe,
    ],
})
export class ProductImageZoomThumbnailsComponent implements OnInit, OnDestroy {
  private mainMediaContainer = new BehaviorSubject<ImageGroup>({});

  @Output() productImage = new EventEmitter<{ image: any; index: number }>();

  @Input() thumbs$: Observable<ThumbnailsGroup[]>;

  @Input() activeThumb: EventEmitter<ImageGroup>;

  protected subscription = new Subscription();

  selectedIndex: number;

  constructor() {
    // Intentional empty constructor
  }

  ngOnInit() {
    this.subscription.add(
      this.activeThumb.subscribe((image) => {
        this.mainMediaContainer.next(image);
      })
    );
  }

  openImage(image: ImageGroup): void {
    this.mainMediaContainer.next(image);
    if (typeof image.zoom?.galleryIndex === 'number') {
      this.productImage.emit({ image, index: image.zoom.galleryIndex });
    }
  }

  isActive(thumbnail: ImageGroup): Observable<boolean> {
    return this.mainMediaContainer.asObservable().pipe(
      filter(isNotNullable),
      map((container: ImageGroup) => {
        return (container.zoom?.url &&
          thumbnail.zoom?.url &&
          container.zoom.url === thumbnail.zoom.url) as boolean;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
