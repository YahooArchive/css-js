/*
Copyright (c) 2015, Yahoo Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com>
*/
(function () {

    require("mocha");
    var expect = require('chai').expect,
        utils = require("../utils.js"),
        testPatterns = require("../test-patterns.js"),
        CSSParser = require("../../src/css-parser.js");

    describe("CSS Strict Specification test suite", function() {

        var parser;

        before(function() {
            var config = {};
            config.ver = "strict";
            config.throwError = true;
            parser = new CSSParser(config);
        });

        it("Strict CSS Specification test", function() {
            testPatterns.cssStrictTestPatterns.forEach(function(testObj) {
                var r = parser.parseCssString(testObj.css);
                testObj.result !== undefined ? expect(r).to.deep.equal(testObj.result) : '';
            });
        });

        it("Strict CSS Specification Invalid test", function() {
            testPatterns.cssStrictInvalidTestPatterns.forEach(function(testObj) {
                try {
                    var r = parser.parseCssString(testObj.css);
                    expect(false).to.equal(true); 
                } catch (err) {
                    // TODO: any good method to do this?
                    err.toString().match(/Parse error/g)? expect(true).to.equal(true) : expect(false).to.equal(true);
                }
            });
        });
    });
}());
