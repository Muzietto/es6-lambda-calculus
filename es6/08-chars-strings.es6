// needed building blocks
var IDENTITY = x => x;
var PAIR = x => y => f => f(x)(y);
var FIRST = x => y => x;
var SECOND = x => y => y;
var TRUE = FIRST;
var FALSE = SECOND;
var COND = PAIR;
var NOT = x => x(FALSE)(TRUE); // COND(FALSE)(TRUE)(x)
var AND = x => y => x(y)(FALSE);
var OR = x => y => x(TRUE)(y);
var ZERO = IDENTITY;
var ISZERO = n => n(FIRST);
var SUCC = n => PAIR(FALSE)(n);
var ONE = SUCC(ZERO);
var TWO = SUCC(ONE);
var THREE = SUCC(TWO);
var FOUR = SUCC(THREE);
var FIVE = SUCC(FOUR);
var SIX = SUCC(FIVE);
var SEVEN = SUCC(SIX);
var EIGHT = SUCC(SEVEN);
var NINE = SUCC(EIGHT);
var TEN = SUCC(NINE);
var PRED = n => (ISZERO(n))(ZERO)(n(SECOND));
// helper stuff for experimenting with Church numerals
var numerically_equal = (numeral, int) => {
  if (int < 0) throw 'numerically_equal: natural numbers are always positive';
  if (numeral === ZERO && int > 0) return FALSE;
  if (int === 0) {
    if (numeral === ZERO) return TRUE;
    else return FALSE;
  }
  else return numerically_equal(PRED(numeral), int - 1);
};  
var EQUAL = a => b => {
  if (ISZERO(b) === TRUE) { 
    if (ISZERO(a) === TRUE) return TRUE;
    else return FALSE;
  }
  if (ISZERO(a) === TRUE) { 
    if (ISZERO(b) === TRUE) return TRUE;
    else return FALSE;
  }
  else return EQUAL(PRED(a))(PRED(b));
};
var LAZY_TRUE = x => y => x();
var LAZY_FALSE = x => y => y();
var LAZY_COND = true_lazy_exp => false_lazy_exp => condition => (condition(LAZY_TRUE)(LAZY_FALSE))(true_lazy_exp)(false_lazy_exp);
var EQUAL1 = f => x => y => LAZY_COND(_ => TRUE)(_ => LAZY_COND(_ => FALSE)(_ => f(f)(PRED(x))(PRED(y)))(OR(AND(NOT(ISZERO(x)))(ISZERO(y)))(AND(ISZERO(x))(NOT(ISZERO(y))))))(AND(ISZERO(y))(ISZERO(x)));
var EQUAL = EQUAL1(EQUAL1);
var ADD3 = f => x => y => {if (ISZERO(y) === TRUE) {return x;} else {return f(f)(SUCC(x))(PRED(y));}};
var ADD = ADD3(ADD3);
var MULT2 = f => x => y => {if (ISZERO(y) === TRUE) {return ZERO;} else {return ADD(x)(f(f)(x)(PRED(y)));}};
var MULT = MULT2(MULT2);
var MAKE_OBJ = type => value => PAIR(type)(value)
var TYPE = obj => obj(FIRST);
var VALUE = obj => obj(SECOND);
var ISTYPE = t => obj => EQUAL(TYPE(obj))(t);
// --> type = ZERO -> error stuff
var error_type = ZERO;
var MAKE_ERROR = e => MAKE_OBJ(error_type)(e);
var ISERROR = e => ISTYPE(error_type)(e);
var ERROR = MAKE_ERROR(error_type);
// --> type = ONE -> boolean stuff
var bool_type = ONE;
var MAKE_BOOL = MAKE_OBJ(bool_type);
var ISBOOL = ISTYPE(bool_type);
var TRUE_OBJ = MAKE_BOOL(TRUE);
var FALSE_OBJ = MAKE_BOOL(FALSE);
var BOOL_ERROR = MAKE_ERROR(bool_type);
var TYPED_NOT = X => (ISBOOL(X))(MAKE_BOOL(NOT(VALUE(X))))(BOOL_ERROR);
var TYPED_AND = X => Y => (AND(ISBOOL(X)(ISBOOL(Y))))(MAKE_BOOL(AND(VALUE(X))(VALUE(Y))))(BOOL_ERROR);
var TYPED_OR = X => Y => (OR(ISBOOL(X)(ISBOOL(Y))))(MAKE_BOOL(OR(VALUE(X))(VALUE(Y))))(BOOL_ERROR);
// --> type = TWO -> numeral stuff
var num_type = TWO;
var MAKE_NUM = MAKE_OBJ(num_type);
var ISNUM = ISTYPE(num_type);
var ZERO_OBJ = MAKE_NUM(ZERO);
var ONE_OBJ = MAKE_NUM(ONE);
var TWO_OBJ = MAKE_NUM(TWO);
var THREE_OBJ = MAKE_NUM(THREE);
var NUM_ERROR = MAKE_ERROR(num_type);
var TYPED_ADD = X => Y => (AND(ISNUM(X))(ISNUM(Y)))(MAKE_NUM(ADD(VALUE(X))(VALUE(Y))))(NUM_ERROR);
var TYPED_MULT = X => Y => (AND(ISNUM(X))(ISNUM(Y)))(MAKE_NUM(MULT(VALUE(X))(VALUE(Y))))(NUM_ERROR);


var char_type = FOUR;
var MAKE_CHAR = MAKE_OBJ(char_type);
var ISCHAR = ISTYPE(char_type);
var CHAR_ERROR = MAKE_ERROR(char_type);
var forty_eight = MULT(SIX)(MULT(FOUR)(TWO));
var sixty_five = MULT(FIVE)(ADD(FIVE)(ADD(FIVE)(THREE)));
var ninety_seven = ADD(ONE)(MULT(TWO)(forty_eight));

var _0 = MAKE_CHAR(PAIR(forty_eight)('0'));
var _1 = MAKE_CHAR(PAIR(SUCC(VALUE(_0)(FIRST)))('1'));
var _2 = MAKE_CHAR(PAIR(SUCC(VALUE(_1)(FIRST)))('2'));
var _3 = MAKE_CHAR(PAIR(SUCC(VALUE(_2)(FIRST)))('3'));
var _4 = MAKE_CHAR(PAIR(SUCC(VALUE(_3)(FIRST)))('4'));
var _5 = MAKE_CHAR(PAIR(SUCC(VALUE(_4)(FIRST)))('5'));
var _6 = MAKE_CHAR(PAIR(SUCC(VALUE(_5)(FIRST)))('6'));
var _7 = MAKE_CHAR(PAIR(SUCC(VALUE(_6)(FIRST)))('7'));
var _8 = MAKE_CHAR(PAIR(SUCC(VALUE(_7)(FIRST)))('8'));
var _9 = MAKE_CHAR(PAIR(SUCC(VALUE(_8)(FIRST)))('9'));
var A = MAKE_CHAR(PAIR(sixty_five)('A'));
var B = MAKE_CHAR(PAIR(SUCC(VALUE(A)(FIRST)))('B'));
var C = MAKE_CHAR(PAIR(SUCC(VALUE(B)(FIRST)))('C'));
var D = MAKE_CHAR(PAIR(SUCC(VALUE(C)(FIRST)))('D'));
var E = MAKE_CHAR(PAIR(SUCC(VALUE(D)(FIRST)))('E'));
var F = MAKE_CHAR(PAIR(SUCC(VALUE(E)(FIRST)))('F'));
var G = MAKE_CHAR(PAIR(SUCC(VALUE(F)(FIRST)))('G'));
var H = MAKE_CHAR(PAIR(SUCC(VALUE(G)(FIRST)))('H'));
var I = MAKE_CHAR(PAIR(SUCC(VALUE(H)(FIRST)))('I'));
var J = MAKE_CHAR(PAIR(SUCC(VALUE(I)(FIRST)))('J'));
var K = MAKE_CHAR(PAIR(SUCC(VALUE(J)(FIRST)))('K'));
var L = MAKE_CHAR(PAIR(SUCC(VALUE(K)(FIRST)))('L'));
var M = MAKE_CHAR(PAIR(SUCC(VALUE(L)(FIRST)))('M'));
var N = MAKE_CHAR(PAIR(SUCC(VALUE(M)(FIRST)))('N'));
var O = MAKE_CHAR(PAIR(SUCC(VALUE(N)(FIRST)))('O'));
var P = MAKE_CHAR(PAIR(SUCC(VALUE(O)(FIRST)))('P'));
var Q = MAKE_CHAR(PAIR(SUCC(VALUE(P)(FIRST)))('Q'));
var R = MAKE_CHAR(PAIR(SUCC(VALUE(Q)(FIRST)))('R'));
var S = MAKE_CHAR(PAIR(SUCC(VALUE(R)(FIRST)))('S'));
var T = MAKE_CHAR(PAIR(SUCC(VALUE(S)(FIRST)))('T'));
var U = MAKE_CHAR(PAIR(SUCC(VALUE(T)(FIRST)))('U'));
var V = MAKE_CHAR(PAIR(SUCC(VALUE(U)(FIRST)))('V'));
var W = MAKE_CHAR(PAIR(SUCC(VALUE(V)(FIRST)))('W'));
var X = MAKE_CHAR(PAIR(SUCC(VALUE(W)(FIRST)))('X'));
var Y = MAKE_CHAR(PAIR(SUCC(VALUE(X)(FIRST)))('Y'));
var Z = MAKE_CHAR(PAIR(SUCC(VALUE(Y)(FIRST)))('Z'));
var a = MAKE_CHAR(PAIR(ninety_seven)('a'));
var b = MAKE_CHAR(PAIR(SUCC(VALUE(a)(FIRST)))('b'));
var c = MAKE_CHAR(PAIR(SUCC(VALUE(b)(FIRST)))('c'));
var d = MAKE_CHAR(PAIR(SUCC(VALUE(c)(FIRST)))('d'));
var e = MAKE_CHAR(PAIR(SUCC(VALUE(d)(FIRST)))('e'));
var f = MAKE_CHAR(PAIR(SUCC(VALUE(e)(FIRST)))('f'));
var g = MAKE_CHAR(PAIR(SUCC(VALUE(f)(FIRST)))('g'));
var h = MAKE_CHAR(PAIR(SUCC(VALUE(g)(FIRST)))('h'));
var i = MAKE_CHAR(PAIR(SUCC(VALUE(h)(FIRST)))('i'));
var j = MAKE_CHAR(PAIR(SUCC(VALUE(i)(FIRST)))('j'));
var k = MAKE_CHAR(PAIR(SUCC(VALUE(j)(FIRST)))('k'));
var l = MAKE_CHAR(PAIR(SUCC(VALUE(k)(FIRST)))('l'));
var m = MAKE_CHAR(PAIR(SUCC(VALUE(l)(FIRST)))('m'));
var n = MAKE_CHAR(PAIR(SUCC(VALUE(m)(FIRST)))('n'));
var o = MAKE_CHAR(PAIR(SUCC(VALUE(n)(FIRST)))('o'));
var p = MAKE_CHAR(PAIR(SUCC(VALUE(o)(FIRST)))('p'));
var q = MAKE_CHAR(PAIR(SUCC(VALUE(p)(FIRST)))('q'));
var r = MAKE_CHAR(PAIR(SUCC(VALUE(q)(FIRST)))('r'));
var s = MAKE_CHAR(PAIR(SUCC(VALUE(r)(FIRST)))('s'));
var t = MAKE_CHAR(PAIR(SUCC(VALUE(s)(FIRST)))('t'));
var u = MAKE_CHAR(PAIR(SUCC(VALUE(t)(FIRST)))('u'));
var v = MAKE_CHAR(PAIR(SUCC(VALUE(u)(FIRST)))('v'));
var w = MAKE_CHAR(PAIR(SUCC(VALUE(v)(FIRST)))('w'));
var x = MAKE_CHAR(PAIR(SUCC(VALUE(w)(FIRST)))('x'));
var y = MAKE_CHAR(PAIR(SUCC(VALUE(x)(FIRST)))('y'));
var z = MAKE_CHAR(PAIR(SUCC(VALUE(y)(FIRST)))('z'));

// a few checks...
// EQUAL(VALUE(B)(FIRST))(SUCC(sixty_five)) // TRUE
// numerically_equal(VALUE(V)(FIRST),86) // TRUE
// VALUE(V)(FIRST) // "V"
