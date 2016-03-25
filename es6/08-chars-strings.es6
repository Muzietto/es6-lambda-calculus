
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

function char2CHAR(char) {
  return {
    '0': _0,
    '1': _1,
    '2': _2,
    '3': _3,
    '4': _4,
    '5': _5,
    '6': _6,
    '7': _7,
    '8': _8,
    '9': _9,
    'a': a,
    'b': b,
    'c': c,
    'd': d,
    'e': e,
    'f': f,
    'g': g,
    'h': h,
    'i': i,
    'j': j,
    'k': k,
    'l': l,
    'm': m,
    'n': n,
    'o': o,
    'p': p,
    'q': q,
    'r': r,
    's': s,
    't': t,
    'u': u,
    'v': v,
    'w': w,
    'x': x,
    'y': y,
    'z': z,
    'A': A,
    'B': B,
    'C': C,
    'D': D,
    'E': E,
    'F': F,
    'G': G,
    'H': H,
    'I': I,
    'J': J,
    'K': K,
    'L': L,
    'M': M,
    'N': N,
    'O': O,
    'P': P,
    'Q': Q,
    'R': R,
    'S': S,
    'T': T,
    'U': U,
    'V': V,
    'W': W,
    'X': X,
    'Y': Y,
    'Z': Z
  }[char];
}

// EQUAL(TYPE(char2CHAR('a')))(FOUR) // TRUE
// VALUE(char2CHAR('a'))(SECOND) // "a"
// EQUAL(VALUE(char2CHAR('a'))(FIRST))(ninety_seven) // TRUE

var string_type = FIVE;
var MAKE_STRING = charlist => (AND(ISLIST(charlist))(ALL_CHARS(charlist)))(MAKE_OBJ(string_type)(charlist))(STRING_ERROR);
var ISSTRING = ISTYPE(string_type);
var STRING_ERROR = MAKE_ERROR(string_type);

var string2STRING = string => MAKE_STRING(array2LIST(string.split('').map(char2CHAR)));

// EQUAL(TYPE(string2STRING('abc')))(FIVE) // TRUE
// EQUAL(TYPE(string2STRING('abc')))(FIVE) // TRUE
// EQUAL(TYPE(HEAD(VALUE(string2STRING('abc')))))(FOUR) // it's a CHAR
// EQUAL(LENGTH(VALUE(string2STRING('abc'))))(THREE) // 3 chars
// VALUE(HEAD(VALUE(string2STRING('abc'))))(SECOND) // "a"
// EQUAL(VALUE(HEAD(VALUE(string2STRING('abc'))))(FIRST))(ninety_seven) // ASCII 97
