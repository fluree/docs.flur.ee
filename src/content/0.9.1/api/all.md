## API Endpoints

### `/api/db/query`

Main query interface for FlureeQL. Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`select` | select-spec |  Selection specification in the form of an array/vector. To select all attributes use `[ "*" ]`. If you were storing customers and wanted to select just the customer name and products they own, the select statement might look like: `[ "customer/name", "customer/products"]`.
`from` | from-spec | Optional. Can be an entity (represented as an identity or integer), or an entire collection of entities utilizing the collection name. If selecting from customers as per the prior example, it would simply be `"from": "customer"`. If selecting a specific customer, it would for example be `"from": 4299262263299` or `"from": "[\"customer/name\", \"Newco Inc.\"]"`. 
`where` | where-spec | Optional. Can be in the simple SQL-like string format or more sophisticated queries can be specified in the datalog format. For the simple format, might include something like: `"where": "customer/name = 'ABC Corp'"` or `"where": "person/age >= 22 AND person/age <= 50"`.
`block` | integer or ISO-8601 date string | Optional time-travel query, specified either by the block the query results should be of, or a wall-clock time in ISO-8601 fromat. When no block is specified, the most current ledger is always queried.
`limit` | integer | Optional limit for result quantity. Fluree uses a default of 1000.


Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "person"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

#### Query with a limit. Get all attributes from every entity in the `chat` collection

```flureeql
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

#### Time travel by specifying a block number

```flureeql
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
#### Time travel by specifying a time

```flureeql
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

#### Query with a where clause

```flureeql
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
### `/api/db/transact`

Main transaction interface for FlureeQL. Post a JSON array/vector that contains entity maps to create, update, upsert or delete.

Each map requires an `_id` as specified below along with key/value pairs containing the attributes and values you wish to modify. An `_action` key is always included, but typically inferred and thus optional for most operations.

Key | Type | Description
-- | -- | -- 
`_id` | identity |  Any identity value which can include the numeric assigned permanent `_id` for an entity, any attribute marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`, or a temporary id (for new entities). See the "Temporary Ids" section in Transactions to learn more. 
`_action` | string | Optional (if it can be inferred). One of: `add`, `update`, `upsert` or `delete`. When using a temporary id, `add` is always inferred. When using an existing identity, `update` is always inferred. `upsert` is inferred for new entities with a tempid if they include an attribute that was marked as `upsert`.

To delete/retract an entire entity, use the `_id` key along with only `"_action": "delete"`. To delete only specific values within an entity, specify the key/value combinations.

The keys can contain the full attribute name including the namespace, i.e. `chat/message` or you can leave off the namespace if it is the same as the collection the entity is within. i.e. when the entity is within the `chat` collection, just `message` can be used which is translated to `chat/message` by Fluree.


Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{"_id": "chat", "message": "Hello, sample chat message."}]' \
   https://ACCOUNT_NAME.flur.ee/api/db/transact
```

#### Insert two new entities using temp-ids (note `"_action": "add"` is inferred)

```flureeql
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

#### Update an existing entity using an identity value (note `"_action": "update"` is inferred)

```flureeql
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

```flureeql
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

#### Delete (retract) a single attribute

```flureeql
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

```flureeql
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

### `/api/db/graphql`

We can run both GraphQL queries and transactions using the same endpoint. Both queries and transactions are performed by sending a JSON map/object containing the following keys:

Key | Required | Description
-- | -- | -- 
`operationName` | False |  The name of the GraphQl query or transaction 
`query` | True | The GraphQL query or transaction. Note that transaction use the same endpoint, but in order to perform a transaction, you must specify the "mutation" root. See the 'GraphQL Transactions' section for more information. 
`variables` | False | Variables that you are passing into your query. 


```all
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

### `/api/db/token`

The token endpoint allows new tokens to be generated on behalf of users. Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`auth` | identity |  Required auth identity you wish this token to be tied to. Can be the `_id` integer of the auth record,  or any identity value such as `["_auth/id", "my_admin_auth_id"]`.
`expireSeconds` | integer | Optional number of seconds until this token should expire. If not provided, token will never expire.
`db` | string | Only required if using your master authorization token from Fluree (from your username/password to flureedb.flur.ee). So long as you are using a token from your own ledger, it will automatically use the ledger the token is coming from.


If you are handling authentication for your application but still want users to connect directly to Fluree, your authentication code can utilize this endpoint to retrieve tokens on behalf of the user. The user can subsequently use this token to interact directly with Fluree from the respective application.

In order to create a token, you must use a token that has the following permission:

1. A role with a rule that grants `token` within the `_rule/ops` attribute.
2. The permission to query the `_auth` record required to generate the token.

For item #2, this allows a permission where someone can generate tokens only for certain user or auth records. Generally you'll use an admin-type rights that have visibility to the entire ledger in which case you simply need to make sure the `_rule/ops` contains the rights for `token`.

Here is an example request using curl. Be sure to replace your auth token, account name and auth-id in the request:

Curl example:

```all
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

```flureeql
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
#### Token request using an identity value (an attribute marked as `unique`) for `auth`

```flureeql
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

### Signed Endpoints 

As an alternative to using JSON Web Tokens, it is possible to hit all of the endpoints with a signature. See more information about signatures in the [Signing Transactions](#signing-transactions) section. 

The endpoints are:

`/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/[ACTION]`

Action | Endpoint
-- | -- 
Query | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/query`
Transact | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/transact`
GraphQL | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/graphql`
New DB | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/new-db`
Delete DB | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/delete-db`

For example, if you are in the `test` network using the `test.one` ledger, you could post a query to the `/fdb/test/test.one/query` endpoint. For queries, the signature needs to be included in the Authorization header. For transactions, the signature can be included in the signature map. See [Signing Transactions](#signing-transactions).

A signature is not required is the option `fdb-group-open-api` is set to true (default for the downloaded version of Fluree). Deleting and adding a ledger only works if `fdb-group-open-api` is set to true. 
