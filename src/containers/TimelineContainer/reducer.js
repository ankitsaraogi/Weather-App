
import * as ActionTypes from './action-types';
import _ from 'lodash';

export default (state = {}, action) => {
    var obj = {}, { id } = action;
    switch (action.type) {  
    case ActionTypes.INITIALIZE_TIMELINE:
        
        obj[action.id] = {
                    properties: action.properties,
                    data: action.data,
                    id: action.id,
                    refresh: action.refresh,
                    context: action.context
                };
        return Object.assign(state, obj);
        
    case ActionTypes.FETCH_TIMELINE_DATA:
        var timelineObj = state[action.id];
        var newTimelineObj = Object.assign(timelineObj, { data: action.payload, refresh: false, dataFetched: true });
        obj[action.id] = newTimelineObj;
        return Object.assign({}, state, obj);

    case ActionTypes.REMOVE_TIMELINE:
        if (state[id]) {
          return _.omit(state, [id]);
          
        }
        return state;
    

    default:
      return state;
    } 
};
