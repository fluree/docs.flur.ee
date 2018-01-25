
# Transactions

## Database Functions

Database functions allow you to atomically update an attribute's value based on the existing value (represented by the symbol `?v`), or substitute in a value such as the current time with `(now)`. The functions allow capabilities such as an atomic counter and compare-and-set. Fluree supports the following database functions, and is continuing to expand the database functions available.

Functions used as values in transactions should be prepended with `#` to indicate it is a function and not a string value.

Function | Example | Description
-- | -- | -- 
`inc` | `#(inc ?v)` |  Atomic increment existing value by 1. Works on `integer`.
`dec` | `#(dec ?v)` | Atomic decrement existing value by 1. Works on `integer`.
`+` | `#(+ ?v 5)` | Increment existing value by specified number. Works on `integer`, `float`.
`-` | `#(- ?v 5)`| Decrement existing value by specific number. Works on `integer`, `float`.
`now` | `#(now)` | Insert current server time. Works on `instant`.
`cas` | `#(cas ?v "brown" "blue")` | Will compare current value to the first argument, and if equal, sets the value to the second argument. If not equal, transaction throws an exception. Works on all types.

