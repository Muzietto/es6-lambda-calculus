
var IDENTITY = x => x
var ID = IDENTITY;
var I = IDENTITY;

IDENTITY(1) // --> 1

IDENTITY(IDENTITY) // --> IDENTITY

(x => x)(x => x) // --> x => x

////////////////////////////////////////

var ADD_1 = x => x + 1

ADD_1(12) // --> 13

(x => y => x + y)(1)(2) // --> 3

(x => y => x + y)(1) // --> ADD_1

///////////////////////////////////////

var SELF_APPLY = s => s(s)
var S = SELF_APPLY;

S(I) // --> I

S(S) // --> S(S)

///////////////////////////////////////

var APPLY = f => x => f(x)

APPLY(ID)(SELF_APPLY) // ID

///////////////////////////////////////

var PAIR = x => y => f => f(x)(y)

PAIR(1)(2) // f => f(1)(2)

var FIRST = x => y => x

var SECOND = x => y => y

PAIR(1)(2)(FIRST) // --> 1

PAIR(1)(2)(SECOND) // --> 2
