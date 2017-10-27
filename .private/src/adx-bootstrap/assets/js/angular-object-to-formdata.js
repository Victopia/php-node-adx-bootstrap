/* angular-object-to-formdata.js | Angular object to FormData conversion service. */

;(function() {'use strict';

angular.module('common.utils', [])
  .factory('objectToFormData', function() {
    return objectToFormData;
  })
  .factory('$multipartInterceptor', function() {
    return {
      request: interceptMultipartRequest
    };
  });

/**
 * Recursively checks of an object contains a File
 */
function objectHasFile(data) {
  if ( angular.isObject(data) ) {
    if ( (data instanceof File) || (data instanceof FileList) ) {
      return true;
    }

    for ( var property in data ) {
      if ( objectHasFile(data[property]) ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Takes a {} object and returns a FormData object.
 */
function objectToFormData(obj, formData, namespace) {
  var formKey;

  if ( !formData ) {
    formData = new FormData();
  }

  if ( !angular.isObject(obj) || (obj instanceof File) ) {
    // note; php-node framework specific encoding for primitive types.
    if ( obj === null ) {
      obj = '__null';
    }
    else if ( obj === true ) {
      obj = '__true';
    }
    else if ( obj === false ) {
      obj = '__false';
    }

    formData.append(namespace, obj);
  }
  else {
    angular.forEach(obj, function(value, property) {
      if (!/^\$/.test(property)) {
        if (namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }

        objectToFormData(value, formData, formKey);
      }
    });

    for (var property in obj) {
    }
  }

  return formData;
};

/**
 * Transform request with payloads which contain File instances into a multipart/form-data request.
 */
function transformMultipartRequest(data, headersGetter) {
  var headers = headersGetter();

  if ( /^multipart\/form\-data/.test(headers['Content-Type']) ) {
    return objectToFormData(data);
  }

  return data;
}

function interceptMultipartRequest(config) {
  if ( String(config.method).toLowerCase() == 'post' ) {
    if ( objectHasFile(config.data) ) {
      delete config.headers['Content-Type'];
      config.data = objectToFormData(config.data);
      config.transformRequest = angular.identity;
    }
  }

  return config;
}

})();
