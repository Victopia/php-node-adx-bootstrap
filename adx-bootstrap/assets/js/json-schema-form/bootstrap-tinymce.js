angular.module("schemaForm")
  .run(function($templateCache) {$templateCache.put("directives/decorators/bootstrap/tinymce/tinymce.html","<div class=\"form-group\" ng-class=\"{\'has-error\': hasError()}\">\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\n  <textarea\n    tx-tinymce=\"form.tinymceOptions\"\n    sf-field-model\n    style=\"background-color: white\"\n    schema-validate=\"form\"\n  ></textarea>\n  <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");});

angular.module('schemaForm-tinymce', ['schemaForm', 'tx-tinymce']).config(
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider, sfBuilderProvider) {
    var wysiwyg = function(name, schema, options) {
      if (schema.type === 'string' && schema.format == 'html') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'wysiwyg';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.string.unshift(wysiwyg);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.defineAddOn(
      'bootstrapDecorator',
      'wysiwyg',
      'directives/decorators/bootstrap/tinymce/tinymce.html',
      sfBuilderProvider.stdBuilders
    );
  });
