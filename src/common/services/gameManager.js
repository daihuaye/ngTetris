/**
* service.game Module
*
* Description
*/
angular.module('service.GameManager', [
    'resource.GameData',
    'service.GridService',
    'service.Piece',
    'service.localStoragePolyfill'
])
.factory('Device', [function () {
    var Device = {};

    Device.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    Device.browserWidth = $(window).width();

    return Device;
}])
.factory('GameManager', [
    'GameData',
    'GridService',
    'Piece',
    'localStoragePolyfill',
function (
    GameData,
    GridService,
    Piece,
    localStoragePolyfill
){
    var game = {
        // Game Variables
        currentPiece: null,
        isNewRecord: false,
        isOpenGameDesign: false,
        openDesignBeforeStart: false,
        data: {},

        // Game Cycle
        newGame: newGame,
        resetGame: resetGame,
        saveGame: saveGame,
        setPause: setPause,
        restoreGame: restoreGame,
        isGameEnd: isGameEnd,
        isPause: isPause,
        isGameStart: isGameStart,
        setGameStart: setGameStart,
        gameOver: gameOver,
        
        // Design New Game Functions
        getIsOpenGameDesign: getIsOpenGameDesign,
        setIsOpenGameDesign: setIsOpenGameDesign,
        getOpenDesignBeforeStart: getOpenDesignBeforeStart,
        setOpenDesignBeforeStart: setOpenDesignBeforeStart,

        // Game Properties
        hasGameHistory: hasGameHistory,
        getGameSavedTime: getGameSavedTime,

        // Score
        saveBestScore: saveBestScore,
        getScore: getScore,
        getBestScore: getBestScore,
        getIsNewRecord: getIsNewRecord,

        // Piece Properties
        createNewPiece: createNewPiece,
        getCurrentPiece: getCurrentPiece,
        moveCurrentPiece: moveCurrentPiece,
        insertPiece: insertPiece,
        getCurrentPattern: getCurrentPattern,
        getCurrentShape: getCurrentShape,
        getPositionX: getPositionX,
        getPositionY: getPositionY,

        // Piece Movement
        rotatePiece: rotatePiece,
        movePieceInLevel: movePieceInLevel,
        updateGhostPiece: updateGhostPiece,
        hardDrop: hardDrop,
        move: move,
        getGameSpeed: getGameSpeed,
        updateGameSpeed: updateGameSpeed
    };

    return game;

    function resetGame() {
        game.currentPiece = null;
        game.isNewRecord = false;
        GameData.gameStart = false;
        GameData.gamePause = false;
        GameData.gameEnd = false;
        GameData.score = 0;
    }

    function newGame() {
        game.resetGame();
        GridService.buildEmptyGameBoard();
    }

    function saveGame() {
        // piece
        game.data.piece = {
            rotation: game.currentPiece.getRotation(),
            patterns: game.currentPiece.getPatternNumber()
        };

        // grid
        game.data.grid = GridService.getGridService();

        // scroe
        game.data.score = GameData.score;

        // custom piece
        game.data.custom = game.currentPiece.getCustomPiece();
        game.data.custom.color = GameData.getColor();

        GameData.savedGameTime = new Date();
        game.data.date = GameData.savedGameTime.toJSON();

        localStoragePolyfill.setItem('game.history', game.data);
        localStoragePolyfill.setItem('game.history.date', game.data.date);
        return;
    }

    function restoreGame() {
        var data = localStoragePolyfill.getItem('game.history');
        if (!_.isNull(data)) {
            game.data = data;
            game.currentPiece.setRotation(game.data.piece.rotation);
            game.currentPiece.setPatternNumber(game.data.piece.patterns);
            GridService.setGridService(game.data.grid);
            GameData.score = game.data.score;
            GameData.setColor(game.data.custom.color);
            game.currentPiece.setCustomPiece(game.data.custom);
            game.currentPiece.setPositionY(0);
            game.currentPiece.setPositionX(4);
            GameData.saveGameTime = new Date(game.data.date);
        }
    }

    function hasGameHistory() {
        var data = localStoragePolyfill.getItem('game.history');
        return !_.isNull(data);
    }

    function getGameSavedTime() {
        var date = localStoragePolyfill.getItem('game.history.date');
        if (!_.isNull(date)) {
            var time = new Date(date);
            return time.toLocaleString();
        } else {
            return null;
        }
    }

    function setGameStart() {
        GameData.gameStart = !GameData.gameStart;
        return this;
    }

    function getGameSpeed() {
        return GameData.getGameSpeed();
    }

    function setPause() {
        GameData.gamePause = !GameData.gamePause;
        return this;
    }

    function isPause() {
        return GameData.gamePause;
    }

    function isGameStart() {
        return GameData.gameStart;
    }

    function gameOver() {
        game.saveBestScore();
        game.setGameStart();
        GameData.gameStart = false;
        GameData.gameEnd = true;
    }

    function isGameEnd() {
        return GameData.gameEnd;
    }

    function getIsOpenGameDesign() {
        return game.isOpenGameDesign;
    }

    function setIsOpenGameDesign(isOpen) {
        game.isOpenGameDesign = isOpen;
    }

    function getOpenDesignBeforeStart() {
        return game.openDesignBeforeStart;
    }

    function setOpenDesignBeforeStart(isOpen) {
        game.openDesignBeforeStart = isOpen;
    }

    function saveBestScore() {
        var score  = parseInt(GameData.getBestScore(), 10),
            preScore = parseInt(game.getScore(), 10);
        if (preScore > score) {
            game.isNewRecord = true;
            localStoragePolyfill.setItem('game.bestScore', preScore);
        }
        return game;
    }

    function getScore() {
        return GameData.score;
    }

    function getBestScore() {
        return GameData.getBestScore();
    }

    function getCurrentPiece() {
        return game.currentPiece;
    }

    function getCurrentPattern() {
        return game.currentPiece.getPattern();
    }

    function getCurrentShape() {
        return game.currentPiece.getShape();
    }

    function rotatePiece(direction) {
        rotatePieceCheck(direction);
    }

    function getPositionX() {
        return game.currentPiece.getPositionX();
    }

    function getPositionY() {
        return game.currentPiece.getPositionY();
    }

    function moveCurrentPiece() {
        var speedY = game.getPositionY() + 1;
        game.currentPiece.updatePosition({
            y: speedY
        }, insertAndClearRow);
    }

    function insertPiece() {
        GridService.insertPiece(game.currentPiece, game.gameOver);
        game.currentPiece.destroy();
        game.currentPiece = null;
    }

    function createNewPiece() {
        game.currentPiece = new Piece({
            x: 4,
            y: 0
        });
    }

    function getIsNewRecord() {
        return game.isNewRecord;
    }

    function movePieceInLevel(direction) {
        var velocity = (direction === 'left') ? -1 : 1;
            speedX = game.getPositionX() + velocity;
        game.currentPiece.updatePosition({
            x: speedX
        });
    }

    function hardDrop() {
        var cell = game.currentPiece.calculateCollisionPoint();
        game.currentPiece.updatePosition(cell, insertAndClearRow);
    }

    function updateGhostPiece() {
        if (game.currentPiece) {
            game.currentPiece.updateGhostPiece();
        }
    }

    function move(key) {
        var rotateRight = 1,
            rotateLeft = -1;
        switch (key) {
            case 'up':
                game.rotatePiece(rotateRight);
                break;
            case 'left':
                game.movePieceInLevel('left');
                break;
            case 'right':
                game.movePieceInLevel('right');
                break;
            case 'down':
                game.rotatePiece(rotateLeft);
                break;
            case 'space':
                game.hardDrop();
                break;
            case 'p':
            case 'esc':
                game.setPause();
                break;
            default:
                break;
        }
        game.updateGhostPiece();
    }

    function updateGameSpeed(speed) {
        GameData.setGameSpeed(speed);
    }

    // private method
    function insertAndClearRow() {
        game.insertPiece();
        GridService.checkAndClearFilledRow(function() {
            GameData.score += 100;
        });
    }

    // private method
    function getBoardWidth() {
        return GameData.gameBoard.boardWidth;
    }

    // private method
    function moveCustomInLevel(velocity) {
        var speedX = game.getPositionX() + velocity;
        game.currentPiece.updatePosition({
            x: speedX
        });  
    }

    // private method
    function rotatePieceCheck(direction) {
        var oldRotation = game.currentPiece.getRotation(),
            newRotation = oldRotation + direction;
        game.currentPiece.setRotation(newRotation < 0 ? newRotation + GameData.rotationLimit : newRotation % GameData.rotationLimit);

        var coord = game.currentPiece.convertPatternToCoordinates();
        for(var i = 0, len = coord.length; i < len; i++) {
            if (!game.currentPiece.withinGrid(coord[i])) {
                if (coord[i].x < 0) {
                    game.movePieceInLevel('right');
                    break;
                }
                if (coord[i].x >= getBoardWidth() ) {
                    game.movePieceInLevel('left');
                    if (game.currentPiece.getPatternNumber() === 2) {
                        if (coord[i+1] && coord[i+1].x >= getBoardWidth()) {
                            moveCustomInLevel(-2);
                        }
                        break;
                    } else {
                        break;
                    }
                }
                if(!game.currentPiece.verifyPiece()) {
                    game.currentPiece.setRotation(oldRotation);
                    break;
                }
            }
        }
    }
    
    return game;
}]);