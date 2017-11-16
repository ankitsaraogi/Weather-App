import INIT from '../../rdx-init';

let Middleware = [];
let rootMiddleware = function({ dispatch }) {
  return next => action => {
    // If action does not have payload
    // or, the payload does not have a .then property
    // we dont care about it, send it on
    if (!action.payload || !action.payload.then) {
      return next(action);
    }

    // Make sure the action's promise resolves
    action.payload
      .then(function(response) {
        // create a new action with the old type, but
        // replace the promise with the reponse data
        //const newAction = 
        response = (Object.prototype.toString.call( response ) === '[object Array]') ? response : response.data;
        dispatch(Object.assign({}, action, { payload: response }));
      });
  };
};

let appMiddleware = function({ dispatch }) {
  return next => action => {
    let appMiddleware = INIT.APP_MIDDLEWARE;
    if (appMiddleware) {
      action = appMiddleware(action);
    }
    
    next(action);
  };
};

Middleware = [...Middleware, rootMiddleware, appMiddleware];

export default Middleware;

