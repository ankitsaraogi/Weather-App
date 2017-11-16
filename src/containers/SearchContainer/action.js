import * as ActionTypes from './action-types';

export function sendSearchResult(properties, results) {
  let { compId, compType, filterId } = properties;
  return {
    type: ActionTypes.SEARCH_RESULT,
    compId,
    compType,
    result: results
  };
}

export function resetSearchResults(properties) {
  let { compId, compType, source, id } = properties;
  return {
    type: ActionTypes.RESET_SEARCH_RESULT,
    id,
    compId,
    compType,
    result: source
  };
}

export function initializeSearch({ id, source, result, compId, compType }) {
  return {
    type: ActionTypes.INITIALIZE_SEARCH,
    id, source, result, compId, compType
  };
}
