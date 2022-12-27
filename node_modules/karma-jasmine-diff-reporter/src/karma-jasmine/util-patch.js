(function (window) {

// This monkey patch overrides Jasmine internal utility function responsible
// for comparing objects and drops support for diff builder, introduced in
// Jasmine 2.6. Brings back legacy object output, so reporter could work with it
// as before.

window.jasmine.matchersUtil = matchersUtilPatched(window.jasmine);

function matchersUtilPatched(j$) {
  var util = j$.matchersUtil;
  var oldEquals = util.equals.bind(util);

  // Below Jasmine 2.6 there is no NullDiffBuilder class
  if (typeof j$.NullDiffBuilder === 'undefined') {
    return util;
  }

  var newEquals = function (a, b, customTesters, diffBuilder) {
    return oldEquals(a, b, customTesters, j$.NullDiffBuilder());
  };

  util.equals = newEquals;

  return util;
}

}(window));
