# Transactions

## Transactions
Fluree allows you to specify transaction using FlureeQL JSON array/vector syntax that contains entity maps to create, update, upsert or delete. Transactions can also be done with GraphQL, for more information on on GraphQL transactions, reference the GraphQL Transactions section. 

Each map requires an `_id` as specified below along with key/value pairs containing the attributes and values you wish to modify. An `_action` key is always included, but typically inferred and thus optional for most operations.

Key | Type | Description
-- | -- | -- 
`_id` | identity |  Any identity value which can include the numeric assigned permanent `_id` for an entity, any attribute marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`, or a temporary id (for new entities). See the "Temporary Ids" section in the below Transactions section to learn more. 
`_action` | string | Optional (if it can be inferred). One of: `add`, `update`, `upsert` or `delete`. When using a temporary id, `add` is always inferred. When using an existing identity, `update` is always inferred. `upsert` is inferred for new entities with a tempid if they include an attribute that was marked as `upsert`.

To delete/retract an entire entity, use the `_id` key along with only `"_action": "delete"`. To delete only specific values within an entity, specify the key/value combinations.

The keys can contain the full attribute name including the namespace, i.e. `chat/message` or you can leave off the namespace if it is the same as the stream the entity is within. i.e. when the entity is within the `chat` stream, just `message` can be used which is translated to `chat/message` by Fluree.

## Temporary Ids

Every transaction item must have an _id attribute to refer to the entity we are attempting to create/update. A tempid can simply be the stream name, i.e. `_user`. 

FlureeQL example:

```
[
  {
    "_id":    "_user",
    "username": "jdoe",
  }
]
```

However, if you would like to reference that tempid somewhere else in your transaction, it is helpful to create a unique tempid. To make a unique tempid, just append the stream with any non-valid stream character (anything other than a-z, A-Z, 0-9, _) followed by anything else. For example, `_user$jdoe` or `_user#1 `.

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
   https://ACCOUNT_NAME.beta.flur.ee/api/db/transact
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact  
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
   
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```
```graphql
mutation deleteAllAttributes ($myDeleteAllAttributesTx: JSON) {
  transact(tx: $myDeleteAllAttributesTx)
}

{
  "myDeleteAllAttributesTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"_action\": \"delete\" }]"
}
```

## Database Functions

Database functions allow you to update an attribute's value based on the existing value. This allows features such as an atomic counter and timestamps. Database functions need to be provided to a transaction as a string. Fluree supports the following database functions, and is expanding the verstility of these functions in future releases.

Function | Example | Description
-- | -- | -- 
`inc` | `#(inc)` |  Increment existing value by 1. Works on `integer`.
`dec` | `#(dec)` | Decrement existing value by 1. Works on `integer`.
`now` | `#(now)` | Insert current server time. Works on `instant`.
`+` | `#(+ [1 2 3])` | Returns the sum of the provided values. Works on `integer` and `float`.
`-` | `#(- [10 9 3])` | Returns the difference of the numbers. The first, as the minuend, the rest as the subtrahends. Works on `integer` and `float`.
`*` | `#(* [90 10 2])` | Returns the product of the provided values. Works on `integer` and `float`.
`/` | `#(/ [36 3 4])` | If only one argument supplied, returns 1/first argument, else returns first argument divided by all of the other arguments. Works on `integer` and `float`.
`quot` | `#(quot 60 10)` | Returns the quotient of dividing the first argument by the second argument. Rounds the answer towards 0 to return the nearest integer. Works on `integer` and `float`.
`rem` | `#(rem 64 10)` | Remainder of dividing the first argument by the second argument. Works on `integer` and `float`.
`mod` | `#(mod 64 10)` | Modulus of the first argument divided by the second argument. The mod function takes the rem of the two arguments, and if the either the numerator or denominator are negative, it adds the denominator to the remainder, and returns that value. Works on `integer` and `float`.
`max` | `#(max [1 2 3])`| Returns the max of the provided values. Works on `integer`, `float`.
`max-attr-val` | `"#(max-attr-val \"person/age\")"`| Returns the max of the provided attribute. Works on `integer`, `float`.
`now` | `#(now)` | Insert current server time. Works on `instant`.

Database function can also be combined, for instance `#(inc (max [1.5 2 3]))` will return 4. 

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

