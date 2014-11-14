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
    'Device',
function (
    $scope,
    GameManager,
    Device
){
    $scope.continueGame = function continueGame() {
        if (GameManager.getOpenDesignBeforeStart()) {
            GameManager.setOpenDesignBeforeStart(false);
        } else {
            GameManager.setPause();
        }
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
        var key = (GameManager.getIsOpenGameDesign() ||
                    GameManager.getOpenDesignBeforeStart()) ?  'design' : 'instructions';
        return key;
    };

    $scope.goBack = function goBack() {
        var notDesignPage = false;
        GameManager.setIsOpenGameDesign(notDesignPage);
    };

    $scope.designNewPiece = function designNewPiece() {
        var designPage = true;
        GameManager.setIsOpenGameDesign(designPage);
    };

    $scope.getSavedTime = function getSavedTime() {
        return GameManager.getGameSavedTime();
    };

    $scope.isShowSaveGameBtn = function isShowSaveGameBtn() {
        return !GameManager.getIsOpenGameDesign();
    };

    $scope.isShowBackBtn = function isShowBackBtn() {
        return !GameManager.getOpenDesignBeforeStart();
    };

    $scope.isMobileDevice = function() {
        return Device.device;
    };

    this.isPause = function isPause() {
        return GameManager.isPause();
    };

    this.isGameStart = function isGameStart() {
        return GameManager.isGameStart();
    };
}])
.directive('diGameMenu', [
    'GameManager',
function(
    GameManager
){
    var GameMenu = {};

    GameMenu.controller = 'GameMenuCtrl';
    
    GameMenu.templateUrl = 'directives/diGameMenu/diGameMenu.tpl.html';

    GameMenu.restrict = 'A';

    GameMenu.replace = true;

    GameMenu.scope = true;

    GameMenu.link = function link(scope, element, attrs, controller) {
        scope.$on('app.pause', function() {
            if ((!controller.isPause() && controller.isGameStart()) ||
                GameManager.getOpenDesignBeforeStart()) {
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