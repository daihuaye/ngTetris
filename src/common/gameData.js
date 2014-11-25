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
    var data = {
        gameStart: false,
        gameEnd: false,
        gamePause: false,
        score: 0,
        savedGameTime: null,
        getGameSpeed: getGameSpeed,
        setGameSpeed: setGameSpeed,
        getBestScore: getBestScore,
        rotationLimit: 4,
        patternLimit: 7,
        cssAnimateTimeout: 300, // milliseconds
        maxCustomPiece: 5,
        customPieceWidth: 4,
        availableColors: 5,
        customColorChosen: '',
        setColor: setColor,
        getColor: getColor,
        gameBoard: {
            borderWidth: 10,
            pieceWidthInPixel: 25, // match the pixel of piece in grid
            boardWidth: 10,
            boardHeight: 20
        }
    };

    return data;

    function getBestScore() {
        return parseInt(localStoragePolyfill.getItem('game.bestScore'), 10) || 0;
    }

    function getGameSpeed() {
        return parseInt(localStoragePolyfill.getItem('game.speed'), 10) || GAMESPEED['BEGINNER'];   
    }

    function setGameSpeed(speed) {
        localStoragePolyfill.setItem('game.speed', speed);
    }

    function setColor(color) {
        data.customColorChosen = color;
    }

    function getColor() {
        return data.customColorChosen;
    }
}]);