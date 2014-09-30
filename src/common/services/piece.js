/**
* service.Piece Module
*
* Description
*/
angular.module('service.Piece', [
    'service.PATTERNS',
    'resource.GameData',
    'service.GridService'
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
    'PATTERN_COOR',
    'GridService',
function (
    PATTERNS,
    GenerateUniqueId,
    GameData,
    PATTERN_COOR,
    GridService
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
    };

    function getBoardWidth() {
        return GameData.gameBoard.boardWidth;
    }

    function getBoardHeight() {
        return GameData.gameBoard.boardHeight;
    }

    Piece.prototype.getId = function getId() {
        return this.id;
    };

    Piece.prototype.getPieceCoordArray = function getPieceCoordArray() {
        return this.convertPatternToCoordinates();
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

    Piece.prototype.getShape = function getShape() {
        return this.patterns;
    };

    Piece.prototype.rotatePiece = function rotatePiece() {
        var oldRotation = this.rotation;
        this.rotation = (this.rotation + 1) % GameData.rotationLimit;
        if(!this.verifyPiece()) {
            this.rotation = oldRotation;
        }
        return this;
    };

    Piece.prototype.updatePosition = function updatePosition(newPosition, cb) {
        var isMoveDown = isNaN(newPosition.y) ? false: newPosition.y > this.y;
            x = isNaN(newPosition.x) ? this.x : newPosition.x,
            y = isNaN(newPosition.y) ? this.y : newPosition.y,
            isVarify = this.verifyPiece({x: x, y: y});

        if(isVarify) {
            this.x = x;
            this.y = y;
        } else if(!isVarify && isMoveDown) {
            if (_.isFunction(cb)) {
                cb();
            }
        }
        return this;
    };

    Piece.prototype.verifyPiece = function verifyPiece(cell) {
        var coord = this.convertPatternToCoordinates(cell),
            isOk = true;
        for(var i = 0, len = coord.length; i < len; i++) {
            if(!this.withinGrid(coord[i]) || !GridService.isPieceVerify(coord[i])) {
                isOk = false;
                break;
            }
        }
        return isOk;
    };

    Piece.prototype.withinGrid = function withinGrid(cell) {
        return cell.x >= 0 && cell.x < getBoardWidth() &&
                cell.y >= 0 && cell.y < getBoardHeight();
    };

    Piece.prototype.convertPatternToCoordinates = function convertPatternToCoordinates(cell) {
        var coord = angular.copy(PATTERN_COOR[this.patterns][this.rotation]),
            location = cell || {x: this.x, y: this.y};
        for(var i = 0; i < GameData.numCellInPiece; i++) {
            coord[i].x += location.x;
            coord[i].y += location.y;   
        }
        return coord;
    };

    Piece.prototype.destroy = function destroy() {
        this.x = null;
        this.y = null;
        this.rotation = null;
        this.patterns = null;
        this.id = null;
    };

    return Piece;
}]);