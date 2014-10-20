/**
* service.localStoragePolyfill Module
*
* Description
*/
angular.module('service.localStoragePolyfill', [])
.factory('localStoragePolyfill', [function () {
    var basilStorage = new window.Basil({
        namespace: 'ngtetris'
    });
    
    return {
        setItem: function setItem(name, value) {
            basilStorage.set(name, value);
        },
        getItem: function getItem(name) {
            return basilStorage.get(name);
        }
    };
}]);