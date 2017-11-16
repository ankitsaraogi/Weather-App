import * as ActionTypes from './action-types';

export function initializeFilter(properties) {
    let { compId, compType, result, filter, id, dependentMap } = properties;
    return {
        type: ActionTypes.INITIALIZE_FILTER,
        compId, compType, result, filter, id, dependentMap
    }
}

export function sendFilterResult(properties, results) {
    let { compId, compType } = properties;
    return {
      type: ActionTypes.FILTER_RESULT,
      compId,
      compType,
      result: results
    }; 
};

export function removeFilter({ id }) {
    return {
        type: ActionTypes.REMOVE_FILTER,
        id
    };
}