# es6-lambda-calculus
Describing lambda-calculus using ES6 arrow notation (currently only on FF)

![alt image](/img/church.jpg)

## definitions

  lambda-expression := name
                    || function
                    || function-application

  name := character sequence

    e.g. IDENTITY, pippo, c3b0

  the keyword 'def' binds names to expressions

    def TWELVE = 12
    def IDENTITY = λx.x

  function := λ name . lambda-expression

    name --> "bound variable"
    lambda-expression --> "body"

    e.g. λx.x, λpippo.pippo*2,

  when function body is a function => n-args function

    λx.(λy.x+y) = λx.λy.x+y

  when a function has a def, we can shift bound variables to the left
  
    def ADD = λx.λy.x+y => ADD x = λy.x+y

  function-application := (function lambda-expression)

    e.g. (λx.x+1 1) = 2; (λx.x λx.x) = λx.x; ((λx.λy.x+y 1) 2) = (λy.1+y 2) = 3

## pairs

  A pair is a way to freeze two expressions to be able to operate on them later (i.e. to apply a function upon them):
  
    def PAIR = λx.λy.λf.((f x) y)

  The two simplest operation on pairs are the getters FIRST and SECOND
## booleans

  Ternary operator = condition ? exp_true : exp_false
  
    λ implementation: COND = λexp_true.λexp_false.λcondition.((cond exp_true) exp_false)
    
    COND === PAIR

  We define now TRUE and FALSE as functions. It's just a decision we make.

    COND 1 2 TRUE = 1 --> TRUE === FIRST
    
    COND 1 2 FALSE = 2 --> FALSE === SECOND