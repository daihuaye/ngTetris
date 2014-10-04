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
    $scope.continueGame = function continueGame() {
        GameManager.setPause();
        $scope.closeModal();
        return this;
    };

    $scope.restartGame = function restartGame() {
        GameManager.newGame();
        $scope.closeModal();
        GameManager.setGameStart();
        return this;
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