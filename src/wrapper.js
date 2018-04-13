import whiteList from "./whiteList";

const attributes = ["class", "tabindex"];
const isData = name => name.startsWith("data");
const isAria = name => name.startsWith("aria") || name === "role";
const isAttribute = name => attributes.includes(name);
const isFunction = fn => typeof fn !== "function";
const isTrapped = name => Reflect.ownKeys(traps).includes(name);

const traps = Object.freeze({
  prepend: function(...children) {
    children.forEach(child =>
      this.prepend(typeof child.unwrap === "function" ? child.unwrap() : child)
    );
  },

  append: function(...children) {
    children.forEach(child =>
      this.append(typeof child.unwrap === "function" ? child.unwrap() : child)
    );
  }
});

/**
 * @param {Object} object
 * @param {Object} props
 *
 * @returns {Object}
 */
const applyProperties = (object, props = {}) => {
  Reflect.ownKeys(props).forEach(prop => {
    if (isAria(prop) || isData(prop) || isAttribute(prop)) {
      object.setAttribute(prop, props[prop]);
    } else {
      object[prop] = props[prop];
    }
  });
  return object;
};

/**
 * Restore the node as it was before wrapping
 *
 * @param {Node}  node
 * @param {Array} privKeys
 *
 * @returns {Node}
 */
const restore = (node, privKeys) => {
  Reflect.ownKeys(node)
    .filter(prop => privKeys.includes(prop))
    .forEach(key => delete node[key]);
  return node;
};

/**
 * Do not hijack methods with name matching these rules
 *
 * @param {String} name
 *
 * @returns {Boolean}
 */
const doesMethodReturnRelevantValue = name =>
  /^(get|has|is)/.test(name) || whiteList.includes(name);

/**
 * @param {Array} subject
 * @param {Array} excluded
 *
 * @returns {Array}
 */
const excludeValues = (subject, excluded) =>
  subject.filter(value => !excluded.includes(value));

/**
 * @param {Node} target
 * @param {Node} child
 */
function prependChild(target, child) {
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
  const ownKeys = Reflect.ownKeys(node);

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
    prependChild(this, applyProperties(document.createElement(name), props));
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
    prependChild(this, document.createTextNode(text));
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
    wrappers.forEach(wrapper => prependChild(this, wrapper.unwrap()));
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
  const privKeys = excludeValues(Reflect.ownKeys(node), ownKeys);

  /**
   * Creates the proxy
   */
  const { proxy, revoke } = Proxy.revocable(element, {
    get: function(target, name, receiver) {
      if (!Reflect.has(target, name)) {
        throw new Error(`Invalid method or property name "${name}"`);
      }

      if (isFunction(target[name])) {
        return Reflect.get(target, name);
      }

      if (isTrapped(name)) {
        return function(...args) {
          traps[name].call(target, ...args);
          return receiver;
        };
      }

      return function(...args) {
        const result = Reflect.apply(target[name], target, args);
        return doesMethodReturnRelevantValue(name) ? result : receiver;
      };
    },

    ownKeys: function(target) {
      return excludeValues(Reflect.ownKeys(target), privKeys);
    }
  });

  return proxy;
}
