/**
* service.GridService Module
*
* Description
*/
angular.module('service.GridService', [
    'resource.GameData',
    'service.Piece'
])
.factory('GridService', [
    'GameData',
    'Piece',
function (
    GameData,
    Piece
){
    var GridService = {};
    GridService.pieces = [];
    GridService.grid = [];

    function getBoardSize() {
        return GameData.gameBoard.boardSize;
    }

    GridService.buildEmptyGameBoard = function buildEmptyGameBoard() {
        var sizeOfBoard = GameData.gameBoard.boardWidth * GameData.gameBoard.boardHeight;
        for (var i = 0; i < sizeOfBoard; i++) {
            GridService.grid[i] = null;
        }
    };

    GridService.getGridService = function getGridService() {
        return GridService.grid;
    };

    GridService.insertPiece = function insertPiece(piece) {

    };

    GridService._positionToCoordinates = function _positionToCoordinates(i) {
        var x = i % getBoardSize(),
            y = (i - x) / getBoardSize();

        return {
            x: x,
            y: y
        };
    };

    GridService._coordinatesToPosition = function _coordinatesToPosition(pos) {
        return (pos.y * getBoardSize()) + pos.x;
    };

    return GridService;
}]);