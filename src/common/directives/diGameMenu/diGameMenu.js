/**
* directive.diGameMenu Module
*
* Description
*/
angular.module('directive.diGameMenu', [
    'service.GameManager'
])
.controller('GameMenuCtrl', [
    '$scope',
    'GameManager',
function (
    $scope,
    GameManager
){
    $scope.startNewGame = function startNewGame() {
        $scope.$emit('menu.gameStart');
    };

    $scope.pauseGame = function pauseGame() {
        GameManager.setPause();
    };

    $scope.continueGame = function continueGame() {
        GameManager.setPause();
        return this;
    };

    $scope.isPause = function isPause() {
        return GameManager.isPause();
    };

    $scope.isGameStart = function isGameStart() {
        return GameManager.isGameStart();
    };
}])
.directive('diGameMenu', [
function(
){
    var GameMenu = {};

    GameMenu.controller = 'GameMenuCtrl';
    
    GameMenu.templateUrl = 'directives/diGameMenu/diGameMenu.tpl.html';

    GameMenu.restrict = 'A';

    GameMenu.scope = true;

    GameMenu.link = function link(scope, element, attrs) {
    };

    return GameMenu;
}]);