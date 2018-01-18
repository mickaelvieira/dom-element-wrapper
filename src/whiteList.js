/**
 * A list of methods that might be called on the node but they will return
 * a value so they should not return the wrapper
 */
// prettier-ignore
export default [
  // "addEventListener",
  // "after",                  // experimental
  "animate",                   // experimental
  // "append",                 // experimental
  // "appendChild",
  "attachShadow",              // experimental
  // "before",                 // experimental
  // "blur",
  // "click",
  "cloneNode",
  "closest",                   // experimental
  "compareDocumentPosition",
  "contains",
  // "createShadowRoot",
  // "dispatchEvent",
  // "focus",
  // "getAttribute",
  // "getAttributeNames",
  // "getAttributeNS",
  // "getAttributeNode",
  // "getAttributeNodeNS",
  // "getBoundingClientRect",
  // "getClientRects",
  // "getDestinationInsertionPoints",
  // "getElementsByClassName",
  // "getElementsByTagName",
  // "getElementsByTagNameNS",
  // "getRootNode",
  // "hasAttribute",
  // "hasAttributeNS",
  // "hasAttributes",
  // "hasChildNodes",
  // "hasPointerCapture",
  // "insertAdjacentElement",
  // "insertAdjacentHTML",
  // "insertAdjacentText",
  // "insertBefore",
  // "isDefaultNamespace",
  // "isEqualNode",
  // "isSameNode"
  "lookupNamespaceURI",
  "lookupPrefix",
  "matches",                   // experimental
  // "normalize",
  // "prepend",                // experimental
  "querySelector",
  "querySelectorAll",
  // "releaseCapture",
  // "releasePointerCapture",
  // "remove",                 // experimental
  // "removeAttribute",
  // "removeAttributeNS",
  // "removeAttributeNode",
  // "removeChild",
  // "removeEventListener",
  // "replaceChild",
  // "replaceWith",            // experimental
  // "requestPointerLock",     // experimental
  // "scroll",
  // "scrollBy",
  // "scrollIntoView",         // experimental
  // "scrollTo",
  // "scrollIntoViewIfNeeded", // experimental
  // "setAttribute",
  // "setAttributeNS",
  // "setAttributeNode",
  // "setAttributeNodeNS",
  // "setCapture",
  // "setPointerCapture",

  // library internal
  "unwrap"
];
