/**
* direcitve.diGameBoard Module
*
* Description
*/
angular.module('direcitve.diGameBoard', [
    'service.GridService',
    'directive.diPiece'
])
.controller('GameBoardCtrl', [
    '$scope',
    'GridService',
function (
    $scope,
    GridService
){
    $scope.getGridService = function getGridService() {
        return GridService.getGridService();
    };

    $scope.getFilledClass = function getFilledClass(cell) {
        if (cell.filled) {
            var pieceClass = '';
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
            }
            return pieceClass;
        }
    };
}])
.directive('diGameBoard', [
function(
){
    var GameBoard = {};

    GameBoard.controller = 'GameBoardCtrl';
    
    GameBoard.templateUrl = 'directives/diGameBoard/diGameBoard.tpl.html';

    GameBoard.restrict = 'A';

    GameBoard.scope = true;

    GameBoard.link = function link(scope, element, attrs) {};

    return GameBoard;
}]);