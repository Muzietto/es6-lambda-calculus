# es6-lambda-calculus
Describing lambda-calculus using ES6 arrow notation (currently only on FF).

Wholly inspired by the study of "Functional Programming through Lambda Calculus" (G. Michaelson)

Made possible only by the mind-blowing work of Alonzo Church.

![Alonzo Church](/img/church.jpg)

## definitions  (see [01-definitions-first-examples.es6](/es6/01-definitions-first-examples.es6))

#####  lambda-expression := name  |  function  |  function-application

  a "resolved" (or "evalued") λ-expression is called a _value_.

#####  name := character sequence

    e.g. IDENTITY, pippo, c3b0

  the keyword 'def' binds names to expressions

    def TWELVE = 12
    def IDENTITY = λx.x

### functions

#####  function := λ name . lambda-expression

    name --> "bound variable"
    lambda-expression --> "body"

    e.g. λx.x, λpippo.pippo*2,

  when function body is a function => n-args function

    λx.(λy.x+y) = λx.λy.x+y

  when a function has a def, we can shift bound variables to the left

    def SUM = λx.λy.x+y => SUM x = λy.x+y

  NB: things like `pippo*2` and `x+y` are used here just to give an idea of what function bodies are made for. Actually function bodies can host only precise λ-expressions. The most relevant function bodies contain __function applications__.

#### why use ES6?

  λ-calculus is generally done with paper and pencil or in esoteric niche languages; ES6 is a good-enough trade-off, because it runs in (almost) every browser and it allows a good approximation of funtions using its brand new [__arrow functions__](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions):

    var IDENTITY = x => x;
    var SUM = x => y => x + y;

  alas, using ES6 we cannot shift bound variables to the left (use Haskell for that...)

### function applications

#####  function-application := (function lambda-expression)

    e.g. (λx.x+1 1) = 2; (λx.x λx.x) = λx.x; ((λx.λy.x+y 1) 2) = (λy.1+y 2) = 3

  convention is that function application associates to the left:

    (λx.λy.x+y 1 2) = ((λx.λy.x+y 1) 2)

  convention is also that function application can be omitted:

    λx.λy.x+y 1 2 = (λx.λy.x+y 1 2)

#### two ways of looking at function application

  application inside function bodies means substituting every bound variable as soon as we know what is (either a value or another λ-expression)

  application to can be thought of in two ways:

  - __call-by-value__ (or _applicative order reduction_): substitutions can be made only using values --> __eager__ languages

    (x => x + 1)(12) --> 13

  - __call-by-name__ (or _normal order reduction_): substitutions are made also using expressions --> __lazy__ languages

    (x => x + 1)(y + z + 5) --> ((y + z + 5) => (y + z + 5) + 1) --> we will see...

  NB: ES6 is an eager language, so the second example aint't real running code, and it is just for the show.

### pairs

  a pair is a way to freeze two expressions to be able to operate on them later (i.e. to apply a function upon them):

    def PAIR = λx.λy.λf.(f x y)

  the two simplest operations on pairs are the getters FIRST and SECOND

    PAIR 1 2 FIRST = 1 => def FIRST = λx.λy.x
    PAIR 1 2 SECOND = 2 => def SECOND = λx.λy.y

## booleans (see [02-booleans.es6](/es6/02-booleans.es6))

  ternary operator = condition ? exp_true : exp_false

  we want to define it in terms of λ-calculus. One possibility is:

    def COND = λexp_true.λexp_false.λcondition.(cond exp_true exp_false)

    def COND = PAIR

  we attempt now to define TRUE and FALSE as functions:

    COND 1 2 TRUE = 1 => def TRUE = FIRST

    COND 1 2 FALSE = 2 => def FALSE = SECOND

  substituting the function body once all the variables have been fulfilled, we come to __a form that will be used a lot__ in the following paragraphs:

    COND exp_true exp_false condition = __condition exp_true exp_false__

### NOT operator

  Definition using the ternary operator is straightforward:

    !x = x ? false : true

  Expressing NOT in terms of λ-calculus is also straightforward:

    def NOT x = COND FALSE TRUE x

### AND operator

  Definition using the ternary operator is the following:

    x && y = x ? y : false

  Expressing AND in terms of λ-calculus derives immediately:

    def AND x y = COND y FALSE x = x y FALSE (try it with paper and pen...)

### OR operator

  Definition using the ternary operator is the following:

    x || y = x ? true : y

  Expressing OR in terms of λ-calculus derives immediately:

    def OR x = COND TRUE y x = x TRUE y (try it with paper and pen...)

## natural numbers (see [03-natural-numbers.es6](/es6/03-natural-numbers.es6))

  we just decide to express number 0 with the identity function:

    def ZERO = IDENTITY = λx.x

  we express every natural number as the `SUCC`essors of its preceding one:

    def ONE = SUCC ZERO
    def TWO = SUCC ONE = SUCC (SUCC ZERO)
    
  we need to define SUCC; we just decide to pick

    SUCC n = PAIR FALSE n
  
  these picks for ZERO and SUCC are just one of the infinite possibilities; they just happen to be simple and powerful enough to start our conversation. Actually Church ended up with less simple yet (a lot) more powerful definitions.
  
    def ONE = SUCC ZERO = PAIR FALSE IDENTITY
    def TWO = SUCC ONE = PAIR FALSE (PAIR FALSE IDENTITY)
    def THREE = SUCC TWO = PAIR FALSE (PAIR FALSE (PAIR FALSE IDENTITY))
    
  let's start to slowly build something really useful; first step is to become able to tell whether a number is zero or not:
  
    ISZERO = COND TRUE FALSE ZERO 
    ISZERO IDENTITY = TRUE
    ISZERO λx.x = λx.λy.x
    ISZERO ONE = FALSE
    ISZERO (PAIR FALSE ZERO) = FALSE

  a function that satisfies these requirements is `ISZERO n = n FIRST`; here's why:

    ISZERO ZERO = ZERO FIRST = IDENTITY FIRST = FIRST = TRUE
    ISZERO ONE = PAIR FALSE ZERO FIRST = FALSE
    ISZERO TWO = PAIR FALSE (PAIR FALSE ZERO) FIRST = FALSE
    
 now we define the `PRED`ecessor function, such that:
 
    PRED ONE = PRED (PAIR FALSE ZERO) = ZERO
    PRED TWO = PRED (PAIR FALSE (PAIR FALSE ZERO)) = ONE = PAIR FALSE ZERO 
 
 therefore we could initially say that `SIMPLE_PRED n = n SECOND`, but we need to guard against n = ZERO
 
    SIMPLE_PRED ZERO = ZERO SECOND = SECOND = FALSE // not a number anymore
   
  we define then that `PRED ZERO = ZERO` and we get:

    predecessor(n) = isZero(n) ? 0 : simplePredecessor(n)  // using the ternary operator

    PRED n = COND ZERO (SIMPLE_PRED n) (ISZERO n) = (ISZERO n) ZERO (SIMPLE_PRED n)

## recursion and arithmetics (see [04-recursion-arithmetics.es6](/es6/04-recursion-arithmetics.es6))

### addition

  an intuitive definition of `add` is possible using recursion, first in ES6, then in λ-calculus notation:

    var add = x => y => (y === 0) ? x : add(x+1)(y-1)
    def ADD x y = COND x (ADD (SUCC x) (PRED y)) (ISZERO y)

  the big problem here is that we have the function referred to in its own body, and this is not allowed;  
  therefore we do some juggling remembering `SELF_APPLY = λs.(s s)`, for which we know that an infinite loop `(SELF_APPLY SELF_APPLY) = ... = (SELF_APPLY SELF_APPLY)` exists;
  we create a helper function `add2` that carries an additional function `f` in its signature __and applies it to itself__:

    var add2 = x => y => (y === 0) ? x : f(f)(x+1)(y-1)
    def ADD2 f x y = COND x (f f (SUCC x) (PRED y)) (ISZERO y) = (ISZERO y) x (f f (SUCC x) (PRED y))

  this magic function `ADD2` has the remarkable power that, when applied to itself, it behaves like we expected from ADD:

    def ADD = ADD2 ADD2

  the big gain is that nobody mentions itself inside its own body anymore; you can see in the definition of `ADD2` that the recursion is created implicitly by the self application of argument `f` and __not__ by an explicit invocation
  
  **unfortunately, this bit cannot be verified in ES6**, because the eager execution tries to calculate both branches of the `COND`, which leads us to a stack overflow even if we know that only one of them should be evalued at a time

  the codebase shows a little cheat that makes use of the real JavaScript `if then else` (which evaluates the FALSE branch only when needed) to create a recursive addition helper that performs some crude and simple calculations

### multiplication

  an even intuitive, recursive definition exists for multiplication:

    var mult = x => y => (y === 0) ? 0 : x + mult(x)(y-1)
    def MULT x y = COND ZERO (ADD x (MULT (SUCC x) (PRED y))) (ISZERO y)

  which leads to a helper function

    def MULT1 f x y = COND ZERO (ADD x (f x (PRED y))) (ISZERO y)

  and a recursive multiplication

    def MULT = RECURSIVE MULT1

  where `RECURSIVE` is an abstraction upon which every helper function can be applied:

    def RECURSIVE f = (λs.(f (s s)) λs.(f (s s)))

  unfortunately `RECURSIVE` is very much akin to `SELF_APPLY` and causes an infinite loop at the very first moment we present it to the browser.

  the codebase shows a little cheat that allows to run multiplication also in an eager interpreter.

### other operations

  Alonzo Church managed to define also subtraction, power, absolute value and integer division; the [numerals he designed eventually](https://en.wikipedia.org/wiki/Church_encoding) are different from the ones shown here.

## types (see [05-types.es6](/es6/05-types.es6))

  types ensure that operations are used on the objects they are supposed to handle;

  we want to be able to pass only `TRUE` and `FALSE` to functions like `NOT`, `AND`, `OR`; we want to be able to pass only `ZERO`, `ONE`, etc to functions like `PRED` and `SUCC`
  
  we represent a typed object with a pair:

    def MAKE_OBJ type value = PAIR type value = λs.(s type value)

  we get to know the type by applying the whole object to `FIRST`, we get to know the value by doing the same with `SECOND`:

    def TYPE obj = obj FIRST
    def VALUE obj = obj SECOND

  we use natural numbers to represent types and numeric comparison to test the type

    def ISTYPE t obj = EQUAL (TYPE obj) t

  because EQUAL has a recursive definition, we have to come up with some clever trick if we want to be able to actually perform type comparison in ES6; here's what we will do:

    var EQUAL = a => b => { if a === b) { return TRUE; } else { return FALSE; }

  but this function can only compare numerals, and therefore types. Nothing else.

### zeroeth object type: errors

  we decide that errors are object type ZERO; we define errors by means of a set of useful functions

    def error_type = ZERO
    def MAKE_ERROR e = MAKE_OBJ error_type e
    def ISERROR e = ISTYPE error_type e

  the values for errors will be defined based upon the function where the error took place; but we define also the ultimate error:

    def ERROR = MAKE_ERROR error_type // = PAIR error_type error_type

  we verify that ERROR satisfied the functions mentioned before:

    ISERROR ERROR = ISTYPE ZERO ERROR = EQUAL (TYPE ERROR) ZERO
    TYPE ERROR = ERROR FIRST = error_type = ZERO

### first object type: booleans

  we decide that booleans are object of type ONE; we define booleans by means of a set of useful functions

    def bool_type = ONE
    def MAKE_BOOL b = MAKE_OBJ bool_type b
    def ISBOOL b = ISTYPE bool_type b

  we define now the typed versions of `TRUE` and `FALSE`:

    def TRUE_OBJ = MAKE_BOOL TRUE
    def FALSE_OBJ = MAKE_BOOL FALSE

  plus a specific error for boolean troubles:

    def BOOL_ERROR = MAKE_ERROR bool_type

  then we make sure that TYPED_NOT operates only on booleans:

    def NOT x = COND FALSE TRUE x // this was untyped NOT

    ISBOOL(X) ? MAKE_BOOL (NOT (VALUE X) : BOOL_ERROR // using the ternary operator

    def TYPED_NOT X = COND (MAKE_BOOL (NOT (VALUE X))) (BOOL_ERROR) (ISBOOL(X)) = (ISBOOL(X)) (MAKE_BOOL (NOT (VALUE X))) (BOOL_ERROR)

  `AND` and `OR` follow along the same lines:

    def TYPED_AND X Y = (AND (ISBOOL X) (ISBOOL Y)) (MAKE_BOOL (AND (VALUE X) (VALUE Y))) (BOOL_ERROR)
    def TYPED_OR X Y = (OR (ISBOOL X) (ISBOOL Y)) (MAKE_BOOL (OR (VALUE X) (VALUE Y))) (BOOL_ERROR)

