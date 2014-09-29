/**
* resource.GameData Module
*
* Description
*/
angular.module('resource.GameData', [])
.factory('GameData', [function () {
    var data = {
        gameStart: false,
        gamePause: false,
        speed: 2000,
        level: 1,
        score: 0,
        rotationLimit: 4,
        patternLimit: 7,
        pieceSquareGrid: 4,
        numCellInPiece: 4,
        gameBoard: {
            borderWidth: 10,
            boardWidthInPixel: 300,
            pieceWidthInPixel: 30,
            borderPaddingTop: 10,
            boardWidth: 10,
            boardHeight: 20,
            boardPosition: {
                x: 0,
                y: 0
            },
            coordinatePosition: 0
        }
    };

    return data;
}]);