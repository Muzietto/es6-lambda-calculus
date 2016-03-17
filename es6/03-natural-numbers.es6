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

// ISZERO(ONE)
// ISZERO(SUCC(ZERO))

var PRED = n => (ISZERO(n))(ZERO)(n(SECOND));

// PRED(ONE) // x => x
// PRED(TWO) // f => f(x)(y)
// ISZERO(PRED(ONE)) // x => y => x
// ISZERO(PRED(TWO)) // x => y => y

