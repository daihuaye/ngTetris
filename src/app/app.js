angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'service.GameManager',
  'service.Keyboard',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', [
    '$scope', 
    'GameManager',
    'KeyboardService',
function(
    $scope,
    GameManager,
    KeyboardService
){
    $scope.keydown = function keydown($event) {
        if (GameManager.isGameStart() && !GameManager.isPause()) {
            KeyboardService.keydownAction($event);
        }
    };

    $scope.keypress = function keypress($event) {
        if (GameManager.isGameStart && !GameManager.isPause()) {
            KeyboardService.keydownAction($event);
        }
    };
}]);