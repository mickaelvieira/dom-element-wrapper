import applyProperties from "./applyProperties";

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
export default function(name, props = {}) {
  const element = applyProperties(document.createElement(name), props);

  element.appendTextNode = function(text) {
    this.appendChild(document.createTextNode(text));
  };

  element.appendNode = function(name, props = {}) {
    this.appendChild(applyProperties(document.createElement(name), props));
  };

  element.appendWrappers = function(...wrappers) {
    wrappers.map(wrapper => this.appendChild(wrapper.unwrap()));
  };

  element.unwrap = function() {
    return this;
  };

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
  };

  return new Proxy(element, {
    get: function(target, name, receiver) {
      if (!(name in target)) {
        throw new Error(`Invalid method or property name "${name}"`);
      }

      if (name === "unwrap") {
        return () => target;
      }

      if (typeof target[name] !== "function") {
        return target[name];
      }

      return function() {
        const args = Array.from(arguments);
        const result = target[name](...args);
        return /^(get|has)/.test(name) ? result : receiver;
      };
    },
    set: function(target, prop, value, receiver) {
      target[prop] = value;
      return receiver;
    }
  });
}
