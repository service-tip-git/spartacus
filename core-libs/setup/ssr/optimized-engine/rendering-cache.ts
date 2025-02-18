/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RenderingEntry } from './rendering-cache.model';
import { SsrOptimizationOptions } from './ssr-optimization-options';

export class RenderingCache {
  protected renders = new Map<string, RenderingEntry>();
  protected usedCacheSize = 0;

  constructor(private options?: SsrOptimizationOptions) {}

  setAsRendering(key: string) {
    this.renders.set(key, { rendering: true });
  }

  isRendering(key: string): boolean {
    return !!this.renders.get(key)?.rendering;
  }

  store(key: string, err?: Error | null, html?: string) {
    const entry: RenderingEntry = { err, html };
    let htmlSize = 0;

    if (this.options?.ttl) {
      entry.time = Date.now();
    }
    if (this.options?.cacheSize) {
      if (html) {
        htmlSize = Buffer.byteLength(html, 'utf8');
      }

      this.renders.delete(key);
      // if (this.options.cacheSizeKb > this.usedCacheSize) {
      if (this.renders.size >= this.options.cacheSize) {
        const oldestKey = this.renders.keys().next().value;
        if (oldestKey !== undefined) {
          const oldestHtmlSize = Buffer.byteLength(
            this.renders.get(oldestKey)?.html || '',
            'utf8'
          );
          this.renders.delete(oldestKey);
          this.usedCacheSize -= oldestHtmlSize;
        }
      }
    }

    if (
      this.options?.shouldCacheRenderingResult?.({
        options: this.options,
        entry,
      })
    ) {
      this.renders.set(key, entry);
      this.usedCacheSize += htmlSize;
    }
  }

  get(key: string): RenderingEntry | undefined {
    return this.renders.get(key);
  }

  clear(key: string) {
    this.renders.delete(key);
  }

  isReady(key: string): boolean {
    const entry = this.renders.get(key);
    const isRenderPresent = entry?.html || entry?.err;
    return isRenderPresent && this.isFresh(key);
  }

  isFresh(key: string): boolean {
    if (!this.options?.ttl) {
      return true;
    }

    return Date.now() - (this.renders.get(key)?.time ?? 0) < this.options?.ttl;
  }
}
