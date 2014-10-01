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

    function exceptConituneKey(event) {
        switch(KeyboardService.getKey(event.which)) {
            case 'esc':
            case 'p':
                $scope.$broadcast('app.pause');
                return true;
            default:
                return false;
        }
    }

    $scope.keydown = function keydown($event) {
        if (exceptConituneKey($event) ||
            (GameManager.isGameStart() && !GameManager.isPause())) {
            KeyboardService.keydownAction($event);
        }
    };
}]);