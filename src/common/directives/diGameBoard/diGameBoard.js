/**
* direcitve.diGameBoard Module
*
* Description
*/
angular.module('directive.diGameBoard', [
    'ngAnimate',
    'service.GridService',
    'directive.diPiece',
    'resource.GameData'
])
.controller('GameBoardCtrl', [
    '$scope',
    'GridService',
    'GameData',
function (
    $scope,
    GridService,
    GameData
){
    var vm = this;
    vm.getGridService = getGridService;
    vm.getFilledClass = getFilledClass;
    vm.getFilledCustomColor = getFilledCustomColor;

    ////////////////

    function getGridService() {
        return GridService.getGridService();
    }

    function getFilledClass(cell) {
        var pieceClass = '';
        if (cell.filled) {
            switch(cell.shape) {
                case 0: pieceClass = 'dy-L-filled';
                    break;
                case 1: pieceClass = 'dy-O-filled';
                    break;
                case 2: pieceClass = 'dy-I-filled';
                    break;
                case 3: pieceClass = 'dy-T-filled';
                    break;
                case 4: pieceClass = 'dy-J-filled';
                    break;
                case 5: pieceClass = 'dy-S-filled';
                    break;
                case 6: pieceClass = 'dy-Z-filled';
                    break;
                default: pieceClass = 'dy-X-filled';
                    break;
            }
        }
        if (cell.ghost) {
            pieceClass += (pieceClass.length > 0) ? ' dy-ghost-piece' : 'dy-ghost-piece';
        }
        return pieceClass;
    }

    function getFilledCustomColor(cell) {
        if (cell.filled && cell.shape === 7) {
            return {
                'background-color': GameData.getColor()
            };
        }
    }
}])
.directive('diGameBoard', [
function(
){
    var GameBoard = {
        controller: 'GameBoardCtrl',
        controllerAs: 'vm',
        templateUrl: 'directives/diGameBoard/diGameBoard.tpl.html',
        restrict: 'AE',
        scope: true,
        replace: true
    };

    return GameBoard;
}]);