# es6-lambda-calculus
Implementing λ-calculus using EcmaScript 6 arrow notation (currently only on FF, IE11 and Edge).

Inspired by the study of ["Functional Programming through Lambda Calculus"](http://www.amazon.com/Introduction-Functional-Programming-Calculus-Mathematics/dp/0486478831) (G. Michaelson)

Made possible only by the mind-blowing work of Alonzo Church.

![Alonzo Church](/img/church.jpg)

At each paragraph you can:
  - view the related ES6 code
  - run and exercise the ES6 code (open in new tab the HTML file and start the browser console)

### Table of Contents
 - [definitions](#definitions)
 - [booleans](#booleans)
 - [natural numbers](#natural-numbers)
 - [recursion and arithmetics](#recursion-and-arithmetics)
 - [laziness](#introducing-laziness)
 - [types](#types)
 - [lists](#lists)
 - [chars and strings](#characters-and-strings)

---
## definitions
###### ES6 code in [01-definitions-first-examples.es6](/es6/01-definitions-first-examples.es6)
###### HTML is [01-definitions-first-examples.html](http://rawgit.com/Muzietto/es6-lambda-calculus/master/01-definitions-first-examples.html)
<br/>

#####  lambda-expression := name  |  function  |  function-application

a "resolved" (or "evalued") λ-expression is called a _value_

#####  name := character sequence

    e.g. IDENTITY, pippo, c3b0

keyword `def` binds names to expressions

    def ID = IDENTITY
    def TWELVE = (SUCCESSOR ELEVEN)
    def IDENTITY = λx.x

### functions

#####  function := λ name . lambda-expression

    name --> "bound variable"
    lambda-expression --> "body"

    e.g. λx.x, λpippo.pippo*2,

when function body is a function => n-args function

    λx.(λy.x+y) = λx.λy.x+y

when a function has a `def`, we can shift bound variables to the left side of the definition:

    def SUM = λx.λy.x+y => SUM x = λy.x+y

NB: things like `pippo*2` and `x+y` are used here just to give an idea of what function bodies are made for. Actually function bodies can host only precise λ-expressions. The most relevant function bodies contain __function applications__.

#### why use ES6?

λ-calculus is generally done with paper and pencil or in esoteric niche languages; ES6 is a good-enough trade-off, because it runs in (almost) every browser and it allows a good approximation of λ-functions using its brand new [__arrow functions__](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions).
  
NB - as of 160322, arrow functions are implemented in released versions of Firefox, IE11 and Edge only, but widespread adoption seems underway.

    var IDENTITY = x => x;
    var SUM = x => y => x + y;

alas, using ES6 we cannot shift bound variables to the left (use Haskell for that...)

### function applications

#####  function-application := (function lambda-expression)

    e.g. (λx.x+1 1) = 2; (λx.x λx.x) = λx.x; ((λx.λy.x+y 1) 2) = (λy.1+y 2) = 3

convention is that function application associates to the left:

    (λx.λy.x+y 1 2) = ((λx.λy.x+y 1) 2)

convention is also that function application can be omitted every time this does not bring ambiguities in the expression:

    λx.λy.x+y 1 2 = (λx.λy.x+y 1 2)

#### two remarkable applicators

##### function `APPLY`

function `APPLY` is the abstraction of application; it applies whatever function to whatever argument:

    def APPLY = λf.λx.(f x)
    var APPLY = f => x => f(x)

##### function `SELF_APPLY`

function `SELF_APPLY` is a quirky thing; it applies whatever function to _itself_. It is customary to call `s` the argument of `SELF_APPLY`:

    def SELF_APPLY = λs.(s s)
    var SELF_APPLY = s => s(s)

this function has a very strange, rather unique characteristic: if you try with paper and pencil the next equation, you will verify that:

    (SELF_APPLY SELF_APPLY) = (SELF_APPLY SELF_APPLY)

because of this peculiarity, `SELF_APPLY` takes a primary role in the λ-calculus definition and implementation of __recursion__.

#### two ways of looking at function application

application inside function bodies means substituting every bound variable as soon as we know what is (either a value or another λ-expression)

application to can be thought of in two ways:

- __call-by-value__ (or _applicative order reduction_): substitutions can be made only using values ⟹__eager__ languages

    (x => x + 1)(12) --> 13

- __call-by-name__ (or _normal order reduction_): substitutions are made also using expressions ⟹ __lazy__ languages

    (x => x + 1)(y + z + 5) --> ((y + z + 5) => (y + z + 5) + 1) --> we will see...

NB: ES6 is an eager language, so the second example aint't real running code, and it is just for the show;

trying to implement recursion using `SELF_APPLY` in an eager language is impossible, because the call-by-value nature will force the interpreter to evaluate the right side before anything else, and this implies another turn of the wheel, a new right side to interpret first, and then another, and the another... ad libitum before anything useful can be done with the expression.

### pairs

a pair is a way to freeze two expressions to be able to operate on them later (i.e. to apply a function upon them):

    def PAIR = λx.λy.λf.(f x y)

the two simplest operations on pairs are the getters `FIRST` and `SECOND`:

    PAIR 1 2 FIRST = 1 => def FIRST = λx.λy.x
    PAIR 1 2 SECOND = 2 => def SECOND = λx.λy.y

###### [back to the top](#table-of-contents)
---
## booleans
###### ES6 code in [02-booleans.es6](/es6/02-booleans.es6)
###### HTML is [02-booleans.html](http://rawgit.com/Muzietto/es6-lambda-calculus/master/02-booleans.html)
<br/>

ternary operator = condition ? true_exp : false_exp

we want to define it in terms of λ-calculus. One possibility is:

    def COND = λtrue_exp.λfalse_exp.λcondition.(condition true_exp false_exp)

    def COND = PAIR

we attempt now to define TRUE and FALSE as functions:

    COND 1 2 TRUE = 1 => def TRUE = FIRST

    COND 1 2 FALSE = 2 => def FALSE = SECOND

substituting the function body once all the variables have been fulfilled, we come to __a form that will be used a lot__ in the following paragraphs:

    COND true_exp false_exp condition = condition true_exp false_exp

### NOT operator

definition using the ternary operator is straightforward:

    !x = x ? false : true

expressing NOT in terms of λ-calculus is also straightforward:

    def NOT x = COND FALSE TRUE x = x FALSE TRUE

### AND operator

definition using the ternary operator is the following:

    x && y = x ? y : false

expressing AND in terms of λ-calculus derives immediately:

    def AND x y = COND y FALSE x = x y FALSE (try it with paper and pen...)

### OR operator

definition using the ternary operator is the following:

    x || y = x ? true : y

expressing OR in terms of λ-calculus derives immediately:

    def OR x = COND TRUE y x = x TRUE y (try it with paper and pen...)

###### [back to the top](#table-of-contents)
---
## natural numbers
###### ES6 code in [03-natural-numbers.es6](/es6/03-natural-numbers.es6)
###### HTML is [03-natural-numbers.html](http://rawgit.com/Muzietto/es6-lambda-calculus/master/03-natural-numbers.html)
<br/>

we just decide to express number 0 with the identity function:

    def ZERO = IDENTITY = λx.x

we express every natural number as the `SUCC`essor of its preceding one:

    def ONE = SUCC ZERO
    def TWO = SUCC ONE = SUCC (SUCC ZERO)

we need to define SUCC; we just decide to pick

    SUCC n = PAIR FALSE n

these picks for `ZERO` and `SUCC` are just one of the infinite possibilities; they just happen to be simple and powerful enough to start our conversation. Actually Church ended up with less simple yet (a lot) more powerful definitions.

    def ONE = SUCC ZERO = PAIR FALSE IDENTITY
    def TWO = SUCC ONE = PAIR FALSE (PAIR FALSE IDENTITY)
    def THREE = SUCC TWO = PAIR FALSE (PAIR FALSE (PAIR FALSE IDENTITY))

let's start to slowly build something really useful; first step is to become able to tell whether a number is `ZERO` or not; these are the specs:

    ISZERO = COND TRUE FALSE ZERO = ZERO TRUE FALSE
    ISZERO IDENTITY = TRUE --> ISZERO λx.x = λx.λy.x
    ISZERO ONE = FALSE
    ISZERO (PAIR FALSE ZERO) = FALSE

a function that satisfies **all** these requirements is `ISZERO n = n FIRST`; let's verify:

    ISZERO ZERO = ZERO FIRST = IDENTITY FIRST = FIRST = TRUE
    ISZERO ONE = PAIR FALSE ZERO FIRST = FALSE
    ISZERO TWO = PAIR FALSE (PAIR FALSE ZERO) FIRST = FALSE

now we define the `PRED`ecessor function, such that:

    PRED ONE = PRED (PAIR FALSE ZERO) = ZERO
    PRED TWO = PRED (PAIR FALSE (PAIR FALSE ZERO)) = ONE = PAIR FALSE ZERO 

therefore we could initially say that `NAIVE_PRED n = n SECOND`, but we need to guard against `n = ZERO`

    NAIVE_PRED ZERO = ZERO SECOND = SECOND = FALSE // not a number anymore

we define then that `PRED ZERO = ZERO` and we get:

    predecessor(n) = isZero(n) ? 0 : naivePredecessor(n)  // using the ternary operator

    PRED n = COND ZERO (NAIVE_PRED n) (ISZERO n) = (ISZERO n) ZERO (NAIVE_PRED n)

###### [back to the top](#table-of-contents)
---
## recursion and arithmetics
###### ES6 code in [04-recursion-arithmetics.es6](/es6/04-recursion-arithmetics.es6)
###### HTML is [04-recursion-arithmetics.html](http://rawgit.com/Muzietto/es6-lambda-calculus/master/04-recursion-arithmetics.html)
<br/>

### addition

an intuitive definition of `add` is possible using recursion, first in ES6, then in λ-calculus notation:

    var add = x => y => (y === 0) ? x : add(x+1)(y-1)
    rec ADD x y = COND x (ADD (SUCC x) (PRED y)) (ISZERO y)

the big problem here is that __we have the function name mentioned in its own body__, and this normally speaking is not allowed by the rules of λ-calculus;
  __keyword `rec` is used in λ-calculus__ (as well as in Scheme, by the way) __to mean that a function is being defined recursively__; it can be used freely to express the concept (and this is done a few times further down this text), but implementing `rec` is quite a complex matter, as we will see in the next paragraph.

in order to implement recursion, we do some juggling remembering `SELF_APPLY = λs.(s s)`, for which we know that an infinite loop `(SELF_APPLY SELF_APPLY) = ... = (SELF_APPLY SELF_APPLY)` exists;
we create a helper function `add2` that carries an additional function `f` in its signature __and applies it to itself__:

    var add2 = x => y => (y === 0) ? x : f(f)(x+1)(y-1)
    def ADD2 f x y = COND x (f f (SUCC x) (PRED y)) (ISZERO y) = (ISZERO y) x (f f (SUCC x) (PRED y))

this magic function `ADD2` has the remarkable power that, when applied to itself, it behaves like we expected from ADD:

    def ADD = ADD2 ADD2 = SELF_APPLY ADD2

the big gain is that nobody mentions itself inside its own body anymore; you can see in the definition of `ADD2` that the recursion is created implicitly by the self application of argument `f` and __not__ by an explicit invocation
  
**unfortunately, this truly interesting bit cannot be verified in ES6**, because its eager interpreter tries to calculate both branches of the `COND` at all times, causing a stack overflow even if we know that only one of them should be evalued at a time

the codebase shows a little cheat about `ADD2` (called `ADD3`) that makes use of the real JavaScript `if then else` (which evaluates the `FALSE` branch only when needed) to create a recursive addition helper that performs some crude and simple calculations

### multiplication

an even intuitive, recursive definition exists for multiplication:

    var mult = x => y => (y === 0) ? 0 : x + mult(x)(y-1)
    rec MULT x y = COND ZERO (ADD x (MULT x (PRED y))) (ISZERO y)

which leads to a helper function which behaves like `ADD2`, and is also __not runnable__ inside a browser:

    def MULT1 f x y = COND ZERO (ADD x (f f x (PRED y))) (ISZERO y)
    def MULT = SELF_APPLY MULT1
    var MULT = SELF_APPLY(MULT1) // 'Internal Error: too much recursion'

this second time we can try to abstract a bit the whole business and come up with a new way to define recursive functions like `ADD` and `MULT`:

    def ADD = RECURSIVE ADD2
    def MULT = RECURSIVE MULT1

where `RECURSIVE` is an abstraction upon which every helper function can be applied:

    def RECURSIVE f = (λs.(f (s s)) λs.(f (s s)))

unfortunately `RECURSIVE` (also known as the _fixed-point combinator_ or the _Y-combinator_) is practically a carbon copy of `(SELF_APPLY SELF_APPLY)` and causes an infinite loop at the very first moment we present it to the browser.

the codebase shows a little cheat about `MULT1` (called `MULT2`) that allows to run multiplication also in an eager interpreter.

### other operations

Alonzo Church managed to define also subtraction, power, absolute value and integer division; the [numerals he designed eventually](https://en.wikipedia.org/wiki/Church_encoding) are different from the ones shown here.

###### [back to the top](#table-of-contents)
---
## introducing laziness
###### ES6 code in [05-laziness.es6](/es6/05-laziness.es6)
###### HTML is [05-laziness.html](http://rawgit.com/Muzietto/es6-lambda-calculus/master/05-laziness.html)
<br/>

at the previous paragraph we saw that recursion implemented through `SELF_APPLY` requires lazy evaluation of `COND`; this can be done putting a `LAZY_COND` in place, which operates on lazy expressions instead of evaluating them straight away

a lazy expression is a function that returns the actual expression when applied:

    def LAZY_EXP = λ_.ACTUAL_EXP
    var LAZY_EXP = _ => ACTUAL_EXP;  // example in JavaScript syntax

a `LAZY_COND` can be expressed in λ-calculus as:

    def LAZY_COND true_lazy_exp false_lazy_exp condition = (condition LAZY_TRUE LAZY_FALSE) true_lazy_exp false_lazy_exp

in other words, a plain `condition` is evaluated; if it is `TRUE`, a `LAZY_TRUE` operator will be used to process the lazy expressions; if it is `FALSE`, then we'll use a `LAZY_FALSE` operator; here they go (also in JavaScript):

    def LAZY_TRUE x y = (x)
    def LAZY_FALSE x y = (y)

    var LAZY_TRUE = x => y => x();
    var LAZY_TRUE = x => y => y();

as first simple example of how to put `LAZY_COND` at work, we prepare a `BIGGER_X_THAN_Y` evaluator; its very first naive recursive (and forbidden) expression is as follows:

    rec BIGGER_X_THAN_Y x y = (AND (ISZERO y) (NOT (ISZERO x))) TRUE (BIGGER_X_THAN_Y (PRED x) (PRED y)) // forbidden syntax

we can express it through a helper function, using `LAZY_COND` and the `SELF_APPLY` trick already presented in the previous paragraph, also in JavaScript:

    def BIGGER_X_THAN_Y1 f x y = LAZY_COND λ_.TRUE λ_.(f f (PRED x) (PRED y)) (AND (ISZERO y) (NOT (ISZERO x)))
    def BIGGER_X_THAN_Y = SELF_APPLY BIGGER_X_THAN_Y1

    var BIGGER_X_THAN_Y1 = f => x => y => LAZY_COND(_ => TRUE)(_ => f(f)(PRED(x))(PRED(y)))(AND(ISZERO(y))(NOT(ISZERO(x))));
    var BIGGER_X_THAN_Y = SELF_APPLY(BIGGER_X_THAN_Y1);

this implementation is able to compute correctly only 1/3 of the possible cases:

    BIGGER_X_THAN_Y(THREE)(TWO); // TRUE
    BIGGER_X_THAN_Y(THREE)(FOUR); // Error - Too much recursion
    BIGGER_X_THAN_Y(THREE)(THREE); // Error - Too much recursion

basically, this implementation is unable to respond `FALSE`; in order to allow input where the larger number is the second, we have to bring complexity in the `NOT(TRUE)` branch; this leads to the helper function `BIGGER_X_THAN_Y2`:

    def BIGGER_X_THAN_Y2 f x y = LAZY_COND λ_.TRUE λ_.(LAZY_COND λ_.FALSE λ_.(f f (PRED x) (PRED y)) (AND (ISZERO x) (NOT (ISZERO y)))) (AND (ISZERO y) (NOT (ISZERO x)))
    def BIGGER_X_THAN_Y = SELF_APPLY BIGGER_X_THAN_Y2

    var BIGGER_X_THAN_Y2 = f => x => y => LAZY_COND(_ => TRUE)(_ => LAZY_COND(_ => FALSE)(_ => f(f)(PRED(x))(PRED(y)))(AND(ISZERO(x))(NOT(ISZERO(y)))))(AND(ISZERO(y))(NOT(ISZERO(x))));
    var BIGGER_X_THAN_Y = SELF_APPLY(BIGGER_X_THAN_Y2);

this second implementation is able to compute correctly 2/3 of the possible cases:

    BIGGER_X_THAN_Y(THREE)(TWO); // TRUE
    BIGGER_X_THAN_Y(THREE)(FOUR); // FALSE
    BIGGER_X_THAN_Y(THREE)(THREE); // Error - Too much recursion

in order to allow input where the arguments are equal, we `OR` one more check in the `NOT(TRUE)` branch; this leads to the final helper function `BIGGER_X_THAN_Y3`:

    def BIGGER_X_THAN_Y3 f x y = LAZY_COND λ_.TRUE λ_.(LAZY_COND λ_.FALSE λ_.(f f (PRED x) (PRED y)) (OR (AND (ISZERO x) (ISZERO y)) (AND (ISZERO x) (NOT (ISZERO y))))) (AND (ISZERO y) (NOT (ISZERO x)))
    def BIGGER_X_THAN_Y = SELF_APPLY BIGGER_X_THAN_Y3

    // the good one!
    var BIGGER_X_THAN_Y3 = f => x => y => LAZY_COND(_ => TRUE)(_ => LAZY_COND(_ => FALSE)(_ => f(f)(PRED(x))(PRED(y)))(OR(AND(ISZERO(x))(ISZERO(y)))(AND(ISZERO(x))(NOT(ISZERO(y))))))(AND(ISZERO(y))(NOT(ISZERO(x))));
    BIGGER_X_THAN_Y = SELF_APPLY(BIGGER_X_THAN_Y3);

    BIGGER_X_THAN_Y(THREE)(TWO); // TRUE
    BIGGER_X_THAN_Y(THREE)(FOUR); // FALSE
    BIGGER_X_THAN_Y(THREE)(THREE); // FALSE

a variation on the same lazy stuff can be used to define a much useful `EQUAL N M` function:

    def EQUAL1 f x y = LAZY_COND λ_.TRUE λ_.(LAZY_COND λ_.FALSE λ_.(f f (PRED x) (PRED y)) (OR (AND (NOT (ISZERO x)) (ISZERO y)) (AND (ISZERO x) (NOT (ISZERO y))))) (AND (ISZERO y) (ISZERO x))
    def EQUAL = SELF_APPLY EQUAL1

    var EQUAL1 = f => x => y => LAZY_COND(_ => TRUE)(_ => LAZY_COND(_ => FALSE)(_ => f(f)(PRED(x))(PRED(y)))(OR(AND(NOT(ISZERO(x)))(ISZERO(y)))(AND(ISZERO(x))(NOT(ISZERO(y))))))(AND(ISZERO(y))(ISZERO(x)));
    var EQUAL = SELF_APPLY(EQUAL1);

    EQUAL(THREE)(TWO); // FALSE
    EQUAL(THREE)(FOUR); // FALSE
    EQUAL(THREE)(THREE); // TRUE

all the recursive functions that in the previous paragraph have been created by cheating with JavaScript's lazy `if then else` operator can now be implemented in pure λ-calculus notation.

a truly insightful function of this family is `jsinteger`, which takes a numeral and returns its value as a plain JavaScript integer; it gives a clear demonstration of the power given by the faculty of mixing JS with λ-notation:
  
    var jsinteger1 = n => f => N => LAZY_COND(_ => n)(_ => f(n + 1)(f)(PRED(N)))(ISZERO(N)) // first n will be the initial value
    var jsinteger = jsinteger1(0)(jsinteger1); // sandwiched self-application

###### NB: this paragraph about laziness is not coming from the Michaelson book; it is instead an original contribution (with a big credit due to @MirkoBonadei)
  
###### [back to the top](#table-of-contents)
---
## types
###### ES6 code in [06-types.es6](/es6/06-types.es6)
###### HTML is [06-types.html](http://rawgit.com/Muzietto/es6-lambda-calculus/master/06-types.html)
<br/>

types ensure that operators are applied on the objects they are supposed to handle;

we want to be able to pass only `TRUE` and `FALSE` to functions like `NOT`, `AND`, `OR`; we want to be able to pass only `ZERO`, `ONE`, etc to functions like `PRED` and `SUCC`
  
we represent a typed object with a pair `(type, value)`:

    def MAKE_OBJ type value = PAIR type value = λs.(s type value)

we get to know the type by applying the whole object to `FIRST`, we get to know the value by doing the same with `SECOND`:

    def TYPE obj = obj FIRST
    def VALUE obj = obj SECOND

we use natural numbers to represent types and numeric comparison to test the type

    def ISTYPE t obj = EQUAL (TYPE obj) t

where `EQUAL` is graciously provided by the previous paragraph about laziness; please note that this `EQUAL` can only compare numerals, and therefore types. Nothing else.

### zeroeth object type: errors

we decide that errors are object type `ZERO`; we define errors by means of a set of useful functions

    def error_type = ZERO
    def MAKE_ERROR e = MAKE_OBJ error_type e
    def ISERROR e = ISTYPE error_type e

the values for errors will be defined based upon the function where the error took place; but we define also the ultimate error:

    def ERROR = MAKE_ERROR error_type // = PAIR error_type error_type

we verify that `ERROR` satisfied the functions mentioned before:

    ISERROR ERROR = ISTYPE ZERO ERROR = EQUAL (TYPE ERROR) ZERO
    TYPE ERROR = ERROR FIRST = error_type = ZERO

### first object type: booleans

we decide that booleans are object of type `ONE`; we define booleans by means of a set of useful functions

    def bool_type = ONE
    def MAKE_BOOL b = MAKE_OBJ bool_type b
    def ISBOOL b = ISTYPE bool_type b

we define now the typed versions of `TRUE` and `FALSE`:

    def TRUE_OBJ = MAKE_BOOL TRUE
    def FALSE_OBJ = MAKE_BOOL FALSE

plus a specific error for boolean troubles:

    def BOOL_ERROR = MAKE_ERROR bool_type

then we make sure that `TYPED_NOT` operates only on booleans:

    def NOT x = COND FALSE TRUE x // this was untyped NOT

    ISBOOL(X) ? MAKE_BOOL (NOT (VALUE X) : BOOL_ERROR // using the ternary operator

    def TYPED_NOT X = COND (MAKE_BOOL (NOT (VALUE X))) (BOOL_ERROR) (ISBOOL(X)) = (ISBOOL(X)) (MAKE_BOOL (NOT (VALUE X))) (BOOL_ERROR)

`TYPED_AND` and `TYPED_OR` follow along the same lines:

    def TYPED_AND X Y = (AND (ISBOOL X) (ISBOOL Y)) (MAKE_BOOL (AND (VALUE X) (VALUE Y))) (BOOL_ERROR)
    def TYPED_OR X Y = (OR (ISBOOL X) (ISBOOL Y)) (MAKE_BOOL (OR (VALUE X) (VALUE Y))) (BOOL_ERROR)

### second object type: numerals

we decide that natural numbers are object of type `TWO`; we define numerals by means of a set of useful functions

    def num_type = TWO
    def MAKE_NUM = MAKE_OBJ num_type
    def ISNUM = ISTYPE num_type

we define now the typed versions of a few integers:

    def ONE_OBJ = MAKE_NUM ONE
    def TWO_OBJ = MAKE_NUM TWO
    def THREE_OBJ = MAKE_NUM THREE

plus a specific error that will be returned in case of troubles with computations involving numerals:

    def NUM_ERROR = MAKE_ERROR num_type

now we make sure that `TYPED_ADD` and `TYPED_MULT` will operate only on numerals:

    def TYPED_ADD X Y = (AND (ISNUM X) (ISNUM Y)) (MAKE_NUM (ADD (VALUE X) (VALUE Y))) (NUM_ERROR)
    def TYPED_MULT X Y = (AND (ISNUM X) (ISNUM Y)) (MAKE_NUM (MULT (VALUE X) (VALUE Y))) (NUM_ERROR)

###### before talking about chars and strings (the last object types presented) here is a little detour about _lists_; after talking about that, we will be able to represent strings as lists of characters

###### [back to the top](#table-of-contents)
---
## lists
###### ES6 code in [07-lists.es6](/es6/07-lists.es6)
###### HTML is [07-lists.html](http://rawgit.com/Muzietto/es6-lambda-calculus/master/07-lists.html)
<br/>

__a list in λ-calculus is implemented as a binary tree__ by _chaining pairs one inside the other_ (guess where LISP got the idea from, in the first place...);

first of all we define the type for lists and the basic type error and operators:

    def list_type = THREE
    def ISLIST = ISTYPE list_type
    def LIST_ERROR = MAKE_ERROR list_type
    def MAKE_LIST = MAKE_OBJ list_type

### the building blocks

we start building lists from the empty list `NIL`, which will need to have a few characteristics:
  
- it is a list (`EQUAL(TYPE(NIL))(list_type)`)
- it has value such that whoever tries to read it, will get an error
- it's gotta be a `PAIR`, so to fit inside the binary tree

all this is satisfied by the following λ-expression

    def NIL = MAKE_LIST (PAIR LIST_ERROR LIST_ERROR)

once we have `NIL`, we may start building the lists; the atomic list builder is called the `CONS`tructor and its working is shown here:

    [1, 2, 5] --> CONS ONE (CONS TWO (CONS FIVE NIL)) // from JS array to λ-calculus LIST

we seem to have almost everything already at hand to start managing this stuff:

    def CONS = PAIR
    def HEAD list = list FIRST  // also known as CAR
    def TAIL list = list SECOND  // als known as CDR
    def ISEMPTY list = COND TRUE FALSE (ISZERO list) = (ISZERO list) TRUE FALSE

but we want to keep track of type, so this time we need the `CONS`tructor and the getters to be a bit more careful;

    def CONS H T = (ISLIST T) (MAKE_LIST (PAIR H T)) LIST_ERROR
    def HEAD list = (ISLIST list) (VALUE list FIRST) LIST_ERROR
    def TAIL list = (ISLIST list) (VALUE list SECOND) LIST_ERROR

### basic list manipulation

then we need some further basic operations on lists, all based on recursion:

    rec LENGTH list = (ISEMPTY list) ZERO (SUCC (LENGTH TAIL list)) // recursive definition, no way...
    rec APPEND element list = (ISEMPTY list) (CONS element NIL) (CONS (HEAD list) (APPEND element (TAIL list))) // also recursive

we are now able to obtain recursion implicitly by using the lazy version of the `SELF_APPLY` trick:

    def LEN1 f list = LAZY_COND λ_.ZERO λ_.(SUCC (f f (TAIL list))) (ISEMPTY list)
    def LENGTH SELF_APPLY LEN1

    def APP1 f element list = LAZY_COND λ_.(CONS element NIL) λ_.(CONS (HEAD list) (f f element (TAIL list))) (ISEMPTY list)
    def APPEND = SELF_APPLY APP1

in the codeabase you will find the EcmaScript 6 version of the helper functions `LEN1` and `APP1`.

### advanced list manipulation: `MAP` and `REDUCE`

we end up thinking about some more sophisticated stuff:

    rec MAP list mapper = COND NIL (CONS (mapper (HEAD list))(MAP (TAIL list) mapper) (ISEMPTY list) // recursive, no way!

we realize `MAP` once more with the implicit recursion of the lazy `SELF_APPLY` method:

    def MAP1 f list mapper = LAZY_COND λ_.NIL λ_.(CONS (mapper (HEAD list))(f f (TAIL list) mapper)) (ISEMPTY list)
    def MAP = SELF_APPLY MAP1 // the good version

the recursive definition for `REDUCE` (fold left) is:

    rec REDUCE fun acc list = (ISEMPTY list) acc (REDUCE fun (fun acc HEAD(list)) (TAIL list)) // explicit recursion, no way!

the version with implicit recursion is:

    def RED1 f fun acc list = LAZY_COND λ_.acc λ_.(f f fun (fun acc HEAD(list)) (TAIL list)) (ISEMPTY list)
    def REDUCE = SELF_APPLY RED1

the codebase contains a JavaScript implementation for both `MAP1` and `RED1`.

### helper functions for managing JavaScript arrays

due to the striking similarity between λ-calculus lists and JavaScript arrays, we can benefit from having a few helper functions to mediate between the two worlds. They are relatively straightforward to implement by mixing idioms from both realms:
  
    var LIST2array = REDUCE(array => head => [head].concat(array))([]);
    var array2LIST = array => array.reverse().reduce((acc, curr) => CONS(curr)(acc), NIL);

the codebase contains a few examples of usage of these functions.

### functions for analyzing the content of lists

the two most typical applications are `ALL`/`EVERY` (a chain of `AND`'s) and `ANY`/`SOME` (a chain of `OR`'s):

    ALL predicate list = REDUCE TYPED_AND TRUE_OBJ (MAP predicate list)
    ANY predicate list = REDUCE TYPED_OR FALSE_OBJ (MAP predicate list)

from `ALL` we derive helper functions that check whether a list contains only homogeneous elements, for example a `STRING` may be built only using a list of `CHAR`'s:

    ALL_CHARS charlist = VALUE (ALL (λx.MAKE_BOOL (ISCHAR x )) charlist) // NB - produces UNTYPED booleans

###### [back to the top](#table-of-contents)
---
## characters and strings
###### ES6 code in [08-chars-strings.es6](/es6/08-chars-strings.es6)
###### HTML is [08-chars-strings.html](http://rawgit.com/Muzietto/es6-lambda-calculus/master/08-chars-strings.html)
<br/>

### characters (type FOUR)

we start by creating the usual basic definitions:

    def char_type = FOUR
    def MAKE_CHAR = MAKE_OBJ char_type
    def ISCHAR = ISTYPE char_type
    def CHAR_ERROR = MAKE_ERROR char_type

then we need a few numerals that we will use to indicate ASCII codes:

    def forty_eight = MULT SIX (MULT FOUR TWO);
    def sixty_five = MULT FIVE (ADD FIVE (ADD FIVE THREE));
    def ninety_seven = ADD ONE (MULT TWO forty_eight);

in λ-calculus we may easily use a function name as its own representation:

    def 'a' = MAKE_CHAR(ninety_seven)
    def 'b' = MAKE_CHAR(SUCC(VALUE 'a'))
    VALUE('a') // --> 'a'
    TYPE('a') // --> FOUR

in JavaScript we can use the relevant character as var name (for numbers we need to prepend an `_`), but if we want to receive its representation as a value, we need to store it first by defining `VALUE(char)` as a `PAIR`; for example:

    var A = MAKE_CHAR(PAIR(sixty_five)('A'));
    var B = MAKE_CHAR(PAIR(SUCC(VALUE(A)(FIRST)))('B'));
    var _0 = MAKE_CHAR(PAIR(forty_eight)('0'));
    var _1 = MAKE_CHAR(PAIR(SUCC(VALUE(_0)(FIRST)))('1'));

we may make good use of a JavaScript mapper e.g. from `"a"` to `var a`:
  
    function char2CHAR(char) {
      return {
        '0': _0,
        ...
        'a': a,
        ...
        'A': A,
        ...
        'Z': Z
      }[char];
    }

now the whole basic alphanumeric charset is at our disposal, with everything numerically ordered.

### strings (type FIVE)

strings are lists of `CHAR`'s:

    def string_type = FIVE
    def ISSTRING = ISTYPE string_type
    def STRING_ERROR = MAKE_ERROR string_type

in this case `MAKE_STRING`, the basic operation for strings, needs to check both the type of the list and all of its elements:

    def MAKE_STRING string = (AND (ISLIST string) (ALL_CHARS string)) (MAKE_OBJ string_type string) STRING_ERROR;

a conversion function from JavaScript strings to λ-calculus `STRING`'s builds upon the conversion functions for JS arrays and `LIST`s:

    var string2STRING = string => MAKE_STRING(array2LIST(string.split('').map(char2CHAR)));

the codebase shows various examples of utilisation of all these functions.

###### NB: again, this paragraph about chars and strings is mostly not coming from the Michaelson book; it is instead an original contribution.

###### [back to the top](#table-of-contents)
