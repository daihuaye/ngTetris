/**
* direcitve.diGameBoard Module
*
* Description
*/
angular.module('direcitve.diGameBoard', [
    'service.BoardGrid',
    'directive.diPiece'
])
.controller('GameBoardCtrl', [
    '$scope',
    'BoardGrid',
function (
    $scope,
    BoardGrid
){
    $scope.getBoardGrid = function getBoardGrid() {
        return BoardGrid.getBoardGrid();
    };

    $scope.getPieceModel = function getPieceModel() {
        return [];
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