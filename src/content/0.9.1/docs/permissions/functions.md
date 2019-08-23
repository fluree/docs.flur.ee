### Database Functions

The `_fn` collection is where the code that governs `_rule/predicate`, `_attribute/spec`, `_attribute/txSpec`, and `_collection/spec` is used. In addition, any [custom functions](#custom-functions) created can be used in transactions.

### Function Attributes

Attribute | Type | Description
-- | -- | -- 
`_fn/name` | `string` |  (optional) A unique identifier for this role.
`_fn/params` | `[string]` | (optional) A vector of parameters that this function supports.
`_fn/code` | `string` | (required) The actual function code. Syntax detailed [here](#function-syntax). 
`_fn/doc` | `string` | (optional) An optional docstring describing this function.
`_fn/spec` | `json` | (optional, not yet implemented) An optional spec for parameters. Spec should be structured as a map, parameter names are keys and the respective spec is the value.
`_fn/language` | `tag` | (optional, not yet implemented) Programming language used.

Note, that every database has two built-in functions, `["_fn$name", "true"]` and `["_fn$name", "false"]`, which either allow or block access, respectively, to a given collection or attribute.

### Function Syntax

Database functions allow you to update an attribute's value based on the existing value. This allows features such as an atomic counter and timestamps. Database functions are stored in `_fn/code` and referenced by `_rule/predicate`, `_attribute/spec`, `_attribute/txSpec`, or `_collection/spec`. Database functions can also be used directly in transactions by prefacing the transaction with a `#`.

Using database functions in:

* Transactions - Pass database functions into transactions with a #, for example, `	#(inc)`. Resolves to any type of value. 
* `_attribute/spec` - A multi-cardinality ref attribute. Control the values that can be held in an attribute. Resolves to true or false. 
* `_attribute/txSpec` - A multi-cardinality ref attribute. Controls all the flakes for a given attribute in a single transaction. Resolves to true or false. 
* `_collection/spec` - A multi-cardinality ref attribute. Control the values of the attributes in a specific collection. Resolves to true or false. 
* `_rule/predicate` - A multi-cardinality ref attribute. Controls whether an auth record can view a certain attribute or collection. Resolves to true or false. 

The below functions are available to use in any of the above listed usages, including transactions, schema specs, and rule predicate. Remember that all of the usages, with the exception of transactions require the function to return either true or false. 

Function | Arguments | Example | Description | Cost (in fuel)
-- | -- | -- | -- | -- 
`inc` | `n` optional | `#(inc)` |  Increment existing value by 1. Works on `integer`. | 10
`dec` | `n` optional | `#(dec)` | Decrement existing value by 1. Works on `integer`. | 10
`now` | none | `#(now)` | Insert current server time. Works on `instant`. | 10
`==` | `[s]` |`#(== [1 1 1 1])` | Returns true if all items within the vector are equal.  Works on `integer`, `string`, and `boolean`. | 9 + count of objects in ==
`+` | `[s]` | `#(+ [1 2 3])` | Returns the sum of the provided values. Works on `integer` and `float`. | 9 + count of objects in +
`-` | `[s]` | `#(- [10 9 3])` | Returns the difference of the numbers. The first, as the minuend, the rest as the subtrahends. Works on `integer` and `float`. | 9 + count of objects in -
`*` | `[s]` | `#(* [90 10 2])` | Returns the product of the provided values. Works on `integer` and `float`. | 9 + count of objects in *
`/` | `[s]` | `#(/ [36 3 4])` | If only one argument supplied, returns 1/first argument, else returns first argument divided by all of the other arguments. Works on `integer` and `float`. | 9 + count of objects in /
`quot` | `n` `d` | `#(quot 60 10)` | Returns the quotient of dividing the first argument by the second argument. Rounds the answer towards 0 to return the nearest integer. Works on `integer` and `float`. | 10 
`rem` | `n` `d` | `#(rem 64 10)` | Remainder of dividing the first argument by the second argument. Works on `integer` and `float`. | 10
`mod` | `n` `d` | `#(mod 64 10)` | Modulus of the first argument divided by the second argument. The mod function takes the rem of the two arguments, and if the either the numerator or denominator are negative, it adds the denominator to the remainder, and returns that value. Works on `integer` and `float`. | 10
`max` | `[s]` |  `#(max [1 2 3])`| Returns the max of the provided values. Works on `integer`, `float`.  | 9 + count of objects in max
`min` | `[s]` |  `#(min [1 2 3])`| Returns the min of the provided values. Works on `integer`, `float`.  | 9 + count of objects in min
`max-attr-val` | `"#(max-attr-val \"person/age\")"`| Returns the max of the provided attribute. Works on `integer`, `float`.  | 10 + cost of fuel to query max-attr-val
`str` | `[s]` | `#(str [\"flur.\" \"ee\"])` | Concatenates all strings in the vector. Works on `integer`, `string`, `float`, and `boolean`. | 10
`if-else` | `test` `true` `false` | `#(if-else (= [1 1]) \"John\" \"Jane\")` | Takes a test as a first argument. If the test succeeds, return the second argument, else return the third argument. | 10
`and` | `[s]` | `#(and [(= [1 1]) (= [2 2]) ])` | Returns true if all objects within the vector are non-nil and non-false, else returns false. | 9 + count of objects in and
`or` | `[s]` | `#(or [(= [1 1]) (= [2 3]) ])` | Returns true if any of the objects within the vector are non-nil and non-false, else returns false. | 9 + count of objects in or
`boolean` | `x` | `#(boolean 1)` | Coerces any non-nil and non-false value to true, else returns false. | 10
`count` | `[s]` or `string` | `#(count  \"Appleseed\")`, `#(count  [1 2 3])` | Returns the count of letters in a string or the number of items in a vector. | 9 + count of objects in count
`get` | `entity` `attribute` | `#(get (?e) \"_id\" )` | Returns the value of an attribute within an object. In this example, we extract the _id of the entity using get. | 10
`contains?` | `entity` `attribute` | `(contains? (get-all (?e) [\"person/user\"]) ?user)` | Checks whether an object or vector contains a specific value. In this example, `get-all` checks whether the person user contains the current user. | 10
`get-all` | `entity` `[path]` | `(contains? (get-all ?e [\"chat/person\" \"person/user\"]) ?user)` | Gets all of a certain attribute (or attribute-path from an entity. | 9 + length of path
`valid-email?` | `x` | `(valid-email? ?v)` | Checks whether a value is a valid email using the following pattern, "`[a-z0-9!#$%&'*+/=?^_`\``{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`\``{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`. | 10
`re-find` | `pattern` `string` | `#(re-find "^[a-zA-Z0-9_][a-zA-Z0-9\.\-_]{0,254}" \"apples1\")` | Checks whether a string follows a given regex pattern. | 10 
`db` | none | `#(== [(get db \"dbid\") 2])` | Returns a database object with the following keys: dbid, block, and permissions. | 10
`query` | `select-string` `from-string` `where-string` `block-string` `limit-string` |  `#(get (query \"[*]\" [\"book/editor\" \"Penguin\"] nil nil nil) \"book/year\")` | Allows you to query the current database. The select-string should be inputted without any commas. The select-string and can be inputted without any quotation marks, for example, `"[* {person/user [*]}]"`, or you can optionally doubly-escape those strings `"[\\\"*\\\" {\\\"person/user\\\" [\\\"*\\\"]}]"`. | Fuel required for the query.  


Database function can also be combined, for instance `#(inc (max [1.5 2 3]))` will return 4. 

The below functions are available through some function interfaces, but not others. For instance, an `_attribute/spec` can access the value `(?v)` of that given attribute, but this function does not make sense in a transaction. The functions are listed below, along with a list of places where those functions are valid. 


1. Value: `?v`
- Arguments: None.
- Example:  `(< [1000 (?v)])` 
- Use: Allows you to access the value of the attribute that the user is attempting to add or update. In the example spec, the value must be greater than 1,000.
- Available in: `_attribute/spec`
- Cost: 10

2. Past Value: `?pV` 
- Arguments: None.
- Example: `(< [(?pV) (?v)])`
- Use: you to access the previous value of the attribute that the user is attempting to add or update, nil if no previous value. In the example spec, the new value `(?v)` must be greater than the previous value `(?pV)`.
- Available in: `_attribute/spec`
- Cost: 10 plus cost of fuel

3. Entity: `?e` 
- Arguments: Optional `string` of additional-select-parameters. By default, this function will query {"select": ["*"], from: `entity`}, however, if you would like to follow the entity's relationships further, you can optionally include an additional select string. You do not need to include the glob character, `*`, in your select string. You can either not include any quotes in the select string, or doubly-escape them, for example: `"[{person/user [*]}]"` or `"[{\\\"person/user\\\" [\\\"*\\\"]}]"`. Your select string needs to be inside of a vector, `[]`.
- Example: `(== [(get (?e) \"movie/director\") \"Quentin Tarantino\"])`
- Use:  Allows you to access all the attributes of the entity that the spec is being applied to. In the example, the spec is checking whether the director of the current entity is Quentin Tarantino.
- Available in: `_attribute/spec`, `_collection/spec`, `_rule/predicate`
- Cost: 10 plus cost of fuel


4. Entity _id: `?eid` 
- Arguments: None
- Example: `(== [?user_id ?eid])`
- Use: Allows you to access all the `_id` of the entity that the spec is being applied to. In the example, the spec is checking whether the current entity _id is the same as the user _id.
- Available in: `_attribute/spec`, `_collection/spec`, `_rule/predicate`
- Cost: 10 plus cost of fuel

5. Auth _id: `?auth_id`
- Arguments: None
- Example: `(== [?auth_id ?eid])`
- Use: Allows you to access all the `_id` of the auth that is currently in use. In the example, the spec is checking whether the current entity _id is the same as the auth_id.
- Available in: `_attribute/spec`, `_collection/spec`, `_rule/predicate`, transactions
- Cost: 10


6. User _id: `?user_id`
- Arguments: None
- Example: `(== [?user_id ?eid])`
- Use: Allows you to access all the `_id` of the user that is currently in use, or nil if no user. In the example, the spec is checking whether the current entity _id is the same as the user_id.
- Available in: `_attribute/spec`, `_collection/spec`, `_rule/predicate`, transactions
- Cost: 10

6. User _id: `flakes`
- Arguments: None
- Example: `(flakes)`
- Use: Returns an array of all flakes in the current spec. For `_attribute/spec` and `_collection/spec` this is a single flake. For
`_attribute/txSpec` this is all the flakes in a given transaction that pertain to the specified attribute. 
- Available in: `_attribute/spec`, `_collection/spec`, `_attribute/txSpec`
- Cost: 10


7. User _id: `objT`
- Arguments: None
- Example: `(objT)`
- Use: Sum of the value of all flakes being added in the current spec.
- Available in: `_attribute/spec`, `_collection/spec`, `_attribute/txSpec`
- Cost: 10


8. User _id: `objF`
- Arguments: None
- Example: `(objF)`
- Use: Sum of the value of all flakes being retracted in the current spec.
- Available in: `_attribute/spec`, `_collection/spec`, `_attribute/txSpec`
- Cost: 10


9. Attribute _id: `?aid`
- Arguments: None
- Example: `(?aid)`
- Use: Allows you to access all the `_id` of the attribute that the spec is being applied to. 
- Available in: `_attribute/spec`, `_attribute/txSpec`, transaction
- Cost: 10

10. Attribute _id: `?a`
- Arguments: Optional `string` of additional-select-parameters. By default, this function will query {"select": ["*"], from: `aid`}, however, if you would like to follow the entity's relationships further, you can optionally include an additional select string. You do not need to include the glob character, `*`, in your select string. You can either not include any quotes in the select string, or doubly-escape them, for example: `"[{person/user [*]}]"` or `"[{\\\"person/user\\\" [\\\"*\\\"]}]"`. Your select string needs to be inside of a vector, `[]`.
- Example: `(== [(get (?a) \"_attribute/name") \"book/title\"])`
- Available in: `_attribute/spec`, `_attribute/txSpec`, transaction
- Cost: 10 plus cost of fuel

### Custom Functions

When you add a function to the `_fn` stream, you can optionally reference it using the `_fn/name` that you have created. For example, let's say that we want to create a function that always adds 7 to any given number.

```all
[{
  "_id": "_fn",
  "name": "addSeven",
  "params": ["n"],
  "code": "(+ [7 n])
}] 
```

Now, we will be able to use it anywhere we use database functions. For example:

1. Using it in a transaction

```all
[{
  "_id": "book",
  "length": "(addSeven 100)
}]
```

2. Using it in another `_fn` that is used in an `_attribute/spec`.

```all
[{
  "_id": ["_attribute/name", "book/length"],
  "spec": ["_fn$addManufacturerPages"]
},
{ 
  "_id": "_fn$addManufacturerPages",
  "name": "addManufacturerPages",
  "code": "(+ [(addSeven 0) 13])
}]
```
