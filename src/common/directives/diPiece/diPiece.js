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
    $scope.pieces = _.range(16);
    
    function getPattern() {
        return GameManager.getCurrentPiece().getPattern();
    }
    function getPiece() {
        return GameManager.getCurrentPiece();
    }

    $scope.checkPattern = function checkPattern(piece) {
        var res = _.find(getPattern(), function (p) {
            return piece === p;
        });
        return _.isNumber(res);
    };
    this.getLeft = function getLeft() {
        return getPiece().x * GameData.gameBoard.pieceWidthInPixel + GameData.gameBoard.borderWidth;
    };
    this.getTop = function getTop() {
        return getPiece().y * GameData.gameBoard.pieceWidthInPixel;
    };
}])
.directive('diPiece', [
function(
){
    var Piece = {};

    Piece.controller = 'PieceCtrl';
    
    Piece.templateUrl = 'directives/diPiece/diPiece.tpl.html';

    Piece.restrict = 'A';

    Piece.replace = true;

    Piece.scope = true;

    Piece.link = function link(scope, element, attrs, controller) {
        element.css('left', controller.getLeft() + 'px');
    };

    return Piece;
}]);