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

    describe("CSS 2.1 Appendix G Specification test suite", function() {

        var parser;

        before(function() {
            var config = {};
            config.ver = "2.1";
            parser = new CSSParser(config);
        });

        it("CSS 2.1 Specification test", function() {
            testPatterns.css21TestPatterns.forEach(function(testObj) {
                var r = parser.parse(testObj.css);
                testObj.result.charset  !== undefined ? expect(r.charset).to.deep.equal(testObj.result.charset) : '';
		testObj.result.imports  !== undefined ? expect(r.imports).to.deep.equal(testObj.result.imports) : '';
                testObj.result.rulesets !== undefined ? expect(r.rulesets).to.deep.equal(testObj.result.rulesets) : '';
                testObj.result.medias   !== undefined ? expect(r.medias).to.deep.equal(testObj.result.medias) : '';
                testObj.result.pages    !== undefined ? expect(r.pages).to.deep.equal(testObj.result.pages) : '';
            });
        });

        it("CSS 2.1 Specification Invalid test", function() {
            testPatterns.css21InvalidTestPatterns.forEach(function(testObj) {
                try {
                    var r = parser.parse(testObj.css);
                    expect(false).to.equal(true); 
                } catch (err) {
                    // TODO: any good method to do this?
                    err.toString().match(/Parse error/g)? expect(true).to.equal(true) : expect(false).to.equal(true);
                }
            });
        });

        it("CSS 2.1 Style String Specification test", function() {
            testPatterns.cssString21TestPatterns.forEach(function(testObj) {
                var r = parser.parseCssString(testObj.css);
                testObj.result !== undefined ? expect(r).to.deep.equal(testObj.result) : '';
            });
        });

        it("CSS 2.1 Style String Specification Invalid test", function() {
            testPatterns.cssString21InvalidTestPatterns.forEach(function(testObj) {
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
