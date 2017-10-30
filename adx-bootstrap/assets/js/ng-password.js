/* ng-password.js | Angular password confirm matcher. */

;(function() {'use strict';

  function $Password() {
    function link(scope, element, attrs, ngModel) {
      ngModel.$validators.ngMatch = function(value) {
        return value == scope.ngMatch;
      };

      scope.$watch("ngMatch", function() {
        ngModel.$validate();
      });
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: link,
      scope: {
        ngMatch: '='
      }
    };
  }

  angular.module('ngPassword', []).directive('ngMatch', $Password);

  if (typeof module === 'object' && typeof define !== 'function') {
    module.exports = angular.module('ngPassword');
  }
})();