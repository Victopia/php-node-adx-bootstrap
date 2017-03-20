<div class="container">
  <div class="jumbotron" ng-if="!ctx.$storage.session">
    <h2>Welcome to Admin Dashboard <small>ver. 0.9.12</small></h2>
    <p>
      Please login to continue.
    </p>
  </div>

  <p ng-if="ctx.$storage.session">
    Choose a module from the menu.
  </p>
</div>
