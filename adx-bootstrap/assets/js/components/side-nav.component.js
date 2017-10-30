/*! side-nav.component.js | Side navigation panel. */

;(function() {'use strict';

var app = (angular.module('august.ui') || angular.module('august.ui', []));

app.run(function($templateCache) {
/* note;babel; Template
`

`
*/

});

app.component('sideNav', {
  templateUrl: 'assets/tpl/side-nav.tpl',
  controller: SideNavController,
  bindings: {
    direction: '@'
  }
});

function SideNavController() {
  var $ctrl = this;

  $ctrl.$postLink = function() {
    console.log(arguments);
  };

  $ctrl.toggleSidenav = doToggleSidenav;

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