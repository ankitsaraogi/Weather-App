import * as ActionTypes from './action-types';
import * as api from '../../core/http-client/api';

export function fetchTabularData({ url, context, id, contextCallback, searchId, filterId }) {
  if (contextCallback) {
    context = Object.assign(context, contextCallback(url, context));
  }
  const request = api.get(url, context);

  return {
    type: ActionTypes.FETCH_TABULAR_DATA,
    payload: request,
    id : id,
    context,
    contextCallback,
    dataFetched: true,
    searchId : searchId ? searchId : undefined,
    filterId : filterId ? filterId : undefined,
  };
}

export function dispatchTabularData({ url, context, id, contextCallback, searchId, filterId, data }) {
  return {
    type: ActionTypes.FETCH_TABULAR_DATA,
    payload: data,
    context,
    contextCallback,
    id : id,
    dataFetched: true,
    searchId : searchId ? searchId : undefined,
    filterId : filterId ? filterId : undefined,
  };
}

export function fetchPaginatedTabularData(context, pageno, id) {
  return {
    type: ActionTypes.FETCH_PAGINATED_DATA,
    id: id,
    dataFetched : true,
    context: context,
    pageno: pageno
  };
}

export function initializeTable({ columns, data, context, pageno, pagination, paginationType, pagesize, searchId }, id) {
  return {
    type: ActionTypes.INITIALIZE_TABLE,
    columns: columns,
    id: id,
    data: data ? data : [],
    context: context,
    dataFetched : false,
    pageno: pageno,
    pagination: pagination,
    paginationType: paginationType,
    pagesize: pagesize,
    search: searchId
  };
};

export function removeTable({ id }) {
  return {
    type: ActionTypes.REMOVE_TABLE,
    id: id,
  }
}
