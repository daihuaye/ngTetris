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

    $scope.isPieceOnGird = function isPieceOnGird(cell) {
        return cell;
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