
# Transactions

## Database Functions

Database functions allow you to update an attribute's value based on the existing value. This allows features such as an atomic counter and compare-and-set. Fluree supports the following database functions, and is expanding the verstility of these functions in future releases.

Function | Example | Description
-- | -- | -- 
`inc` | `$(inc)` |  Increment existing value by 1. Works on `integer`.
`dec` | `$(dec)` | Decrement existing value by 1. Works on `integer`.
`+` | `$(+ 5)` | Increment existing value by specified number. Works on `integer`, `float`.
`-` | `$(- 5)`| Decrement existing value by specific number. Works on `integer`, `float`.
`now` | `$(now)` | Insert current server time. Works on `instant`.
`cas` | `$(cas "brown" "blue")` | Will compare current value to the first argument, and if equal sets the value to the second argument. If not equal, transaction throws an exception. Works on all types.

