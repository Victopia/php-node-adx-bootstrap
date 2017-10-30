// note; Original source has been heavily customized for a specific project, requires trimming before putting here.

(function() {"use strict";
angular.module("adxBsApp", [
  "ngRoute",
  "ngMessages",
  "ngStorage",
  "angular-bind-html-compile",
  "common.utils",
  "jlareau.pnotify",
  "infinite-scroll",
  "schemaForm",
  "ui.ace",
  "schemaForm-tinymce",
  "ngPassword"
])
.config(appConfig)
.run(appRun)
.filter("isEmpty", function() {
  return function(input) {
    if (angular.isArray(input)) {
      return input.length == 0;
    } else if (angular.isObject(input)) {
      var keys = 0;
      for (var i in input) keys++;
      return keys == 0;
    } else {
      return !input;
    }
  };
});

function appConfig($httpProvider, $pnotifyProvider) {
  $httpProvider.interceptors.push("$multipartInterceptor");
  $pnotifyProvider
    .setDefaults({
      styling: "bootstrap3",
      nonblock: { nonblock: true, nonblock_opacity: 0.2 },
      buttons: { closer: false, sticker: false }
    })
    .setStack("default", {
      dir1: "down",
      dir2: "left",
      push: "bottom",
      spacing1: 12,
      spacing2: 12,
      context: $("body")
    })
    .setStack("modal", { dir1: "down", dir2: "left", modal: true })
    .setDefaultStack("default");

  if (typeof tv4 != 'undefined') {
    tv4.language('zh-TW');
  }
}

function appRun($rootScope, $localStorage, $location, $pnotify) {
  $rootScope.$on("$routeChangeSuccess", function(current, previous) {
    $rootScope.navTitle = current.navTitle;
  });
  if ($localStorage.session) {
    var $onSessionEnsure = $rootScope.$on("$sessionEnsure", function() {
      $onSessionEnsure();
    });
    var $onSessionInvalidate = $rootScope.$on(
      "$sessionInvalidate",
      function() {
        $onSessionInvalidate();
        $location.path("/");
      }
    );
  } else {
    $location.path("/");
  }
}
})();
