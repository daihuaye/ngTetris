angular.module( 'ngBoilerplate.home', [
  'ui.router',
  'direcitve.diGameBoard',
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
    function gameLoop() {
        GameManager.moveCurrentPiece();
    }

    var loop = _.throttle(gameLoop, 2000, {
            leading: false,
            trailing: false
        });
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
        KeyboardService.init();
        GameManager.newGame();
    };

    $scope.startNewGame = function startNewGame() {
        GameManager.setGameStart();
        KeyboardService.on(function(key) {
            GameManager.move(key);
        });
        $scope.gameOn();
    };

    $scope.isGameStart = function isGameStart() {
        return GameManager.isGameStart();
    };

    $scope.pauseGame = function pauseGame() {
        GameManager.setPause();
    };

    $scope.isPause = function isPause() {
        return GameManager.isPause();
    };

    $scope.continueGame = function continueGame() {
        GameManager.setPause();
    };

    $scope.newGame();
}]);