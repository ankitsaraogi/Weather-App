import * as Actions from './action';
import * as ActionTypes from './action-types';
import DROPDOWNNAME from './constants.js';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.REFRESH_ON_CHANGE:
        var obj = {};
        var prevdata = state[action.id] ? state[action.id].data : undefined;
        obj[action.id] = {data: action.data, id: action.id, prevdata: prevdata};
        return Object.assign(state, obj);
    default:
      return state;
    } 
};