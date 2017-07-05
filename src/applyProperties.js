/**
* @param {Element} element
* @param {Object}  props
*
* @returns {Element}
*/
export default function(element, props = {}) {
  Object.keys(props).forEach(prop => (element[prop] = props[prop]));
  return element;
}
