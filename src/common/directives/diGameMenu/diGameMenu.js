/**
* directive.diGameMenu Module
*
* Description
*/
angular.module('directive.diGameMenu', [
    'service.GameManager',
    'directive.diBootstrapSlider',
    'directive.diDesignPiece'
])
.controller('GameMenuCtrl', [
    '$scope',
    'GameManager',
function (
    $scope,
    GameManager
){
    var isDesgin = false;
    $scope.continueGame = function continueGame() {
        GameManager.setPause();
        $scope.closeModal();
    };

    $scope.restartGame = function restartGame() {
        GameManager.newGame();
        $scope.closeModal();
        GameManager.setGameStart();
    };

    $scope.endGame = function endGame() {
        GameManager.gameOver();
        $scope.closeModal();
    };

    $scope.restoreGame = function restoreGame() {
        GameManager.restoreGame();
        GameManager.setPause();
        $scope.closeModal();
    };

    $scope.hasGameHistory = function hasGameHistory() {
        return GameManager.hasGameHistory();
    };

    $scope.getCurrentView = function getCurrentView() {
        var key = isDesgin ?  'design' : 'instructions';
        return key;
    };

    $scope.goBack = function goBack() {
        isDesgin = false;
    };

    $scope.designNewPiece = function designNewPiece() {
        isDesgin = true;
    };

    $scope.getSavedTime = function getSavedTime() {
        return GameManager.getGameSavedTime();
    };

    this.isPause = function isPause() {
        return GameManager.isPause();
    };

    this.isGameStart = function isGameStart() {
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

    GameMenu.replace = true;

    GameMenu.scope = true;

    GameMenu.link = function link(scope, element, attrs, controller) {
        scope.$on('app.pause', function() {
            if (!controller.isPause() && controller.isGameStart()) {
                $(element).modal({
                    backdrop: 'static'
                });
            } else {
                scope.closeModal();                
            }
        });

        scope.closeModal = function closeModal() {
            $(element).modal('hide');
        };

    };

    return GameMenu;
}]);