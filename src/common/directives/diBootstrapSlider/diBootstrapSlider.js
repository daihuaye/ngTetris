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
    $scope.whichRole = function whichRole(role) {
        var speed = GameManager.getGameSpeed();
        return GAMESPEED[role] === speed;
    };

    this.updateGameSpeed = function updateGameSpeed(option) {
        var speed = GAMESPEED[option];
        GameManager.updateGameSpeed(speed);
    };
}])
.directive('diBootstrapSlider', [
function(
){
    var BootstrapSlider = {};

    BootstrapSlider.controller = 'BootstrapSliderCtrl';
    
    BootstrapSlider.templateUrl = 'directives/diBootstrapSlider/diBootstrapSlider.tpl.html';

    BootstrapSlider.restrict = 'A';

    BootstrapSlider.scope = true;

    BootstrapSlider.replace = true;

    BootstrapSlider.link = function link(scope, element, attrs, controller) {
        element.on('click', function (event) {
            var option = $(event.target).find('input').data('role');
            controller.updateGameSpeed(option);
            scope.$emit('BootstrapSlider.Speed');
        });
    };

    return BootstrapSlider;
}]);