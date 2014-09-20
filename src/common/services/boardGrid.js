/**
* service.BoardGrid Module
*
* Description
*/
angular.module('service.BoardGrid', [
    'resource.GameData',
    'service.Piece'
])
.factory('BoardGrid', [
    'GameData',
    'Piece',
function (
    GameData,
    Piece
){
    var boardGrid = {};
    boardGrid.pieces = [];
    boardGrid.grid = [];

    function getBoardSize() {
        return GameData.gameBoard.boardSize;
    }

    boardGrid.buildEmptyGameBoard = function buildEmptyGameBoard() {
        var sizeOfBoard = GameData.gameBoard.boardWidth * GameData.gameBoard.boardHeight;
        for (var i = 0; i < sizeOfBoard; i++) {
            boardGrid.grid[i] = null;
        }
    };

    boardGrid.getBoardGrid = function getBoardGrid() {
        return boardGrid.grid;
    };

    boardGrid._positionToCoordinates = function _positionToCoordinates(i) {
        var x = i % getBoardSize(),
            y = (i - x) / getBoardSize();

        return {
            x: x,
            y: y
        };
    };

    boardGrid._coordinatesToPosition = function _coordinatesToPosition(pos) {
        return (pos.y * getBoardSize()) + pos.x;
    };

    return boardGrid;
}]);