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
    var vm = this,
    options = {
        // Game Cycle
        continueGame: continueGame,
        restartGame: restartGame,
        restoreGame: restoreGame,
        endGame: endGame,
        isPause: isPause,
        isGameStart: isGameStart,
        saveGame: saveGame,

        // Game History
        hasGameHistory: hasGameHistory,

        // Current View & Save Time
        getCurrentView: getCurrentView,
        getSavedTime: getSavedTime,
        goBack: goBack,

        // Design New Piece
        designNewPiece: designNewPiece,

        // Condition
        isShowSaveGameBtn: isShowSaveGameBtn,
        isShowBackBtn: isShowBackBtn,
        isMobileDevice: isMobileDevice
    };

    angular.extend(vm, options);

    //////////////

    function continueGame() {
        if (GameManager.getOpenDesignBeforeStart()) {
            GameManager.setOpenDesignBeforeStart(false);
        } else {
            GameManager.setPause();
        }
        $scope.closeModal();
    }

    function restartGame() {
        GameManager.newGame();
        $scope.closeModal();
        GameManager.setGameStart();
    }

    function endGame() {
        GameManager.gameOver();
        $scope.closeModal();
    }

    function restoreGame() {
        GameManager.restoreGame();
        GameManager.setPause();
        $scope.closeModal();
    }

    function hasGameHistory() {
        return GameManager.hasGameHistory();
    }

    function getCurrentView() {
        var key = (GameManager.getIsOpenGameDesign() ||
                    GameManager.getOpenDesignBeforeStart()) ?  'design' : 'instructions';
        return key;
    }

    function goBack() {
        var notDesignPage = false;
        GameManager.setIsOpenGameDesign(notDesignPage);
    }

    function designNewPiece() {
        var designPage = true;
        GameManager.setIsOpenGameDesign(designPage);
    }

    function getSavedTime() {
        return GameManager.getGameSavedTime();
    }

    function isShowSaveGameBtn() {
        return !GameManager.getIsOpenGameDesign();
    }

    function isShowBackBtn() {
        return !GameManager.getOpenDesignBeforeStart();
    }

    function isMobileDevice() {
        return Device.device;
    }

    function isPause() {
        return GameManager.isPause();
    }

    function isGameStart() {
        return GameManager.isGameStart();
    }

    function saveGame() {
        GameManager.saveGame();
    }
}])
.directive('diGameMenu', [
    'GameManager',
function(
    GameManager
){
    var GameMenu = {
        controller: 'GameMenuCtrl',
        controllerAs: 'vm',
        templateUrl: 'directives/diGameMenu/diGameMenu.tpl.html',
        restrict: 'A',
        scope: true,
        link: link
    };

    return GameMenu;

    function link(scope, element, attrs, controller) {
        scope.$on('app.pause', function() {
            if ((!controller.isPause() && controller.isGameStart()) ||
                GameManager.getOpenDesignBeforeStart()) {
                $(element).children('.dy-game-menu').modal({
                    backdrop: 'static'
                });
                $(element).addClass('dy-game-menu-modal');
            } else {
                scope.closeModal();
            }
        });

        scope.closeModal = function closeModal() {
            $(element).children('.dy-game-menu').modal('hide');
            $(element).removeClass('dy-game-menu-modal');
        };

    }
}]);