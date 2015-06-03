/*
Copyright (c) 2015, Yahoo Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com, neraliu@gmail.com>

Grammer of CSS 2.1 specification

Reference:

stylesheet  : [ CDO | CDC | S | statement ]*;
statement   : ruleset | at-rule;
at-rule     : ATKEYWORD S* any* [ block | ';' S* ];
block       : '{' S* [ any | block | ATKEYWORD S* | ';' S* ]* '}' S*;
ruleset     : selector? '{' S* declaration? [ ';' S* declaration? ]* '}' S*;
selector    : any+;
declaration : property S* ':' S* value;
property    : IDENT;
value       : [ any | block | ATKEYWORD S* ]+;
any         : [ IDENT | NUMBER | PERCENTAGE | DIMENSION | STRING
              | DELIM | URI | HASH | UNICODE-RANGE | INCLUDES
              | DASHMATCH | ':' | FUNCTION S* [any|unused]* ')'
              | '(' S* [any|unused]* ')' | '[' S* [any|unused]* ']'
              ] S*;
unused      : block | ATKEYWORD S* | ';' S* | CDO S* | CDC S*;

- http://www.w3.org/TR/2011/REC-CSS2-20110607/syndata.html
- http://www.w3.org/TR/2011/REC-CSS2-20110607/grammar.html
*/

%start stylesheet

%%

/* stylesheet */
stylesheet
  : space_cdata_statements
    %{
      $$ = [];
      if ($1 !== null) $$ = $1;
      return $$;
    %}
  ;

/* [ S | CDO | CDC | statement ]* */
/* new: [ S | CDO | CDC | statement ]+ */
space_cdata_statements
  : space_cdata_statement
    %{
      $$ = [];
      $$.push($1);
    %}
  | space_cdata_statements space_cdata_statement
    %{
      $$ = [];
      if ($1 !== null && $2 !== null) {
        var s = $$; 
        $1.forEach(function(d) { s.push(d); });
        s.push($2);
      } else if ($1 !== null && $2 === null) {
        $$ = $1;
      } 
    %}
  /* change to + */ /* | -> null */
  ;

/* [ S | CDO | CDC | statement ] */
space_cdata_statement
  : statement -> $1
  | space_cdata -> null
  ;

/* statement -> ruleset | at-rule; */
statement
  : atrule 	-> $1
  | ruleset     -> $1
  ;

/* ruleset -> selector? '{' S* declaration? [ ';' S* declaration? ]* '}' S*; */
ruleset
  : selector_list '{' space_or_empty declarations declaration_list '}' space_or_empty
    %{
      $$ = {};
      $$.selector = $1;
      $$.declaration = [];
      var s = $$;
      $4 !== null? s.declaration.push($4) : '';
      $5 !== null? $5.forEach(function(d) { s.declaration.push(d); }) : ''
    %}
  ;

/* selector -> any+; */
/*
selector 
  : any -> $1
  ;
*/
/* new: selector -> any [ ',' space_or_empty any | '/' space_or_empty any ]* */
selector_list
  : any -> $1
  | ',' space_or_empty any -> $3
  | '/' space_or_empty any -> $3
  | selector_list ',' space_or_empty any -> $1 + "," + $4
  | selector_list '/' space_or_empty any -> $1 + "/" + $4
  ;

/* declaration -> [ property S* ':' S* value; ]? */
declarations
  : property space_or_empty ':' space_or_empty value
    %{
      $$ = {};
      if ($1 !== null) $$.key = $1;
      if ($5 !== null) $$.value = $5;
    %}
  | -> null
  ;

/* declaration_list -> [ ';' S* declaration? ]* */
declaration_list
  : ';' space_or_empty declarations
    %{
      $$ = [];
      if ($3 !== null) $$.push($3);
    %}
  | declaration_list ';' space_or_empty declarations
    %{
      $$ = [];
      $$ = $1;
      if ($4 !== null) $$.push($4);
    %}
  | -> null
  ;

/* property -> IDENT; */
property
  : IDENT -> $1
  ;

/* value -> [ any | block | ATKEYWORD S* ]+; */
value
  : any
    %{
      $$ = [];
      if ($1 !== null) $$.push($1);
    %} 
  | anys any
    %{
      $$ = [];
      var r = $$;
      $1 !== null? $1.forEach(function(e) { r.push(e); }) : '';
      if ($2 !== null) $$.push($2);
    %} 
  | block
    %{
      $$ = [];
      if ($1 !== null) $$.push($1);
    %} 
  | blocks block
    %{
      $$ = [];
      var r = $$;
      $1 !== null? $1.forEach(function(e) { r.push(e); }) : '';
      if ($2 !== null) $$.push($2);
    %} 
  | ATKEYWORD space_or_empty
    %{
      $$ = [];
      if ($1 !== null) $$.push($1);
    %}
  | atkeywords ATKEYWORD space_or_empty
    %{
      $$ = [];
      var r = $$;
      $1 !== null? $1.forEach(function(e) { r.push(e); }) : '';
      if ($2 !== null) $$.push($2);
    %} 
  ;

/* at-rule -> ATKEYWORD S* any* [ block | ';' S* ]; */
atrule
  : ATKEYWORD space_or_empty anys block
    %{
      $$ = {};
      $$[$1] = [];
      var r = $$[$1];
      $3 !== null? $3.forEach(function(e) { r.push(e); }) : '';
      $$[$1].push($4);
    %}
  | ATKEYWORD space_or_empty anys ';' space_or_empty
    %{
      $$ = {};
      $$[$1] = [];
      var r = $$[$1];
      $3 !== null? $3.forEach(function(e) { r.push(e); }) : '';
    %}
  ;

/* block -> '{' S* [ any | block | ATKEYWORD S* | ';' S* ]* '}' S*; */
block
  : '{' space_or_empty any_block_atkeyword_semi '}' space_or_empty -> $3
  ;

/* blocks -> [ block ]* */
blocks
  : block
    %{
      $$ = [];
      if ($1 !== null) $$.push($1);
    %} 
  | blocks block
    %{
      $$ = [];
      var r = $$;
      $1 !== null? $1.forEach(function(e) { r.push(e); }) : '';
      if ($2 !== null) $$.push($2);
    %} 
  | -> null
  ;

/* any_block_atkeyword_semi -> [ any | block | ATKEYWORD S* | ';' S* ]* */
any_block_atkeyword_semi
  : anys 				-> $1
  | blocks				-> $1
  | atkeywords 				-> $1
  | semis				-> $1
  | -> null
  ;

/*
[ IDENT | NUMBER | PERCENTAGE | DIMENSION | STRING
| DELIM | URI | HASH | UNICODE-RANGE | INCLUDES
| DASHMATCH | ':' | FUNCTION S* [any|unused]* ')'
| '(' S* [any|unused]* ')' | '[' S* [any|unused]* ']'
] S*;
*/
any
  : IDENT space_or_empty	-> $1
  | NUMBER space_or_empty	-> $1
  | PERCENTAGE space_or_empty	-> $1
  | DEMINSION space_or_empty	-> $1
  | STRING space_or_empty	-> $1
  | URI space_or_empty		-> $1
  | HASH space_or_empty		-> $1
  | UNICODERANGE space_or_empty	-> $1
  | INCLUDES space_or_empty	-> $1
  | DASHMATCH space_or_empty	-> $1
  | ':'	space_or_empty		-> $1
  | FUNCTION space_or_empty any_unuseds ')' space_or_empty 	-> $1 + $3 + $4
  | '(' space_or_empty any_unuseds ')' space_or_empty		-> $1 + $3 + $4
  | '[' space_or_empty any_unuseds ']' space_or_empty		-> $1 + $3 + $4
  ;

/* anys -> [ any ]* */
anys
  : any
    %{
      $$ = [];
      if ($1 !== null) $$.push($1);
    %} 
  | anys any
    %{
      $$ = [];
      var r = $$;
      $1 !== null? $1.forEach(function(e) { r.push(e); }) : '';
      if ($2 !== null) $$.push($2);
    %} 
  | -> null
  ;

/* unused -> block | ATKEYWORD S* | ';' S* | CDO S* | CDC S*; */
unused
  : block		        -> $1
  | ATKEYWORD space_or_empty    -> $1
  | ';' space_or_empty          -> $1
  | CDO space_or_empty          -> null
  | CDC space_or_empty          -> null
  ;

/* unuseds -> [ unused ]* */
unuseds
  : unused
    %{
      $$ = [];
      if ($1 !== null) $$.push($1);
    %} 
  | unuseds unused
    %{
      $$ = [];
      var r = $$;
      $1 !== null? $1.forEach(function(e) { r.push(e); }) : '';
      if ($2 !== null) $$.push($2);
    %}
  | -> null
  ; 

/* atkeywords -> [ ATKEYWORD S* ]* */
atkeywords
  : ATKEYWORD space_or_empty
    %{
      $$ = [];
      if ($1 !== null) $$.push($1);
    %} 
  | atkeywords ATKEYWORD space_or_empty
    %{
      $$ = [];
      var r = $$;
      $1 !== null? $1.forEach(function(e) { r.push(e); }) : '';
      if ($2 !== null) $$.push($2);
    %} 
  | -> null
  ;

/* semis -> [ ';' S* ]* */
semis
  : ';' space_or_empty
    %{
      $$ = [];
      if ($1 !== null) $$.push($1);
    %} 
  | semis ';' space_or_empty
    %{
      $$ = [];
      var r = $$;
      $1 !== null? $1.forEach(function(e) { r.push(e); }) : '';
      if ($2 !== null) $$.push($2);
    %} 
  | -> null
  ;

/* any_unuseds -> [any|unused]* */
any_unuseds
  : any
    %{
      $$ = [];
      $1 !== null? $$.push($1) : '';
    %}
  | anys 		        -> $1
  | unused
    %{
      $$ = [];
      $1 !== null? $$.push($1) : '';
    %}
  | unuseds 			-> $1
  | -> null
  ;

/* S|CDO|CDC */
space_cdata
  : S                   -> null
  | CDO                 -> null
  | CDC                 -> null
  ;

/* S* */
space_or_empty
  : at_least_one_space          -> $1
  | -> ""
  ;

/* S+ */
at_least_one_space
  : S                           -> " "
  | at_least_one_space S        -> " "
  ;
