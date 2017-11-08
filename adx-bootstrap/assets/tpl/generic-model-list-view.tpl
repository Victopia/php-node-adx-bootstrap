<div class="container-fluid">
  <div ng-if="$ctrl.userForm.searchSchema"
       sf-schema="{'type':'object','properties':{'':0}}"
       sf-form="$ctrl.userForm.searchSchema"
       sf-model="$ctrl.viewStates.actionContext"></div>

  <div class="row">
    <div class="col-lg-3 col-sm-4" style="max-height: calc(100vh - 170px); overflow-y: auto;">
      <div class="list-group"
        infinite-scroll="$ctrl.loadData()"
        infinite-scroll-disabled="$ctrl.listState.status > 0 || !$ctrl.dataSchema"
        infinite-scroll-listen-for-event="list:filtered">
        <a href="javascript:" class="list-group-item" ng-click="$ctrl.setData({})">
          <i class="glyphicon glyphicon-plus"></i> New
        </a>

        <a href="javascript:" class="list-group-item"
          ng-repeat="(index, item) in $ctrl.dataItems | filter:$ctrl.viewStates.actionContext.filter"
          ng-click="$ctrl.setData(item)"
          ng-class="{ active: item.uuid == $ctrl.currentData.uuid }">
          <div class="list-group-item-heading">
            <b>{{item[$ctrl.dataSchema.titleField || 'title']}}</b>
          </div>

          <p class="list-group-item-text" ng-if="item[$ctrl.dataSchema.descriptionField || 'description']" style="white-space: pre-line; max-height: 5em; overflow: hidden;">{{item[$ctrl.dataSchema.descriptionField || 'description'].substr(0, 255)}}</p>
        </a>
      </div>

      <div class="text-center hidden-xs">
        <i class="glyphicon"
          ng-class="
            { 'glyphicon-record': $ctrl.listStates.status == 0
            , 'glyphicon-option-horizontal':  $ctrl.listStates.status == 1
            , 'glyphicon-ok-circle':  $ctrl.listStates.status == 2 }"
          style="
            font-size: 2em;
            color: #eee;
            text-shadow: 0 1px 2px #999;"
          ></i>
      </div>
    </div>

    <div class="col-lg-9 col-sm-8">
      <form name="$ctrl.dataForm" ng-submit="$ctrl.saveData($event)" ng-if="$ctrl.dataSchema && $ctrl.currentData">
        <div sf-schema="$ctrl.dataSchema" sf-form="$ctrl.formSchema || $ctrl.userForm.formSchema" sf-model="$ctrl.currentData"></div>

        <div class="form-group">
            <div class="btn-group" ng-if="$ctrl.currentData.uuid">
              <button type="button" class="btn btn-danger" ng-click="$ctrl.viewStates.deleteVisible = !$ctrl.viewStates.deleteVisible" ng-class="{ active: $ctrl.viewStates.deleteVisible }">
                <i class="glyphicon glyphicon-remove"></i>
              </button>

              <button type="button" class="btn btn-danger" ng-click="$ctrl.deleteData()" ng-if="$ctrl.viewStates.deleteVisible" ng-disabled="$ctrl.viewStates.delete > 0">Delete</button>
            </div>

            <div class="pull-right">
              <button type="button" class="btn btn-default" ng-click="$ctrl.currentData = null">Cancel</button>

              <button type="submit" class="btn btn-primary" ng-disabled="$ctrl.viewStates.save > 0">Save</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
