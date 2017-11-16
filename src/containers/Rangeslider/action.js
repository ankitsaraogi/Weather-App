import * as ActionTypes from './action-types';

export function setRangeSlider(properties) {
  let { id, value, filterId } = properties;
  return {
      type: ActionTypes.SET_RANGESLIDER,
      id,
      min: value.min,
      max: value.max,
      filterId
  };
}

export function resetRangeSlider(properties) {
  let { id, value, filterId } = properties;
  return {
    type: ActionTypes.RESET_RANGESLIDER,
    id,
    min: value.min,
    max: value.max,
    filterId
  };
}
