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

    describe("CSS 2.1 Core Specification test suite", function() {

        var parser;

        before(function() {
            var config = {};
            config.ver = "2.1-core";
            parser = new CSSParser(config);
        });

        it("CSS 2.1 Specification test", function() {
            testPatterns.css21CoreTestPatterns.forEach(function(testObj) {
                var r = parser.parse(testObj.css);
                expect(r).to.deep.equal(testObj.result);
            });
        });

        it("CSS 2.1 Specification Invalid test", function() {
            testPatterns.css21CoreInvalidTestPatterns.forEach(function(testObj) {
                try {
                    var r = parser.parse(testObj.css);
                    expect(false).to.equal(true); 
                } catch (err) {
                    // TODO: any good method to do this?
                    err.toString().match(/Parse error/g)? expect(true).to.equal(true) : expect(false).to.equal(true);
                }
            });
        });
    });
}());
