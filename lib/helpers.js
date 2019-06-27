const _get = (obj, path, defaultValue = null) =>
  String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (a, c) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue),
      obj
    );

module.exports = { _get };
