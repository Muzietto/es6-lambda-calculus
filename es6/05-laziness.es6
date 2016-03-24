// needed building blocks
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

var LAZY_TRUE = x => y => x();
var LAZY_FALSE = x => y => y();
var LAZY_COND = true_lazy_exp => false_lazy_exp => condition => (condition(LAZY_TRUE)(LAZY_FALSE))(true_lazy_exp)(false_lazy_exp);

// var BIGGER_X_THAN_Y = x => y => (AND(ISZERO(y))(NOT(ISZERO(x))))(TRUE)(BIGGER_X_THAN_Y(PRED(x))(PRED(y))); // forbidden syntax

var BIGGER_X_THAN_Y1 = f => x => y => LAZY_COND(_ => TRUE)(_ => f(f)(PRED(x))(PRED(y)))(AND(ISZERO(y))(NOT(ISZERO(x))));
// BIGGER_X_THAN_Y = BIGGER_X_THAN_Y1(BIGGER_X_THAN_Y1);
// BIGGER_X_THAN_Y(THREE)(TWO); // TRUE
// BIGGER_X_THAN_Y(THREE)(FOUR); // Error - Too much recursion
// BIGGER_X_THAN_Y(THREE)(THREE); // Error - Too much recursion

var BIGGER_X_THAN_Y2 = f => x => y => LAZY_COND(_ => TRUE)(_ => LAZY_COND(_ => FALSE)(_ => f(f)(PRED(x))(PRED(y)))(AND(ISZERO(x))(NOT(ISZERO(y)))))(AND(ISZERO(y))(NOT(ISZERO(x))));
// BIGGER_X_THAN_Y = BIGGER_X_THAN_Y2(BIGGER_X_THAN_Y2);
// BIGGER_X_THAN_Y(THREE)(TWO); // TRUE
// BIGGER_X_THAN_Y(THREE)(FOUR); // FALSE
// BIGGER_X_THAN_Y(THREE)(THREE); // Error - Too much recursion

// the good one!
var BIGGER_X_THAN_Y3 = f => x => y => LAZY_COND(_ => TRUE)(_ => LAZY_COND(_ => FALSE)(_ => f(f)(PRED(x))(PRED(y)))(OR(AND(ISZERO(x))(ISZERO(y)))(AND(ISZERO(x))(NOT(ISZERO(y))))))(AND(ISZERO(y))(NOT(ISZERO(x))));
BIGGER_X_THAN_Y = BIGGER_X_THAN_Y3(BIGGER_X_THAN_Y3);
// BIGGER_X_THAN_Y(THREE)(TWO); // TRUE
// BIGGER_X_THAN_Y(THREE)(FOUR); // FALSE
// BIGGER_X_THAN_Y(THREE)(THREE); // FALSE

var EQUAL1 = f => x => y => LAZY_COND(_ => TRUE)(_ => LAZY_COND(_ => FALSE)(_ => f(f)(PRED(x))(PRED(y)))(OR(AND(NOT(ISZERO(x)))(ISZERO(y)))(AND(ISZERO(x))(NOT(ISZERO(y))))))(AND(ISZERO(y))(ISZERO(x)));
var EQUAL = EQUAL1(EQUAL1);
// EQUAL(THREE)(TWO); // FALSE
// EQUAL(THREE)(FOUR); // FALSE
// EQUAL(THREE)(THREE); // TRUE

