'use strict';

exports.findBy = function (collection, key, value) {
  for (var i = 0; i < collection.length; i++) {
    if (collection[i][key] === value) {
      return collection[i];
    }
  }
  return null;
};
