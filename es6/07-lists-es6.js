
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
var LENGTH = SELF_APPLY(LEN2);

// EQUAL(LENGTH(CONS(TWO_OBJ)(NIL)))(ONE) //TRUE
// EQUAL(LENGTH(CONS(TWO_OBJ)(CONS(ONE_OBJ)(NIL))))(TWO) // TRUE

var APP1 = f => list => (ISEMPTY(list))(CONS(element)(NIL))(CONS(HEAD(list))(f(f)(element)(TAIL(list)))); // eager - won't work
var APP2 = f => element => list => LAZY_COND(_ => CONS(element)(NIL))(_ => CONS(HEAD(list))(f(f)(element)(TAIL(list))))(ISEMPTY(list)) // lazy - will do
var APPEND = SELF_APPLY(APP2);

// EQUAL(LENGTH(APPEND(THREE_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))))(THREE) // TRUE
// EQUAL(VALUE(HEAD(APPEND(THREE_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))))))(ONE)
// EQUAL(VALUE(HEAD(TAIL(APPEND(THREE_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))))))(TWO)
// EQUAL(VALUE(HEAD(TAIL(TAIL(APPEND(THREE_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))))))))(THREE)

var MAP1 = f => list => mapper => LAZY_COND(_ => NIL)(_ => CONS(mapper(HEAD(list)))(f(f)(TAIL(list))(mapper)))(ISEMPTY(list)) // lazy - will do
var MAP = SELF_APPLY(MAP1); // MAP list mapper

// MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))) // CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL)))
// EQUAL(LENGTH(MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))))))(THREE) // TRUE
// EQUAL(VALUE(HEAD(MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))))))(ONE) // TRUE
// EQUAL(VALUE(HEAD(TAIL(MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))))))))(TWO) // TRUE
// EQUAL(VALUE(HEAD(TAIL(TAIL(MAP(TYPED_ADD(ONE_OBJ))(CONS(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL)))))))))(THREE) // TRUE

var RED1 = f => fun => acc => list => LAZY_COND(_ => acc)(_ => f(f)(fun)(fun(acc)(HEAD(list)))(TAIL(list)))(ISEMPTY(list)) // lazy - will do
var REDUCE = SELF_APPLY(RED1); // REDUCE fun acc list

// EQUAL(VALUE(REDUCE(TYPED_ADD)(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL))))))(SIX)
// EQUAL(TYPE(REDUCE(TYPED_ADD)(ZERO_OBJ)(CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL))))))(TWO) // it's a numeral...

// VALUE(REDUCE(TYPED_AND)(TRUE_OBJ)(CONS(TRUE_OBJ)(CONS(TRUE_OBJ)(CONS(TYPED_NOT(FALSE_OBJ))(NIL))))) // TRUE
// EQUAL(TYPE(REDUCE(TYPED_AND)(TRUE_OBJ)(CONS(TRUE_OBJ)(CONS(TRUE_OBJ)(CONS(TYPED_NOT(FALSE_OBJ))(NIL))))))(ONE) // it's a BOOLEAN...

var ALL = predicate => list => REDUCE(TYPED_AND)(TRUE_OBJ)(MAP(predicate)(list));
var EVERY = ALL;

// ISBOOL(ALL(x => MAKE_BOOL(ISNUM(x)))(CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL))))) // TRUE
// VALUE(ALL(x => MAKE_BOOL(ISNUM(x)))(CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL))))) // TRUE
// VALUE(ALL(x => MAKE_BOOL(ISNUM(x)))(CONS(ONE_OBJ)(CONS(TRUE_OBJ)(CONS(THREE_OBJ)(NIL))))) // FALSE

// from now on we produce only TYPED booleans
var ALL_ERRORS  = errorlist  => ALL(x => MAKE_BOOL(ISERROR(x)))(charlist);
var ALL_BOOLS   = boollist   => ALL(x => MAKE_BOOL(ISBOOL(x)))(charlist);
var ALL_NUMS    = numlist    => ALL(x => MAKE_BOOL(ISNUM(x)))(charlist);
var ALL_LISTS   = listlist   => ALL(x => MAKE_BOOL(ISLIST(x)))(charlist);
var ALL_CHARS   = charlist   => ALL(x => MAKE_BOOL(ISCHAR(x)))(charlist);
var ALL_STRINGS = stringlist => ALL(x => MAKE_BOOL(ISSTRING(x)))(charlist);

var ANY = predicate => list => REDUCE(TYPED_OR)(FALSE_OBJ)(MAP(predicate)(list));
var SOME = ANY;

// ISBOOL(ANY(x => MAKE_BOOL(ISBOOL(x)))(CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL))))) // TRUE
// VALUE(ANY(x => MAKE_BOOL(ISBOOL(x)))(CONS(ONE_OBJ)(CONS(TWO_OBJ)(CONS(THREE_OBJ)(NIL))))) // FALSE
// VALUE(ANY(x => MAKE_BOOL(ISBOOL(x)))(CONS(ONE_OBJ)(CONS(TRUE_OBJ)(CONS(THREE_OBJ)(NIL))))) // TRUE

var LIST2ARRAY = REDUCE(arra => head_list => [head_list].concat(arra))([]);

// EQUAL(VALUE(LIST2ARRAY(CONS(ONE_OBJ)(NIL))[0]))(ONE); // TRUE
// LIST2ARRAY(CONS(ONE_OBJ)(CONS(TWO_OBJ)(NIL))).length // 2

// pay attention to that reverse
var array2LIST = array => array.reverse().reduce((acc, curr) => CONS(curr)(acc), NIL);

// EQUAL(VALUE(HEAD(array2LIST([ONE_OBJ,TWO_OBJ,THREE_OBJ]))))(ONE) // TRUE
// EQUAL(TYPE(array2LIST([ONE_OBJ,TWO_OBJ,THREE_OBJ])))(THREE) // it's a list
// EQUAL(LENGTH(array2LIST([ONE_OBJ,TWO_OBJ,THREE_OBJ])))(THREE) // TRUE
