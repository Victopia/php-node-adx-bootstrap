/* app.routes.js | Angular routes definition. */

;(function() {'use strict';

angular.module('adxBsApp').config(appConfig);

function appConfig($routeProvider, $locationProvider, $httpProvider) {
  $httpProvider.defaults.cache = true;

  $routeProvider
    .when('/', {
      templateUrl: 'assets/tpl/dashboard.tpl',
      controller: 'DashboardCtrl',
      controllerAs: 'ctx',
      isHome: true
    })
    .when('/account', {
      templateUrl: 'assets/tpl/user-account.tpl',
      controller: 'UserCtrl',
      controllerAs: 'userCtx'
    })
    // note; Generic route for most module pages
    // note;dev; Additional features may be added in the "resolve" object.
    .when('/g/:formId', {
      template: '<div bind-html-compile="$ctrl.template"></div>',
      controller: 'GenericTplCtrl',
      controllerAs: '$ctrl',
      resolve: {
        session: function($localStorage) {
          return $localStorage.session || {};
        }
      }
    })
    // note; Most flexible template which only has one element
//     .when('/t/:formId', {
//       template: '<ng-include src="module.userForm.templateHref"></ng-include>',
//       controller: 'GenericTemplateCtrl',
//       controllerAs: 'module'
//     })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
}

})();
