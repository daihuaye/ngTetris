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

    game.getCurrentPiece = function getCurrentPiece() {
        return game.currentPiece;
    };

    game.getPositionX = function getPositionX() {
        return game.currentPiece.getPositionX();
    };

    game.getPositionY = function getPositionY() {
        return game.currentPiece.getPositionY();
    };

    game.moveCurrentPiece = function moveCurrentPiece() {
        var speedY = game.getPositionY() + 0.01;
        game.currentPiece.updatePosition({
            y: speedY
        });
    };

    game.move = function move(key) {
        console.log(key);
    };
    
    return game;
}]);