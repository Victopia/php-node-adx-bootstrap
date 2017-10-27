/* user.controller.js | Controller for user login context. */

;(function() {'use strict';

angular
  .module('adxBsApp')
  .controller('UserCtrl', UserController);

function UserController($scope, $http, $timeout, $localStorage, $pnotify) {
  var ctx = this;

  ctx.$viewStates = {};

  ctx.user = null;
  ctx.session = null;
  ctx.formSchema =
    [ { "type": "section"
      , "htmlClass": "panel panel-default"
      , "items":
        [ { "type": "template"
          , "template": "<div class='panel-heading'><h2 class='panel-title'>Summary</h2></div>"
          }
        , { "type": "section"
          , "htmlClass": "panel-body"
          , "items":
            [ { "type": "section"
              , "htmlClass": "row"
              , "items":
                [ { "type": "section"
                  , "htmlClass": "col-md-3 col-sm-4"
                  , "items":
                    [ { "key": "avatar"
                      , "type": "fileInput"
                      , "title": "Avatar"
                      }
                    , { "key": "avatar"
                      , "type": "thumbnail"
                      , "condition": "model.avatar"
                      , "notitle": true
                      }
                    ]
                  }
                , { "type": "section"
                  , "htmlClass": "col-md-9 col-sm-8"
                  , "items":
                    [ { "type": "template"
                      , "template": "<div class='form-group'><label class='control-label'>Email</label><p class='form-control-static'>{{model.username}} <span class='text-success' ng-if='model.verified'><i class='glyphicon glyphicon-ok'></i> Verified</span></p></div>"
                      }
                    , { "key": "first_name"
                      , "notitle": true
                      }
                    , { "key": "last_name"
                      , "notitle": true
                      }
                    ]
                  }
                ]
              }
            ]
          }
        , { "type": "template"
          , "template": "<div class='panel-heading'><h2 class='panel-title'>Update Password</h2></div>"
          }
        , { "type": "section"
          , "htmlClass": "panel-body"
          , "items":
            [ { "key": "password"
              , "type": "password"
              , "placeholder": "New Password"
              , "required": false
              }
            , { "key": "password_confirm"
              , "type": "password"
              , "placeholder": "Confirm New Password"
              , "ngModel": function(ngModel) {
                  ngModel.$validators.ngMatch = function(value) {
                    return value == (ctx.userClone || {}).password;
                  };
                }
              , "validationMessage":
                { "ngMatch": "Confirm password mismatch"
                }
              }
            ]
          }
        , { "type": "section"
          , "htmlClass": "panel-footer"
          , "items":
            [ { "type": "section"
              , "htmlClass": "btn-toolbar"
              , "items":
                [ { "type": "button"
                  , "title": "Cancel"
                  , "onClick": "userCtx.stopEdit()"
                  }
                , { "type": "submit"
                  , "title": "Save"
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

  ctx.login = doLogin;
  ctx.logout = doLogout;
  ctx.update = doUpdateUser;
  ctx.startEdit = startEdit;
  ctx.stopEdit = stopEdit;

  // note; realtime update on user forms.
  $scope.$root.$on('data.UserForm.update', function(event, userForm) {
    if ($scope.$root.forms) {
      var formsId = $scope.$root.forms.map(function(form) {
        return form.uuid;
      });

      var index = formsId.indexOf(userForm.uuid);

      if ( index > -1 ) {
        $scope.$root.forms.splice(index, 1, userForm);
      }
    }
  });

  if ( $localStorage.session ) {
    doEnsure();
  }

  $scope.$root.$on('session.invalidate', doLogout);
  $scope.$root.$on('session.ensure', doEnsure);

  function doLogin(username, password) {
    $http.post('../service/sessions/validate/', { username: username, password: password })
      .then(onLogin, noLogin);

    function onLogin(res) {
      // todo; Assign the sid into local storage
      ctx.session = $localStorage.session = res.data;

      doUser();
      doUserForm();

      $scope.$emit('$sessionValidate');
    }

    function noLogin(res) {
      // todo; Prompt user about the error
      // note;dev; try ngMessage
      $pnotify.error(res.data.error);
    }
  }

  function doLogout() {
    var session = ctx.session || $localStorage.session || {};

    // note; Invalidate current session
    if ( session.sid ) {
      $http.post('../service/sessions/invalidate', { headers: { Authorization: 'Session ' + session.sid } })
        .finally(doneLogout);
    }

    function doneLogout() {
      ctx.session = null;

      delete $scope.$root.forms;
      delete $localStorage.session;

      $scope.$emit('$sessionInvalidate');
    }
  }

  function doEnsure() {
    if ( $localStorage.session ) {
      if ( new Date($localStorage.session.expires).getTime() > Date.now() ) {
        $http.get('../service/sessions/ensure/', { headers: { Authorization: 'Session ' + $localStorage.session.sid } })
          .then(onEnsure, noEnsure);
      }
      else {
        // note; expired, remove the session.
        delete $localStorage.session;
      }
    }

    function onEnsure(res) {
      ctx.session = $localStorage.session = res.data;

      doUser();
      doUserForm();

      $scope.$emit('$sessionEnsure');
    }

    function noEnsure() {
      // $pnotify.error('Unable to ensure session id, invalidating.');
      console.debug('Session expired, logging out.');

      ctx.session = null;

      delete $scope.$root.forms;
      delete $localStorage.session;

      $scope.$emit('$sessionInvalidate');
    }
  }

  function doUser() {
    $http.get('../service/_/User/~', { headers: { Authorization: 'Session ' + $localStorage.session.sid } })
      .then(onUser, noUser);

    function onUser(response) {
      ctx.user = response.data;
    }

    function noUser(response) {
      $pnotify.error(response.data.error || 'Error getting user details.', 'Server Error');
    }
  }

  function doUserForm() {
    $http.get('../service/_/UserForm',
      { headers: { Authorization: 'Session ' + $localStorage.session.sid }
      , params: { __range: '0-65535' }
      })
      .then(onUserForm, noUserForm);

    function onUserForm(response) {
      if ( angular.isArray(response.data) ) {
        $scope.$root.forms = response.data;
      }
      else {
        response.data.error = 'Malformed server response.';
        response.noRetry = true;

        noUserForm(response);
      }
    }

    function noUserForm(response) {
      $pnotify.error(response.data.error || 'Error getting user forms, retrying ...', 'Server Error');

      if ( !response.noRetry ) {
        $timeout(doUserForm, 1000);
      }
    }
  }

  function startEdit() {
    if ( ctx.$viewStates.editFormLoading ) {
      return;
    }

    ctx.$viewStates.editFormLoading = true;

    $http.get('../service/_/User/schema', { headers: { Authorization: 'Session ' + $localStorage.session.sid } })
      .then(onUserSchema, noUserSchema)
      .finally(doneUserSchema);

    function onUserSchema(response) {
      ctx.dataSchema = response.data;
      ctx.userClone = angular.copy(ctx.user);

      // note; for easy front end binding.
      if (ctx.userClone.avatars) {
        ctx.userClone.avatar = '../' + ctx.userClone.avatars.optimize;
      }
    }

    function noUserSchema() {
      $pnotify.error('Cannot download user schema, please try again.');
    }

    function doneUserSchema() {
      delete ctx.$viewStates.editFormLoading;
    }
  }

  function stopEdit() {
    delete ctx.userClone;
    delete ctx.dataSchema;
  }

  function doUpdateUser() {
    delete ctx.userClone.password_confirm;

    if ( angular.isString(ctx.userClone.avatar) ) {
      delete ctx.userClone.avatar;
    }

    // todo; Invoke REST API calls
    $http.post('../service/_/User/~', ctx.userClone)
      .then(onUpdateUser, noUpdateUser);

    function onUpdateUser(response) {
      ctx.user = response.data;

      delete ctx.user.password;
      delete ctx.userClone;
      delete ctx.dataSchema;
    }

    function noUpdateUser(response) {
      $pnotify.error(response.data.error || 'Error updating user info.', 'Server Error');
    }
  }
}

})();
