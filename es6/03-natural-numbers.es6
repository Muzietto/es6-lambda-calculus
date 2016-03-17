
var COND = x => y => c => c(x)(y);

var MAX = x => y => {if (x>y) {return x;} else {return y;}};

// COND(1)(2)(MAX) --> 2
// COND(11)(2)(MAX) --> 11

var TRUE = x => y => x; // TRUE === FIRST

var FALSE = x => y => y; // FALSE === SECOND

// COND(1)(2)(TRUE) --> 1
// COND(1)(2)(FALSE) --> 2

// !x = x ? false: true

var NOT = x => COND(FALSE)(TRUE)(x);

// NOT(TRUE) --> x => y => y
// NOT(FALSE) --> x => y => x

// x && y = x ? y : false

var AND = x => y => COND(y)(FALSE)(x);

// AND(TRUE)(FALSE) --> x => y => y
// AND(TRUE)(TRUE) --> x => y => x

// x || y = x ? true : y

var OR = x => y => COND(TRUE)(y)(x);

// OR(FALSE)(TRUE) --> x => y => x

var _AND = x(y)(FALSE);
var _OR = x(TRUE)(y);
