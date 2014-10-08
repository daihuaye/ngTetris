/**
* service.game Module
*
* Description
*/
angular.module('service.GameManager', [
    'resource.GameData',
    'service.GridService',
    'service.Piece',
    'service.localStoragePolyfill'
])
.factory('GameManager', [
    'GameData',
    'GridService',
    'Piece',
    'localStoragePolyfill',
function (
    GameData,
    GridService,
    Piece,
    localStoragePolyfill
){
    var game = {
        currentPiece: null,
        isNewRecord: false
    };

    game.resetGame = function resetGame() {
        game.currentPiece = null;
        game.isNewRecord = false;
        GameData.gameStart = false;
        GameData.gamePause = false;
        GameData.gameEnd = false;
        GameData.score = 0;
    };

    game.newGame = function newGame() {
        game.resetGame();
        GridService.buildEmptyGameBoard();
    };

    game.setGameStart = function setGameStart() {
        GameData.gameStart = !GameData.gameStart;
        return this;
    };

    game.getGameSpeed = function getGameSpeed() {
        return GameData.speed;
    };

    game.setPause = function setPause() {
        GameData.gamePause = !GameData.gamePause;
        return this;
    };

    game.isPause = function isPause() {
        return GameData.gamePause;
    };

    game.isGameStart = function isGameStart() {
        return GameData.gameStart;
    };

    game.gameOver = function gameOver() {
        game.saveBestScore();
        game.setGameStart();
        GameData.gameStart = false;
        GameData.gameEnd = true;
    };

    game.isGameEnd = function isGameEnd() {
        return GameData.gameEnd;
    };

    game.saveBestScore = function saveBestScore() {
        var score  = parseInt(GameData.getBestScore(), 10),
            preScore = parseInt(game.getScore(), 10);
        if (preScore > score) {
            game.isNewRecord = true;
            localStoragePolyfill.setItem('game.bestScore', preScore);
        }
        return game;
    };

    game.getScore = function getScore() {
        return GameData.score;
    };

    game.getBestScore = function getBestScore() {
        return GameData.getBestScore();
    };

    game.getCurrentPiece = function getCurrentPiece() {
        return game.currentPiece;
    };

    game.getCurrentPattern = function getCurrentPattern() {
        return game.currentPiece.getPattern();
    };

    game.getCurrentShape = function getCurrentShape() {
        return game.currentPiece.getShape();
    };

    game.rotatePiece = function rotatePiece() {
        return game.currentPiece.rotatePiece();
    };

    game.getPositionX = function getPositionX() {
        return game.currentPiece.getPositionX();
    };

    game.getPositionY = function getPositionY() {
        return game.currentPiece.getPositionY();
    };

    function insertAndClearRow() {
        game.insertPiece();
        GridService.checkAndClearFilledRow(function() {
            GameData.score += 100;
        });
    }

    game.moveCurrentPiece = function moveCurrentPiece() {
        var speedY = game.getPositionY() + 1;
        game.currentPiece.updatePosition({
            y: speedY
        }, insertAndClearRow);
    };

    game.insertPiece = function insertPiece() {
        GridService.insertPiece(game.currentPiece, game.gameOver);
        game.currentPiece.destroy();
        game.currentPiece = null;
    };

    game.createNewPiece = function createNewPiece() {
        game.currentPiece = new Piece({
            x: 4,
            y: 0
        });
    };

    game.getIsNewRecord = function getIsNewRecord() {
        return game.isNewRecord;
    };

    game.movePieceInLevel = function movePieceInLevel(direction) {
        var velocity = (direction === 'left') ? -1 : 1;
            speedX = game.getPositionX() + velocity;
        game.currentPiece.updatePosition({
            x: speedX
        });
    };

    game.hardDrop = function hardDrop() {
        var cell = game.currentPiece.calculateCollisionPoint();
        game.currentPiece.updatePosition(cell, insertAndClearRow);
    };

    game.updateGhostPiece = function updateGhostPiece() {
        if (game.currentPiece) {
            game.currentPiece.updateGhostPiece();
        }
    };

    game.move = function move(key) {
        switch (key) {
            case 'up':
                game.rotatePiece();
                break;
            case 'left':
                game.movePieceInLevel('left');
                break;
            case 'right':
                game.movePieceInLevel('right');
                break;
            case 'down':
                game.moveCurrentPiece();
                break;
            case 'space':
                game.hardDrop();
                break;
            case 'p':
            case 'esc':
                game.setPause();
                break;
            default:
                break;
        }
        game.updateGhostPiece();
    };

    game.updateGameSpeed = function updateGameSpeed(speed) {
        GameData.speed = speed;
    };
    
    return game;
}]);