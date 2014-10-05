/**
* resource.GameData Module
*
* Description
*/
angular.module('resource.GameData', [
    'service.localStoragePolyfill'
])
.factory('GameData', [
    'localStoragePolyfill',
function (
    localStoragePolyfill
){
    function getBestScore() {
        return localStoragePolyfill.getItem('game.bestScore') || 0;
    }

    var data = {
        gameStart: false,
        gameEnd: false,
        gamePause: false,
        speed: 2000,
        level: 1,
        score: 0,
        getBestScore: getBestScore,
        rotationLimit: 4,
        patternLimit: 7,
        pieceSquareGrid: 4,
        numCellInPiece: 4,
        cssAnimateTimeout: 300, // milliseconds
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