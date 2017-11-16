import INIT from '../src/rdx-init';
import * as Utils from '../src/core/utils/commonUtils';

let TimelineMiddleware = function(action) {
    let { type, payload } = action;
    if (payload && payload.list) {
        switch (type) {
            case "FETCH_TIMELINE_DATA" :
                //payload = Utils.makeObjectFlat(payload.list);
                action = Object.assign({}, action, { 
                        payload: payload.list.map(function(l, index){
                        return Utils.makeObjectFlat(l);
                    }) 
                });
                break;
            default:
                action = Object.assign({}, action, { payload: payload.list });
        }
    }
    
    return action;
};

let appEntryMiddleware = function(action) {
    return TimelineMiddleware(action);
};

INIT.APP_MIDDLEWARE = appEntryMiddleware;

