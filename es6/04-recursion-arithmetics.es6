// needed building blocks
var IDENTITY = x => x;
var PAIR = x => y => f => f(x)(y);
var FIRST = x => y => x;
var SECOND = x => y => y;
var TRUE = FIRST;
var FALSE = SECOND;
var COND = PAIR;
var ZERO = IDENTITY;
var ISZERO = n => n(FIRST);
var SUCC = n => PAIR(FALSE)(n);
var ONE = SUCC(ZERO);
var TWO = SUCC(ONE);
var THREE = SUCC(TWO);
var PRED = n => (ISZERO(n))(ZERO)(n(SECOND));

// helper function for addition
var ADD2 = f => x => y => (ISZERO(y))(x)(f(f)(SUCC(x))(PRED(y)))

// recursive addition
var ADD = ADD2(ADD2)

// ADD(ZERO)(ONE) // 'Internal Error: too much recursion'

var RECURSIVE = f => (s => (f(s(s))))(s => (f(s(s))))

var MULT1 = f => x => y => (ISZERO(y))(ZERO)(ADD(x)(f(x)(PRED(y)))) 

// var MULT = RECURSIVE(MULT1) // 'Internal Error: too much recursion'

