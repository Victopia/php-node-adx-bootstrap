/*! app.controller.js | Main application controller. */

;(function() {'use strict';

angular
  .module('adxBsApp')
  .controller('AppCtrl', AppController);

function AppController($localStorage, $scope) {
  var ctx = this;

  // todo; watch for sid in local storage
  // todo; unload :everything when sid is being removed
  // todo; load :everything if sid is being assigned

  /* note;dev;

  :everything means,
  1. Accessible modules (side nav)
  2. Redirect to dashboard (ngRoute)

  */

  ctx.$storage = $localStorage;
  ctx.sidenavVisible = false;

  ctx.toggleSidenav = doToggleSidenav;

  $scope.$root.$on('$routeChangeSuccess', function(evt, current, prev) {
    ctx.sidenavVisible = false;

    ctx.$route = current;
  });

  function doToggleSidenav(value, $event) {
    if ( $event && !$event.target.querySelector('#navSide') || !($scope.forms || []).length ) {
      return;
    }

    if ( angular.isUndefined(value) ) {
      value = !ctx.sidenavVisible;
    }

    ctx.sidenavVisible = value;
  }
}

})();
