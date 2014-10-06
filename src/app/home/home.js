angular.module( 'ngBoilerplate.home', [
  'ui.router',
  'directive.diGameBoard',
  'directive.diGameMenu',
  'service.GameManager',
  'service.animframePolyFill',
  'service.Keyboard'
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
function HomeController(
    $scope,
    GameManager,
    animframePolyFill,
    KeyboardService
){
    var loop = _.throttle(gameLoop, GameManager.getGameSpeed(), {
            leading: false,
            trailing: false
        });

    function gameLoop() {
        GameManager.moveCurrentPiece();
        GameManager.updateGhostPiece();    
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.gameOn = function gameOn() {
        var self = this;
        window.requestAnimationFrame(function () {
            self.gameOn();
        });
        if(!GameManager.isPause() && GameManager.isGameStart()) {
            loop();
            $scope.$broadcast('GameOn');
        }
    };

    $scope.newGame = function newGame() {
        GameManager.newGame();
        return this;
    };

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
        $scope.gameOn();
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

    $scope.$on('diPiece.createNewPiece', function() {
        GameManager.createNewPiece();
    });

    KeyboardService.init();
    $scope.newGame();
}]);