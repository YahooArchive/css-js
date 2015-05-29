/*
Copyright (c) 2015, Yahoo Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com, neraliu@gmail.com>

Grammer of CSS 2.1 specification

Reference:
- http://www.w3.org/TR/2011/REC-CSS2-20110607/syndata.html
- http://www.w3.org/TR/2011/REC-CSS2-20110607/grammar.html
- http://www.w3.org/TR/css-style-attr/
*/

%start style_attribute

%%

/* style_attribute -> S* declaration? [ ';' S* declaration? ]* */
style_attribute
  : space_or_empty declarations declaration_list
    %{
      $$ = [];
      var r = $$;
      $2 !== null? $$.push($2) : '';
      $3 !== null? $3.forEach(function(e) { r.push(e); }) : ''
      return $$;
    %}
  ;

/* declarations -> [ property ':' S* expr prio? ]? */
declarations
  : property ':' space_or_empty expr
    %{
      $$ = {};
      $$.key = $1;
      $$.value = $4;
    %}
  | property ':' space_or_empty expr prio
    %{
      $$ = {};
      $$.key = $1;
      $$.value = $4 + ' ' + $5;				/* TODO: should i need to add a space */
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

/* property -> IDENT S* */
property
  : IDENT space_or_empty 	-> $1
  ;

/* expr -> term [ operator? term ]* */
expr
  : term term_list
    %{
      $$ = $1;
      if ($2 !== null) $$ = $1 + ' ' + $2;
    %}
  ;
term_list
  : term -> $1
  | operator term -> $1 + $2
  | term_list term -> $1 + ' ' + $2
  | term_list operator term -> $1 + ' ' + $2 + $3
  | -> null
  ;

/*
term
  : unary_operator?
    [ NUMBER S* | PERCENTAGE S* | LENGTH S* | EMS S* | EXS S* | ANGLE S* |
      TIME S* | FREQ S* ]
  | STRING S* | IDENT S* | URI S* | hexcolor | function
  ;
*/
term
  : numeric_term 			-> $1
  | unary_operator numeric_term 	-> $1 + $2
  | string_term				-> $1
  ;
numeric_term
  : NUMBER space_or_empty 		-> $1 
  | PERCENTAGE space_or_empty 		-> $1 
  | LENGTH space_or_empty		-> $1
  | EMS space_or_empty			-> $1
  | EXS space_or_empty			-> $1
  | ANGLE space_or_empty		-> $1
  | TIME space_or_empty			-> $1
  | FREQ space_or_empty			-> $1
  ;
string_term
  : STRING space_or_empty		-> $1
  | IDENT space_or_empty 		-> $1
  | URI space_or_empty	 		-> $1
  | hexcolor space_or_empty		-> $1
  | function space_or_empty 		-> $1
  ;

/* prio -> IMPORTANT_SYM S* */
prio
  : IMPORTANT_SYM space_or_empty	-> $1
  ;

/* function -> FUNCTION S* expr ')' S* */
function
  : FUNCTION space_or_empty expr ')' space_or_empty -> $1 + $3 + $4
  ;

/*
* There is a constraint on the color that it must
* have either 3 or 6 hex-digits (i.e., [0-9a-fA-F])
* after the "#"; e.g., "#000" is OK, but "#abcd" is not.
* hexcolor -> HASH S*
*/
hexcolor
  : HASH space_or_empty 	-> $1
  ;

/* S+ */
at_least_one_space
  : S                           -> " "
  | at_least_one_space S        -> " "
  ;

/* S* */
space_or_empty
  : at_least_one_space 		-> $1
  | -> ""
  ;

/* unary_operator -> '-' | '+' */
unary_operator
  : '+' 			-> $1
  | '-'				-> $1
  ;

/* operator -> '/' S* | ',' S* */
operator
  : '/' space_or_empty		-> $1
  | ',' space_or_empty 		-> $1
  ;
