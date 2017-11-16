import * as ActionTypes from './action-types';
import _ from 'lodash';
import * as SearchActionTypes from '../SearchContainer/action-types';
import * as FilterActionTypes from '../FilterContainer/action-types';

export default (state = {}, action) => {
    var obj = {}, tableListObj = state[action.id], newTableListObj, { id } = action;
  switch (action.type) {
    case ActionTypes.INITIALIZE_TABLE:
        obj[action.id] = {
                    columns : action.columns,
                    data: action.data,
                    id: action.id,
                    refresh: false,
                    dataFetched: false,
                    context: action.context,
                    currentPage: action.pageno,
                    pagination: action.pagination,
                    pagesize: action.pagesize,
                    paginationType: action.paginationType,
					searchId: action.searchId
                };
        return Object.assign(state, obj);
        
    case ActionTypes.FETCH_TABULAR_DATA:
        newTableListObj = Object.assign(tableListObj, { data: action.payload, refresh: false, dataFetched: true });
        obj[action.id] = newTableListObj;
        return Object.assign({}, state, obj);

    case ActionTypes.FETCH_PAGINATED_DATA:
        newTableListObj = Object.assign(tableListObj, { currentPage: action.pageno, context: action.context, dataFetched: true });//{...tableListObj, ...{pageno: action.pageno, context: action.context, dataFetched: true}}
        obj[action.id] = newTableListObj;
        return Object.assign({}, state, obj);

    case ActionTypes.REMOVE_TABLE:
        if (state[id]) {
          return _.omit(state, [id]);
          
        }
        return state;
    
    case SearchActionTypes.SEARCH_RESULT:
    case  SearchActionTypes.RESET_SEARCH_RESULT: 
    case FilterActionTypes.FILTER_RESULT:     
        tableListObj = state[action.compId];
        if (tableListObj && action.compType === "rdxTable" && action.result) {
            newTableListObj = Object.assign(tableListObj, {data: action.result, refresh: false, dataFetched: true, selectedIndexes: []});
            obj[action.id] = newTableListObj;
            return Object.assign({}, state, obj);      
        }
        
        return state;

     default:
        return state;
    } 
};
