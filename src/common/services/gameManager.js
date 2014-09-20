/**
* service.game Module
*
* Description
*/
angular.module('service.gameManager', [
    'resource.GameData',
    'service.BoardGrid'
])
.factory('GameManager', [
    'GameData',
    'BoardGrid',
function (
    GameData,
    BoardGrid
){
    var game = {};

    game.newGame = function newGame() {
        BoardGrid.buildEmptyGameBoard();
    };
    
    return game;
}]);