angular.module( 'ngTetris.home', [
  'ui.router',
  'directive.diGameBoard',
  'directive.diGameMenu',
  'service.GameManager',
  'service.animframePolyFill',
  'service.Keyboard',
  'service.GAMESPEED'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})
.controller('HomeCtrl', [
    '$scope',
    'GameManager',
    'animframePolyFill',
    'KeyboardService',
    'GAMESPEED',
function HomeController(
    $scope,
    GameManager,
    animframePolyFill,
    KeyboardService,
    GAMESPEED
){
    var loop;

    function setUpGameLoop() {
        return _.throttle(gameLoop, GameManager.getGameSpeed(), {
            leading: false,
            trailing: false
        });
    }

    loop = setUpGameLoop();

    function gameLoop() {
        GameManager.moveCurrentPiece();
        GameManager.updateGhostPiece();    
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function gameOn() {
        window.requestAnimationFrame(function () {
            gameOn();
        });
        if(!GameManager.isPause() && GameManager.isGameStart()) {
            loop();
            $scope.$broadcast('home.GameOn');
        }
    }

    function newGame() {
        GameManager.newGame();
        return this;
    }

    $scope.restartNewGame = function restartNewGame() {
        GameManager.newGame();
        GameManager.setGameStart();
        return this;
    };

    $scope.getScore = function getScore() {
        return GameManager.getScore();
    };

    $scope.getBestScore = function getBestScore() {
        var score = parseInt(GameManager.getBestScore(), 10);
        if (score === 0) {
            return '--';
        } else {
            return score;
        }
    };

    $scope.startNewGame = function startNewGame() {
        GameManager.createNewPiece();
        GameManager.setGameStart();
        KeyboardService.on(function(key) {
            GameManager.move(key);
        });
        gameOn();
        return this;
    };

    $scope.isGameStart = function isGameStart() {
        return GameManager.isGameStart();
    };

    $scope.isGameEnd = function isGameEnd() {
        return GameManager.isGameEnd();
    };

    $scope.isNewRecord = function isNewRecord() {
        return GameManager.getIsNewRecord(); 
    };

    $scope.getGameSpeed = function getGameSpeed() {
        var curSpeed = GameManager.getGameSpeed(),
            speedKey = '';
        for(var key in GAMESPEED) {
            if (GAMESPEED[key] === curSpeed) {
                speedKey = key;
                break;
            }
        }
        return speedKey;
    };

    $scope.setGameSpeed = function setGameSpeed() {
        if ($scope.isGameStart()) {
            $scope.$broadcast('app.pause');
            GameManager.setPause();
        }
    };

    $scope.openDesignMenu = function openDesignMenu() {
        GameManager.setOpenDesignBeforeStart(true);
        $scope.$broadcast('app.pause');
    };

    $scope.saveGame = function saveGame() {
        GameManager.saveGame();
    };

    $scope.$on('Piece.createNewPiece', function() {
        GameManager.createNewPiece();
    });

    $scope.$on('BootstrapSlider.Speed', function() {
        loop = setUpGameLoop();
    });

    KeyboardService.init();
    newGame();
}]);