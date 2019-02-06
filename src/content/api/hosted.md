
### `/api/db/query`

Main query interface for FlureeQL. Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`select` | select-spec |  Selection specification in the form of an array/vector. To select all predicates use `[ "*" ]`. If you were storing customers and wanted to select just the customer name and products they own, the select statement might look like: `[ "customer/name", "customer/products"]`.
`from` | from-spec | Optional. Can be an subject (represented as an idsubject or integer), or an entire collection of entities utilizing the collection name. If selecting from customers as per the prior example, it would simply be `"from": "customer"`. If selecting a specific customer, it would for example be `"from": 4299262263299` or `"from": "[\"customer/name\", \"Newco Inc.\"]"`. 
`where` | where-spec | Optional. Can be in the simple SQL-like string format or more sophisticated queries can be specified in the datalog format. For the simple format, might include something like: `"where": "customer/name = 'ABC Corp'"` or `"where": "person/age >= 22 AND person/age <= 50"`.
`block` | integer or ISO-8601 date string | Optional time-travel query specified by block number, duration, or wall-clock time as a ISO-8601 formatted string. When no block is specified, the most current database is always queried.
`limit` | integer | Optional limit for result quantity. Fluree uses a default of 100.


Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "person"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

#### Query with a limit. Get all predicates from every subject in the `chat` collection

```json
{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "limit": 100}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat(limit:100) {
    _id
    comments
    instant
    message
    person
  }
}
}
```

```sparql
(Limit not currently supported; will be ignored)
 SELECT ?chat ?message ?person ?instant ?fullName 
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/instant  ?instant.
    ?person fd:person/fullName ?fullName.
 }
 LIMIT 100
```

#### Time travel by specifying a block number

```json
{
  "select": ["*"],
  "from": "chat",
  "block": 2
}
```

```graphql
Not supported
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "block": 2}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```sparql
 SELECT ?chat ?message ?person ?instant ?fullName 
 WHERE {
    ?chat   fd2:chat/message  ?message;
            fd2:chat/person   ?person;
            fd2:chat/instant  ?instant.
    ?person fd2:person/fullName ?fullName.
 }

```
#### Time travel by specifying a time

```json
{
  "select": ["*"],
  "from": "chat",
  "block": "2017-11-14T20:59:36.097Z"
}
```
```curl
    curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "block": "2017-11-14T20:59:36.097Z"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
Not supported
```

```sparql
Not supported
```

#### Query with a where clause

```json
{
  "select": ["*"],
  "where": "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"
}
```
```curl
    curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "where": "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat(where: "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"){
    _id
    instant 
    message
  }
}
}
```

```sparql
Not supported
```

### `/api/db/transact`

Main transaction interface for FlureeQL. Post a JSON array/vector that contains subject maps to create, update, upsert or delete.

Each map requires an `_id` as specified below along with key/value pairs containing the predicates and values you wish to modify. An `_action` key is always included, but typically inferred and thus optional for most operations.

Key | Type | Description
-- | -- | -- 
`_id` | idsubject |  Any idsubject value which can include the numeric assigned permanent `_id` for an subject, any predicate marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`, or a temporary id (for new entities). See the "Temporary Ids" section in Transactions to learn more. 
`_action` | string | Optional (if it can be inferred). One of: `add`, `update`, `upsert` or `delete`. When using a temporary id, `add` is always inferred. When using an existing idsubject, `update` is always inferred. `upsert` is inferred for new entities with a tempid if they include an predicate that was marked as `upsert`.

To delete/retract an entire subject, use the `_id` key along with only `"_action": "delete"`. To delete only specific values within an subject, specify the key/value combinations.

The keys can contain the full predicate name including the namespace, i.e. `chat/message` or you can leave off the namespace if it is the same as the collection the subject is within. i.e. when the subject is within the `chat` collection, just `message` can be used which is translated to `chat/message` by Fluree.


Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{"_id": "chat", "message": "Hello, sample chat message."}]' \
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
}]'\
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, 
    { \"_id\": \"person\", \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

```sparql
Transactions not supported in SPARQL.
```

#### Update an existing subject using an idsubject value (note `"_action": "update"` is inferred)

```json
[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Idsubject"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Idsubject"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation updatePerson($myUpdatePersonTx: JSON) {
  transact(tx: $myUpdatePersonTx)
}

{
  "myUpdatePersonTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"fullName\": \"Jane Doe Updated By Idsubject\" }]"
}
```

```sparql
Transactions not supported in SPARQL.
```

#### Update an existing subject using internal `_id` value (note `"_action": "update"` is inferred)

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

```sparql
Transactions not supported in SPARQL.
```

#### Delete (retract) a single predicate

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
mutation deletePredicate ($myDeletePredicateTx: JSON) {
  transact(tx: $myDeletePredicateTx)
}

{
  "myDeletePredicateTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"handle\": null }]"
}
```

```sparql
Transactions not supported in SPARQL.
```

#### Delete (retract) all predicates for an subject

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
mutation deleteAllPredicates ($myDeleteAllPredicatesTx: JSON) {
  transact(tx: $myDeleteAllPredicatesTx)
}

{
  "myDeleteAllPredicatesTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"_action\": \"delete\" }]"
}
```

```sparql
Transactions not supported in SPARQL.
```

### `/api/db/graphql`

We can run both GraphQL queries and transactions using the same endpoint. Both queries and transactions are performed by sending a JSON map/object containing the following keys:

Key | Required | Description
-- | -- | -- 
`operationName` | False |  The name of the GraphQl query or transaction 
`query` | True | The GraphQL query or transaction. Note that transaction use the same endpoint, but in order to perform a transaction, you must specify the "mutation" root. See the 'GraphQL Transactions' section for more information. 
`variables` | False | Variables that you are passing into your query. 


```
{
  "query": "{ graph {chat { _id instant message}}}","variables": null,
  "operationName": null
  }
```


```graphql
{
  "query": "{ graph {chat { _id instant message}}}","variables": null,
  "operationName": null
  }
```

### `/api/db/sparql`

All SPARQL queries can be sent to this endpoint. Simply send a string of the SPARQL query to `/api/db/sparql/`. The [SPARQL Queries](#sparql-queries) section has information about structuring these queries. 

```
 SELECT ?chat ?message ?person ?instant ?fullName 
 WHERE {
    ?chat   fd2:chat/message  ?message;
            fd2:chat/person   ?person;
            fd2:chat/instant  ?instant.
    ?person fd2:person/fullName ?fullName.
 }

```

```sparql
 SELECT ?chat ?message ?person ?instant ?fullName 
 WHERE {
    ?chat   fd2:chat/message  ?message;
            fd2:chat/person   ?person;
            fd2:chat/instant  ?instant.
    ?person fd2:person/fullName ?fullName.
 }

```


### `/api/db/signin`

The signin endpoint is only available in the hosted version of Fluree. This endpoint will return a token for the master database. Using this token, you will be able to see information about your account, your databases, and you will be able to issue tokens for any databases within your account. 

Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | --
`user` | idsubject | The user idsubject you are logging in with. This can be the `_id` integer of the user record, or any idsubject value, such as `["_user/username", "my_username"]`.
`password` | string | Your password

### `/api/db/token`


The token endpoint allows new tokens to be generated on behalf of users. Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`auth` | idsubject |  Required auth idsubject you wish this token to be tied to. Can be the `_id` integer of the auth record,  or any idsubject value such as `["_auth/id", "my_admin_auth_id"]`.
`expireSeconds` | integer | Optional number of seconds until this token should expire. If not provided, token will never expire.
`db` | string | Only required if using your master authorization token from Fluree (from your username/password to flureedb.flur.ee). So long as you are using a token from your own database, it will automatically use the database the token is coming from.


If you are handling authentication for your application but still want users to connect directly to Fluree, your authentication code can utilize this endpoint to retrieve tokens on behalf of the user. The user can subsequently use this token to interact directly with Fluree from the respective application.

In order to create a token, you must use a token that has the following permission:

1. A role with a rule that grants `token` within the `_rule/ops` predicate.
2. The permission to query the `_auth` record required to generate the token.

For item #2, this allows a permission where someone can generate tokens only for certain user or auth records. Generally you'll use an admin-type rights that have visibility to the entire database in which case you simply need to make sure the `_rule/ops` contains the rights for `token`.

Here is an example request using curl. Be sure to replace your auth token, account name and auth-id in the request:

Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "auth": 25769804776,
  "expireSeconds": 3600
}' \
https://$FLUREE_ACCOUNT.flur.ee/api/db/token
```


#### Token request using the `_id` numeric identifier for `auth`

```json
{
  "auth": 25769804776,
  "expireSeconds": 3600
}
```
```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "auth": 25769804776,
  "expireSeconds": 3600
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/token
```
```graphql
Not supported
```
```sparql
Not supported
```
#### Token request using an idsubject value (an predicate marked as `unique`) for `auth`

```json
{
  "auth": ["_auth/id", "my_unique_id"],
  "expireSeconds": 3600
}
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "auth": ["_auth/key", "db-admin"],
  "expireSeconds": 3600
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/token
  ```
```graphql
Not supported
```
```sparql
Not supported
```