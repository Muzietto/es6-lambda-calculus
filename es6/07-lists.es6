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
var ADD = ADD3(ADD3)
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
var ERROR = MAKE_ERROR(error_type);
// --> type = ONE -> boolean stuff
var bool_type = ONE;
var MAKE_BOOL = MAKE_OBJ(bool_type);
var ISBOOL = ISTYPE(bool_type);
var TRUE_OBJ = MAKE_BOOL(TRUE);
var FALSE_OBJ = MAKE_BOOL(FALSE);
var BOOL_ERROR = MAKE_ERROR(bool_type);
var TYPED_NOT = X => (ISBOOL(X))(MAKE_BOOL(NOT(VALUE(X))))(BOOL_ERROR)
var TYPED_AND = X => Y => (AND(ISBOOL(X))(ISBOOL(Y)))(MAKE_BOOL(AND(VALUE(X))(VALUE(Y))))(BOOL_ERROR);
var TYPED_OR = X => Y => (OR(ISBOOL(X))(ISBOOL(Y)))(MAKE_BOOL(OR(VALUE(X))(VALUE(Y))))(BOOL_ERROR);
// --> type = TWO -> numeral stuff
var num_type = TWO;
var MAKE_NUM = MAKE_OBJ(num_type);
var ISNUM = ISTYPE(num_type);
var ZERO_OBJ = MAKE_NUM(ZERO);
var ONE_OBJ = MAKE_NUM(ONE);
var TWO_OBJ = MAKE_NUM(TWO);
var THREE_OBJ = MAKE_NUM(THREE);
var FOUR_OBJ = MAKE_NUM(FOUR);
var FIVE_OBJ = MAKE_NUM(FIVE);
var SIX_OBJ = MAKE_NUM(SIX);
var NUM_ERROR = MAKE_ERROR(num_type);
var TYPED_ADD = X => Y => (AND(ISNUM(X))(ISNUM(Y)))(MAKE_NUM(ADD(VALUE(X))(VALUE(Y))))(NUM_ERROR);
var TYPED_MULT = X => Y => (AND(ISNUM(X))(ISNUM(Y)))(MAKE_NUM(MULT(VALUE(X))(VALUE(Y))))(NUM_ERROR);


var list_type = THREE;
var ISLIST = ISTYPE(list_type);
var LIST_ERROR = MAKE_ERROR(list_type);
var MAKE_LIST = MAKE_OBJ(list_type);
var CONS = H => T => (ISLIST(T))(MAKE_LIST(PAIR(H)(T)))(LIST_ERROR);
var HEAD = list => (ISLIST(list))(VALUE(list)(FIRST))(LIST_ERROR);
var TAIL = list => (ISLIST(list))(VALUE(list)(SECOND))(LIST_ERROR);
var NIL = MAKE_LIST(PAIR(LIST_ERROR)(LIST_ERROR)); // a very strange NIL, indeed...
// NB - this ISEMPTY works correctly only when the list contains typed objects!!
var ISEMPTY = list => (ISLIST(list))(ISERROR(HEAD(list)))(FALSE);
var ISNIL = ISEMPTY;

// ISLIST(NIL) // TRUE
// ISEMPTY(NIL) // TRUE
// ISEMPTY(CONS(ONE)(NIL)) // TRUE <-- WRONG!!!!
// ISEMPTY(CONS(ONE_OBJ)(NIL)) // FALSE <-- CORRECT!
// ISNIL(TAIL(CONS(ONE_OBJ)(NIL))) // TRUE
// numerically_equal(HEAD(CONS(ONE)(NIL)),1) // TRUE

// EQUAL(TYPE(CONS(ONE_OBJ)(TWO)))(ZERO) // ERROR
// EQUAL(VALUE(CONS(ONE_OBJ)(TWO)))(THREE) // list_type

// EQUAL(VALUE(CONS(ONE_OBJ)(NIL))(FIRST))(ONE) // TRUE
// EQUAL(TYPE(CONS(ONE_OBJ)(NIL)))(THREE) // TRUE

var LEN1 = f => list => (ISEMPTY(list))(ZERO)(SUCC(f(f)(TAIL(list)))); // eager - won't work
var LEN2 = f => list => LAZY_COND(_ => ZERO)(_ => SUCC(f(f)(TAIL(list))))(ISEMPTY(list)) // lazy - will do
var LENGTH = LEN2(LEN2);

// EQUAL(LENGTH(CONS(TWO_OBJ)(NIL)))(ONE) //TRUE
// EQUAL(LENGTH(CONS(TWO_OBJ)(CONS(ONE_OBJ)(NIL))))(TWO) // TRUE

var APP1 = f => list => (ISEMPTY(list))(CONS(element)(NIL))(CONS(HEAD(list))(f(f)(element)(TAIL(list)))); // eager - won't work
var APP2 = f => element => list => LAZY_COND(_ => CONS(element)(NIL))(_ => CONS(HEAD(list))(f(f)(element)(TAIL(list))))(ISEMPTY(list)) // lazy - will do
var APPEND = APP2(APP2);

// EQUAL(LENGTH(APPEND(THREE_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))))(THREE) // TRUE
// EQUAL(VALUE(HEAD(APPEND(THREE_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))))))(ONE)
// EQUAL(VALUE(HEAD(TAIL(APPEND(THREE_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))))))(TWO)
// EQUAL(VALUE(HEAD(TAIL(TAIL(APPEND(THREE_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))))))))(THREE)

var MAP2 = f => mapper => list => LAZY_COND(_ => NIL)(_ => CONS(mapper(HEAD(list)))(f(f)(mapper)(TAIL(list))))(ISEMPTY(list)) // lazy - will do
var MAP = MAP2(MAP2); // MAP list mapper

// MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))) // CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL)))
// EQUAL(LENGTH(MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))))))(THREE) // TRUE
// EQUAL(VALUE(HEAD(MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))))))(ONE) // TRUE
// EQUAL(VALUE(HEAD(TAIL(MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))))))))(TWO) // TRUE
// EQUAL(VALUE(HEAD(TAIL(TAIL(MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))))))))(THREE) // TRUE

var RED2 = f => fun => acc => list => LAZY_COND(_ => acc)(_ => f(f)(fun)(fun(acc)(HEAD(list)))(TAIL(list)))(ISEMPTY(list)) // lazy - will do
var REDUCE = RED2(RED2); // REDUCE fun acc list

// EQUAL(VALUE(REDUCE(TYPED_ADD)(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL))))))(SIX)
// EQUAL(TYPE(REDUCE(TYPED_ADD)(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL))))))(TWO) // it's a numeral...

// VALUE(REDUCE(TYPED_AND)(TRUE_OBJ)(CONS(TRUE_OBJ)(CONS(TRUE_OBJ)(CONS(TYPED_NOT(FALSE_OBJ))(NIL))))) // TRUE
// EQUAL(TYPE(REDUCE(TYPED_AND)(TRUE_OBJ)(CONS(TRUE_OBJ)(CONS(TRUE_OBJ)(CONS(TYPED_NOT(FALSE_OBJ))(NIL))))))(ONE) // it's a BOOLEAN...

var LIST2ARRAY = REDUCE(arra => head_list => [head_list].concat(arra))([]);

// EQUAL(VALUE(LIST2ARRAY(CONS(ONE_OBJ)(NIL))[0]))(ONE); // TRUE
// LIST2ARRAY(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))).length // 2

// why on earth do we need that reverse?
var ARRAY2LIST = array => array.reverse().reduce((acc, curr) => CONS(curr)(acc), NIL);

// EQUAL(VALUE(HEAD(ARRAY2LIST([ONE_OBJ,TWO_OBJ,THREE_OBJ]))))(ONE) // TRUE
// EQUAL(TYPE(ARRAY2LIST([ONE_OBJ,TWO_OBJ,THREE_OBJ])))(THREE) // it's a list
// EQUAL(LENGTH(ARRAY2LIST([ONE_OBJ,TWO_OBJ,THREE_OBJ])))(THREE) // TRUE
