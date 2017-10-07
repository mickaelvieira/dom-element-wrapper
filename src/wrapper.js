import whiteList from "./whiteList";

/**
* @param {Object} object
* @param {Object} props
*
* @returns {Object}
*/
function applyProperties(object, props = {}) {
  Object.keys(props).forEach(prop => {
    object[prop] = props[prop];
  });
  return object;
}

/**
* Restore the node as it was before wrapping
*
* @param {Node}  node
* @param {Array} privKeys
*
* @returns {Node}
*/
function restore(node, privKeys) {
  Object.keys(node)
    .filter(prop => privKeys.indexOf(prop) >= 0)
    .forEach(key => delete node[key]);
  return node;
}

/**
* Do not hijack methods with name matching these rules
*
* @param {String} name
*
* @returns {Boolean}
*/
function doesMethodReturnRelevantValue(name) {
  return /^(get|has|is)/.test(name) || whiteList.indexOf(name) >= 0;
}

/**
* @param {Array} subject
* @param {Array} excluded
*
* @returns {Array}
*/
function excludeValues(subject, excluded) {
  return subject.filter(value => excluded.indexOf(value) === -1);
}

/**
* @param {Node} target
* @param {Node} child
*/
function prependNode(target, child) {
  if (!target.firstChild) {
    target.appendChild(child);
  } else {
    target.insertBefore(child, target.firstChild);
  }
}

/**
* Creates and wraps a node in order to chain its methods
*
* @param {String|Node} nameOrNode
* @param {Object}      props
*
* @returns {Proxy}
*/
export default function(nameOrNode, props) {
  const node =
    typeof nameOrNode === "string"
      ? document.createElement(nameOrNode)
      : nameOrNode;

  /**
   * Caches object enumerable properties
   */
  const ownKeys = Object.keys(node);

  /**
   * Applies properties
   */
  const element = applyProperties(node, props);

  /**
   * Prepends a node to the element
   *
   * @param {String} name
   * @param {Object} props
   */
  element.prependNode = function(name, props) {
    prependNode(this, applyProperties(document.createElement(name), props));
  };

  /**
   * Appends a node to the element
   *
   * @param {String} name
   * @param {Object} props
   */
  element.appendNode = function(name, props) {
    this.appendChild(applyProperties(document.createElement(name), props));
  };

  /**
   * Prepends a child text node to the element
   *
   * @param {String} text
   */
  element.prependText = function(text) {
    prependNode(this, document.createTextNode(text));
  };

  /**
   * Appends a child text node to the element
   *
   * @param {String} text
   */
  element.appendText = function(text) {
    this.appendChild(document.createTextNode(text));
  };

  /**
   * Prepends a list of wrappers to the element
   *
   * @param {Proxy} wrappers
   */
  element.prependWrappers = function(...wrappers) {
    wrappers.forEach(wrapper => prependNode(this, wrapper.unwrap()));
  };

  /**
   * Appends a list of wrappers to the element
   *
   * @param {Proxy} wrappers
   */
  element.appendWrappers = function(...wrappers) {
    wrappers.forEach(wrapper => this.appendChild(wrapper.unwrap()));
  };

  /**
   * Revokes the proxy and restore the underlying node and return it
   *
   * @returns {Node}
   */
  element.unwrap = function() {
    revoke();
    return restore(this, privKeys);
  };

  /**
   * Retrieves lib only properties
   */
  const privKeys = excludeValues(Object.keys(node), ownKeys);

  const { proxy, revoke } = Proxy.revocable(element, {
    get: function(target, name, receiver) {
      if (!(name in target)) {
        throw new Error(`Invalid method or property name "${name}"`);
      }

      if (typeof target[name] !== "function") {
        return target[name];
      }

      return function(...args) {
        const result = target[name](...args);
        return doesMethodReturnRelevantValue(name) ? result : receiver;
      };
    },

    ownKeys: function(target) {
      return excludeValues(Object.keys(target), privKeys);
    }
  });

  return proxy;
}
