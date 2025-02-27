/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Action } from '@ngrx/store';
import { LoaderState } from './loader-state';
import { LoaderAction } from './loader.action';

export const initialLoaderState: LoaderState<any> = {
  loading: false,
  error: false,
  success: false,
  value: undefined,
};

/**
 * Higher order reducer that adds generic loading flag to chunk of the state
 *
 * Utilizes "loader" meta field of actions to set specific flags for specific
 * action (LOAD, SUCCESS, FAIL, RESET)
 */
export function loaderReducer<T, V extends Action = Action>(
  entityType: string,
  reducer?: (state: T | undefined, action: Action | V) => T | undefined
): (state: LoaderState<T> | undefined, action: LoaderAction) => LoaderState<T> {
  return (
    state: LoaderState<T> = initialLoaderState,
    action: LoaderAction
  ): LoaderState<T> => {
    if (
      action.meta &&
      action.meta.loader &&
      action.meta.entityType === entityType
    ) {
      const entity = action.meta.loader;

      if (entity.load) {
        return {
          ...state,
          loading: true,
          value: getReducerIfExists(state.value),
        };
      } else if (entity.error) {
        return {
          ...state,
          loading: false,
          error: true,
          success: false,
          value: getReducerIfExists(undefined),
        };
      } else if (entity.success) {
        return {
          ...state,
          value: getReducerIfExists(action.payload),
          loading: false,
          error: false,
          success: true,
        };
      } else {
        // reset state action
        return {
          ...initialLoaderState,
          value: reducer
            ? reducer(initialLoaderState.value, action)
            : initialLoaderState.value,
        };
      }
    }

    if (reducer) {
      const newValue = reducer(state.value, action);
      if (newValue !== state.value) {
        return { ...state, value: newValue };
      }
    }
    return state;

    function getReducerIfExists(fallbackValue: any) {
      return reducer ? reducer(state.value, action) : fallbackValue;
    }
  };
}
