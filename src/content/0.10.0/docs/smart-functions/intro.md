## Smart Functions

Smart functions are the engine for setting permissions in Fluree. This section details the role of smart functions and lists all of the built-in smart functions. We also have a <a href="https://github.com/fluree/smart-function-library" target="_blank">Github repo</a> with basic smart functions you can add to your applications.

### Role of Smart Functions

Every time a transaction is issued, that transaction might trigger various smart functions. In addition, when an end user issues a query, various smart functions might be triggered. 

Smart functions will either return `true` or `false`. If every smart function that is triggered returns a `true`, then the transaction will go through. If even one triggered smart function returns `false`, then the transaction will fail, or in the case of a query- that piece of information will not be displayed to the user. 

Smart functions are stored in the `_fn` collection. From the `_fn` collection, smart functions can be referenced in a variety of places. Functions stored in different locations are triggered in slightly different ways.

Location | When Trigged?
-- | --
[_rule/fns](/docs/smart-functions/rules) | When an `_auth` record containing a given `_rule` issues a query or transaction containing the `_collection` or `_predicates` specified in the rule. 
[_collection/spec](/docs/smart-functions/collection-spec) | When transaction containing the specified `_collection` is issued, regardless of the issuer.
[_predicate/spec](/docs/smart-functions/predicate-spec) | When transaction containing the specified `_predicate` is issued, regardless of issuer (once per specified predicate).
[_predicate/txSpec](/docs/smart-functions/predicate-tx-spec) | When transaction containing the specified `_predicate` is issued, regardless of who issuer (once per transaction).
[In transactions](/docs/smart-functions/fns-in-txs) | You can use smart functions directly in transactions, but their role and behavior is slightly different. 

### Function Predicates

There are two built-in smart functions that come with every database, `["_fn/name", true]` and `["_fn/name", false]`, which simply return `true` or `false`, respectively. Below are all of the predicates that you can specify when creating a smart function.

Predicate | Type | Description
-- | -- | -- 
`name` | `string` | Function name
`params` | `(multi) string` | List of parameters this function supports.
`code` | `string` | Actual database code
`doc` | `string` | A docstring for this function.
`language` | `string` |  Programming language used (not yet implemented, currently only Clojure supported)
`spec` | `JSON` | (not yet implemented) Optional spec for parameters. Spec should be structured as a map, parameter names are keys and the respective spec is the value.

### Universal Functions

Clojure is the only language that is currently supported for writing smart functions. Only a subset of Clojure functions, as well as several custom functions, are allowed to be used in smart functions. 

The below functions are available for any smart functions, regardless of where those smart functions are deployed (i.e. `_predicate/spec` versus `_rule/fns`). In addition, `true` and `false` are valid keywords in your function code.

Note: Each function accrues a certain amount of [fuel](/docs/infrastructure/db-infrastructure#fuel). Fuel is used to limit usage in the hosted version of Fluree.

Function | Arguments | Example | Description | Cost (in fuel)
-- | -- | -- | -- | -- 
`inc` | `n` optional | `(inc)` |  Increment existing value by 1. Works on `integer`. | 10
`dec` | `n` optional | `(dec)` | Decrement existing value by 1. Works on `integer`. | 10
`now` | none | `(now)` | Insert current server time. Works on `instant`. | 10
`==` | `arg1 arg2 ...` |`(== 1 1 1 1)` | Returns true if all items within the vector are equal.  Works on `integer`, `string`, and `boolean`. | 9 + count of objects in ==
`+` | `arg1 arg2 ...` | `(+ 1 2 3)` | Returns the sum of the provided values. Works on `integer` and `float`. | 9 + count of objects in +
`-` | `arg1 arg2 ...` | `(- 10 9 3)` | Returns the difference of the numbers. The first, as the minuend, the rest as the subtrahends. Works on `integer` and `float`. | 9 + count of objects in -
`*` | `arg1 arg2 ...` | `(* 90 10 2)` | Returns the product of the provided values. Works on `integer` and `float`. | 9 + count of objects in *
`/` | `arg1 arg2 ...` | `(/ 36 3 4)` | If only one argument supplied, returns 1/first argument, else returns first argument divided by all of the other arguments. Works on `integer` and `float`. | 9 + count of objects in /
`>` | `arg1 arg2 ...` | `(> 90 10 2)` | Returns true if values are in monotonically decreasing order. | 9 + count of objects in >
`>=` | `arg1 arg2 ...` | `(>= 90 90 10 2)` | Returns true if values are in monotonically non-increasing order. | 9 + count of objects in >=
`<` | `arg1 arg2 ...` | `(< 2 10 90)` | Returns true if values are in monotonically increasing order. | 9 + count of objects in <
`<=` | `arg1 arg2 ...` | `(<= 2 10 90 90)` | Returns true if values are in monotonically non-decreasing order. | 9 + count of objects in <=
`quot` | `n` `d` | `(quot 60 10)` | Returns the quotient of dividing the first argument by the second argument. Rounds the answer towards 0 to return the nearest integer. Works on `integer` and `float`. | 10 
`rem` | `n` `d` | `(rem 64 10)` | Remainder of dividing the first argument by the second argument. Works on `integer` and `float`. | 10
`mod` | `n` `d` | `(mod 64 10)` | Modulus of the first argument divided by the second argument. The mod function takes the rem of the two arguments, and if the either the numerator or denominator are negative, it adds the denominator to the remainder, and returns that value. Works on `integer` and `float`. | 10
`max` | `arg1 arg2 ...` |  `(max 1 2 3)`| Returns the max of the provided values. Works on `integer`, `float`.  | 9 + count of objects in max
`min` | `arg1 arg2 ...` |  `(min 1 2 3)`| Returns the min of the provided values. Works on `integer`, `float`.  | 9 + count of objects in min
`max-pred-val` | `predicate-name` | `(max-pred-val \"person/age\")`| Returns the max of the provided predicate. Works on `integer`, `float`.  | 10 + cost of fuel to query max-pred-val
`str` | `arg1 arg2 ...` | `(str \"flur.\" \"ee\")` | Concatenates all strings in the vector. Works on `integer`, `string`, `float`, and `boolean`. | 10
`if-else` | `test` `true` `false` | `(if-else (== 1 1) \"John\" \"Jane\")` | Takes a test as a first argument. If the test succeeds, return the second argument, else return the third argument. | 10
`and` | `arg1 arg2 ...` | `(and (== 1 1) (== 2 2) )` | Returns true if all objects within the vector are non-nil and non-false, else returns false. | 9 + count of objects in and
`or` | `arg1 arg2 ...` | `(or (== 1 1) (== 2 3))` | Returns true if any of the objects within the vector are non-nil and non-false, else returns false. | 9 + count of objects in or
`boolean` | `x` | `(boolean 1)` | Coerces any non-nil and non-false value to true, else returns false. | 10
`nil?` | `x` | `(nil? 2)` | If nil, returns true, else returns false. | 10
`count` | `[s]` or `string` | `(count  \"Appleseed\")`, `#(count  [1 2 3])` | Returns the count of letters in a string or the number of items in a vector. | 9 + count of objects in count
`get` | `subject` `predicate` | `(get (?s) \"_id\" )` | Returns the value of an predicate within an object. In this example, we extract the _id of the subject using get. | 10
`contains?` | `subject` `value` | `(contains? (get-all (?s) [\"person/user\"]) ?user)` | Checks whether an object or hash-set contains a specific key (for objects) or value (for hash-sets). Vectors check index and NOT value. To check values of vector, convert values to hash-set first. In this example, `get-all` checks whether the person user contains the current user. | 10
`hash-set` | `arg1 arg2 ...` | `(hash-set \"orange\" \"pear\")` | Returns hash-set containing all the args | 9 + count of values in hash-set
`upper-case` | `str.` | `(upper-case \"pear\")` | Returns upper-case version of string. | 10
`lower-case` | `str.` | `(lower-case \"pear\")` | Returns lower-case version of string. | 10
`nth` | `collection integer` | `(nth [1 2 3] 0)` | Returns the `nth` element in a collection, for example `(nth [1 2 3] 0)` returns `1`. | 9 + count of objects in the collection
`get-all` | `subject` `[path]` | `(contains? (get-all ?s [\"chat/person\" \"person/user\"]) ?user)` | Returns nil or a set of all of a certain predicate (or predicate-path) from an subject. | 9 + length of path
`valid-email?` | `x` | `(valid-email? (?o))` | Checks whether a value is a valid email using the following pattern, `[a-z0-9!#$%&'*+/=?^_{\|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{\|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`. | 10
`re-find` | `pattern` `string` | `(re-find "^[a-zA-Z0-9_][a-zA-Z0-9\.\-_]{0,254}" \"apples1\")` | Checks whether a string follows a given regex pattern. | 10 
`db` | none | `(== (get db \"dbid\") 2)` | Returns a database object with the following keys: dbid, block, and permissions. | 10
`query` | `select-string`, `from-string`, `where-string`, `block-string` `limit-string` |  `(get (query \"[*]\" [\"book/editor\" \"Penguin\"] nil nil nil) \"book/year\")` | Allows you to query the current database. The select-string should be inputted without any commas. The select-string and can be inputted without any quotation marks, for example, `"[* {person/user [*]}]"`, or you can optionally doubly-escape those strings `"[\\\"*\\\" {\\\"person/user\\\" [\\\"*\\\"]}]"`. (This format is deprecated as of `0.9.6`.)| Fuel required for the query.  

Database function can also be combined, for instance `(inc (max 1.5 2 3))` will return 4. 

When you write a smart function and add it to the `_fn` collection, you can use the name of that smart function in other smart functions. 

For example, you can add a function called, `addThree` that adds 3 to any number, `n`.

```flureeql
[{
    "_id": "_fn",
    "name": "addThree",
    "params": ["n"],
    "code": "(+ 3 n)"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_fn",
    "name": "addThree",
    "params": ["n"],
    "code": "(+ 3 n)"
}]' \
   [HOST]/api/db/transact
```
```graphql
mutation addTenFunc ($addThreeFunTx: JSON) {
  transact(tx: $addThreeFunTx)
}

{
  "addThreeFunTx": "[{\"_id\":\"_fn\",\"name\":\"addThree\",\"params\":[\"n\"],\"code\":\"(+ 3 n)\"}]"
}
```

```sparql
Transactions not supported in SPARQL
```

Once, `addThree` is in the database, you can create a new function called `addTen`, which uses `addThree`. 

```flureeql
[{
    "_id": "_fn",
    "name": "addTen",
    "params": ["n"],
    "code": "(+ 7 (addThree n))"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_fn",
    "name": "addTen",
    "params": ["n"],
    "code": "(+ 7 (addThree n))"}]' \
   [HOST]/api/db/transact
```
```graphql
mutation addTenFunc ($addTenFunTx: JSON) {
  transact(tx: $addTenFunTx)
}

{
  "addTenFunTx": "[{\"_id\":\"_fn\",\"name\":\"addTen\",\"params\":[\"n\"],\"code\":\"(+ 7 (addThree n))\"}]"
}
```

```sparql
Transactions not supported in SPARQL
```

### Context-Dependent Functions

Some available functions are only available in certain contexts. For example, `?o`, which gets the object of a triple is relevant for a `_predicate/spec`, but not for a `_collection/spec`.

Fn | Args | Example | Available In | Usage | Fuel
-- | -- | ------- | -- | -- | --  
`?s` | `string`* | `(== (get (?s) \"person/handle\") \"jdoe\")` | `_predicate/spec`, `_collection/spec`, `_rule/fns` | Allows you to access all the predicates of the subject that the spec is being applied to.  (This smart function is no longer in use as of `0.9.6`.) | 10 plus cost of lookup
`?sid` | None | `(== (?auth_id) (?sid))` | `_predicate/spec`, `_collection/spec`, `_rule/fns` | The `_id` of the subject that the spec is being applied to | 10
`?p` | `string`** | `(== (get (?p) \"_predicate/name") \"person/fullName\")` | `_predicate/spec`, `_predicate/txSpec`, `transaction` | Allows you to access all the predicates of the predicate that the spec is being applied to. (This smart function is no longer in use as of `0.9.6`.) | 10 plus cost of fuel
`?pid` | None | `(?pid)` | `_predicate/spec`, `_predicate/txSpec`, transaction | `_id` of the predicate that the spec is being applied to | 10
`?o` <img width=40/>| None | `(< 1000 (?o))` <img width=150/> | `_predicate/spec` | The proposed object of the predicate that the user is attempting to add or update. | 10
`?pO` |  None | `(< (?pO) (?o))` | `_predicate/spec` | The object of the predicate that the user is attempting to add or update, as of the block before the proposed transaction | 10 plus cost of object-lookup 
`?auth_id` | None | `(== (?auth_id) (?sid))` | `_predicate/spec`, `_collection/spec`, `_rule/fns`, transactions | The `_id` of the auth that is querying or transacting | 10
`flakes` | None | `(flakes)` | `_predicate/spec`, `_collection/spec`, `_predicate/txSpec` | Returns an array of all flakes in the current proposed transaction. For `_predicate/spec` and `_collection/spec` this is a single flake. For `_predicate/txSpec` this is all the flakes in a given transaction that pertain to the specified predicate.| 10
`objT` | None | `(objT)` | `_predicate/spec`, `_collection/spec`, `_predicate/txSpec` | Sum of the value of all flakes being added in the current spec. | 10
`objF` | None | `(objF)` | `_predicate/spec`, `_collection/spec`, `_predicate/txSpec` | Sum of the value of all flakes being retracted in the current spec. | 10

\* Optional string of additional-select-parameters. By default, this function will query `{"select": ["*"], from: [SUBJECT]}`, however, if you would like to follow the subject's relationships further, you can optionally include an additional select string. You do not need to include the glob character, *, in your select string. You can either not include any quotes in the select string, or doubly-escape them, for example: `"[{person/user [*]}]" or "[{\\\"person/user\\\" [\\\"*\\\"]}]"`. Your select string needs to be inside of a vector, [].

\*\* Optional string of additional-select-parameters. By default, this function will query `{"select": ["*"], from: p}`, however, if you would like to follow the subject's relationships further, you can optionally include an additional select string. You do not need to include the glob character, *, in your select string. You can either not include any quotes in the select string, or doubly-escape them, for example: `"[{person/user [*]}]"` or `"[{\\\"person/user\\\" [\\\"*\\\"]}]"`. Your select string needs to be inside of a vector, [].