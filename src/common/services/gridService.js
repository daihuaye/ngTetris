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
    var GridService = {
        // Grid Variables
        grid: [],

        buildEmptyGameBoard: buildEmptyGameBoard,
        getGridService: getGridService,
        setGridService: setGridService,

        // Piece Verify
        insertPiece: insertPiece,
        isPieceVerify: isPieceVerify,

        // Row
        checkAndClearFilledRow: checkAndClearFilledRow,
        clearNthRow: clearNthRow,

        // Piece Action Function
        movePieceDownLevel: movePieceDownLevel,
        _positionToCoordinates: _positionToCoordinates,
        _coordinatesToPosition: _coordinatesToPosition,

        // Ghost Piece
        resetGhostPiece: resetGhostPiece,
        updateGhostPiece: updateGhostPiece
    },
    coordToPosMem = _.memoize(function (pos) {
        return (pos.y * getBoardWidth()) + pos.x;
    }, function (pos) {
        return '' + pos.x + pos.y;
    }),
    posToCoord = _.memoize(function (i) {
        var x = i % getBoardWidth(),
            y = (i - x) / getBoardWidth();

        return {
            x: x,
            y: y
        };
    });

    return GridService;

    // private method
    function getBoardWidth() {
        return GameData.gameBoard.boardWidth;
    }

    // private method
    function getBoardHeight() {
        return GameData.gameBoard.boardHeight;
    }

    function buildEmptyGameBoard() {
        var sizeOfBoard = getBoardWidth() * getBoardHeight();
        for (var i = 0; i < sizeOfBoard; i++) {
            GridService.grid[i] = {
                filled: false,
                shape: null,
                ghost: false
            };
        }
    }

    function getGridService() {
        return GridService.grid;
    }

    function setGridService(grid) {
        GridService.grid = grid;
    }

    function insertPiece(piece, gameOver) {
        var coordArray = piece.getPieceCoordArray();
        for (var i = 0; i < coordArray.length; i++) {
            var pos = GridService._coordinatesToPosition(coordArray[i]);
            if (GridService.grid[pos].filled) {
                gameOver();
            } else {
                GridService.grid[pos].filled = true;
                GridService.grid[pos].shape = piece.getShape();
            }
        }
    }

    function isPieceVerify(coord) {
        var pos = GridService._coordinatesToPosition(coord);
        if(GridService.grid[pos].filled) {
            return false;
        }
        return true;
    }

    function checkAndClearFilledRow(cb) {
        for(var i = 0; i < getBoardHeight(); i++) {
            var j = 0;
            for(; j < getBoardWidth(); j++) {
                var pos = GridService._coordinatesToPosition({x: j, y: i});
                if(!GridService.grid[pos].filled) {
                    break;
                }
            }
            if(j === getBoardWidth()) {
                // clear the row
                GridService
                    .clearNthRow(i)
                    .movePieceDownLevel(i);
                cb();
            }
        }
    }

    function clearNthRow(row) {
        for(var z = 0; z < getBoardWidth(); z++) {
            var pos = GridService._coordinatesToPosition({x: z, y: row});
            GridService.grid[pos].filled = false;
            GridService.grid[pos].shape = null;
        }
        return GridService;
    }

    function movePieceDownLevel(row) {
        for(var i = row - 1; i >= 0; i--) {
            for(var j = 0; j < getBoardWidth(); j++) {
                var curPos = GridService._coordinatesToPosition({x: j, y: i}),
                    nextPos = GridService._coordinatesToPosition({x: j, y: i + 1});
                GridService.grid[nextPos] = angular.copy(GridService.grid[curPos]);
                GridService.grid[curPos].filled = false;
                GridService.grid[curPos].shape = null;
            }
        }
        return GridService;
    }

    function _positionToCoordinates(i) {
        return posToCoord(i);  
    }

    function _coordinatesToPosition(pos) {
        return coordToPosMem(pos);
    }

    function resetGhostPiece() {
        for(var i = 0, len = GridService.grid.length; i < len; i++) {
            GridService.grid[i].ghost = false;
        }
    }

    function updateGhostPiece(cell) {
        var pos = GridService._coordinatesToPosition(cell);
        if (pos > 0) {
            GridService.grid[pos].ghost = true;
        }
    }
}]);