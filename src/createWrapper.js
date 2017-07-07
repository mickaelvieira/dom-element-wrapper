import whiteList from "./whiteList";

/**
* @param {Object} object
* @param {Object} props
*
* @returns {Object}
*/
function applyProperties(object, props = {}) {
  Object.keys(props).forEach(prop => (object[prop] = props[prop]));
  return object;
}

/**
* Try to create a node with the value provided
* otherwise it returns a text node containing the name provided
*
* @param {String} value
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
* Restore the node as it was before wrapping
*
* @param {Node} node
*
* @returns {Node}
*/
function restore(node) {
  Object.keys(node).map(key => delete node[key]);
  return node;
}

/**
* @param {String} name
*
* @returns {Boolean}
*/
function doesMethodReturnRelevantValue(name) {
  return /^(get|has|is)/.test(name) || whiteList.indexOf(name) >= 0;
}

/**
* Create and wrap an Element in order to chain its methods
*
* @param {String|Node} nameOrNode
* @param {Object}      props
*
* @returns {Proxy}
*/
export default function(nameOrNode, props = {}) {
  const node =
    typeof nameOrNode === "string"
      ? document.createElement(nameOrNode)
      : nameOrNode;

  const element = applyProperties(node, props);

  /**
   * Append a node to an existing node
   *
   * @param {String} name
   * @param {Object} props
   *
   * @returns {Node}
   */
  element.appendNode = function(name, props = {}) {
    this.appendChild(applyProperties(document.createElement(name), props));
    return this;
  };

  /**
   * Append a text node to an existing node
   *
   * @param {String} text
   *
   * @returns {Node}
   */
  element.appendTextNode = function(text) {
    this.appendChild(document.createTextNode(text));
    return this;
  };

  /**
   * Append a list of wrappers to an existing node
   *
   * @param {Proxy} wrappers
   *
   * @returns {Node}
   */
  element.appendWrappers = function(...wrappers) {
    wrappers.map(wrapper => this.appendChild(wrapper.unwrap()));
    return this;
  };

  /**
   * Append multiple nodes to an existing node
   *
   * @param {String|Array|Node} children
   *
   * @returns {Node}
   */
  element.appendChildren = function(...children) {
    children.map(child => {
      if (typeof child === "string") {
        this.appendChild(tryNodeName(child));
      } else if (Array.isArray(child)) {
        this.appendNode(child[0], child[1]);
      } else {
        this.appendChild(child);
      }
    });
    return this;
  };

  /**
   * Revoke the proxy and restore the underlying node and return it
   *
   * @returns {Node}
   */
  element.unwrap = function() {
    revoke();
    return restore(this);
  };

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

    set: function(target, prop, value, receiver) {
      target[prop] = value;
      return receiver;
    }
  });

  return proxy;
}
