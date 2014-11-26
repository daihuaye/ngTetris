/**
* directive.diBootstrapSlider Module
*
* Description
*/
angular.module('directive.diBootstrapSlider', [
    'service.GameManager',
    'service.GAMESPEED'
])
.controller('BootstrapSliderCtrl', [
    '$scope',
    'GameManager',
    'GAMESPEED',
function (
    $scope,
    GameManager,
    GAMESPEED
){
    var vm = this;
    vm.whichRole = whichRole;
    vm.updateGameSpeed = updateGameSpeed;

    function whichRole(role) {
        var speed = GameManager.getGameSpeed();
        return GAMESPEED[role] === speed;
    }

    function updateGameSpeed(option) {
        var speed = GAMESPEED[option];
        GameManager.updateGameSpeed(speed);
    }
}])
.directive('diBootstrapSlider', [
function(
){
    var BootstrapSlider = {
        controller: 'BootstrapSliderCtrl',
        controllerAs: 'vm',
        templateUrl: 'directives/diBootstrapSlider/diBootstrapSlider.tpl.html',
        restrict: 'A',
        scope: true,
        replace: true,
        link: link
    };

    return BootstrapSlider;

    //////////////////

    function link(scope, element, attrs, controller) {
        element.on('click', function (event) {
            var option = $(event.target).find('input').data('role');
            controller.updateGameSpeed(option);
            scope.$emit('BootstrapSlider.Speed');
        });
    }
}]);