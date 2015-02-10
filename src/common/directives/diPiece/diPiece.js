/**
* directive.diPiece Module
*
* Description
*/
angular.module('directive.diPiece', [
    'service.GameManager',
    'resource.GameData'
])
.controller('PieceCtrl', [
    '$scope',
    'GameManager',
    'GameData',
function (
    $scope,
    GameManager,
    GameData
){
    var getX = _.memoize(function(x) { 
           return x * GameData.gameBoard.pieceWidthInPixel + GameData.gameBoard.borderWidth;
        }),
        getY = _.memoize(function (y) {
            return y * GameData.gameBoard.pieceWidthInPixel;
        }),
        memCheckPattern = _.memoize(function (pattern, piece) {
            var res = _.find(getPattern(), function (p) {
                return piece === p;
            });
            return _.isNumber(res);
        }, function (pattern, piece) {
            return pattern.toString() + ',' + piece;
        }),
        options = {
            pieces: _.range(16),
            checkPattern: checkPattern,
            getClassForShape: getClassForShape,
            getLeft: getLeft,
            getTop: getTop
        },
        vm = this;

    angular.extend(vm, options);

    //////////////////

    function getPattern() {
        return GameManager.getCurrentPattern();
    }

    function getPiece() {
        return GameManager.getCurrentPiece();
    }

    function getPositionX () {
        return GameManager.getPositionX();
    }

    function getPositionY() {
        return GameManager.getPositionY();
    }


    // if sequence is match, then highlight the DOM ele
    function checkPattern(piece) {
        if (!GameManager.isGameStart()) {
            return;
        }
        return memCheckPattern(getPattern(), piece);
    }

    function getClassForShape() {
        if (!GameManager.isGameStart() ||
            _.isNull(GameManager.getCurrentPiece())) {
            return;
        }
        var pieceClass = '';
        switch(GameManager.getCurrentShape()) {
            case 0: pieceClass = 'dy-L';
                break;
            case 1: pieceClass = 'dy-O';
                break;
            case 2: pieceClass = 'dy-I';
                break;
            case 3: pieceClass = 'dy-T';
                break;
            case 4: pieceClass = 'dy-J';
                break;
            case 5: pieceClass = 'dy-S';
                break;
            case 6: pieceClass = 'dy-Z';
                break;
            default: pieceClass = 'dy-X';
                break;
        }   
        return pieceClass;
    }

    function getLeft() {
        return getX(getPositionX());
    }

    function getTop() {
        return getY(getPositionY());
    }
}])
.directive('diPiece', [
    'GameManager',
    'GameData',
function(
    GameManager,
    GameData
){
    var Piece = {
        controller: 'PieceCtrl',
        controllerAs: 'vm',
        templateUrl: 'directives/diPiece/diPiece.tpl.html',
        restrict: 'A',
        replace: true,
        scope: true,
        link: link
    };

    return Piece;
    
    function link(scope, element, attrs, controller) {
        scope.$on('home.GameOn', function () {
            var top = controller.getTop(),
                left = controller.getLeft();
                // translatePos = 'translate(' + left + 'px,' + Math.round(top) + 'px)';
            element.css({
                // 'transform': translatePos,
                // '-webkit-transform': translatePos,
                // '-ms-transform': translatePos,
                // '-moz-transform': translatePos
                top: top + 'px',
                left: left + 'px'
            });
        });

        scope.getColor = function getColor() {
            var ul = element.children(),
                li = ul ? ul.children() : undefined;
            if (ul.hasClass('dy-X')) {
                if (controller.checkPattern(this.i)) {
                    return {
                        'background-color': GameData.getColor()
                    };
                }
            }
        };

        // can't separate the digest loop with class update and
        // create a new piece, so manually update the dy-piece-ready class
        scope.isPieceReady = function isPieceReady() {
            var isReady = !_.isNull(GameManager.getCurrentPiece());
            if (!isReady) {
                element.removeClass('dy-piece-ready');
                scope.$emit('Piece.createNewPiece');
            } else {
                if (!element.hasClass('dy-piece-ready')) {
                    // wait for the animation complete in 0.3 seconds
                    // if modify the timeout time, it need to update 
                    // the variables in the variables.less
                    window.setTimeout(function() {
                        element.addClass('dy-piece-ready');
                    }, GameData.cssAnimateTimeout);
                }
            }
            return isReady;
        };
    }
}]);