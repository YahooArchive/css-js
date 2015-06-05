/*
Copyright (c) 2015, Yahoo Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com, neraliu@gmail.com>
*/
(function() {
"use strict";

var cssParser21 = require('./css-parser.21.js');
var cssParser21Core = require('./css-parser.21.core.js');
var cssStringParser21 = require('./css-parser.21.attr.js');
var cssStrictStringParser = require('./css-parser.strict.attr.js');

var cssParser3 = require('./css-parser.3.js');

function CSSParser(config) {
    config = config || {};
    
    this.cssParser = null;
    this.cssStringParser = null;

    config.ver === "2.1"? this.cssParser = cssParser21 : '';
    config.ver === "2.1-core"? this.cssParser = cssParser21Core : '';

    config.ver === "2.1"? this.cssStringParser = cssStringParser21 : '';

    config.ver === "3"? this.cssParser = cssParser3 : '';
    config.ver === "3"? this.cssStringParser = cssStringParser21 : '';

    config.ver === "strict"? this.cssParser = '' : ''; // TODO: need to implement
    config.ver === "strict"? this.cssStringParser = cssStrictStringParser : '';

    this.cssParser === null? this.cssParser = cssParser21 : '';
    this.cssStringParser === null? this.cssStringParser = cssStringParser21 : '';

    this.throwError = config.throwError !== undefined? config.throwError : true;
}

CSSParser.prototype.parse = function(str) {
    var ast = {};
    try {
        ast = this.cssParser.parse(str);
    } catch (err) {
        if (this.throwError) {
            throw err;
        } else {
            return false;
        }
    }
    return ast;
};

CSSParser.prototype.parseCssString = function(str) {
    var ast = {};
    try {
        ast = this.cssStringParser.parse(str);
    } catch (err) {
        if (this.throwError) {
            throw err;
        } else {
            return false;
        }
    }
    return ast;
};

module.exports = CSSParser;

})();
