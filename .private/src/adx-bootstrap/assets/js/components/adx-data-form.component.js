/*! adx-data-form.component.js | Schema form as a component. */

;(function() {'use strict';

angular.module('adxBsApp').component('adxDataForm', {
/*! note;babel; The component template code.
  template: `
<div class="modal" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close"
          ng-disabled="$ctrl.viewStates.save || $ctrl.viewStates.delete"
          ng-click="$ctrl.close()">&times;</button>

        <h4 class="modal-title">Edit</h4>
      </div>

      <div class="modal-body">
        <form name="$ctrl.dataForm" ng-submit="$ctrl.save($event)" ng-if="$ctrl.ngModel">
          <div sf-schema="$ctrl.schema" sf-form="$ctrl.form || ['*']" sf-model="$ctrl.ngModel"></div>

          <div class="form-group clearfix">
              <div class="btn-group" ng-if="$ctrl.ngModel.uuid">
                <button type="button" class="btn btn-danger"
                  ng-click="$ctrl.viewStates.deleteVisible = !$ctrl.viewStates.deleteVisible"
                  ng-class="{ active: $ctrl.viewStates.deleteVisible }">
                  <i class="glyphicon glyphicon-trash"></i>
                </button>

                <button type="button" class="btn btn-danger"
                  ng-click="$ctrl.delete()"
                  ng-if="$ctrl.viewStates.deleteVisible"
                  ng-disabled="$ctrl.viewStates.delete > 0">Delete</button>
              </div>

              <div class="pull-right">
                <button type="submit" class="btn btn-primary" ng-disabled="$ctrl.viewStates.save > 0">Save</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>`,
*/
  template: "<div class=\"modal\" role=\"dialog\">\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\"\n          ng-disabled=\"$ctrl.viewStates.save || $ctrl.viewStates.delete\"\n          ng-click=\"$ctrl.close()\">&times;</button>\n\n        <h4 class=\"modal-title\">Edit</h4>\n      </div>\n\n      <div class=\"modal-body\">\n        <form name=\"$ctrl.dataForm\" ng-submit=\"$ctrl.save($event)\" ng-if=\"$ctrl.ngModel\">\n          <div sf-schema=\"$ctrl.schema\" sf-form=\"$ctrl.form || ['*']\" sf-model=\"$ctrl.ngModel\"></div>\n\n          <div class=\"form-group clearfix\">\n              <div class=\"btn-group\" ng-if=\"$ctrl.ngModel.uuid\">\n                <button type=\"button\" class=\"btn btn-danger\"\n                  ng-click=\"$ctrl.viewStates.deleteVisible = !$ctrl.viewStates.deleteVisible\"\n                  ng-class=\"{ active: $ctrl.viewStates.deleteVisible }\">\n                  <i class=\"glyphicon glyphicon-trash\"></i>\n                </button>\n\n                <button type=\"button\" class=\"btn btn-danger\"\n                  ng-click=\"$ctrl.delete()\"\n                  ng-if=\"$ctrl.viewStates.deleteVisible\"\n                  ng-disabled=\"$ctrl.viewStates.delete > 0\">Delete</button>\n              </div>\n\n              <div class=\"pull-right\">\n                <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"$ctrl.viewStates.save > 0\">Save</button>\n              </div>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>",
  controller: ModelDataFormController,
  require: 'ngModel',
  bindings: {
    id: '@',
    endpoint: '@',
    schema: '<',
    form: '<',
    ngModel: '=',
    onPost: '&',
    onDelete: '&',
    onClose: '&'
  }
});

function ModelDataFormController($interpolate, $scope, $timeout, $http, $pnotify) {
  var $ctrl = this
    , $pane = $('#' + $ctrl.id).find('.modal');

  $ctrl.viewStates =
    { save: 0
    , delete: 0
    , deleteVisible: false
    };

  $ctrl.save = doSaveItem;
  $ctrl.delete = doDeleteItem;
  $ctrl.close = doClosePanel;

  $pane.modal({
    backdrop: 'static',
    keyboard: false,
    show: false
  });

  $scope.$watch(
    function() { return $ctrl.ngModel },
    function(value) { if ( value && !$ctrl.viewStates.closing ) $pane.modal('show') }
  );

  $scope.$root.$on('$routeChangeSuccess', function() {
    doClosePanel();
  });

  $pane.on('hidden.bs.modal', function() {
    $timeout(function() {
      $ctrl.onClose();
    });
  });

  function doClosePanel() {
    $ctrl.viewStates.closing = true;

    $pane.modal('hide');
  }

  function doSaveItem($event) {
    var vs = $ctrl.viewStates;

    $scope.$broadcast('schemaFormValidate');

    if ( !$ctrl.dataForm.$valid || vs.save > 0 )
      return;

    $event.preventDefault();

    vs.save = 1;

    var endpoint = $ctrl.endpoint.replace(/\{([^\{\}]+)\}/g, '{{$1}}');

    endpoint = $interpolate(endpoint)($ctrl.ngModel); // ../service/_/User/{{uuid}}?__sid=

    $http.post(endpoint, $ctrl.ngModel)
      .then(onSave, noSave)
      .finally(doneSave);

    function onSave(response) {
      // note; Only refresh the whole list when there are data creation.
      if ( response.status == 201 ) {
        doReloadItems();
      }

      $ctrl.ngModel = response.data;

      $ctrl.onPost({
        $response: response
      });

      doClosePanel();
    }

    function noSave(response) {
      if ( response.data.errors ) {
        var errors = [];

        angular.forEach(response.data.errors, function(value, key) {
          errors.push(key + ': ' + value);
        });

        $pnotify.error(errors.join('\n'), 'Invalid Data Input');
      }
      else {
        $pnotify.error(response.data.error || 'Unable to save data.', 'Server Error');
      }
    }

    function doneSave() {
      vs.save = 0;
    }
  }

  function doDeleteItem() {
    var vs = $ctrl.viewStates;

    if ( vs.delete > 0 )
      return;

    vs.delete = 1;

    var endpoint = $ctrl.endpoint.replace(/\{([^\{\}]+)\}/g, '{{$1}}');

    endpoint = $interpolate(endpoint)($ctrl.ngModel); // ../service/_/User/{{uuid}}?__sid=

    $http.delete(endpoint)
      .then(onDeleteItem, noDeleteItem)
      .finally(doneDeleteItem);

    function onDeleteItem(response) {
      if ( response.data ) {
        $ctrl.ngModel = null;

        $ctrl.onDelete({
          $response: response
        });

        doClosePanel();
      }
    }

    function noDeleteItem(response) {
      $pnotify.error(response.data.error || 'Unable to delete this item.', 'Server Error');
    }

    function doneDeleteItem() {
      vs.delete = 0;
      vs.deleteVisible = false;
    }
  }

}

})();
