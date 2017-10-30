/* bootstrap-file-input.js | File upload for schema form bootstrap decorator. */

angular.module('schemaForm')
  .run(function($templateCache) {
    $templateCache.put('decorators/bootstrap/fileInput.html', "<div class=\"form-group {{form.htmlClass}}\"> <label class=\"control-label {{form.labelHtmlClass}}\" ng-class=\"{'sr-only': !showTitle()}\" for=\"{{form.key.slice(-1)[0]}}\"> {{ form.title }} <\/label> <input id=\"{{form.key.slice(-1)[0]}}\" type=\"file\" sf-field-model sf-file-model accept=\"{{form.accept || '*\/*'}}\" \/> <div ng-show=\"(hasError() && errorMessage(schemaError())) || form.description\" ng-bind-html=\"(hasError() && errorMessage(schemaError())) || form.description\"><\/div> <\/div>");
  })
  .config(function (schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider, sfBuilderProvider) {
//     schemaFormProvider.defaults.string.unshift(function(name, schema, options) {
//       if ( schema.type == 'file' ) {
//         var form = schemaFormProvider.stdFormObj(name, schema, options);
//
//         form.key = options.path;
//         form.type = 'fileInput';
//
//         options.lookup[sfPathProvider.stringify(options.path)] = form;
//
//         return form;
//       }
//     });

    // Add to the bootstrap directive
    schemaFormDecoratorsProvider.defineAddOn(
      'bootstrapDecorator',
      'fileInput',
      'decorators/bootstrap/fileInput.html',
      sfBuilderProvider.stdBuilders
    );
  })
  .directive('sfFileModel', function() {
    function link(scope, element, attr, ngModel) {
      if ( element.attr('type').toLowerCase() != 'file' || !ngModel ) {
        return;
      }

      element.on('change', function(event) {
        var files = event.target.files;

        if ( !element.attr('multiple') ) {
          files = files[0];
        }

        ngModel.$setViewValue(files);
      });

      scope.$on('$destroy', function() {
        element.off('change');
      });
    }

    return { restrict: 'A'
           , require: '?ngModel'
           , link: link
           , transclude: true
           };
  });
