/**
* resource.GameData Module
*
* Description
*/
angular.module('resource.GameData', [
    'service.localStoragePolyfill',
    'service.GAMESPEED'
])
.factory('GameData', [
    'localStoragePolyfill',
    'GAMESPEED',
function (
    localStoragePolyfill,
    GAMESPEED
){
    function getBestScore() {
        return parseInt(localStoragePolyfill.getItem('game.bestScore'), 10) || 0;
    }

    function getGameSpeed() {
        return parseInt(localStoragePolyfill.getItem('game.speed'), 10) || GAMESPEED['BEGINNER'];   
    }

    function setGameSpeed(speed) {
        localStoragePolyfill.setItem('game.speed', speed);
    }

    var data = {
        gameStart: false,
        gameEnd: false,
        gamePause: false,
        level: 1,
        score: 0,
        getGameSpeed: getGameSpeed,
        setGameSpeed: setGameSpeed,
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