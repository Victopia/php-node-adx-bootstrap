<div class="container">
  <div ng-if="module.dataModel.searchSchema"
       sf-schema="{'type':'object','properties':{'':0}}"
       sf-form="module.dataModel.searchSchema"
       sf-model="module.viewStates.actionContext"></div>

  <div class="row">
    <div class="col-lg-3 col-sm-4" style="max-height: calc(100vh - 170px); overflow-y: auto;">
      <div class="list-group"
        infinite-scroll="module.loadData()"
        infinite-scroll-disabled="module.listState.status > 0"
        infinite-scroll-listen-for-event="list:filtered">
        <a href="javascript:" class="list-group-item" ng-click="module.setData({})">
          <i class="glyphicon glyphicon-plus"></i> New
        </a>

        <a href="javascript:" class="list-group-item"
          ng-repeat="(index, item) in module.dataItems | filter:module.viewStates.actionContext.filter"
          ng-click="module.setData(item)"
          ng-class="{ active: item.uuid == module.currentData.uuid }">
          <div class="list-group-item-heading">
            <b>{{item[module.dataSchema.titleField || 'title']}}</b>
          </div>

          <p class="list-group-item-text" ng-if="item[module.dataSchema.descriptionField || 'description']" style="white-space: pre-line; max-height: 5em; overflow: hidden;">{{item[module.dataSchema.descriptionField || 'description'].substr(0, 255)}}</p>
        </a>
      </div>

      <div class="text-center hidden-xs">
        <i class="glyphicon" ng-class="{ 'glyphicon-record': module.listState.status == 0, 'glyphicon-option-horizontal':  module.listState.status == 1, 'glyphicon-ok-circle':  module.listState.status == 2 }" style="font-size: 2em; color: #eee; text-shadow: 0 1px 2px #999;"></i>
      </div>
    </div>

    <div class="col-lg-9 col-sm-8">
      <form name="module.dataForm" ng-submit="module.saveData($event)" ng-if="module.dataModel && module.dataSchema && module.currentData">
        <div sf-schema="module.dataSchema" sf-form="module.dataModel.formSchema" sf-model="module.currentData"></div>

        <div class="form-group">
            <div class="btn-group" ng-if="module.currentData.uuid">
              <button type="button" class="btn btn-danger" ng-click="module.viewStates.deleteVisible = !module.viewStates.deleteVisible" ng-class="{ active: module.viewStates.deleteVisible }">
                <i class="glyphicon glyphicon-remove"></i>
              </button>

              <button type="button" class="btn btn-danger" ng-click="module.deleteData()" ng-if="module.viewStates.deleteVisible" ng-disabled="module.viewStates.delete > 0">Delete</button>
            </div>

            <div class="pull-right">
              <button type="button" class="btn btn-default" ng-click="module.currentData = null">Cancel</button>

              <button type="submit" class="btn btn-primary" ng-disabled="module.viewStates.save > 0">Save</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
