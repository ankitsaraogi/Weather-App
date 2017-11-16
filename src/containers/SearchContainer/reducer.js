import * as ActionTypes from './action-types';
import * as TableActionTypes from '../TableContainer/action-types';

export default (state = {}, action ) => {
    var obj = {};
    let { source, id, result, compId, compType } = action;
    switch (action.type) {
        case ActionTypes.INITIALIZE_SEARCH:
            obj[action.id] = {
                source, id, result, compId, compType
            };
            return Object.assign(state, obj);

        case ActionTypes.RESET_SEARCH_RESULT:
            obj[action.id] = {
                id, result, compId
            };
            return Object.assign(state, obj);
            
        case TableActionTypes.FETCH_TABULAR_DATA:
            var searchObj = state[action.searchId];
            
            if (searchObj && searchObj["compId"] === action.id) {
            var newSearchObj = Object.assign(searchObj, { source: action.payload });
            obj[action.searchId] = newSearchObj;
            return Object.assign({}, state, obj);
            }

            return state;
            
        default:
        return state;
    } 
};
