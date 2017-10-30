angular.module("adxBsApp").component('eventPhoto', {
    template:
    '<div class="row">' +
    '<div class="col-lg-12">' +
    '<form name="$ctrl.dataForm" ng-submit="$ctrl.saveData($event)">' +
    '<div class="form-group">' +
    '<label class="control-label">Event ID</label>' +
    '<input class="form-control" ng-model="$ctrl.currentData.eventId">' +
    '</div>' +
    '<div class="form-group text-center" style="position: relative;" ng-if="$ctrl.currentData">' +
    '<div class="input-area" style="height: 100px; width: 100%; border: 5px dashed #ddd; color: #ddd; border-radius: 4px;">' +
    '<span style="line-height: 100px; font-size: 18px;">' +
    '<i class="glyphicon glyphicon-camera"></i> Drag Or Click To Upload Photos' +
    '</span>' +
    '</div>' +
    '<input class="text-right form-control" type="file" sf-photos-model ng-model="$ctrl.currentData.photos" multiple style="height: 100px; opacity: 0; background: black; top: 0; position: absolute;">' +
    '</div><!-- file drag and drop area -->' +


    '<div class="schema-form-section row" ng-if="$ctrl.currentData">' +
    '<div class="form-group col-sm-6" ng-repeat="photo in $ctrl.currentData.photos">' +
    '<div class="schema-form-array  additionalItems additionalItems">' +
    '<ol class="list-group" ng-if="$ctrl.currentData.photos.length > 0">' +
    '<li class="list-group-item">' +

    '<button type="button" class="btn btn-link btn-xs pull-right" ng-click="$ctrl.removeImg($index)">' +
    '<span class="glyphicon glyphicon-minus-sign"></span>' +
    '<span class="sr-only">Close</span>' +
    '</button>' +

    '<div class="schema-form-section row">' +
    '<div class="col-sm-6">' +
    '<div class="schema-form-section">' +
    '<div class="embedj-responsive-item">' +
    '<img sf-field-model="ng-file-src" ng-file-basepath="../" width="100%" ng-file-src="photo[\'url\']" class="ng-isolate-scope" src="" />' +
    '</div>' +
    '</div>' +
    '</div><!-- col -->' +
    // '<div class="form-group col-sm-6">' +
    // '<div class="schema-form-section">' +
    // '<input class="form-control" />' +
    // '</div>' +
    // '</div><!-- col -->' +
    '</div><!-- row -->' +
    '</li>' +
    '</ol>' +
    '</div>'+
    '</div><!-- col -->' +
    '</div><!-- row -->' +


    '<div class="form-group">' +
    '<div class="btn-group" ng-if="$ctrl.currentData.uuid">' +
    '<button type="button" class="btn btn-danger" ng-click="$ctrl.viewStates.deleteVisible = !$ctrl.viewStates.deleteVisible" ng-class="{ active: $ctrl.viewStates.deleteVisible }">' +
    '<i class="glyphicon glyphicon-remove"></i>' +
    '</button>' +
    '<button type="button" class="btn btn-danger" ng-click="$ctrl.deleteData()" ng-if="$ctrl.viewStates.deleteVisible" ng-disabled="$ctrl.viewStates.delete > 0">Delete</button>' +
    '</div>' +
    '<div class="pull-right">' +
    '<button type="button" class="btn btn-default" ng-click="$ctrl.currentData = null">Cancel</button> ' +
    '<button type="submit" class="btn btn-primary" ng-disabled="$ctrl.viewStates.save > 0">Save</button>' +
    '</div>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</div>',
    bindings: {
        userForm: '<'
    },
    controller: function ($http, $localStorage, $pnotify) {
        var vm = this;
        vm.$onInit = function () {
            vm.userFormCopy = this.userForm;
        };
        vm.listState = {
            status: 0 // 0: ready, 1: loading, 2: finished
            , offset: 0
            , length: 20
        };
        vm.dataItems = [];
        vm.currentData = null;

        vm.getEvent = function (value) {
            $http.get('../service/_/Event',
                {
                    headers: {Authorization: sid ? 'Session ' + sid : undefined}
                    , params: {__range: vm.listState.offset + '-' + vm.listState.length, name_en: '/' + value + '/'}
                    , cache: false
                })
                .then(function (result) {
                    return result.data;
                }, function (result) {
                    $pnotify.error(result.data.error || 'Unable to download data items.', 'Server Error');
                });
        };

        vm.setData = function (item) {
            if (item) {
                vm.currentData = item;
            } else {
                vm.currentData = {
                    eventId: '',
                    photos: []
                }
            }
        };

        vm.removeImg = function (index) {
            vm.currentData.photos.splice(index, 1);
        };

        vm.saveData = function () {
            console.log(vm.currentData);
        };
    }
}).directive('sfPhotosModel', function () {
    function link(scope, element, attr, ngModel) {
        if (element.attr('type').toLowerCase() != 'file' || !ngModel) {
            return;
        }
        element.on('change', function (event) {
            var reader = new FileReader();
            var files = event.target.files;
            var photos = ngModel.$viewValue;
            for (var i = 0; i < event.target.files.length; i++) {
                photos.push({
                    url: files[i],
                    BIBs: []
                });
            }

            ngModel.$setViewValue(photos);
            // element.attr("value") = '';
            element[0].value = '';
            // if ( !element.attr('multiple') ) {
            //     files = files[0];
            // }
            //
            // ngModel.$setViewValue(files);
        });

        scope.$on('$destroy', function () {
            element.off('change');
        });
    }

    return {
        restrict: 'A',
        require: '?ngModel',
        link: link,
        transclude: true
    };
});