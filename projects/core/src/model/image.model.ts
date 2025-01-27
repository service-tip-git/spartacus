/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Images {
  [imageType: string]: ImageGroup | ImageGroup[];
}

export interface Image {
  altText?: string;
  role?: string;
  format?: string;
  galleryIndex?: number;
  imageType?: ImageType;
  url?: string;
  /**
   * Represents width for an image in the MediaComponent.
   *
   * This property do not originate from the CMS but was added
   * to allow for the manual setting of the width of
   * images displayed by the MediaComponent.
   */
  width?: number;
  /**
   * Represents height for an image in the MediaComponent.
   *
   * This property do not originate from the CMS but was added
   * to allow for the manual setting of the height of
   * images displayed by the MediaComponent.
   */
  height?: number;
}

export enum ImageType {
  PRIMARY = 'PRIMARY',
  GALLERY = 'GALLERY',
}

export interface ImageGroup {
  [format: string]: Image;
}
