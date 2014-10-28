/**
* directive.diDesignPiece Module
*
* Description
*/
angular.module('directive.diDesignPiece', [
    'ngMessages',
    'resource.GameData',
    'service.ROTATION_MATRIX'
])
.factory('CustomPiece', [
    'GameData',
    'ROTATION_MATRIX',
    function (
    GameData,
    ROTATION_MATRIX
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
        patternCoord2d = [],
        pattern2d = [];

    function getCustomPieceWidth() {
        return GameData.customPieceWidth;
    }

    function getRotatePattern(matrix, deg) {
        var pattern = [],
            rotationArray = ROTATION_MATRIX[deg];
        // [y, x], index 0 is y, 1 is x
        _.each(rotationArray, function (elem, index) {
            var pos = !_.chain(matrix)
                    .find(function (obj, key) {
                        return elem[1] === obj.x &&
                                elem[0] === obj.y;
                    })
                    .isUndefined()
                    .value();
            if (pos) {
                pattern.push(index);
            }
        });
        pattern2d.push(pattern);
    }

    function setPatternCoord2d() {
        patternCoord2d = [];
        _.each(pattern2d, function (pattern) {
            setPatternToCoord(pattern);
        });
    }

    function setPatternToCoord(pattern) {
        var patternCoord = [];
        _.each(pattern, function (i) {
            patternCoord.push(posToCoord(i));
        });
        patternCoord2d.push(patternCoord);
    }

    custom.generatePatterns = function generatePatterns(pieces) {
        var pattern = [];
        pattern2d = [];
        patternCoord2d = [];
        _.each(pieces, function (piece, index) {
            if (piece.isSelected) {
                pattern.push(index);
            }
        });
        pattern2d.push(pattern);
        custom.generatePatternCoord();
    };

    custom.generatePatternCoord = function generatePatternCoord() {
        // set up the first patter coord
        setPatternToCoord(pattern2d[0]);

        for(var deg in [90, 180, 270]) {
            // deg is index [0, 1, 2]
            // patternCoor2d has init with orgin coord
            // so index + 1 to move to next rotation
            getRotatePattern(patternCoord2d[0], parseInt(deg, 10) + 1);
        }

        setPatternCoord2d();
    };

    custom.getPattern = function getPattern(rotation) {
        return pattern2d[rotation];
    };

    custom.getPatternCoord = function getPatternCoord(rotation) {
        return patternCoord2d[rotation];
    };

    custom.getCustomPiece = function getCustomPiece() {
        return {
            pattern2d: pattern2d,
            patternCoord2d: patternCoord2d
        };
    };

    custom.setCustomPiece = function setCustomPiece(customPiece) {
        pattern2d = customPiece.pattern2d;
        patternCoord2d = customPiece.patternCoord2d;
    };

    custom.hasCustomPiece = function hasCustomPiece() {
        return pattern2d.length > 0;
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
    var isSumbit = false,
        currentColor = '';
    
    $scope.pieces = [];
    $scope.colors = randomColor({count: GameData.availableColors});
    if (GameData.getColor() === '') {
        GameData.setColor(randomColor());
    }
    currentColor = GameData.getColor();

    _.each(_.range(16), function (value) {
        $scope.pieces[value] = {
            isSelected: false
        };
    });
    _.each(CustomPiece.getPattern(0), function (index) {
        $scope.pieces[index].isSelected = true;
    });
    $scope.errorCode = {
        maxlength: false,
        minlength: ($scope.pieces.length === 0),
        saved: false
    };

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
        isSumbit = true;
    };

    $scope.isSelected = function isSelected(index) {
        return $scope.pieces[index].isSelected;
    };

    $scope.savePiece = function savePiece() {
        isSumbit = true;
        if (isOk()) {
            $scope.errorCode.saved = true;
            CustomPiece.generatePatterns($scope.pieces);
            GameData.setColor(currentColor);
        }
    };

    $scope.isSaved = function isSaved() {
        return isSumbit && !$scope.errorCode.saved;
    };

    $scope.getMaxPiece = function getMaxPiece() {
        return GameData.maxCustomPiece;
    };

    $scope.interacted = function interacted() {
        return isSumbit;
    };

    $scope.pickColor = function pickColor(color) {
        $scope.errorCode.saved = false;
        if ($scope.pieces.length > 0) {
            isSumbit = true;
        }
        currentColor = color;
    };

    $scope.getColor = function getColor() {
        return { background: currentColor };
    };

    $scope.getColorByIndex = function getColorByIndex(index) {
        if ($scope.pieces[index].isSelected) {
            return currentColor;
        }
        return;
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