/**
* service.game Module
*
* Description
*/
angular.module('service.GameManager', [
    'resource.GameData',
    'service.GridService',
    'service.Piece'
])
.factory('GameManager', [
    'GameData',
    'GridService',
    'Piece',
function (
    GameData,
    GridService,
    Piece
){
    var game = {
        currentPiece: null
    };

    game.newGame = function newGame() {
        game.currentPiece = new Piece({
            x: 4,
            y: 0
        });
        GridService.buildEmptyGameBoard();
    };

    game.setGameStart = function setGameStart() {
        GameData.gameStart = !GameData.gameStart;
        return this;
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

    game.getCurrentPiece = function getCurrentPiece() {
        return game.currentPiece;
    };

    game.getCurrentPattern = function getCurrentPattern() {
        return game.currentPiece.getPattern();
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

    game.moveCurrentPiece = function moveCurrentPiece() {
        var speedY = game.getPositionY() + 1;
        game.currentPiece.updatePosition({
            y: speedY
        }, function(){
            game.insertPiece();
            GridService.checkAndClearFilledRow();
        });
    };

    game.insertPiece = function insertPiece() {
        GridService.insertPiece(game.currentPiece);
        game.currentPiece.destroy();
        game.currentPiece = null;
        game.createNewPiece();
    };

    game.createNewPiece = function createNewPiece() {
        game.currentPiece = new Piece({
            x: 4,
            y: 0
        });
    };

    game.movePieceInLevel = function movePieceInLevel(direction) {
        var velocity = (direction === 'left') ? -1 : 1;
            speedX = game.getPositionX() + velocity;
        game.currentPiece.updatePosition({
            x: speedX
        });
    };

    game.move = function move(key) {
        switch(key) {
            case 'up': game.rotatePiece();
                break;
            case 'left': game.movePieceInLevel('left');
                break;
            case 'right': game.movePieceInLevel('right');
                break;
            default:
                break;
        }
    };
    
    return game;
}]);