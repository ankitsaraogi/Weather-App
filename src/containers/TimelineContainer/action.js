import * as ActionTypes from './action-types';
import * as api from '../../core/http-client/api';

export function fetchTimelineData({ url, context, id, contextCallback })  {

    if (contextCallback) {
        context = Object.assign(context, contextCallback(url, context));
    }
    const request = api.get(url, context);

    return {
        type: ActionTypes.FETCH_TIMELINE_DATA,
        payload: request,
        id : id,
        context,
        contextCallback,
        dataFetched: true
    }
}

export function initializeTimeline({ properties, context }, id) {
    return {
        type: ActionTypes.INITIALIZE_TIMELINE,
        properties,
        context,
        id: id,
        data: [],
        refresh: false
    };
};

export function removeTimeline({ id }) {
    return {
      type: ActionTypes.REMOVE_TIMELINE,
      id: id,
    };
  }
  
