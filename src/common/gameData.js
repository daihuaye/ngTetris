/**
* resource.GameData Module
*
* Description
*/
angular.module('resource.GameData', [])
.factory('GameData', [function () {
    var data = {
        speed: 800,
        level: 1,
        score: 0,
        gameBoard: {
            borderWidth: 10,
            boardWidthInPixel: 380,
            pieceWidthInPixel: 380 / 10,
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