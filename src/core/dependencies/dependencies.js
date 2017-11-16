import { Store } from '../store/store.js'

export const handleDependencies = function(dependencies)  {
    let dependenciesObj = getDependeciesObj();
    for (var i = 0; i < dependencies.length; i++) {
        let dependencyObj = dependencies[i];
        let action = dependencyObj["action"];

        switch (action) {
            case "REFRESH" : 
                handleRefresh(dependencyObj, dependenciesObj.refresh);
                break;

            default:
                return;
        }
    }

    return dependenciesObj;
};

const getDependeciesObj = function() {
    let dependenciesObj = {};
    dependenciesObj["refresh"] = [];
    dependenciesObj["hide"] = undefined;

    return dependenciesObj;
}

const handleRefresh = function(dependencyObj, returnArr) {
    let type = dependencyObj["type"];
    let key = dependencyObj["key"];
    let obj = undefined;

    let component = Store.getState()[type];
    let componentStoreData = component ? component[key] : undefined
    if (componentStoreData) {
        obj = {};
        obj[key] = componentStoreData["data"];
        returnArr.push(obj);
    }

    return returnArr;
};