import * as ActionTypes from './action-types';

export function checkboxSelected(properties) {
  let { id, value, selected, filterId } = properties;
  return {
      type: ActionTypes.CHECKBOX_SELECTED,
      id,
      value: value ? value : selected,
      filterId
  };
};

export function checkboxUnselected(properties) {
  let { id, value, selected, filterId } = properties;
  return {
    type: ActionTypes.CHECKBOX_UNSELECTED,
    id,
    value: value ? value : selected,
    filterId
  };
};
