/*
Copyright (c) 2015, Yahoo Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
(function() {

var css21TestPatterns = [
    { css: '@charset "UTF-8";', result: { charset: '"UTF-8"' } },
    { css: "@charset 'iso-8859-15';", result: { charset: "'iso-8859-15'" } },

    { css: '@import url("fineprint.css") print;', result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ 'print' ] } ] } },
    { css: '@IMPORT url("fineprint.css") print;', result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ 'print' ] } ] } },
    { css: '@import url("bluish.css") projection, tv;', result: { imports: [ { import: 'url("bluish.css")', mediaqueries: [ 'projection', 'tv' ] } ] } },
    { css: "@import 'custom.css';", result: { imports: [ { import: "'custom.css'" } ] } },
    { css: '@import url("chrome://communicator/skin/");', result: { imports: [ { import: 'url("chrome://communicator/skin/")' } ] } },
    { css: '@import "common.css" screen, projection;', result: { imports: [ { import: '"common.css"', mediaqueries: [ 'screen', 'projection' ] } ] } },
    { css: '@import /* This is a single-line comment */ "common.css" screen, projection;', 
        result: { imports: [ { import: '"common.css"', mediaqueries: [ 'screen', 'projection' ] } ] } },
    { css: '@import url("fineprint.css") print; @import url("bluish.css");', result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ 'print' ] },
                                                                                                  { import: 'url("bluish.css")' } 
                                                                                                ] } },

    { css: "<!-- \n\n      .a { color: green; background: white none; }", 
        result: { rulesets: [ { selector: '.a', declaration: [ { key: 'color', value: 'green' }, { key: 'background', value: 'white none' } ] } ] } },
    { css: "<!--.b { color: green; background: white none; } --> <!-- --> <!--", 
        result: { rulesets: [ { selector: '.b', declaration: [ { key: 'color', value: 'green' }, { key: 'background', value: 'white none' } ] } ] } },
    { css: "  	<!--	.f { color: green; background: white none; }-->",
        result: { rulesets: [ { selector: '.f', declaration: [ { key: 'color', value: 'green' }, { key: 'background', value: 'white none' } ] } ] } },
    { css: "-->.g { color: green; background: white none; }<!--",
        result: { rulesets: [ { selector: '.g', declaration: [ { key: 'color', value: 'green' }, { key: 'background', value: 'white none' } ] } ] } },
    { css: "-->-->-->-->-->-->.i { color: green; background: white none; }-->-->-->-->",
        result: { rulesets: [ { selector: '.i', declaration: [ { key: 'color', value: 'green' }, { key: 'background', value: 'white none' } ] } ] } },
    { css: "<!-- .j { color: green; background: white none; } -->", 
        result: { rulesets: [ { selector: '.j', declaration: [ { key: 'color', value: 'green' }, { key: 'background', value: 'white none' } ] } ] } },
    { css: "<!--\n        .k { color: green; background: white none; } \n-->",
        result: { rulesets: [ { selector: '.k', declaration: [ { key: 'color', value: 'green' }, { key: 'background', value: 'white none' } ] } ] } },

    /* simple_selector */
    { css: "e { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "e { color: red; /* This is a single-line comment */ text-align: center; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "* { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '*', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "#hash { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '#hash', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: ".classname { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '.classname', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "[attrib] { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '[attrib]', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "[attrib = ident] { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '[attrib=ident]', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "[attrib = 'string'] { color: red; text-align: center; }",
        result: { rulesets: [ { selector: "[attrib='string']", declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "[attrib ~= ident] { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '[attrib~=ident]', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "[attrib ~= 'string'] { color: red; text-align: center; }",
        result: { rulesets: [ { selector: "[attrib~='string']", declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "[attrib |= ident] { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '[attrib|=ident]', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "[attrib |= 'string'] { color: red; text-align: center; }",
        result: { rulesets: [ { selector: "[attrib|='string']", declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: ":left { color: red; text-align: center; }",
        result: { rulesets: [ { selector: ':left', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "e:ident { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e:ident', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "e:function() { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e:function()', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "e:function(ident) { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e:function(ident)', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },

    /* simple_selector with combinator */
    { css: "e1 > e2 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e1>e2', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "e1 + e2 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e1+e2', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "e1 > e2 > e3 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e1>e2>e3', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "e1 e2 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e1 e2', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "e1 e2 > e3 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e1 e2>e3', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },

    /* selector_list */
    { css: "e1, e2 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e1', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] },
                              { selector: 'e2', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] }
                            ] } },
    { css: "e, #hash { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] },
                              { selector: '#hash', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] }
                            ] } },
    { css: "e, * { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] },
                              { selector: '*', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] }
                            ] } },

    /* declaration */
    { css: "e { color: red; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red' } ] } ] } },
    { css: "e { color: red !important; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red !important' } ] } ] } },
    { css: "e { color: red /* comment */ !important; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red !important' } ] } ] } },
    { css: "e { color: red none; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red none' } ] } ] } },
    { css: "e { color: red / yellow; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red /yellow' } ] } ] } },
    { css: "e { color: red, yellow; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red ,yellow' } ] } ] } },
    { css: "e { color: red, yellow, green; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'red ,yellow ,green' } ] } ] } },
    { css: "e { border: 1; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1" } ] } ] } },
    { css: "e { border: 1.0; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1.0" } ] } ] } },
    { css: "e { border: .3; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: ".3" } ] } ] } },
    { css: "e { border: +1; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "+1" } ] } ] } },
    { css: "e { border: -1; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "-1" } ] } ] } },
    { css: "e { border: 1em; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1em" } ] } ] } },
    { css: "e { border: 1ex; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1ex" } ] } ] } },
    { css: "e { border: 1px; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1px" } ] } ] } },
    { css: "e { border: 1cm; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1cm" } ] } ] } },
    { css: "e { border: 1mm; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1mm" } ] } ] } },
    { css: "e { border: 1in; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1in" } ] } ] } },
    { css: "e { border: 1pt; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1pt" } ] } ] } },
    { css: "e { border: 1pc; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1pc" } ] } ] } },
    { css: "e { border: 1deg; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1deg" } ] } ] } },
    { css: "e { border: 1rad; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1rad" } ] } ] } },
    { css: "e { border: 1grad; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1grad" } ] } ] } },
    { css: "e { border: 1ms; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1ms" } ] } ] } },
    { css: "e { border: 1s; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1s" } ] } ] } },
    { css: "e { border: 1hz; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1hz" } ] } ] } },
    { css: "e { border: 1khz; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1khz" } ] } ] } },
    { css: "e { border: 1%; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1%" } ] } ] } },
    { css: "e { color: 'red'; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: "'red'" } ] } ] } },
    { css: "e { color: red; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: "red" } ] } ] } },
    { css: 'e { color: url("bluish.css"); }',
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: 'url("bluish.css")' } ] } ] } },
    { css: "e { color: #ffffff; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: "#ffffff" } ] } ] } },
    { css: "e { color: function(ident); }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'color', value: "function(ident)" } ] } ] } },

    { css: "e1 { color: red; } e2 { font-family: verdana; }",
        result: { rulesets: [ { selector: 'e1', declaration: [ { key: 'color', value: 'red' } ] }, { selector: 'e2', declaration: [ { key: 'font-family', value: 'verdana' } ] } ] } },

    /* media rule */
    { css: "@media screen { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ 'screen' ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },
    { css: "@media screen, tv { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ 'screen', 'tv' ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },
    { css: "@media screen { p { font-family: verdana, sans-serif; font-size: 17px; } .classname { font-family: georgia, serif; font-size: 14px; color: blue; } }",
        result: { medias: { mediaqueries: [ 'screen' ], rulesets: [ 
                { "selector": "p", "declaration": [ 
                     { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] }, 
                { "selector": ".classname", "declaration": [ 
                     { key: "font-family", value: "georgia ,serif" }, { key: "font-size", value: "14px" }, { key: "color", value: "blue" } ] } ] }, } },

    /* page rule */
    { css: "@page :pseudo-class { margin:2in; }",
        result: { pages: { pseudo_class: "pseudo-class", declaration: [ { key: "margin", value: "2in" } ] } } },
    { css: "@page :pseudo-class { margin:2in; size: 10px }",
        result: { pages: { pseudo_class: "pseudo-class", declaration: [ { key: "margin", value: "2in" }, { key: "size", value: "10px" } ] } } },

    /* @{I}{M}{P}{O}{R}{T} */
    { css: "@\\i\\m\\p\\o\\r\\t 'custom.css';", result: { imports: [ { import: "'custom.css'" } ] } },
    { css: "@\\49\\4d\\50\\4f\\52\\54 'custom.css';", result: { imports: [ { import: "'custom.css'" } ] } },
    { css: "@\\69\\6d\\70\\6f\\72\\74 'custom.css';", result: { imports: [ { import: "'custom.css'" } ] } },

    /* "@"{P}{A}{G}{E} */
    { css: "@\\pa\\ge :pseudo-class { margin:2in; }",
        result: { pages: { pseudo_class: "pseudo-class", declaration: [ { key: "margin", value: "2in" } ] } } },
    { css: "@\\50\\41\\47\\45 :pseudo-class { margin:2in; }",
        result: { pages: { pseudo_class: "pseudo-class", declaration: [ { key: "margin", value: "2in" } ] } } },
    { css: "@\\70\\61\\67\\65 :pseudo-class { margin:2in; }",
        result: { pages: { pseudo_class: "pseudo-class", declaration: [ { key: "margin", value: "2in" } ] } } },

    /* "@"{M}{E}{D}{I}{A} */
    { css: "@\\med\\ia screen { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ 'screen' ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },
    { css: "@\\4d\\45\\44\\49\\41 screen { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ 'screen' ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },
    { css: "@\\6d\\65\\64\\69\\61 screen { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ 'screen' ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },

    /* {escape} \\[^\r\n\f0-9a-fA-F] */
    { css: "te\\st { color: red; text-align: center; }",
        result: { rulesets: [ { selector: 'te\\st', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\g\\h\\i\\j\\k\\l\\m\\o\\p\\q\\s\\t\\u\\v\\x\\y\\z { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\g\\h\\i\\j\\k\\l\\m\\o\\p\\q\\s\\t\\u\\v\\x\\y\\z', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\r { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\r', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\R { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\R', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\n { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\n', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\N { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\N', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },

    /* {escape}   {unicode}|\\[^\r\n\f0-9a-fA-F] 
       {unicode}  \\{h}{1,6}(\r\n|[ \t\r\n\f])?
    */

    /* this pattern can be matched against in following html/css code segment
<style>
#\a {
        background-color: orange;
}
</style>
<div id="
">div content</div>
<div id="&#10;">div content</div>
    */
    { css: "\\a { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\a ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\a\\b\\c\\d\\e\\f { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\a\\b\\c\\d\\e\\f ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\A\\B\\C\\D\\E\\F { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\A\\B\\C\\D\\E\\F ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\0\\1\\2\\3\\4\\5\\6\\7\\8\\9 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\0\\1\\2\\3\\4\\5\\6\\7\\8\\9 ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\41 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\41 ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\041 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\041 ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\0041 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\0041 ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\00041 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\00041 ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\000041 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\000041 ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\0000041 { color: red; text-align: center; }", /* more than 6 chars, the first \\000004 without space and 1 is the second char */
        result: { rulesets: [ { selector: '\\0000041', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },
    { css: "\\000041 \\000042 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\000041 \\000042 ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },

    /* this pattern can still be matched with the current lex definition,
       however, the spec is stating to replace those with 'replacement character u+fffd */
    { css: "\\110000 { color: red; text-align: center; }",
        result: { rulesets: [ { selector: '\\110000 ', declaration: [ { key: 'color', value: 'red' }, { key: 'text-align', value: 'center' } ] } ] } },

    /* vendor specific extension */
    { css: "e { -moz-opacity: 0.6; -khtml-opacity:0.6; opacity: 0.6; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: '-moz-opacity', value: '0.6' }, 
                                                              { key: '-khtml-opacity', value: '0.6' }, 
                                                              { key: 'opacity', value: '0.6' } ] } ] } },
];
exports.css21TestPatterns = css21TestPatterns;

var css21InvalidTestPatterns = [
    { css: ' @charset "UTF-8";' },
    { css: '@charset UTF-8;'    },
    { css: '@Charset "UTF-8";'    },

    { css: "@import url('landscape.css') screen and (orientation:landscape);" },

    { css: ".xa <!-- { color: yellow; background: red none; }" },
    { css: ".xb { color: yellow -->; background: red none <!--; }" },
    { css: ".xc { <!-- color: yellow; --> background: red none; }" },
    { css: ".xd { <!-- color: yellow; background: red none -->; }" },
    { css: "<! -- .xe { color: yellow; background: red none; }" },
    { css: "--> <!--       --> <!-- -- > .xf { color: yellow; background: red none; }" },

    { css: "element:  ident { color: red; text-align: center; }" }, /* no space between element_name and ident */

    { css: "e { border: 1e+1; }" },
    { css: "e { border: 1ident; }" },
    { css: "e { border: 1-ident; }" },
    { css: "e { color: function(); }" }, /* function must have expr as argument */

    /* {escape} \\[^\r\n\f0-9a-fA-F] */
    { css: "\\\r { color: red; text-align: center; }" },
    { css: "\\\n { color: red; text-align: center; }" },
    { css: "\\\f { color: red; text-align: center; }" },
];
exports.css21InvalidTestPatterns = css21InvalidTestPatterns;

var css21CoreTestPatterns = [
    { css: '@charset "UTF-8";', result: [ { '@charset': [ '"UTF-8"' ] } ] },
    { css: "@charset 'iso-8859-15';", result: [ { '@charset': [ "'iso-8859-15'" ] } ] },
    { css: '@import url("fineprint.css") print;', result: [ { '@import': [ 'url("fineprint.css")', 'print' ] } ] },
    // TODO: fix this
    // { css: '@IMPORT url("fineprint.css") print;', result: [ { '@IMPORT': [ 'url("fineprint.css")', 'print' ] } ] },

    { css: "@import 'custom.css';", result: [ { '@import': [ "'custom.css'" ] } ] },
    { css: '@import url("bluish.css") projection tv;', result: [ { '@import': [ 'url("bluish.css")', 'projection', 'tv' ] } ] },
    { css: '@import url("chrome://communicator/skin/");', result: [ { '@import': [ 'url("chrome://communicator/skin/")' ] } ] },
    { css: '@import "common.css" screen projection;', result: [ { '@import': [ '"common.css"', 'screen', 'projection' ] } ] },
    { css: '@import /* This is a single-line comment */ "common.css" screen projection;', 
        result: [ { '@import': [ '"common.css"', 'screen', 'projection' ] } ] },
    { css: '@import url("fineprint.css") print; @import url("bluish.css"); @charset "UTF-8";', 
           result: [ { '@import': [ 'url("fineprint.css")', 'print' ] },
                     { '@import': [ 'url("bluish.css")' ] },
                     { '@charset': [ '"UTF-8"' ] },
                   ] },

    { css: "e { color: red; text-align: center; }",
        result: [ { selector: 'e', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "e { color: red; /* This is a single-line comment */ text-align: center; }",
        result: [ { selector: 'e', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "#hash { color: red; text-align: center; }",
        result: [ { selector: '#hash', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "[attrib] { color: red; text-align: center; }",
        result: [ { selector: '[attrib]', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "(attrib) { color: red; text-align: center; }",
        result: [ { selector: '(attrib)', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "url(http://www.abc.com) { color: red; text-align: center; }",
        result: [ { selector: 'url(http://www.abc.com)', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },

    { css: "e { color: red; }",
        result: [ { selector: 'e', declaration: [ { key: 'color', value: [ 'red' ] } ] } ] },
    { css: "e { border: 1; }",
        result: [ { selector: 'e', declaration: [ { key: 'border', value: [ "1" ] } ] } ] },
    { css: "e { border: 1%; }",
        result: [ { selector: 'e', declaration: [ { key: 'border', value: [ "1%" ] } ] } ] },
    { css: "e { color: 'red'; }",
        result: [ { selector: 'e', declaration: [ { key: 'color', value: [ "'red'" ] } ] } ] },
    { css: "e { color: \"red\"; }",
        result: [ { selector: 'e', declaration: [ { key: 'color', value: [ '"red"' ] } ] } ] },
    { css: 'e { color: url("bluish.css"); }',
        result: [ { selector: 'e', declaration: [ { key: 'color', value: [ 'url("bluish.css")' ] } ] } ] },
    { css: "e { color: #ffffff; }",
        result: [ { selector: 'e', declaration: [ { key: 'color', value: [ '#ffffff' ] } ] } ] },
    { css: "e { color: function(ident); }",
        result: [ { selector: 'e', declaration: [ { key: 'color', value: [ 'function(ident)' ] } ] } ] },

    { css: "e1 { color: red; } e2 { font-family: verdana; }",
        result: [ { selector: 'e1', declaration: [ { key: 'color', value: [ 'red' ] } ] }, { selector: 'e2', declaration: [ { key: 'font-family', value: [ 'verdana' ] } ] } ] },

    // TODO: the comma separated value is not supported
    /*
    { css: "p { font-family: verdana, sans-serif; font-size: 17; }",
        result: [ { selector: 'p', declaration: [ { key: 'font-family', value: [ 'verdana', 'sans-serif' ] }, { key: 'font-size', value: [ '17' ] } ] } ] },
    */

    // TODO: this returned array is different from appendix G implementation.
    { css: "e1, e2 { color: red; text-align: center; }",
        result: [ { selector: 'e1,e2', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] },
                ] },
    { css: "e1/ e2 { color: red; text-align: center; }",
        result: [ { selector: 'e1/e2', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] },
                ] },

    { css: "te\\st { color: red; text-align: center; }",
        result: [ { selector: 'te\\st', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\g\\h\\i\\j\\k\\l\\m\\o\\p\\q\\s\\t\\u\\v\\x\\y\\z { color: red; text-align: center; }",
        result: [ { selector: '\\g\\h\\i\\j\\k\\l\\m\\o\\p\\q\\s\\t\\u\\v\\x\\y\\z', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\r { color: red; text-align: center; }",
        result: [ { selector: '\\r', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\R { color: red; text-align: center; }",
        result: [ { selector: '\\R', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\n { color: red; text-align: center; }",
        result: [ { selector: '\\n', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\N { color: red; text-align: center; }",
        result: [ { selector: '\\N', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },

    { css: "\\a { color: red; text-align: center; }",
        result: [ { selector: '\\a ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\a\\b\\c\\d\\e\\f { color: red; text-align: center; }",
        result: [ { selector: '\\a\\b\\c\\d\\e\\f ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\A\\B\\C\\D\\E\\F { color: red; text-align: center; }",
        result: [ { selector: '\\A\\B\\C\\D\\E\\F ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\0\\1\\2\\3\\4\\5\\6\\7\\8\\9 { color: red; text-align: center; }",
        result: [ { selector: '\\0\\1\\2\\3\\4\\5\\6\\7\\8\\9 ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\41 { color: red; text-align: center; }",
        result: [ { selector: '\\41 ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\041 { color: red; text-align: center; }",
        result: [ { selector: '\\041 ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\0041 { color: red; text-align: center; }",
        result: [ { selector: '\\0041 ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\00041 { color: red; text-align: center; }",
        result: [ { selector: '\\00041 ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\000041 { color: red; text-align: center; }",
        result: [ { selector: '\\000041 ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\0000041 { color: red; text-align: center; }", /* more than 6 chars, the first \\000004 without space and 1 is the second char */
        result: [ { selector: '\\0000041', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
    { css: "\\000041 \\000042 { color: red; text-align: center; }",
        result: [ { selector: '\\000041 \\000042 ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },

    /* this pattern can still be matched with the current lex definition,
       however, the spec is stating to replace those with 'replacement character u+fffd */
    { css: "\\110000 { color: red; text-align: center; }",
        result: [ { selector: '\\110000 ', declaration: [ { key: 'color', value: [ 'red' ] }, { key: 'text-align', value: [ 'center' ] } ] } ] },
];
exports.css21CoreTestPatterns = css21CoreTestPatterns;

var css21CoreInvalidTestPatterns = [
    // comma is not supported in core syntax
    { css: '@import url("bluish.css") projection, tv;' },
    { css: '@import "common.css" screen, projection;' },

    { css: "* { color: red; text-align: center; }" },

    { css: ".classname { color: red; text-align: center; }" },

    { css: "[attrib = ident] { color: red; text-align: center; }" },
    { css: "[attrib = 'string'] { color: red; text-align: center; }" },
    { css: "[attrib ~= ident] { color: red; text-align: center; }" },
    { css: "[attrib ~= 'string'] { color: red; text-align: center; }" },
    { css: "[attrib |= ident] { color: red; text-align: center; }" },
    { css: "[attrib |= 'string'] { color: red; text-align: center; }" },

    { css: ":left { color: red; text-align: center; }" },
    { css: "e:ident { color: red; text-align: center; }" },
    { css: "e:function() { color: red; text-align: center; }" },
    { css: "e:function(ident) { color: red; text-align: center; }" },

    { css: "e1 > e2 { color: red; text-align: center; }" },
    { css: "e1 + e2 { color: red; text-align: center; }" },
    { css: "e1 > e2 > e3 { color: red; text-align: center; }" },
    { css: "e1 e2 { color: red; text-align: center; }" },
    { css: "e1 e2 > e3 { color: red; text-align: center; }" },

    { css: "e { color: red !important; }" },
    { css: "e { color: red none; }" },
    { css: "e { color: red / yellow; }" },
    { css: "e { color: red, yellow; }" },
    { css: "e { color: red, yellow, green; }" },

    { css: "e { border: 1.0; }" },
    { css: "e { border: 0.3; }" },
    { css: "e { border: +1; }" },
    { css: "e { border: -1; }" },
    { css: "e { border: 1e+1; }" },
    { css: "e { border: 1em; }" },
    { css: "e { border: 1ex; }" },
    { css: "e { border: 1px; }" },
    { css: "e { border: 1cm; }" },
    { css: "e { border: 1mm; }" },
    { css: "e { border: 1in; }" },
    { css: "e { border: 1pt; }" },
    { css: "e { border: 1pc; }" },
    { css: "e { border: 1deg; }" },
    { css: "e { border: 1rad; }" },
    { css: "e { border: 1grad; }" },
    { css: "e { border: 1ms; }" },
    { css: "e { border: 1s; }" },
    { css: "e { border: 1hz; }" },
    { css: "e { border: 1khz; }" },
];
exports.css21CoreInvalidTestPatterns = css21CoreInvalidTestPatterns;

var cssString21TestPatterns = [
    { css: "color: red",
        result: [ { key: "color", value: "red" } ] },
    { css: "   color: red", /* with space */
        result: [ { key: "color", value: "red" } ] },
    { css: "color: red;",
        result: [ { key: "color", value: "red" } ] },
    { css: "color: red; text-align: left",
        result: [ { key: "color", value: "red" }, { key: "text-align", value: "left" } ] },
    { css: "color: red; text-align: left;",
        result: [ { key: "color", value: "red" }, { key: "text-align", value: "left" } ] },
];
exports.cssString21TestPatterns = cssString21TestPatterns;

var cssString21InvalidTestPatterns = [
    { css: "color: red:" },
    { css: "color; red:" },
    { css: "color; red;" },
    { css: "color: red; text-align: left:" },
];
exports.cssString21InvalidTestPatterns = cssString21InvalidTestPatterns;

var css3TestPatterns = [
    { css: '@charset "UTF-8";', result: { charset: '"UTF-8"' } },
    { css: "@charset 'iso-8859-15';", result: { charset: "'iso-8859-15'" } },

    { css: '@import url("fineprint.css") print;', result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: '', media_type: 'print', expression: '' } ] } ] } },
    { css: '@IMPORT url("fineprint.css") print;', result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: '', media_type: 'print', expression: '' } ] } ] } },
    { css: '@import url("bluish.css") projection, tv;', result: { imports: [ { import: 'url("bluish.css")', mediaqueries: [ { prefix: '', media_type: 'projection', expression: '' },
                                                                                                                            { prefix: '', media_type: 'tv', expression: '' },
                                                                                                                          ] } ] } },
    { css: "@import 'custom.css';", result: { imports: [ { import: "'custom.css'" } ] } },
    { css: '@import url("chrome://communicator/skin/");', result: { imports: [ { import: 'url("chrome://communicator/skin/")' } ] } },
    { css: '@import "common.css" screen, projection;', result: { imports: [ { import: '"common.css"', mediaqueries: [ { prefix: '', media_type: 'screen', expression: '' },
                                                                                                                     { prefix: '', media_type: 'projection', expression: '' },
                                                                                                                    ] } ] } },
    { css: '@import /* This is a single-line comment */ "common.css" screen, projection;', result: { imports: [ { import: '"common.css"', 
                                                                                                     mediaqueries: [ { prefix: '', media_type: 'screen', expression: '' },
                                                                                                                     { prefix: '', media_type: 'projection', expression: '' },
                                                                                                                   ] } ] } },
    { css: '@import url("fineprint.css") print; @import url("bluish.css");', result: { imports: [ { import: 'url("fineprint.css")', 
                                                                                                     mediaqueries: [ { prefix: '', media_type: 'print', expression: '' } 
                                                                                                                   ] },
                                                                                                  { import: 'url("bluish.css")' } 
                                                                                                ] } },
    { css: '@import url("fineprint.css") only print;', result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: 'only', media_type: 'print', expression: '' } ] } ] } },
    { css: '@import url("fineprint.css") not print;',  result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: 'not',  media_type: 'print', expression: '' } ] } ] } },

    { css: '@import url("fineprint.css") only screen and (color);', 
      result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: 'only', media_type: 'screen', expression: [ { media_feature: 'color', value: '' } ] } ] } ] } },
    { css: '@import url("fineprint.css") only screen and (color:red);', 
      result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: 'only', media_type: 'screen', expression: [ { media_feature: 'color', value: 'red' } ] } ] } ] } },
    { css: '@import url("fineprint.css")   only    screen    and     (color:  red);', 
      result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: 'only', media_type: 'screen', expression: [ { media_feature: 'color', value: 'red' } ] } ] } ] } },
    { css: '@import url("fineprint.css") only screen and (color:red) and (min-color: 4);', 
      result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: 'only', media_type: 'screen', expression: [ 
                                                                                                                                   { media_feature: 'color', value: 'red' },
                                                                                                                                   { media_feature: 'min-color', value: '4' },
                                                                                                                                 ] } ] } ] } },
    /* TODO: is orientation supported as media_type?
    { css: "@import url('landscape.css') screen and (orientation:landscape);",
      result: { imports: [ { import: 'url("fineprint.css")', mediaqueries: [ { prefix: 'only', media_type: 'screen', expression: [
                                                                                                                                   { media_feature: 'orientation', value: 'landscape' },
                                                                                                                                 ] } ] } ] } },
    */

    { css: "e { border: 1; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1" } ] } ] } },
    { css: "e { border: 1.0; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "1.0" } ] } ] } },
    { css: "e { border: .3; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: ".3" } ] } ] } },
    { css: "e { border: 1e+1; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: '1e+1' } ] } ] } },
    { css: "e { border: 1E-1; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: '1E-1' } ] } ] } },
    { css: "e { border: 1e+1em; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: '1e+1em' } ] } ] } },
    { css: "e { border: +1; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "+1" } ] } ] } },
    { css: "e { border: -1; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: "-1" } ] } ] } },
    /* TODO (1): DIMENSION is not supported in CSS 3.0? 
    http://www.w3.org/TR/2003/WD-css3-syntax-20030813/ */
    { css: "e { border: 1ident; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: '1 ident' } ] } ] } },
    { css: "e { border: 1-ident; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: 'border', value: '1 -ident' } ] } ] } },

    { css: "@media screen { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ { prefix: '', media_type: 'screen', expression: '' } ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },
    { css: "@media screen, tv { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ { prefix: '', media_type: 'screen', expression: '' }, { prefix: '', media_type: 'tv', expression: '' } ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },
    { css: "@media screen { p { font-family: verdana, sans-serif; font-size: 17px; } .classname { font-family: georgia, serif; font-size: 14px; color: blue; } }",
        result: { medias: { mediaqueries: [ { prefix: '', media_type: 'screen', expression: '' } ], rulesets: [ 
                { "selector": "p", "declaration": [ 
                     { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] }, 
                { "selector": ".classname", "declaration": [ 
                     { key: "font-family", value: "georgia ,serif" }, { key: "font-size", value: "14px" }, { key: "color", value: "blue" } ] } ] }, } },
    /* TODO: DIMENSION pattern is not supported in CSS 3.0? 
    http://www.w3.org/TR/2003/WD-css3-syntax-20030813/ 
    { css: "@media all and (max-weight: 3kg) { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ { prefix: '', media_type: 'all', expression: [ { media_feature: 'max-weight', value: '3kg' } ] } ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },
    */
    { css: "@media all and (max-size: 3pt) { p { font-family: verdana, sans-serif; font-size: 17px; } }",
        result: { medias: { mediaqueries: [ { prefix: '', media_type: 'all', expression: [ { media_feature: 'max-size', value: '3pt' } ] } ], rulesets: [ { "selector": "p", "declaration": [ { key: "font-family", value: "verdana ,sans-serif" }, { key: "font-size", value: "17px" } ] } ] }, } },

    /* vendor specific extension */
    { css: "e { -moz-opacity: 0.6; -khtml-opacity:0.6; opacity: 0.6; }",
        result: { rulesets: [ { selector: 'e', declaration: [ { key: '-moz-opacity', value: '0.6' }, 
                                                              { key: '-khtml-opacity', value: '0.6' }, 
                                                              { key: 'opacity', value: '0.6' } ] } ] } },
];
exports.css3TestPatterns = css3TestPatterns;

var css3InvalidTestPatterns = [
    { css: ' @charset "UTF-8";' },
    { css: '@charset UTF-8;'    },
    { css: '@Charset "UTF-8";'    },

    { css: ".xa <!-- { color: yellow; background: red none; }" },
    { css: ".xb { color: yellow -->; background: red none <!--; }" },
    { css: ".xc { <!-- color: yellow; --> background: red none; }" },
    { css: ".xd { <!-- color: yellow; background: red none -->; }" },
    { css: "<! -- .xe { color: yellow; background: red none; }" },
    { css: "--> <!--       --> <!-- -- > .xf { color: yellow; background: red none; }" },

    { css: "element:  ident { color: red; text-align: center; }" }, /* no space between element_name and ident */

    /* Please refer to TODO (1)
    { css: "e { border: 1ident; }" },
    { css: "e { border: 1-ident; }" },
    */
    { css: "e { color: function(); }" }, /* function must have expr as argument */

    /* {escape} \\[^\r\n\f0-9a-fA-F] */
    { css: "\\\r { color: red; text-align: center; }" },
    { css: "\\\n { color: red; text-align: center; }" },
    { css: "\\\f { color: red; text-align: center; }" },

    /* expression is in the format of '[ and (...) ]*' */
    { css: "@media screen and projection { p { font-family: verdana, sans-serif; font-size: 17px; } }" },
];
exports.css3InvalidTestPatterns = css3InvalidTestPatterns;

var cssStrictTestPatterns = [
    { css: 'a:b',             result: [ { key: 'a', value: 'b' } ] },
    { css: 'A:B',             result: [ { key: 'A', value: 'B' } ] },
    { css: 'a:"aA0"',         result: [ { key: 'a', value: '"aA0"' } ] },
    { css: 'a:" !#$%&"',      result: [ { key: 'a', value: '" !#$%&"' } ] },
    { css: "a:' !#$%&'",      result: [ { key: 'a', value: "' !#$%&'" } ] },

    { css: 'a:"()"',          result: [ { key: 'a', value: '"()"' } ] },
    { css: 'a:"*+,-./"',      result: [ { key: 'a', value: '"*+,-./"' } ] },
    { css: 'a:":;<=>?@"',     result: [ { key: 'a', value: '":;<=>?@"' } ] },
    { css: 'a:"[\\]^_`"',     result: [ { key: 'a', value: '"[\\]^_`"' } ] },
    { css: 'a:"{|}~"',        result: [ { key: 'a', value: '"{|}~"' } ] },

    { css: "a:'()'",          result: [ { key: 'a', value: "'()'" } ] },
    { css: "a:'*+,-./'",      result: [ { key: 'a', value: "'*+,-./'" } ] },
    { css: "a:':;<=>?@'",     result: [ { key: 'a', value: "':;<=>?@'" } ] },
    { css: "a:'[\\]^_`'",     result: [ { key: 'a', value: "'[\\]^_`'" } ] },
    { css: "a:'{|}~'",        result: [ { key: 'a', value: "'{|}~'" } ] },

    { css: 'background:url(http://www.evil.com)', result: [ { key: 'background', value: 'url(http://www.evil.com)' } ] },
    { css: 'background:url(foo://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose)', 
        result: [ { key: 'background', value: 'url(foo://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose)' } ] },
    { css: 'background:url()',    result: [ { key: 'background', value: 'url()' } ] },

    // TODO: it is a strange pattern, do we need to have a URI validator?
    { css: 'background:url([)',   result: [ { key: 'background', value: 'url([)' } ] },

    { css: 'a:1',             result: [ { key: 'a', value: '1' } ] },
    { css: 'a:1.0',           result: [ { key: 'a', value: '1.0' } ] },
    { css: 'a:.3',            result: [ { key: 'a', value: '.3' } ] },
    { css: 'a:+1',            result: [ { key: 'a', value: '+1' } ] },
    { css: 'a:-1',            result: [ { key: 'a', value: '-1' } ] },
    { css: 'a:1e+1',          result: [ { key: 'a', value: '1e+1' } ] },
    { css: 'a:1E-1',          result: [ { key: 'a', value: '1E-1' } ] },
    { css: 'a:1em',           result: [ { key: 'a', value: '1em' } ] },
    { css: 'a:1e+1em',        result: [ { key: 'a', value: '1e+1em' } ] },
    { css: 'a:1ex',           result: [ { key: 'a', value: '1ex' } ] },
    { css: 'a:1px',           result: [ { key: 'a', value: '1px' } ] },
    { css: 'a:1cm',           result: [ { key: 'a', value: '1cm' } ] },
    { css: 'a:1mm',           result: [ { key: 'a', value: '1mm' } ] },
    { css: 'a:1in',           result: [ { key: 'a', value: '1in' } ] },
    { css: 'a:1pt',           result: [ { key: 'a', value: '1pt' } ] },
    { css: 'a:1pc',           result: [ { key: 'a', value: '1pc' } ] },
    { css: 'a:1deg',          result: [ { key: 'a', value: '1deg' } ] },
    { css: 'a:1rad',          result: [ { key: 'a', value: '1rad' } ] },
    { css: 'a:1grad',         result: [ { key: 'a', value: '1grad' } ] },
    { css: 'a:1ms',           result: [ { key: 'a', value: '1ms' } ] },
    { css: 'a:1s',            result: [ { key: 'a', value: '1s' } ] },
    { css: 'a:1hz',           result: [ { key: 'a', value: '1hz' } ] },
    { css: 'a:1khz',          result: [ { key: 'a', value: '1khz' } ] },
    { css: 'a:1%',            result: [ { key: 'a', value: '1%' } ] },
];
exports.cssStrictTestPatterns = cssStrictTestPatterns;

var cssStrictInvalidTestPatterns = [
    { css: 'a:\u0000'   },
    { css: 'a:\u0020'   },
    { css: 'a:\u007F'   },
    { css: 'e { a:b }'  },

    { css: 'e { a:{  }' },
    { css: 'e { a:}  }' },
    { css: 'e { a:[  }' },
    { css: 'e { a:]  }' },
    { css: 'e { a:(  }' },
    { css: 'e { a:)  }' },
    { css: 'e { a:{} }' },
    { css: 'e { a::  }' },
    { css: 'e { a:;  }' },

    { css: 'e { a: &NewLine;; }' },
    { css: 'background:url(http://www.evil.com\u0000)' },

    { css: 'background:url())', },
    { css: 'background:url({})', },
];
exports.cssStrictInvalidTestPatterns = cssStrictInvalidTestPatterns;

})();
