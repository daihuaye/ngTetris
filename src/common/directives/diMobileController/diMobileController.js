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
    var vm = this;
    vm.move = move;
    vm.pause = pause;

    ///////////////////

    function move(direction) {
        GameManager.move(direction);
    }

    function pause() {
        if (GameManager.isGameStart()) {
            $scope.$emit('mobile.pause');
            GameManager.setPause();
        } else {
            GameManager.setOpenDesignBeforeStart(true);
            $scope.$emit('mobile.pause');
        }
    }
}])
.directive('diMobileController', [
function(
){
    var MobileController = {
        controller: 'MobileControllerCtrl',
        controllerAs: 'vm',
        templateUrl: 'directives/diMobileController/diMobileController.tpl.html',
        restrict: 'A',
        scope: true
    };
    
    return MobileController;
}]);