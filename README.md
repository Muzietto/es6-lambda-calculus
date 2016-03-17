# es6-lambda-calculus
Describing lambda-calculus using ES6 arrow notation (currently only on FF)

![Alonzo Church](/img/church.jpg)

## definitions  (see [01-definitions-first-examples.es6](/es6/01-definitions-first-examples.es6))

  lambda-expression := name
                    |  function
                    |  function-application

  a "resolved" (or "evalued") λ-expression is called a __value__.

  name := character sequence

    e.g. IDENTITY, pippo, c3b0

  the keyword 'def' binds names to expressions

    def TWELVE = 12
    def IDENTITY = λx.x

### functions

  function := λ name . lambda-expression

    name --> "bound variable"
    lambda-expression --> "body"

    e.g. λx.x, λpippo.pippo*2,

  when function body is a function => n-args function

    λx.(λy.x+y) = λx.λy.x+y

  when a function has a def, we can shift bound variables to the left

    def SUM = λx.λy.x+y => SUM x = λy.x+y

  NB: things like 'pippo*2' and 'x+y' are used here just to give an idea of what function bodies are made for. Actually function bodies can host only precise λ-expressions. The most relevant function bodies contain __function applications__.

#### why use ES6?

  λ-calculus is generally done with paper and pencil or in esoteric niche languages; ES6 is a good-enough trade-off, because it runs in (almost) every browser and it allows a good approximation of funtions using its brand new __arrows__:

    var IDENTITY = x => x;
    var SUM = x => y => x + y;

  alas, using ES6 we cannot shift bound variables to the left (use Haskell for that...)

### function applications

  function-application := (function lambda-expression)

    e.g. (λx.x+1 1) = 2; (λx.x λx.x) = λx.x; ((λx.λy.x+y 1) 2) = (λy.1+y 2) = 3

  convention is that function application associates to the left:

    (λx.λy.x+y 1 2) = ((λx.λy.x+y 1) 2)

  convention is also that function application can be omitted:

    λx.λy.x+y 1 2 = (λx.λy.x+y 1 2)

#### two ways of looking at function application

  application inside function bodies means substituting every bound variable as soon as we know what is (either a value or another λ-expression)

  application to can be thought of in two ways:

  - call-by-value (or __applicative order reduction__): substitutions can be made only using values --> __eager__ languages

    (x => x + 1)(12) --> 13

  - call-by-name (or __normal order reduction__): substitutions are made also using expressions --> __lazy__ languages

    (x => x + 1)(y + z + 5) --> ((y + z + 5) => (y + z + 5) + 1) --> we will see...

  NB: ES6 is an eager language, so the second example is just for the show.

## pairs

  A pair is a way to freeze two expressions to be able to operate on them later (i.e. to apply a function upon them):

    def PAIR = λx.λy.λf.(f x y)

  The two simplest operations on pairs are the getters FIRST and SECOND

    PAIR 1 2 FIRST = 1 => def FIRST = λx.λy.x
    PAIR 1 2 SECOND = 2 => def SECOND = λx.λy.y

## booleans (see [02-booleans.es6](/es6/02-booleans.es6))

  Ternary operator = condition ? exp_true : exp_false

  We want to define it in terms of λ-calculus. One possibility is:

    def COND = λexp_true.λexp_false.λcondition.(cond exp_true exp_false)

    def COND = PAIR

  We attempt now to define TRUE and FALSE as functions:

    COND 1 2 TRUE = 1 => def TRUE = FIRST

    COND 1 2 FALSE = 2 => def FALSE = SECOND

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
