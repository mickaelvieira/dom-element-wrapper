(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.elementWrapper = factory());
}(this, (function () { 'use strict';

/**
* @param {Element} element
* @param {Object}  props
*
* @returns {Element}
*/
var applyProperties = function (element) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  Object.keys(props).forEach(function (prop) {
    return element[prop] = props[prop];
  });
  return element;
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
* Try to create a node with the value provided
* otherwise it returns a text node containing the name provided
*
* @param {string} value
*
* @returns {Node}
*/
function tryNodeName(value) {
  try {
    return document.createElement(value);
  } catch (e) {
    return document.createTextNode(value);
  }
}

/**
* Create and wrap an Element in order to chain its methods
*
* @param {String} name
* @param {Object} props
*
* @returns {Proxy}
*/
var createWrapper = function (name) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var element = applyProperties(document.createElement(name), props);

  element.appendTextNode = function (text) {
    this.appendChild(document.createTextNode(text));
  };

  element.appendNode = function (name) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.appendChild(applyProperties(document.createElement(name), props));
  };

  element.appendWrappers = function () {
    var _this = this;

    for (var _len = arguments.length, wrappers = Array(_len), _key = 0; _key < _len; _key++) {
      wrappers[_key] = arguments[_key];
    }

    wrappers.map(function (wrapper) {
      return _this.appendChild(wrapper.unwrap());
    });
  };

  element.unwrap = function () {
    return this;
  };

  element.appendChildren = function () {
    var _this2 = this;

    for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      children[_key2] = arguments[_key2];
    }

    children.map(function (child) {
      if (typeof child === "string") {
        _this2.appendChild(tryNodeName(child));
      } else if (Array.isArray(child)) {
        _this2.appendNode(child[0], child[1]);
      } else {
        _this2.appendChild(child);
      }
    });
  };

  return new Proxy(element, {
    get: function get(target, name, receiver) {
      if (!(name in target)) {
        throw new Error("Invalid method or property name \"" + name + "\"");
      }

      if (name === "unwrap") {
        return function () {
          return target;
        };
      }

      if (typeof target[name] !== "function") {
        return target[name];
      }

      return function () {
        var args = Array.from(arguments);
        var result = target[name].apply(target, _toConsumableArray(args));
        return (/^(get|has)/.test(name) ? result : receiver
        );
      };
    },
    set: function set(target, prop, value, receiver) {
      target[prop] = value;
      return receiver;
    }
  });
};

var index = {
  createWrapper: createWrapper,
  applyProperties: applyProperties
};

return index;

})));
