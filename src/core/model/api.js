import * as Utils from '../utils/commonUtils';
var axios = require('axios');
import rdxConst from '../../rdx-init';

var main_url = rdxConst.MAIN_URL;

export const get = function(url, query_parameter) {
    var complete_url = main_url + url;

    var complete_url = main_url + url;
    if (query_parameter) {  
        if (typeof(query_parameter) == "object") {
            complete_url = main_url + Utils.replaceParamsInUrl(url, query_parameter);
        }
        else {
            complete_url = complete_url + query_parameter;
        }
    }
    
    var encodedURI = window.encodeURI(complete_url);

    return axios.get(encodedURI);
};

export const all = function(url, query_parameter) {
    var axiosArr = [];
    for (var i = 0; i < url.length; i++) {
        axiosArr.push(get(url[i], query_parameter[i]));
    }

    return axios.all(axiosArr);
};

