
// helper function for addition
var ADD2 = f => x => y => (ISZERO(y))(x)(f(f)(SUCC(x))(PRED(y)));
var ADD3 = f => x => y => { if (ISZERO(y) === TRUE) {
    return x;
  } else {
    return f(f)(SUCC(x))(PRED(y));
  }
};

// recursive addition
// var ADD = SELF_APPLY(ADD2)
// ADD(ZERO)(ONE) // 'Internal Error: too much recursion'

var ADD = SELF_APPLY(ADD3);

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

// var MULT = SELF_APPLY(MULT1) // 'Internal Error: too much recursion'
var MULT = SELF_APPLY(MULT2);

// MULT(TWO)(TWO)  // check it with numerically_equal(MULT(TWO)(TWO), 4)
// numerically_equal(MULT(FIVE)(THREE),15) // TRUE

var RECURSIVE = f => (s => f(s(s)))(s => f(s(s)));
var Y = RECURSIVE;
var THETA = (x => y => y(x(y)(y)))(x => y => y(x(y)(y)));
