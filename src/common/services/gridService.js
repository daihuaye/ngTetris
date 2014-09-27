/**
* service.GridService Module
*
* Description
*/
angular.module('service.GridService', [
    'resource.GameData'
])
.factory('GridService', [
    'GameData',
function (
    GameData
){
    var GridService = {};
    GridService.grid = [];

    function getBoardSize() {
        return GameData.gameBoard.boardWidth;
    }

    function getBoardWidth() {
        return GameData.gameBoard.boardWidth;
    }

    function getBoardHeight() {
        return GameData.gameBoard.boardHeight;
    }

    GridService.buildEmptyGameBoard = function buildEmptyGameBoard() {
        var sizeOfBoard = getBoardWidth() * getBoardHeight();
        for (var i = 0; i < sizeOfBoard; i++) {
            GridService.grid[i] = false;
        }
    };

    GridService.getGridService = function getGridService() {
        return GridService.grid;
    };

    GridService.insertPiece = function insertPiece(piece) {
        var coordArray = piece.getPieceCoordArray();
        for (var i = 0; i < coordArray.length; i++) {
            var pos = this._coordinatesToPosition(coordArray[i]);
            GridService.grid[pos] = true;
        }
    };

    GridService.isPieceVerify = function isPieceVerify(coord) {
        var pos = this._coordinatesToPosition(coord);
        if(GridService.grid[pos]) {
            return false;
        }
        return true;
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