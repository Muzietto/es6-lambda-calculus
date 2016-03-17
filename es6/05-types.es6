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
var PRED = n => (ISZERO(n))(ZERO)(n(SECOND));


var MAKE_OBJ = type => value => PAIR(type)(value)

var TYPE = obj => obj(FIRST)

var VALUE = obj => obj(SECOND)

var EQUAL = a => b => { if (a === b) { return TRUE; } else { return FALSE; } }
                         
var ISTYPE = t => obj => EQUAL(TYPE(obj))(t)

// type = ZERO -> error stuff

var error_type = ZERO

var MAKE_ERROR = e => MAKE_OBJ(error_type)(e)

var ISERROR = e => ISTYPE(error_type)(e)

var ERROR = MAKE_ERROR(error_type)

// ISTYPE(error_type)(ERROR)