
var IDENTITY = x => x

IDENTITY(1) // --> 1

IDENTITY(IDENTITY) // --> IDENTITY

(x => x)(x => x) // --> x => x