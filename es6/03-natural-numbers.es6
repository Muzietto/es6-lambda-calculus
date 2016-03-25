
var ZERO = IDENTITY;

var ISZERO = n => n(FIRST);

var SUCC = n => PAIR(FALSE)(n);

var ONE   = SUCC(ZERO);
var TWO   = SUCC(ONE);
var THREE = SUCC(TWO);
var FOUR  = SUCC(THREE);
var FIVE  = SUCC(FOUR);
var SIX   = SUCC(FIVE);
var SEVEN = SUCC(SIX);
var EIGHT = SUCC(SEVEN);
var NINE  = SUCC(EIGHT);
var TEN   = SUCC(NINE);

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

// numerically_equal(SUCC(SUCC(TWO)), 4); // FIRST
