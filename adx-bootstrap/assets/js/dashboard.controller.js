/* dashboard.controller.js */

;(function() {'use strict';

angular.module('adxBsApp')
  .controller('DashboardCtrl', DashboardController)

function DashboardController($localStorage) {
  this.$storage = $localStorage;
}

})();
