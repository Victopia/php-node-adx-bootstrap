/* generic-model.controller.js */

;(function() {'use strict';

angular.module('adxBsApp')
  .controller('GenericTplCtrl', GenericModelController);

function GenericModelController($q, $routeParams, $location, $http, $pnotify, $localStorage, $scope) {
  var $ctrl = this;

  $ctrl.userForm = null;
  $ctrl.jqParam = $.param;

  $ctrl.fetchRemote = function(url) {
    return $http.get(url)
      .then(
        function(response) {
          return response.data;
        },
        function(response) {
          if ( !response.data.error ) {
            console.error('Error fetching remote data.');
          }
        }
      );
  };

  // note; Download data schema and retrieve form schema.
  $scope.$watchCollection('forms', function(value) {
    if ( value ) {
      for (var i=0; i<value.length; i++ ) {
        if ( value[i].uuid == $routeParams.formId ) {
          $ctrl.userForm = value[i];

          $scope.$root.navTitle = 'Data: ' + value[i].title;

          doTemplate(value[i])
            .then(
              function(template) {
                $ctrl.template = template;
                return $ctrl.userForm;
              },
              function() {
                $pnotify.error('Unable to get backend template.');
              }
            );
          return;
        }
      }

      $location.path('/');
    }
    else {
      $ctrl.userForm = null;
    }
  });

  /**
   * Check which template shall we work on.
   */
  function doTemplate(userForm) {
    if ( userForm.type == 'schema' ) {
      // note; use generic model template
      return $q.resolve('<generic-model-list-view data-user-form="$ctrl.userForm"></generic-model-list-view>');
    }
    else if ( userForm.type == 'template' ) {
      return userForm.template? $q.resolve(userForm.template): $q.reject();
    }
    else if ( userForm.type == 'templateUrl' ) {
      return $http.get(userForm.templateUrl).then(function(res) { return res.data; });
    }
  }
}

})();
