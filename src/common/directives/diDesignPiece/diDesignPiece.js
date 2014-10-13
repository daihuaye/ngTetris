/**
* directive.diDesignPiece Module
*
* Description
*/
angular.module('directive.diDesignPiece', [
    'ngMessages',
    'resource.GameData'
])
.factory('CustomPiece', [
    'GameData',
    function (
    GameData
){
    var custom = {},
        posToCoord = _.memoize(function (i) {
            var x = i % getCustomPieceWidth(),
                y = (i - x) / getCustomPieceWidth();

            return {
                x: x,
                y: y
            };
        }),
        pattern = [],
        patternCoord = [];

    function getCustomPieceWidth() {
        return GameData.customPieceWidth;
    }

    custom.generatePatterns = function generatePatterns(pieces) {
        pattern = [];
        patternCoord = [];
        _.each(pieces, function (piece, index) {
            if (piece.isSelected) {
                pattern.push(index);
            }
        });
        custom.generatePatternCoord();
    };

    custom.generatePatternCoord = function generatePatternCoord() {
        _.each(pattern, function (i) {
            patternCoord.push(posToCoord(i));
        });
    };

    custom.getPattern = function getPattern() {
        return pattern;
    };

    custom.getPatternCoord = function getPatternCoord() {
        return patternCoord;
    };

    custom.hasCustomPiece = function hasCustomPiece() {
        return pattern.length > 0;
    };

    return custom;
}])
.controller('DesignPieceCtrl', [
    '$scope',
    'GameData',
    'CustomPiece',
function (
    $scope,
    GameData,
    CustomPiece
){
    var isSumbit = false;
    
    $scope.pieces = [];
    $scope.errorCode = {
        maxlength: false,
        minlength: true,
        saved: false
    };
    _.each(_.range(16), function (value) {
        $scope.pieces[value] = {
            isSelected: false
        };
    });
    _.each(CustomPiece.getPattern(), function (index) {
        $scope.pieces[index].isSelected = true;
    });

    function checkSelectedField() {
        var res = _.countBy($scope.pieces, function (piece) {
            return piece.isSelected ? 'selected' : 'unselected';
        });
        if (res.selected > GameData.maxCustomPiece) {
            $scope.errorCode.maxlength = true;
        } else {
            $scope.errorCode.maxlength = false;
        }
        if (res.selected > 0) {
            $scope.errorCode.minlength = false;
        } else if (_.isUndefined(res.selected)) {
            $scope.errorCode.minlength = true;
        }
        $scope.errorCode.saved = false;
    }

    function isOk() {
        // check any fields except saved field 
        return _.chain($scope.errorCode)
                .find(function (value, key) {
                    return key === 'saved' ? false : value;
                })
                .isUndefined()
                .value();
    }

    $scope.onClick = function onClick(index) {
        var isChecked = $scope.pieces[index].isSelected;
        $scope.pieces[index].isSelected = !isChecked;
        checkSelectedField();
    };

    $scope.isSelected = function isSelected(index) {
        return $scope.pieces[index].isSelected;
    };

    $scope.savePiece = function savePiece() {
        isSumbit = true;
        if (isOk()) {
            $scope.errorCode.saved = true;
            CustomPiece.generatePatterns($scope.pieces);
        }
    };

    $scope.getMaxPiece = function getMaxPiece() {
        return GameData.maxCustomPiece;
    };

    $scope.interacted = function interacted() {
        return isSumbit;
    };
}])
.directive('diDesignPiece', [
function(
){
    var DesignPiece = {};

    DesignPiece.controller = 'DesignPieceCtrl';
    
    DesignPiece.templateUrl = 'directives/diDesignPiece/diDesignPiece.tpl.html';

    DesignPiece.restrict = 'A';

    DesignPiece.scope = true;

    DesignPiece.link = function link(scope, element, attrs) {};

    return DesignPiece;
}]);