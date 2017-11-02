/**
 * Wait until Angular has finished rendering and has
 * no outstanding $http calls before continuing. The specific Angular app
 * is determined by the rootSelector.
 *
 * Asynchronous.
 *
 * @param {string} rootSelector The selector housing an ng-app
 * @param {boolean} ng12Hybrid Flag set if app is a hybrid of angular 1 and 2
 * @param {function(string)} callback callback. If a failure occurs, it will
 *     be passed as a parameter.
 */
exports.NG_WAIT_FN = function(rootSelector, ng12Hybrid, callback) {
  var el = document.querySelector(rootSelector);

  try {
    if (!ng12Hybrid && window.getAngularTestability) {
      window.getAngularTestability(el).whenStable(callback);
      return;
    }
    if (!window.angular) {
      throw new Error('window.angular is undefined.  This could be either ' +
          'because this is a non-angular page or because your test involves ' +
          'client-side navigation, which can interfere with Protractor\'s ' +
          'bootstrapping.  See http://git.io/v4gXM for details');
    }
    if (angular.getTestability) {
      angular.getTestability(el).whenStable(callback);
    } else {
      if (!angular.element(el).injector()) {
        throw new Error('root element (' + rootSelector + ') has no injector.' +
            ' this may mean it is not inside ng-app.');
      }
      angular.element(el).injector().get('$browser').
      notifyWhenNoOutstandingRequests(callback);
    }
  } catch (err) {
    callback(err.message);
  }
};

/**
 * Wait until all Angular2 applications on the page have become stable.
 *
 * Asynchronous.
 *
 * @param {function(string)} callback callback. If a failure occurs, it will
 *     be passed as a parameter.
 */
exports.NG2_WAIT_FN = function(callback) {
  try {
    var testabilities = window.getAllAngularTestabilities();
    var count = testabilities.length;
    var decrement = function() {
      count--;
      if (count === 0) {
        callback();
      }
    };
    testabilities.forEach(function(testability) {
      testability.whenStable(decrement);
    });
  } catch (err) {
    callback(err.message);
  }
};

