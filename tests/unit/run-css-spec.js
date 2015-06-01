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

    describe("CSS general test suite", function() {

        it("should not throw exception test", function() {
            var config = {};
            config.ver = "2.1";
            config.throwError = false;

            var newParser = new CSSParser(config);
            var cssString = ' @charset "UTF-8";';
            var r = newParser.parse(cssString);
            expect(r).to.equal(false);
        });

        it("should throw exception test", function() {
            var config = {};
            config.ver = "2.1";
            config.throwError = false;

            var newParser = new CSSParser(config);
            var cssString = ' @charset "UTF-8";';
            try {
                var r = newParser.parse(cssString);
                expect(false).to.equal(true); 
            } catch (err) {
                expect(true).to.equal(true); 
            }
        });
    });
}());
