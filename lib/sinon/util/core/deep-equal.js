"use strict";

var samsam = require("@sinonjs/samsam");

function isReallyNaN(val) {
    return val !== val;
}

var deepEqual = module.exports = function deepEqual(a, b) {
    if (typeof a !== "object" || typeof b !== "object") {
        return isReallyNaN(a) && isReallyNaN(b) || a === b;
    }

    if (a instanceof Error && b instanceof Error) {
        return a === b;
    }

    if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        return false;
    }

    var haveDifferentKeys = Object.keys(a).sort().join() !== Object.keys(b).sort().join();
    if (haveDifferentKeys) {
        return false;
    }

    var matcher = arguments[2];
    if (matcher) {
        var allKeysMatch = Object.keys(a).every(function (key) {
            return matcher(a[key], b[key]);
        });

        return allKeysMatch;
    }

    return samsam.deepEqual(a, b);
};

deepEqual.use = function (match) {
    return function deepEqual$matcher(a, b) {
        // If both are matchers they must be the same instance in order to be considered equal
        // If we didn't do that we would end up running one matcher against the other
        if (match.isMatcher(a)) {
            if (match.isMatcher(b)) {
                return a === b;
            }

            return a.test(b);
        }

        return deepEqual(a, b, deepEqual$matcher);
    };
};
