(function (app) {
    app.config(myAppConfig);
    app.run( function run () {});
    app.controller('AppCtrl', AppCtrl);

    function myAppConfig (
        $stateProvider,
        $urlRouterProvider,
        $translateProvider,
        en
    ){
      $urlRouterProvider.otherwise( '/home' );
      $translateProvider.translations('en', en);
      $translateProvider.preferredLanguage('en');
    }

    function AppCtrl(
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

        $scope.importTrackingScript = function importTrackingScript() {
            if (window.location.origin.indexOf('localhost') !== -1) {
                return false;
            } else {
                return true;
            }
        };
    }
})(angular.module( 'ngTetris', [
  'templates-app',
  'templates-common',
  'ngTetris.home',
  'service.GameManager',
  'service.Keyboard',
  'ui.router',
  'pascalprecht.translate',
  'service.language'
]));