/**
* directive.diMobileController Module
*
* Description
*/
angular.module('directive.diMobileController', [
    'ngTouch',
    'service.GameManager'
])
.controller('MobileControllerCtrl', [
    '$scope',
    'GameManager',
function (
    $scope,
    GameManager
){
    $scope.move = function move(direction) {
        GameManager.move(direction);
    };

    $scope.pause = function pause() {
        if (GameManager.isGameStart()) {
            $scope.$emit('mobile.pause');
            GameManager.setPause();
        } else {
            GameManager.setOpenDesignBeforeStart(true);
            $scope.$emit('mobile.pause');
        }
    };
}])
.directive('diMobileController', [
function(
){
    var MobileController = {};

    MobileController.controller = 'MobileControllerCtrl';
    
    MobileController.templateUrl = 'directives/diMobileController/diMobileController.tpl.html';

    MobileController.restrict = 'A';

    MobileController.scope = true;

    MobileController.link = function link(scope, element, attrs) {};

    return MobileController;
}]);