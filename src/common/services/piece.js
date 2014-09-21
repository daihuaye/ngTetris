/**
* service.Piece Module
*
* Description
*/
angular.module('service.Piece', [
    'service.PATTERNS',
    'resource.GameData'
])
.factory('GenerateUniqueId', [function () {
    var generateUid = function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    };

    return {
        next: function() { return generateUid(); }
    };
}])
.factory('Piece', [
    'PATTERNS',
    'GenerateUniqueId',
    'GameData',
function (
    PATTERNS,
    GenerateUniqueId,
    GameData
){
    var Piece = function (pos) {
        var position = pos || {
            x: 4,
            y: 0
        };
        this.x = position.x;
        this.y = position.y;
        this.rotation = Math.floor(Math.random() * GameData.rotationLimit);
        this.patterns = Math.floor(Math.random() * GameData.patternLimit);  
        this.id = GenerateUniqueId.next();
        this.canMove = null;
    };

    Piece.prototype.getId = function getId() {
        return this.id;
    };

    Piece.prototype.reset = function reset() {
        this.canMove = null;
    };

    Piece.prototype.updatePosition = function updatePosition(newPosition) {
        this.x = newPosition.x || this.x;
        this.y = newPosition.y || this.y;
    };

    Piece.prototype.getPositionX = function getPositionX() {
        return this.x;
    };

    Piece.prototype.getPositionY = function getPositionY() {
        return this.y;
    };

    Piece.prototype.getPattern = function getPattern() {
        return PATTERNS[this.patterns][this.rotation];
    };

    Piece.prototype.rotatePiece = function rotatePiece() {
        this.rotation = (this.rotation + 1) % GameData.rotationLimit;
        return this;
    };

    return Piece;
}]);