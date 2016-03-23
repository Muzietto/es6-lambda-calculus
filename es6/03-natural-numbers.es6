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

// numerically_equal(SUCC(SUCC(TWO)), 4); // FIRST
// EQUAL(SUCC(ZERO))(PRED(TWO)); // SECOND