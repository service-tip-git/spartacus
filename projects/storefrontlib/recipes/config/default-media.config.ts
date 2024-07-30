/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { MediaConfig } from '../../shared/components/media/media.config';

export const mediaConfig: MediaConfig = {
  mediaFormats: {
    mobile: { width: 400 },
    tablet: { width: 770 },
    desktop: { width: 1140 },
    widescreen: { width: 1400 },
    // product media
    cartIcon: { width: 65 },
    thumbnail: { width: 96 },
    product: { width: 284 },
    zoom: { width: 515 },
  },
  pictureElementFormats: {
    mobile: {
      maxWidth: '767px',
    },
    tablet: {
      minWidth: '768px',
      maxWidth: '1024px',
    },
    desktop: {
      minWidth: '1025px',
      maxWidth: '1439px',
    },
    widescreen: {
      minWidth: '1440px',
    },
    retina_mobile: {
      maxWidth: '786px',
      minDevicePixelRatio: 3,
    },
    retina_desktop: {
      minWidth: '1440px',
      minDevicePixelRatio: 2,
    },
  },
  pictureFormatsOrder: [
    'retina_desktop',
    'retina_mobile',
    'widescreen',
    'desktop',
    'tablet',
    'mobile',
  ],
  mediaQueryMap: {
    minWidth: 'min-width',
    maxWidth: 'max-width',
    minHeight: 'min-height',
    maxHeight: 'max-height',
    minDevicePixelRatio: '-webkit-min-device-pixel-ratio',
    maxDevicePixelRatio: '-webkit-max-device-pixel-ratio',
    orientation: 'orientation',
    minAspectRatio: 'min-aspect-ratio',
    maxAspectRatio: 'max-aspect-ratio',
    minResolution: 'min-resolution',
    maxResolution: 'max-resolution',
  },
};
