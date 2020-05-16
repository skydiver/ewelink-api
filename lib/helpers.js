const nonceLib = require('nonce')();

const nonce = nonceLib();

const timestamp = Math.floor(new Date() / 1000);

const _get = (obj, path, defaultValue = null) =>
  String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (a, c) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue),
      obj
    );

module.exports = {
  nonce,
  timestamp,
  _get,
};
