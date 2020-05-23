const nonce = Math.random()
  .toString(36)
  .slice(5);

const timestamp = Math.floor(new Date() / 1000);

const _get = (obj, path, defaultValue = null) =>
  String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (a, c) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue),
      obj
    );

const _empty = obj => Object.entries(obj).length === 0;

const toQueryString = object =>
  `?${Object.keys(object)
    .map(key => `${key}=${object[key].toString()}`)
    .join('&')}`;

module.exports = {
  nonce,
  timestamp,
  _get,
  _empty,
  toQueryString,
};
