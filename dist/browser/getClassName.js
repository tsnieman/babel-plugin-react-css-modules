'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var DEFAULT_HANDLE_MISSING_STYLENAME_OPTION = 'throw';

var isNamespacedStyleName = function isNamespacedStyleName(styleName) {
  return styleName.indexOf('.') !== -1;
};

var getClassNameForNamespacedStyleName = function getClassNameForNamespacedStyleName(styleName, styleModuleImportMap, handleMissingStyleNameOption) {
  // Note:
  // Do not use the desctructing syntax with Babel.
  // Desctructing adds _slicedToArray helper.
  var styleNameParts = styleName.split('.');
  var importName = styleNameParts[0];
  var moduleName = styleNameParts[1];
  var handleMissingStyleName = handleMissingStyleNameOption || DEFAULT_HANDLE_MISSING_STYLENAME_OPTION;

  if (!moduleName) {
    if (handleMissingStyleName === 'throw') {
      throw new Error('Invalid style name.');
    } else if (handleMissingStyleName === 'warn') {
      // eslint-disable-next-line no-console
      console.warn('Invalid style name.');
    } else {
      return null;
    }
  }

  if (!styleModuleImportMap[importName]) {
    if (handleMissingStyleName === 'throw') {
      throw new Error('CSS module import does not exist.');
    } else if (handleMissingStyleName === 'warn') {
      // eslint-disable-next-line no-console
      console.warn('CSS module import does not exist.');
    } else {
      return null;
    }
  }

  if (!styleModuleImportMap[importName][moduleName]) {
    if (handleMissingStyleName === 'throw') {
      throw new Error('CSS module does not exist.');
    } else if (handleMissingStyleName === 'warn') {
      // eslint-disable-next-line no-console
      console.warn('CSS module does not exist.');
    } else {
      return null;
    }
  }

  return styleModuleImportMap[importName][moduleName];
};

exports.default = function (styleNameValue, styleModuleImportMap, options) {
  var styleModuleImportMapKeys = Object.keys(styleModuleImportMap);

  var handleMissingStyleName = options && options.handleMissingStyleName || DEFAULT_HANDLE_MISSING_STYLENAME_OPTION;

  return styleNameValue.split(' ').filter(function (styleName) {
    return styleName;
  }).map(function (styleName) {
    var includedStyleModuleImportMapKeys = styleModuleImportMapKeys.filter(function (x) {
      var shouldBeIncluded = true;

      var satisfiesInclude = x.match(new RegExp(options.include));
      if (options.include && !satisfiesInclude) shouldBeIncluded = false;

      var satisfiesExclude = x.match(new RegExp(options.exclude));
      if (options.exclude && satisfiesExclude) shouldBeIncluded = false;

      return shouldBeIncluded;
    });

    if (isNamespacedStyleName(styleName)) {
      return getClassNameForNamespacedStyleName(styleName, styleModuleImportMap, handleMissingStyleName);
    }

    if (includedStyleModuleImportMapKeys.length === 0) {
      throw new Error('Cannot use styleName attribute without importing at least one stylesheet.');
    }

    if (includedStyleModuleImportMapKeys.length > 1) {
      throw new Error('Cannot use anonymous style name with more than one stylesheet import.');
    }

    var styleModuleMap = styleModuleImportMap[styleModuleImportMapKeys[0]];

    if (!styleModuleMap[styleName]) {
      if (handleMissingStyleName === 'throw') {
        throw new Error('Could not resolve the styleName \'' + styleName + '\'.');
      }
      if (handleMissingStyleName === 'warn') {
        // eslint-disable-next-line no-console
        console.warn('Could not resolve the styleName \'' + styleName + '\'.');
      }
    }

    return styleModuleMap[styleName];
  }).filter(function (className) {
    // Remove any styles which could not be found (if handleMissingStyleName === 'ignore')
    return className;
  }).join(' ');
};

//# sourceMappingURL=getClassName.js.map