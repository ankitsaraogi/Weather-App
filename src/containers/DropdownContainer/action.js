import * as ActionTypes from './action-types';

export function refreshAllViews(data, id) {
  return {
    type: ActionTypes.REFRESH_ON_CHANGE,
    id : id,
    data: data
  };
}
