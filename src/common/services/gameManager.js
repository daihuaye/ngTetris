/**
* service.game Module
*
* Description
*/
angular.module('service.GameManager', [
    'resource.GameData',
    'service.BoardGrid',
    'service.Piece'
])
.factory('GameManager', [
    'GameData',
    'BoardGrid',
    'Piece',
function (
    GameData,
    BoardGrid,
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
        BoardGrid.buildEmptyGameBoard();
        game.update();
    };

    game.getCurrentPiece = function getCurrentPiece() {
        return game.currentPiece;
    };

    game.update = function update() {
        var self = this;
        window.requestAnimationFrame(function () {
            self.update();
        });
    };
    
    return game;
}]);