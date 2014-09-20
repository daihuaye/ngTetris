angular.module( 'ngBoilerplate.home', [
  'ui.router',
  'direcitve.diGameBoard',
  'service.GameManager',
  'service.animframePolyFill'
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
function HomeController(
    $scope,
    GameManager,
    animframePolyFill
){
    $scope.newGame = function newGame() {
       GameManager.newGame();
    };

    $scope.newGame();
}]);