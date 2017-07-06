/**
* @param {Object} object
* @param {Object} props
*
* @returns {Object}
*/
export default function(object, props = {}) {
  Object.keys(props).forEach(prop => (object[prop] = props[prop]));
  return object;
}
