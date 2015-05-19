/**
* directive.diDesignPiece Module
*
* Description
*/
angular.module('directive.diDesignPiece', [
    'ngMessages',
    'resource.GameData',
    'service.ROTATION_MATRIX',
    'service.GameManager'
])
.factory('CustomPiece', [
    'GameData',
    'ROTATION_MATRIX',
    function (
    GameData,
    ROTATION_MATRIX
){
    var custom = {
        generatePatterns: generatePatterns,
        generatePatternCoord: generatePatternCoord,

        getPattern: getPattern,
        getPatternCoord: getPatternCoord,

        getCustomPiece: getCustomPiece,
        setCustomPiece: setCustomPiece,
        hasCustomPiece: hasCustomPiece,
        destroyCustomPiece: destroyCustomPiece
    },
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

    return custom;

    /////////////////////

    function generatePatterns(pieces) {
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
    }

    function destroyCustomPiece () {
        pattern2d = [];
        patternCoord2d = [];
    }

    function generatePatternCoord() {
        // set up the first patter coord
        setPatternToCoord(pattern2d[0]);

        for(var deg in [90, 180, 270]) {
            // deg is index [0, 1, 2]
            // patternCoor2d has init with orgin coord
            // so index + 1 to move to next rotation
            getRotatePattern(patternCoord2d[0], parseInt(deg, 10) + 1);
        }

        setPatternCoord2d();
    }

    function getPattern(rotation) {
        return pattern2d[rotation];
    }

    function getPatternCoord(rotation) {
        return patternCoord2d[rotation];
    }

    function getCustomPiece() {
        return {
            pattern2d: pattern2d,
            patternCoord2d: patternCoord2d
        };
    }

    function setCustomPiece(customPiece) {
        pattern2d = customPiece.pattern2d;
        patternCoord2d = customPiece.patternCoord2d;
    }

    function hasCustomPiece() {
        return pattern2d.length > 0;
    }

    // private methods
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

    // private methods
    function setPatternCoord2d() {
        patternCoord2d = [];
        _.each(pattern2d, function (pattern) {
            setPatternToCoord(pattern);
        });
    }

    // private methods
    function setPatternToCoord(pattern) {
        var patternCoord = [];
        _.each(pattern, function (i) {
            patternCoord.push(posToCoord(i));
        });
        patternCoord2d.push(patternCoord);
    }
}])
.controller('DesignPieceCtrl', [
    '$scope',
    'GameData',
    'CustomPiece',
    'GameManager',
function (
    $scope,
    GameData,
    CustomPiece,
    GameManager
){
    var vm = this,
        isSumbit = false,
        currentColor = '';

    vm.pieces = [];
    vm.colors = randomColor({count: GameData.availableColors});
    if (GameData.getColor() === '') {
        GameData.setColor(randomColor());
    }
    currentColor = GameData.getColor();

    _.each(_.range(16), function (value) {
        vm.pieces[value] = {
            isSelected: false
        };
    });
    _.each(CustomPiece.getPattern(0), function (index) {
        vm.pieces[index].isSelected = true;
    });
    vm.errorCode = {
        maxlength: false,
        minlength: (vm.pieces.length === 0),
        saved: false
    };

    vm.onClick = onClick;
    vm.isSelected = isSelected;
    vm.isSaved = isSaved;
    vm.getMaxPiece = getMaxPiece;
    vm.interacted = interacted;
    vm.pickColor = pickColor;
    vm.getColor = getColor;
    vm.getColorByIndex = getColorByIndex;
    vm.getTop = getTop;

    /////////////

    function checkSelectedField() {
        var res = _.countBy(vm.pieces, function (piece) {
            return piece.isSelected ? 'selected' : 'unselected';
        });
        if (res.selected > GameData.maxCustomPiece) {
            vm.errorCode.maxlength = true;
        } else {
            vm.errorCode.maxlength = false;
        }
        if (res.selected > 0) {
            vm.errorCode.minlength = false;
        } else if (_.isUndefined(res.selected)) {
            vm.errorCode.minlength = true;
        }
        vm.errorCode.saved = false;
    }

    function isOk() {
        // check any fields except saved field 
        return _.chain(vm.errorCode)
                .find(function (value, key) {
                    return key === 'saved' ? false : value;
                })
                .isUndefined()
                .value();
    }

    function savePiece() {
        isSumbit = true;
        if (isOk()) {
            vm.errorCode.saved = true;
            CustomPiece.generatePatterns(vm.pieces);
        }
    }

    function onClick(index) {
        var isChecked = vm.pieces[index].isSelected;
        vm.pieces[index].isSelected = !isChecked;
        checkSelectedField();
        isSumbit = true;
        savePiece();
    }

    function isSelected(index) {
        return vm.pieces[index].isSelected;
    }

    function isSaved() {
        return isSumbit && !vm.errorCode.saved;
    }

    function getMaxPiece() {
        return GameData.maxCustomPiece;
    }

    function interacted() {
        return isSumbit;
    }

    function pickColor(color) {
        vm.errorCode.saved = false;
        if (vm.pieces.length > 0) {
            isSumbit = true;
        }
        currentColor = color;
        GameData.setColor(currentColor);
    }

    function getColor() {
        return { background: currentColor };
    }

    function getColorByIndex(index) {
        if (vm.pieces[index].isSelected) {
            return currentColor;
        }
        return;
    }

    function getTop() {
        var customTop = GameManager.getOpenDesignBeforeStart() ? { top: '-76px' } : {};
        return customTop;
    }

}])
.directive('diDesignPiece', [
function(
){
    var DesignPiece = {};

    DesignPiece.controller = 'DesignPieceCtrl';

    DesignPiece.controllerAs = 'dp';

    DesignPiece.templateUrl = 'directives/diDesignPiece/diDesignPiece.tpl.html';

    DesignPiece.restrict = 'A';

    DesignPiece.scope = true;

    DesignPiece.link = function link(scope, element, attrs) {};

    return DesignPiece;
}]);