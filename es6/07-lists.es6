
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
