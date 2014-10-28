/**
* service.Piece Module
*
* Description
*/
angular.module('service.Piece', [
    'service.PATTERNS',
    'resource.GameData',
    'service.GridService',
    'directive.diDesignPiece'
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
    'CustomPiece',
function (
    PATTERNS,
    GenerateUniqueId,
    GameData,
    PATTERN_COOR,
    GridService,
    CustomPiece
){
    var Piece = function (pos) {
            var position = pos || {
                    x: 4,
                    y: 0
                },
                patternLimit = CustomPiece.hasCustomPiece() ? GameData.patternLimit + 1 : 
                                                                GameData.patternLimit;
            this.x = position.x;
            this.y = position.y;
            this.rotation = Math.floor(Math.random() * GameData.rotationLimit);
            this.patterns = Math.floor(Math.random() * patternLimit); 
            this.id = GenerateUniqueId.next();
            GridService.resetGhostPiece();
        },
        withinGridMem = _.memoize(function (cell) {
            return cell.x >= 0 && cell.x < getBoardWidth() &&
                cell.y >= 0 && cell.y < getBoardHeight();
        }, function (cell) {
            return '' + cell.x + cell.y;
        });

    function getBoardWidth() {
        return GameData.gameBoard.boardWidth;
    }

    function getBoardHeight() {
        return GameData.gameBoard.boardHeight;
    }

    function getPatternCoord() {
        if (_.isUndefined(PATTERN_COOR[this.patterns])) {
            return CustomPiece.getPatternCoord(this.rotation);
        } else {
            return PATTERN_COOR[this.patterns][this.rotation];
        }
    }

    Piece.prototype.getRotation = function() {
        return this.rotation;
    };

    Piece.prototype.setRotation = function(rotation) {
        this.rotation = rotation;
    };

    Piece.prototype.getPatternNumber = function() {
        return this.patterns;
    };

    Piece.prototype.setPatternNumber = function(patternNum) {
        this.patterns = patternNum;
    };

    Piece.prototype.getCustomPiece = function getCustomPiece() {
        return CustomPiece.getCustomPiece();
    };

    Piece.prototype.setCustomPiece = function setCustomPiece(custom) {
        CustomPiece.setCustomPiece(custom);
    };

    Piece.prototype.getId = function getId() {
        return this.id;
    };

    Piece.prototype.restorePiece = function(rotation, patterns) {
        this.rotation = rotation;
        this.patterns = patterns;
    };

    Piece.prototype.getPieceCoordArray = function getPieceCoordArray() {
        return this.convertPatternToCoordinates();
    };

    Piece.prototype.getPositionX = function getPositionX() {
        return this.x;
    };

    Piece.prototype.setPositionX = function setPositionX(x) {
        this.x = x;
    };

    Piece.prototype.getPositionY = function getPositionY() {
        return this.y;
    };

    Piece.prototype.setPositionY = function getPositionY(y) {
        this.y = y;
    };

    Piece.prototype.getPattern = function getPattern() {
        if (_.isUndefined(PATTERNS[this.patterns])) {
            return CustomPiece.getPattern(this.rotation);
        } else {
            return PATTERNS[this.patterns][this.rotation];
        }
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
        var isMoveDown = isNaN(newPosition.y) ? false : newPosition.y > this.y;
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
        return withinGridMem(cell);
    };

    Piece.prototype.convertPatternToCoordinates = function convertPatternToCoordinates(cell) {
        var coord = angular.copy(getPatternCoord.apply(this)),
            location = cell || {x: this.x, y: this.y};
        _.each(coord, function (ele, index) {
            coord[index].x += location.x;
            coord[index].y += location.y;
        });
        return coord;
    };

    Piece.prototype.calculateCollisionPoint = function calculateCollisionPoint() {
        var cell = {
            x: this.x,
            y: this.y
        };
        for(var i = cell.y; i < getBoardHeight(); i++) {
            cell.y = i;
            if(!this.verifyPiece(cell)) {
                break;
            }
        }
        cell.y--;
        return cell;
    };

    Piece.prototype.updateGhostPiece = function updateGhostPiece() {
        var point = this.calculateCollisionPoint(),
            coord = this.convertPatternToCoordinates(point);
        GridService.resetGhostPiece();
        for(var i = 0, len = coord.length; i < len; i++) {
            GridService.updateGhostPiece(coord[i]);
        }
    };

    Piece.prototype.destroy = function destroy() {
        this.x = null;
        this.y = null;
        this.rotation = null;
        this.patterns = null;
        this.id = null;
        GridService.resetGhostPiece();
    };

    return Piece;
}]);