import _ from 'lodash';
import * as ActionTypes from './action-types';
import * as TableActionTypes from '../TableContainer/action-types';
import * as CheckboxActionTypes from '../CheckboxContainer/action-types';
import * as RangeActionTypes from '../Rangeslider/action-types';

export default (state = {}, action) => {
  var obj = {}, filterObj = state[action.filterId], newFilterObj, { id } = action;
  switch (action.type) {
    case ActionTypes.INITIALIZE_FILTER:
      
      let { compId, compType, result, filter, dependentMap } = action;
      obj[id] = {
        compId, compType, result, filter, dependentMap
      };
      return Object.assign(state, obj);
      
    case TableActionTypes.FETCH_TABULAR_DATA:
        if (filterObj && filterObj["compId"] === action.id) {
          newFilterObj = Object.assign(filterObj, { source: action.payload });
          obj[action.filterId] = newFilterObj;
          return Object.assign({}, state, obj);
        }

        return state;

    case ActionTypes.REMOVE_FILTER:
        if (state[id]) {
          return _.omit(state, [id]);
          
        }
        return state;

    case CheckboxActionTypes.CHECKBOX_SELECTED:
        dependentMap = filterObj.dependentMap;
        
        if (filterObj) {
          let newFilter = Object.assign({}, filterObj.filter);

          let value = action.value;
          newFilter.selected[action.id] = { value : value };

          newFilterObj = Object.assign(filterObj, { filter: newFilter });
          obj[action.filterId] = newFilterObj;
          return Object.assign({}, state, obj);
        }

        return state;

    case CheckboxActionTypes.CHECKBOX_UNSELECTED:
        dependentMap = filterObj.dependentMap;
        
        if (filterObj) {
          let newFilter = Object.assign({}, filterObj.filter);
          delete newFilter.selected[action.id];
          
          newFilterObj = Object.assign(filterObj, { filter: newFilter });
          obj[action.filterId] = newFilterObj;
          return Object.assign({}, state, obj);
        }

        return state;

    case RangeActionTypes.SET_RANGESLIDER:
        dependentMap = filterObj.dependentMap;
        
        if (filterObj) {
          let newFilter = Object.assign({}, filterObj.filter);

          let value = [action.min, action.max];
          newFilter.range[action.id] = { value : value };

          newFilterObj = Object.assign(filterObj, { filter: newFilter });
          obj[action.filterId] = newFilterObj;
          return Object.assign({}, state, obj);
        }

        return state;

    case RangeActionTypes.RESET_RANGESLIDER:
        dependentMap = filterObj.dependentMap;
        
        if (filterObj) {
          let newFilter = Object.assign({}, filterObj.filter);
          delete newFilter.range[action.id];
          
          newFilterObj = Object.assign(filterObj, { filter: newFilter });
          obj = {};
          obj[action.filterId] = newFilterObj;
          return Object.assign({}, state, obj);
        }

        return state;

    default:
      return state;
  } 
};
