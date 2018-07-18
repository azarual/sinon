"use strict";

var samsam = require("@sinonjs/samsam");
var toString = Object.prototype.toString;

var deepEqual = module.exports = function deepEqual(a, b, matcher) {
    if (samsam.deepEqual(a, b)) {
        return true;
    }

    if (typeof a !== "object" || typeof b !== "object") {
        return a === b;
    }

    if (toString.call(a) !== toString.call(b)) {
        return false;
    }

    if (Object.keys(a).sort().join() !== Object.keys(b).sort().join()) {
        return false;
    }

    if (matcher) {
        var allKeysMatch = Object.keys(a).every(function (key) {
            return matcher(a[key], b[key]);
        });

        return allKeysMatch;
    }

    return false;
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
