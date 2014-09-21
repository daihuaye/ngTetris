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
    $scope.gameOn = function gameOn() {
        var self = this;
        window.requestAnimationFrame(function () {
            self.gameOn();
        });
        GameManager.moveCurrentPiece();
        $scope.$broadcast('GameOn');
    };

    $scope.newGame = function newGame() {
        KeyboardService.init();
        GameManager.newGame();
        $scope.gameOn();
    };

    $scope.startNewGame = function startNewGame() {
        KeyboardService.on(function(key) {
            GameManager.move(key);
        });
    };

    $scope.newGame();
}]);