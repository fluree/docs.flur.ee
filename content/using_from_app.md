
# Your App + FlureeDB

## Overview

Interacting with FlureeDB from your application can be done in one of three ways:

1. The JSON API (i.e. FlureeQL)
2. GraphQL
3. An embeddable FlureeDB client (not yet in beta)

For any of these methods, a valid token must be supplied with the database requests (queries, transactions, etc.). 

Tokens are tied to a specific authorization record stored in the database and govern the permission of the requests. There are several ways to get a token which are subsequently explained.

It is worth noting that transactions are signed using public/private key cryptography. The hosted FlureeDB abstracts this from your application so that a more common username/password authentication scheme can be utilized.


## Getting Tokens

Interacting with the hosted FlureeDB is done using secure tokens that have the authorization identity encoded directly in them. There are several ways to get tokens, and the method you choose is influenced by how you'd like to run FlureeDB.

**Interacting with FlureeDB only from your app server**

FlureeDB can be run in a manner similar to a traditional database server, 'behind' your application server. If you choose to utilize it in this way, you simply need to generate a token with the permissions you desire (likely full access) and pass it to your application. You provide the token to your application like you would any secret, typically via an environment variable.

To get a permanent admin token, follow these steps:

1. Identify the authorization record (or create one) that you wish the token to utilize. A sample transaction is provided here if you need to create a new one.
2. Generate a token tied to that authorization record either via the FlureeDB admin dashboard or via an API call

If you need to create an authorization record, see the example provided.

Remember, authorization is governed by rules (stored in the `_rule` stream). Rules are grouped into roles (stored in the `_role` stream), and roles are assigned to auth entities (`_auth` stream).

#### Sample rule, role and auth record for admin privileges

```json
[
  {
    "_id":    "_auth",
    "id":    "db-admin",
    "doc":    "A db admin auth that has full data visibility and can generate tokens for other users.",
    "roles":  ["_role$db-admin"] 
  },
  {
    "_id":   "_role$db-admin", 
    "id":    "db-admin",
    "doc":   "A role for full access to database.",
    "rules": ["_rule$db-admin",  "_rule$db-token"] 
  },
  {
    "_id":       "_rule$db-admin" ,
    "id":        "db-admin",
    "doc":       "Rule that grants full access to all streams.",
    "stream":    "*",
    "streamDefault": true,
    "ops":       ["query", "transact"],
    "predicate": "true"
  },
  {
    "_id":       "_rule$db-token" ,
    "id":        "db-admin-token",
    "doc":       "Rule allows token generation for other users.",
    "ops":       ["token"],
    "predicate": "true"
  }
]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[
  {
    "_id":    "_auth",
    "id":    "db-admin",
    "doc":    "A db admin auth that has full data visibility and can generate tokens for other users.",
    "roles":  ["_role$db-admin"] 
  },
  {
    "_id":   "_role$db-admin", 
    "id":    "db-admin",
    "doc":   "A role for full access to database.",
    "rules": ["_rule$db-admin",  "_rule$db-token"] 
  },
  {
    "_id":       "_rule$db-admin" ,
    "id":        "db-admin",
    "doc":       "Rule that grants full access to all streams.",
    "stream":    "*",
    "streamDefault": true,
    "ops":       ["query", "transact"],
    "predicate": "true"
  },
  {
    "_id":       "_rule$db-token" ,
    "id":        "db-admin-token",
    "doc":       "Rule allows token generation for other users.",
    "ops":       ["token"],
    "predicate": "true"
  }
]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```
```graphql
mutation addRoleRuleAuth($myAuthTx: JSON){
  transact(tx: $myAuthTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myAuthTx": "[ 
    { \"_id\": \"_auth\", \"key\": \"db-admin\", \"doc\": \"A db admin auth that has full data visibility and can generate tokens for other users.\", \"roles\": [\"_role$db-admin\"] }, 
    { \"_id\": \"_role$db-admin\", \"id\": \"db-admin\", \"doc\": \"A role for full access to database.\", \"rules\": [\"_rule$db-admin\", \"_rule$db-token\"] }, 
    { \"_id\": \"_rule$db-admin\", \"id\": \"db-admin\", \"doc\": \"Rule that grants full access to all streams.\", \"stream\": \"*\", \"streamDefault\": true, \"ops\": [\"query\", \"transact\"], \"predicate\": \"true\" }, 
    { \"_id\": \"_rule$db-token\", \"id\": \"db-admin-token\", \"doc\": \"Rule allows token generation for other users.\", \"ops\": [\"token\"], \"predicate\": \"true\" } ]"
}
```

#### Query for all `_auth` records and their respective rules and roles

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": [ "*", { "_auth/roles": [ "*", {"_role/rules": ["*"]} ] } ], "from": "_auth"}' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```json
{
  "select": [ "*", { "_auth/roles": [ "*", {"_role/rules": ["*"]} ] } ],
  "from": "_auth"
}
```

```graphql
{ graph {
  _auth {
    _id
    id
    doc
    key
    roles {
      id
      _id
      doc
      rules {
        id
        _id
        doc
        stream
        streamDefault
        predicate
        ops
      }
    }
  }  
}
}
```

**Interacting with FlureeDB directly from your end-user apps**

FlureeDB is also designed to interact directly with front-end apps/UIs via a set of permissions tied to individual users. The rules-based permissions will 'hide' any data the user is unable to view, and prevent unauthorized transactions. In this case, each user will need a unique token tied to them. There are two ways to generate these user-specific tokens:

1. An API endpoint, `/api/db/token`, can generate tokens assuming the user generating the token has permission to do so for the given user / auth record. You can roll your own authentication logic within your app server, and once satisfied, use the API endpoint to generate the token and pass it to the client for subsequent use.
2. For hosted FlureeDB, we provide an authentication service you can leverage if you like by having your end-user application POST username + password to the `/api/signin` JSON endpoint, and assuming successful authentication, a token will be returned. Additional options such as token expiration can also be provided. This service also handles password reset requests for you.



## Revoking Tokens

Tokens become useless under two conditions:

1. They reach their token expiration date (assuming one was provided when creating the token).
2. The `_auth` entity the token is associated with no longer has permissions.

A token is tied directly to a specific `_auth` entity, and with every request the roles + rules associated with that entity are retrieved. Therefore, the way to make a token useless is to make the `_auth` entity it is tied to useless. To do so, employ one of these strategies:

1. Delete the auth entity (ensure if it is referenced to a `_user` via the `_user/auth` attribute that the reference is also deleted. 
2. Remove current roles referenced by the `_auth` entity, and associate a role that has no permission.

If you think the token was compromised but you still want the same roles + rules, you can copy the existing `_auth` attributes to a new `_auth` entity. Recall a `_user` can have many `_auth` entities. If using Fluree for authorization, the user will be prompted to log in again, and a new token will be issued.

If you have a token but don't know the `_auth` entity it is tied to, you can get that information from the token itself. The middle part of the token (between the two `.`) is JSON that is Base64 encoded. Here is a way to decode it in javascript: `JSON.parse(atob("place_token_here".split('.')[1]))`. The auth `_id` value is in the `sub` key (subject).

You should try to make tokens expire at a reasonable timeframe that balances security with your application's needed convenience.

## API Endpoints

### `/api/db/query`

Main query interface for FlureeQL. Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`select` | select-spec |  Selection specification in the form of an array/vector. To select all attributes use `[ "*" ]`. If you were storing customers and wanted to select just the customer name and products they own, the select statement might look like: `[ "customer/name", "customer/products"]`.
`from` | from-spec | Can be an entity (represented as an identity or integer), or an entire stream of entities utilizing the stream name. If selecting from customers as per the prior example, it would simply be `"from": "customer"`. If selecting a specific customer, it would for example be `"from": 4299262263299` or `"from": "[\"customer/name\", \"Newco Inc.\"]"`. 
`where` | where-spec | Optional. Can be in the simple SQL-like string format or more sophisticated queries can be specified in the datalog format. For the simple format, might include something like: `"where": "customer/name = 'ABC Corp'"` or `"where": "person/age >= 22 AND person/age <= 50"`.
`block` | integer or ISO-8601 date string | Optional time-travel query, specified either by the block the query results should be of, or a wall-clock time in ISO-8601 fromat. When no block is specified, the most current database is always queried.
`limit` | integer | Optional limit for result quantity. Fluree uses a default of 1000.


Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "person"}' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

#### Query with a limit. Get all attributes from every entity in the `chat` stream

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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
Not supported
```

#### Query with a where clause

```json
{
  "select": ["*"],
  "from": "chat",
  "where": "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"
}
```
```curl
    curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "where": "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"}' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
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

The keys can contain the full attribute name including the namespace, i.e. `chat/message` or you can leave off the namespace if it is the same as the stream the entity is within. i.e. when the entity is within the `chat` stream, just `message` can be used which is translated to `chat/message` by Fluree.


Curl example:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{"_id": "chat", "message": "Hello, sample chat message."}]' \
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
}]'\
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
### `/api/db/token`

The token endpoint allows new tokens to be generated on behalf of users. Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`auth` | identity |  Required auth identity you wish this token to be tied to. Can be the `_id` integer of the auth record,  or any identity value such as `["_auth/id", "my_admin_auth_id"]`.
`expireSeconds` | integer | Optional number of seconds until this token should expire. If not provided, token will never expire.
`db` | string | Only required if using your master authorization token from FlureeDB (from your username/password to flureedb.flur.ee). So long as you are using a token from your own database, it will automatically use the database the token is coming from.


If you are handling authentication for your application but still want users to connect directly to FlureeDB, your authentication code can utilize this endpoint to retrieve tokens on behalf of the user. The user can subsequently use this token to interact directly with FlureeDB from the respective application.

In order to create a token, you must use a token that has the following permission:

1. A role with a rule that grants `token` within the `_rule/ops` attribute.
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
https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/token
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/token
```
```graphql
Not supported
```
#### Token request using an identity value (an attribute marked as `unique`) for `auth`

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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/token
  ```
```graphql
Not supported
```
