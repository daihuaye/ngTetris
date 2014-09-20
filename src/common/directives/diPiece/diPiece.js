/**
* directive.diPiece Module
*
* Description
*/
angular.module('directive.diPiece', [
    'service.Piece',
    'resource.GameData'
])
.controller('PieceCtrl', [
    '$scope',
    'Piece',
    'GameData',
function (
    $scope,
    Piece,
    GameData
){
    var P = new Piece(),
        patterns = P.getPattern();
    $scope.pieces = _.range(16);
    $scope.checkPattern = function checkPattern(piece) {
        var res = _.find(patterns, function (p) {
            return piece === p;
        });
        return _.isNumber(res);
    };
    this.getLeft = function getLeft() {
        return P.x * GameData.gameBoard.pieceWidthInPixel + GameData.gameBoard.borderWidth;
    };
    this.getTop = function getTop() {
        return P.y * GameData.gameBoard.pieceWidthInPixel;
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