/*! generic-model-list-view.component.js | Generic data model editor with schema form. */

;(function() {'use strict';

angular.module('adxBsApp').component('genericModelListView', {
  templateUrl: 'assets/tpl/generic-model-list-view.tpl',
  controller: GenericModelListViewCtrl,
  bindings: {
    userForm: '<'
  }
});

function GenericModelListViewCtrl($q, $http, $timeout, $location, $pnotify, $localStorage, $scope) {
  var ctx = this;

  ctx.dataSchema = null;
  ctx.dataItems = [];
  ctx.currentData = null;
  ctx.listState =
    { status: 0 // 0: ready, 1: loading, 2: finished
    , offset: 0
    , length: 20
    };
  ctx.viewStates =
    { save: 0
    , delete: 0
    , deleteVisible: false
    , actionContext: {}
    };

  ctx.loadData = doDataItem;
  ctx.setData = doSetItem;
  ctx.saveData = doSaveItem;
  ctx.deleteData = doDeleteItem;

  var $onUserForm = $scope.$watch(
    function() { return ctx.userForm },
    function(nv, ov) {
      if ( nv === ov ) {
        $onUserForm();

        doDataSchema(nv);
      }
    }
  )

/*! todo; check if these are needed.

      ctx.dataItems = [];
      ctx.currentData = null;
      ctx.listState.status = 0;
      ctx.listState.offset = 0;
*/

  $scope.$watch(
    function() { return JSON.stringify(ctx.viewStates.actionContext.filter); },
    function(nv, ov) {
      if (nv !== ov) {
        $timeout(function() { $scope.$emit('list:filtered'); });
      }
    }
  );

  function doDataSchema(userForm) {
    var sid = $localStorage.session.sid;

    return $http.get('../service/_/' + userForm.module + '/schema',
      { headers: { Authorization: sid? 'Session ' + sid: undefined }
      })
      .then(onDataSchema, noDataSchema);

    function onDataSchema(response) {
      ctx.dataSchema = response.data;

      doDataItem();
    }

    function noDataSchema(response) {
      $location.path('/');
      $scope.$emit('session.invalidate');
    }
  }

  function doDataItem() {
    var ls = ctx.listState;
    var sid = $localStorage.session.sid;

    if ( ls.status > 0 ) {
      return;
    }

    ls.status = 1;

    $http.get('../service/_/' + ctx.userForm.module,
      { headers: { Authorization: sid? 'Session ' + sid: undefined }
      , params: angular.extend({ __range: ls.offset + '-' + ls.length }, ls.filter)
      , cache: false
      })
      .then(onDataItem, noDataItem);

    function onDataItem(response) {
      if ( !angular.isArray(response.data) ) {
        response.data.error = 'Malformed response from server.';
        noDataItem(response);
      }
      else {
        if ( response.data.length < ls.length ) {
          ls.status = 2;
        }
        else {
          ls.status = 0;
          ls.offset+= ls.length;
        }

        ctx.dataItems = (ctx.dataItems || []).concat(response.data);
      }
    }

    function noDataItem(response) {
      $pnotify.error(response.data.error || 'Unable to download data items.', 'Server Error');

      ls.status = 0;
    }
  }

  function resetDataItems() {
    ctx.dataItems = [];
    ctx.listState.status = 0;
    ctx.listState.offset = 0;
  }

  function doSetItem(data) {
    ctx.currentData = null;

    // note; Because json-schema-form always fuck with the supplied sfForm value,
    //       it'll never equals. We keep this line just in case they make it
    //       better in the future.
    if ( !angular.equals(ctx.formSchema, ctx.userForm.formSchema) ) {
      ctx.formSchema = angular.copy(ctx.userForm.formSchema);
    }

    $timeout(function() {
      ctx.currentData = data;
    });
  }

  function doSaveItem($event) {
    var vs = ctx.viewStates;

    $scope.$broadcast('schemaFormValidate');

    if ( !ctx.dataForm.$valid || vs.save > 0 )
      return;

    $event.preventDefault();

    vs.save = 1;

    var postUrl = '../service/_/' + ctx.userForm.module;

    if ( ctx.currentData.uuid ) {
      postUrl+= '/' + ctx.currentData.uuid;
    }

    $http.post(postUrl, ctx.currentData,
      { headers: { Authorization: 'Session ' + $localStorage.session.sid }
      })
      .then(onSaveItem, noSaveItem)
      .finally(doneSaveItem);

    function onSaveItem(response) {
      // note; Only refresh the whole list when there are data creation.
      if ( response.status == 201 ) {
        resetDataItems();
        doDataItem();
      }
      else {
        var index = ctx.dataItems.indexOf(ctx.currentData);

        if (index > -1) {
          $timeout(function() {
            ctx.dataItems.splice(index, 1, response.data);
          });
        }
      }

      doSetItem(response.data);

      $scope.$emit('data.' + ctx.userForm.module + '.update', response.data);
    }

    function noSaveItem(response) {
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

    function doneSaveItem() {
      vs.save = 0;
    }
  }

  function doDeleteItem() {
    var vs = ctx.viewStates;

    if ( vs.delete > 0 )
      return;

    vs.delete = 1;

    $http.delete('../service/_/' + ctx.userForm.module + '/' + ctx.currentData.uuid,
      { headers: { Authorization: 'Session ' + $localStorage.session.sid }
      })
      .then(onDeleteItem, noDeleteItem)
      .finally(doneDeleteItem);

    function onDeleteItem(response) {
      if ( response.data ) {
        ctx.currentData = null;
      }
    }

    function noDeleteItem(response) {
      $pnotify.error(response.data.error || 'Unable to delete this item.', 'Server Error');
    }

    function doneDeleteItem() {
      vs.delete = 0;

      ctx.currentData = null;

      ctx.viewStates.deleteVisible = false;

      resetDataItems();
      doDataItem();
    }
  }
}

})();