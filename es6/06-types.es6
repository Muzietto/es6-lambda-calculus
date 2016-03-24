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
var LAZY_TRUE = x => y => x();
var LAZY_FALSE = x => y => y();
var LAZY_COND = true_lazy_exp => false_lazy_exp => condition => (condition(LAZY_TRUE)(LAZY_FALSE))(true_lazy_exp)(false_lazy_exp);
var EQUAL1 = f => x => y => LAZY_COND(_ => TRUE)(_ => LAZY_COND(_ => FALSE)(_ => f(f)(PRED(x))(PRED(y)))(OR(AND(NOT(ISZERO(x)))(ISZERO(y)))(AND(ISZERO(x))(NOT(ISZERO(y))))))(AND(ISZERO(y))(ISZERO(x)));
var EQUAL = EQUAL1(EQUAL1);
var ADD3 = f => x => y => {if (ISZERO(y) === TRUE) {return x;} else {return f(f)(SUCC(x))(PRED(y));}};
var ADD = ADD3(ADD3);
var MULT2 = f => x => y => {if (ISZERO(y) === TRUE) {return ZERO;} else {return ADD(x)(f(f)(x)(PRED(y)));}};
var MULT = MULT2(MULT2);


var MAKE_OBJ = type => value => PAIR(type)(value);
var TYPE = obj => obj(FIRST);
var VALUE = obj => obj(SECOND);
var ISTYPE = t => obj => EQUAL(TYPE(obj))(t);

// --> type = ZERO -> error stuff
var error_type = ZERO;
var MAKE_ERROR = e => MAKE_OBJ(error_type)(e);
var ISERROR = e => ISTYPE(error_type)(e);
// example of error instance
var ERROR = MAKE_ERROR(error_type);

// ISERROR(ERROR) // x => y => x
// ISTYPE(error_type)(ERROR)

// --> type = ONE -> boolean stuff
var bool_type = ONE;
var MAKE_BOOL = MAKE_OBJ(bool_type);
var ISBOOL = ISTYPE(bool_type);

// boolean instances
var TRUE_OBJ = MAKE_BOOL(TRUE);
var FALSE_OBJ = MAKE_BOOL(FALSE);

// specific error
var BOOL_ERROR = MAKE_ERROR(bool_type);

// ISBOOL(TRUE_OBJ) // x => y => x
// ISERROR(FALSE_OBJ) // x => y => y
// ISERROR(BOOL_ERROR) // x => y => x

var TYPED_NOT = X => (ISBOOL(X))(MAKE_BOOL(NOT(VALUE(X))))(BOOL_ERROR);

// VALUE(TYPED_NOT(TRUE_OBJ)) --> FALSE
// TYPE(TYPED_NOT(TRUE_OBJ)) --> bool_type === ONE
// PRED(TYPE(TYPED_NOT(TRUE_OBJ))) --> IDENTITY
// VALUE(TYPED_NOT(ERROR)) --> bool_error === ONE
// TYPE(TYPED_NOT(ERROR)) --> error_type === ZERO === IDENTITY

var TYPED_AND = X => Y => (AND(ISBOOL(X))(ISBOOL(Y)))(MAKE_BOOL(AND(VALUE(X))(VALUE(Y))))(BOOL_ERROR);
var TYPED_OR = X => Y => (OR(ISBOOL(X))(ISBOOL(Y)))(MAKE_BOOL(OR(VALUE(X))(VALUE(Y))))(BOOL_ERROR);

// VALUE(TYPED_AND(TRUE_OBJ)(TRUE_OBJ)) --> TRUE
// TYPE(TYPED_AND(TRUE_OBJ)(TRUE_OBJ)) --> bool_type === ONE
// VALUE(TYPED_OR(FALSE_OBJ)(FALSE_OBJ)) --> FALSE
// VALUE(TYPED_AND(TRUE_OBJ)(ERROR)) --> bool_error === ONE
// TYPE(TYPED_OR(ERROR)(ERROR)) --> error_type === ZERO === IDENTITY
// VALUE(TYPED_AND(TRUE_OBJ)(TYPED_NOT(FALSE_OBJ))) // FIRST

// --> type = TWO -> numeral stuff
var num_type = TWO;
var MAKE_NUM = MAKE_OBJ(num_type);
var ISNUM = ISTYPE(num_type);

// number instances
var ZERO_OBJ = MAKE_NUM(ZERO);
var ONE_OBJ = MAKE_NUM(ONE);
var TWO_OBJ = MAKE_NUM(TWO);
var THREE_OBJ = MAKE_NUM(THREE);

// specific error
var NUM_ERROR = MAKE_ERROR(num_type);

// ISNUM(TWO_OBJ) // TRUE --> x => y => x
// ISERROR(ZERO_OBJ) // FALSE --> x => y => y
// ISERROR(NUM_ERROR) // TRUE --> x => y => x

var TYPED_ADD = X => Y => (AND(ISNUM(X))(ISNUM(Y)))(MAKE_NUM(ADD(VALUE(X))(VALUE(Y))))(NUM_ERROR);
var TYPED_MULT = X => Y => (AND(ISNUM(X))(ISNUM(Y)))(MAKE_NUM(MULT(VALUE(X))(VALUE(Y))))(NUM_ERROR);

// PRED(PRED(PRED(VALUE(TYPED_MULT(ONE_OBJ)(TWO_OBJ)))))
// TYPE(TYPED_MULT(ONE_OBJ)(TWO_OBJ))===TWO // true
// EQUAL(VALUE(TYPED_MULT(TWO_OBJ)(TWO_OBJ)))(FOUR) // FIRST
// PRED(VALUE(TYPED_ADD(ONE_OBJ)(ONE_OBJ)))===ONE // true
// TYPE(TYPED_ADD(ONE_OBJ)(TRUE_OBJ))===ZERO // true

