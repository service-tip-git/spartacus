/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { useFeatureStyles } from '@spartacus/core';
import { GoogleMapRendererService } from '@spartacus/storefinder/core';

@Component({
  selector: 'cx-store-finder-map',
  templateUrl: './store-finder-map.component.html',
  standalone: false,
})
export class StoreFinderMapComponent implements OnChanges {
  @ViewChild('mapElement', { static: true })
  mapElement: ElementRef;
  @Input()
  locations: any[];
  @Output()
  selectedStoreItem: EventEmitter<number> = new EventEmitter();

  constructor(private googleMapRendererService: GoogleMapRendererService) {
    useFeatureStyles('a11yStoreFinderOverflow');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.locations && this.locations) {
      this.renderMap();
    }
  }

  /**
   * Sets the center of the map to the given location
   * @param latitude latitude of the new center
   * @param longitude longitude of the new center
   */
  centerMap(latitude: number, longitude: number): void {
    this.googleMapRendererService.centerMap(latitude, longitude);
  }

  renderMap(): void {
    this.googleMapRendererService.renderMap(
      this.mapElement.nativeElement,
      this.locations,
      (markerIndex) => {
        this.selectStoreItemClickHandle(markerIndex);
      }
    );
  }

  private selectStoreItemClickHandle(markerIndex: number) {
    this.selectedStoreItem.emit(markerIndex);
  }
}
