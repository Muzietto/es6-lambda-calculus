var IDENTITY = x => x;
var PAIR = x => y => f => f(x)(y);
var FIRST = x => y => x;
var SECOND = x => y => y;
var COND = x => y => c => c(x)(y);
var TRUE = x => y => x; // TRUE === FIRST
var FALSE = x => y => y; // FALSE === SECOND
var NOT = x => COND(FALSE)(TRUE)(x);
var AND = x => y => COND(y)(FALSE)(x);
var OR = x => y => COND(TRUE)(y)(x);
var ZERO = IDENTITY;
var ISZERO = n => n(FIRST);
var SUCC = n => PAIR(FALSE)(n);
var PRED = n => (ISZERO(n))(ZERO)(n(SECOND));
var ONE = SUCC(ZERO);
var TWO = SUCC(ONE);
var THREE = SUCC(TWO);
var FOUR = SUCC(THREE);
var FIVE = SUCC(FOUR);
var SIX = SUCC(FIVE);
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

var LAZY_COND = true_exp => false_exp => pred => pred(LAZY_TRUE)(LAZY_FALSE)(_ => true_exp)(_ => false_exp);

var MAX = x => y => {if (x>y) {return x;} else {return y;}};


//var MAX = LAZY_COND(x)(y)()