<div class="container" style="max-width: 800px;">
  <div class="panel panel-default" ng-if="!userCtx.dataSchema">
    <div class="panel-heading">
      <h2 class="panel-title">Summary</h2>
    </div>

    <div class="panel-body">
      <div class="row">
        <div class="col-md-3 col-sm-4">
          <img ng-src="{{ userCtx.user.avatars.normal || '/assets/images/avatar-blank.png' }}" width="100%"/>
        </div>

        <div class="col-md-9 col-sm-8">
          <h4>
            {{ userCtx.user.name }}

            <a href="javascript:" ng-click="userCtx.startEdit()">
              <i class="glyphicon glyphicon-pencil"></i>
            </a>
          </h4>

          {{ userCtx.user.username }}
        </div>
      </div>
    </div>
  </div>

  <form sf-schema="userCtx.dataSchema" sf-form="userCtx.formSchema" sf-model="userCtx.userClone"
    ng-if="userCtx.dataSchema" ng-submit="userCtx.update()"></form>

  <!--
    <div class="media">
      <div class="media-left">
        <img class="media-object" width="15%" alt="{{userCtx.user.name}}" ng-if="userCtx.user.avatars.medium" ng-src="{{userCtx.user.avatars.medium}}"/>
        <div class="media-object" ng-if="!userCtx.user.avatars.medium" style="background-color: grey; height: 15vw; width: 15vw;"></div>
      </div>

      <div class="media-body" ng-if="!userCtx.edit">
        <h2 class="media-heading">
          {{userCtx.user.name}}
          <a href="javascript:" class="btn btn-link" ng-click="userCtx.startEdit()">
            <i class="glyphicon glyphicon-pencil"></i>
          </a>

          <p>{{userCtx.user.email}}</p>
        </h2>
      </div>

      <div class="media-body" ng-if="userCtx.edit">
        <form name="userForm" ng-submit="userCtx.update()">
          <div class="form-inline form-group">
            <div class="form-group">
              <input type="text" class="form-control" ng-model="userCtx.userClone.first_name" placeholder="First Name" required/>
            </div>
            <div class="form-group">
              <input type="text" class="form-control" ng-model="userCtx.userClone.middle_names" placeholder="Other Names"/>
            </div>
            <div class="form-group">
              <input type="text" class="form-control" ng-model="userCtx.userClone.last_name" placeholder="Last Name" required/>
            </div>
          </div>

          <div class="form-group">
            <label for="txtEmail" class="control-label">Email</label>
            <input id="txtEmail" type="text" class="form-control" ng-model="userCtx.userClone.email"/>
          </div>

          <div class="form-group">
            <label for="txtPwd" class="control-label">Password</label>

            <div class="form-inline">
              <div class="form-group">
                <input id="txtPwd" name="pwd" type="password" class="form-control" placeholder="New Password"
                  ng-model="userCtx.userClone.password" minlength="6"/>
              </div>

              <div class="form-group" ng-class="{ 'has-error': !(userForm.cfmPwd.$error | isEmpty) }">
                <input id="txtCfmPwd" name="cfmPwd" type="password" class="form-control" placeholder="Confirm New Password"  minlength="6"
                  ng-model="userCtx.userClone.confirmPassword"
                  ng-match="userCtx.userClone.password"/>

                <span class="text-danger" ng-messages="userForm.cfmPwd.$error">
                  <span ng-message="ngMatch">Password mismatch</span>
                </span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <button type="button" class="btn btn-default" ng-click="userCtx.stopEdit()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  -->
</div>
