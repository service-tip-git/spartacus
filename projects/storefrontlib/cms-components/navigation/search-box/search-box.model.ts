/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SearchBoxConfig {
  displaySuggestions?: boolean | string;
  displayProducts?: boolean | string;
  displayProductImages?: boolean | string;
  maxProducts?: number;
  maxSuggestions?: number;
  minCharactersBeforeRequest?: number;
  recentSearches?: boolean | string;
  maxRecentSearches?: number;
  trendingSearches?: boolean | string;
  maxTrendingSearches?: number;
}

export interface SearchResults {
  message?: string;
  products?: any[];
  suggestions?: string[];
  recentSearches?: string[];
}
