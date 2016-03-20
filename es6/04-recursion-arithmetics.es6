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
var FOUR = SUCC(THREE);
var FIVE = SUCC(FOUR);
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

// helper function for addition
var ADD2 = f => x => y => (ISZERO(y))(x)(f(f)(SUCC(x))(PRED(y)));
var ADD3 = f => x => y => { if (ISZERO(y) === TRUE) {
    return x;
  } else {
    return f(f)(SUCC(x))(PRED(y));
  }
};

// recursive addition
// var ADD = ADD2(ADD2)
// ADD(ZERO)(ONE) // 'Internal Error: too much recursion'

var ADD = ADD3(ADD3);

// PRED(ADD(ONE)(ONE))===PRED(ADD(TWO)(ZERO)) // TRUE
// EQUAL(ADD(ONE)(TWO))(ADD(TWO)(ONE)) // TRUE
// numerically_equal(ADD(TWO)(THREE),5)

var MULT1 = f => x => y => (ISZERO(y))(ZERO)(ADD(x)(f(f)(x)(PRED(y))));
var MULT2 = f => x => y => { if (ISZERO(y) === TRUE) {
    return ZERO;
  } else {
    return ADD(x)(f(f)(x)(PRED(y)));
  }
};

// var MULT = MULT1(MULT1) // 'Internal Error: too much recursion'
var MULT = MULT2(MULT2);

// MULT(TWO)(TWO)  // check it with numerically_equal(MULT(TWO)(TWO), 4)
// EQUAL(MULT(FIVE)(THREE))(MULT(THREE)(FIVE)) // TRUE
