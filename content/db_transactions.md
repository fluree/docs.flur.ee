# Transactions

## Transactions
Fluree allows you to specify transaction using FlureeQL JSON array/vector syntax that contains entity maps to create, update, upsert or delete. Transactions can also be done with GraphQL, for more information on on GraphQL transactions, reference the GraphQL Transactions section. 

Each map requires an `_id` as specified below along with key/value pairs containing the attributes and values you wish to modify. An `_action` key is always included, but typically inferred and thus optional for most operations.

Key | Type | Description
-- | -- | -- 
`_id` | identity |  Any identity value which can include the numeric assigned permanent `_id` for an entity, any attribute marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`, or a temporary id (for new entities). See the "Temporary Ids" section in the below Transactions section to learn more. 
`_action` | string | Optional (if it can be inferred). One of: `add`, `update`, `upsert` or `delete`. When using a temporary id, `add` is always inferred. When using an existing identity, `update` is always inferred. `upsert` is inferred for new entities with a tempid if they include an attribute that was marked as `upsert`.

To delete/retract an entire entity, use the `_id` key along with only `"_action": "delete"`. To delete only specific values within an entity, specify the key/value combinations.

The keys can contain the full attribute name including the namespace, i.e. `chat/message` or you can leave off the namespace if it is the same as the collection the entity is within. i.e. when the entity is within the `chat` collection, just `message` can be used which is translated to `chat/message` by Fluree.

## Temporary Ids

Every transaction item must have an _id attribute to refer to the entity we are attempting to create/update. A tempid can simply be the collection name, i.e. `_user`. 

FlureeQL example:

```
[
  {
    "_id":    "_user",
    "username": "jdoe",
  }
]
```

However, if you would like to reference that tempid somewhere else in your transaction, it is helpful to create a unique tempid. To make a unique tempid, just append the collection with any non-valid collection character (anything other than a-z, A-Z, 0-9, _) followed by anything else. For example, `_user$jdoe` or `_user#1 `.

FlureeQL example:
```
[
  {
    "_id":    "_user$jdoe",
    "username": "jdoe",
    "roles": [["_role/id", "chatUser"]],
    "auth": ["_auth$temp"]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": "_user$jdoe"
  },
  {
    "_id": "_auth$temp",
    "key": "tempAuthRecord"
  }
]
```

## Adding Data

In order to add data, you must use a temporary `_id`, i.e. `["_chat", -1]`. In this case, `"_action": "add"` is inferred. Any attributes that you wish to add to this entity should be included as key-value pairs. 

Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{"_id": ["chat", -1], "message": "Hello, sample chat message."}]' \
   https://ACCOUNT_NAME.flur.ee/api/db/transact
```

#### Insert two new entities using temp-ids (note `"_action": "add"` is inferred)

```json
[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact  
```

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, 
    { \"_id\": \"person\", \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

## Updating Data

In order to update data, you can reference an existing entity by using its `_id` or, for any attribute marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`. Attributes that you wish to update should be included as key-value pairs.

When referencing an existing entity,  `"_action": "update"` is inferred.

Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Identity"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

#### Update an existing entity using an identity value (note `"_action": "update"` is inferred)

```json
[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Identity"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Identity"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation updatePerson($myUpdatePersonTx: JSON) {
  transact(tx: $myUpdatePersonTx)
}

{
  "myUpdatePersonTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"fullName\": \"Jane Doe Updated By Identity\" }]"
}
```
#### Update an existing entity using internal `_id` value (note `"_action": "update"` is inferred)

```json
[{
  "_id":      4294967296001,
  "fullName": "Jane Doe Updated By Numeric _id"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      4294967296001,
  "fullName": "Jane Doe Updated By Numeric _id"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{ \"_id\": 4294967296001, \"fullName\": \"Jane Doe Updated By Numeric _id\" }]"
}
```
## Upserting Data

When a transaction with a tempid resolves to an existing entity, `"_action": "upsert"` is inferred. This is only applicable to attributes marked as unique. By default the transaction will throw an exception if a conflict with a unique attribute exists.

If "person/handle" is marked as unique and `["person/handle", "jdoe"]` is already in our database, this transaction will simply update `["person/handle", "jdoe"]`. If `["person/handle", "jdoe"]` is not yet in the database, it will add the new entity.  

Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "person",
  "handle": "jdoe"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

#### Upsert into an existing entity (note `"_action": "upsert"` is inferred when a tempid resolves to an existing entity with a unique attribute)

```json
[{
  "_id":      "person",
  "handle":   "jdoe"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "person",
  "handle": "jdoe"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{ \"_id\": \"person\", \"handle\": \"jdoe\" }]"
}
```

## Deleting Data 

You can delete (retract) a single attribute by setting the value of `_id` to a two-tuple of the attribute and attribute value, and then setting the attribute to null. `"_action": "delete"` is inferred. 


Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "handle":   null
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   
```

You can delete (retract) all attributes for an entity by setting the value of `_id` to a two-tuple of the attribute and attribute value, and then specifying `"_action": "delete"`. 


#### Delete (retract) a single attribute

```json
[{
  "_id":      ["person/handle", "jdoe"],
  "handle":   null
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "handle":   null
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation deleteAttribute ($myDeleteAttributeTx: JSON) {
  transact(tx: $myDeleteAttributeTx)
}

{
  "myDeleteAttributeTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"handle\": null }]"
}
```

#### Delete (retract) all attributes for an entity

```json
[{
  "_id":      ["person/handle", "jdoe"],
  "_action":  "delete"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "_action":  "delete"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
mutation deleteAllAttributes ($myDeleteAllAttributesTx: JSON) {
  transact(tx: $myDeleteAllAttributesTx)
}

{
  "myDeleteAllAttributesTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"_action\": \"delete\" }]"
}
```

## Transaction Response

After submitting a successful transaction, the response will have the following keys: 

Key | Description
---|---
`tempids` | A mapping of any temporary id used in a transaction to its final id value that was assigned.
`block` | The blockchain block number that was created with this transaction. These increment by one. 
`time` | The amount of time that the transaction took to complete.
`status` | The status of the transactions. These map to HTML status codes, i.e. 200 is OK. 
`hash` | The blockchain hash of this transaction, that can be cryptographically proven with the same `flakes` in the future, and linked to the previous block that creates the chain.
`block-bytes` | The size of the block, in bytes.
`timestamp` | A timestamp for the transaction. 
`flakes` | Flakes are the state change of the database, and is the block data itself. Each is a six-tuple of information including the entity-id, attribute-id, value, block-id, true/false for add/delete, and expiration of this piece of data in epoch-milliseconds (0 indicates it never expires).


# Database Functions
## Database Functions

The `_fn` collection is where the code that governs `_rule/predicate`, `_attribute/spec`, `_attribute/txSpec`, and `_collection/spec` is used. In addition, any [custom functions](#custom-functions) created can be used in transactions.

## Function Attributes

Attribute | Type | Description
-- | -- | -- 
`_fn/name` | `string` |  (optional) A unique identifier for this role.
`_fn/params` | `[string]` | (optional) A vector of parameters that this function supports.
`_fn/code` | `string` | (required) The actual function code. Syntax detailed [here](#function-syntax). 
`_fn/doc` | `string` | (optional) An optional docstring describing this function.
`_fn/spec` | `json` | (optional, not yet implemented) An optional spec for parameters. Spec should be structured as a map, parameter names are keys and the respective spec is the value.
`_fn/language` | `tag` | (optional, not yet implemented) Programming language used.

Note, that every database has two built-in functions, `["_fn$name", "true"]` and `["_fn$name", "false"]`, which either allow or block access, respectively, to a given collection or attribute.

## Function Syntax

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


7. User _id: `valT`
- Arguments: None
- Example: `(valT)`
- Use: Sum of the value of all flakes being added in the current spec.
- Available in: `_attribute/spec`, `_collection/spec`, `_attribute/txSpec`
- Cost: 10


8. User _id: `valF`
- Arguments: None
- Example: `(valF)`
- Use: Sum of the value of all flakes being retracted in the current spec.
- Available in: `_attribute/spec`, `_collection/spec`, `_attribute/txSpec`
- Cost: 10



## Custom Functions

When you add a function to the `_fn` stream, you can optionally reference it using the `_fn/name` that you have created. For example, let's say that we want to create a function that always adds 7 to any given number.

```
[{
  "_id": "_fn",
  "name": "addSeven",
  "params": ["n"],
  "code": "(+ [7 n])
}] 
```

Now, we will be able to use it anywhere we use database functions. For example:

1. Using it in a transaction

```
[{
  "_id": "book",
  "length": "(addSeven 100)
}]
```

2. Using it in another `_fn` that is used in an `_attribute/spec`.

```
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
