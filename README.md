# es6-lambda-calculus
Describing lambda-calculus using ES6 arrow notation (currently only on FF)

![alt image](/img/church.jpg)

## definitions

  lambda-expression := name
                    || function
                    || function-application

  name := character sequence

    e.g. IDENTITY, pippo, c3b0

  function := λ name . lambda-expression

    name --> "bound variable"
    lambda-expression --> "body"

    e.g. λx.x, λpippo.pippo*2,

  when function body == function => n-args function

     λx.(λy.x+y) = λx.λy.x+y

  function-application := (function lambda-expression)

    e.g. (λx.x+1 1) = 2; (λx.x λx.x) = λx.x; ((λx.λy.x+y 1) 2) = (λy.1+y 2) = 3