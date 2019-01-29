## Hosted Endpoint Examples

All requests should be POST requests, and all requests, with the exception of requests to `/api/signin` 

### `/api/db/query`
All single queries in FlureeQL syntax that include a `select` key should be issued through the `/api/db/query` endpoint. 

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/db/query
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: { "select": ["*"], "from": "_collection"}
```

### `/api/db/multi-query`

If you are submitting multiple FlureeQL queries at once (using the [multi-query syntax](/docs/query/advanced-query#multiple-queries)), that should be done through the `/multi-query` endpoint. 

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/db/multi-query
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: { "query1": { "select": ["*"], "from": "_collection"}, 
        "query2": { "select": ["*"], "from": "_predicate"}}
```

### `/api/db/block`

FlureeQL [block queries](/docs/query/block-query) should be submitted to the `/block` endpoint. This does not include other types of queries (basic queries, history queries, etc) that might have a "block" key. This only includes queries like those in the linked section - queries that are returning flakes from a block or set of blocks. 

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/db/block
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: { "block": 5 }
```

### `/api/db/history`

FlureeQL [history queries](/docs/query/history-query) should be submitted to the `/history` endpoint. This only includes queries like those in the linked section.

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/db/history
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: {
  "history": ["person/handle", "zsmith"],
  "block": 4
}
```

### `/api/db/transact`

All transactions, except transaction issued through the GraphQL syntax, should be issued to the `/api/db/transact` endpoint.

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/db/history
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: [{
    "_id":    "_user",
    "username": "jdoe",
  }]
```

### `/api/db/graphql`

All queries and transactions in GraphQL syntax should be issued through the `/api/db/graphql` endpoint. 

An example of a GraphQL query:

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/db/graphql
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: {"query": "{ graph {
  chat {
    _id
    comments
    instant
    message
    person
  }
}
}"}
```

An example of a GraphQL transaction:

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/db/graphql
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: {"query": "mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}, 
"variables": {
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"oRamirez\", \"fullName\": \"Oscar Ramirez\" }, 
    { \"_id\": \"person\", \"handle\": \"cStuart\", \"fullName\": \"Chana Stuart\" }]"
}}
```

### `/api/db/sparql`

All queries in SPARQL syntax, regardless of type, should be issued through the `/api/db/sparql` endpoint. 

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/db/sparql
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: "SELECT ?chat ?message ?person ?instant ?comments
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/comments ?comments;
            fd:chat/instant  ?instant.
 }"
```

### `/api/db/token`

The token endpoint allows new tokens to be generated on behalf of users. For more information on how tokens work, see [Getting Tokens](/api/hosted-endpoints/getting-tokens).

Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`auth` | id |  Auth id you wish this token to be tied to. Can be the `_id` integer of the auth record,  or any unique two-tuple such as `["_auth/id", "my_admin_auth_id"]`.
`expireSeconds` | integer | Optional number of seconds until this token should expire. If not provided, token will never expire. If, `root` is `true`, then `expireSeconds` needs to be 3599 or less. 
`db` | string | Only required if using your master authorization token from FlureeDB (from your username/password to flureedb.flur.ee). So long as you are using a token from your own database, it will automatically use the database the token is coming from.
`root` | boolean | If you do not specify an auth in your request, you can specify root is `true` to get a token with root access. 

You can get a token for your databases using either a token from the master db (what you get from `/api/db/signin` or from one of your databases. 

An example using the token from `/api/db/signin` as [MASTER  TOKEN]: 

```
Action: POST
Endpoint: https://[ACCOUNT NAME].beta.flur.ee/api/db/token
Headers: {"Authorization": "Bearer [MASTER TOKEN]"}
Body: {
  "root": true,
  "expireSeconds": 3599
  "db": "[ACCOUNT].[DBNAME]"
}
```

An example using a token from the database (i.e. the token from the above request):

```
Action: POST
Endpoint: https://[ACCOUNT NAME].beta.flur.ee/api/db/token
Headers: {"Authorization": "Bearer [DB TOKEN]"}
Body: {
  "root": true,
  "expireSeconds": 3599
}
```
As you can see, if you are already using a token from a given database, you don't need to specify the database name. 


### `/api/action` (Logs)

To retrieve the logs for a given database, you would post an array where the first item is "logs", and the second item is a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | --
`db` | database name | Required. Should be the `[ACCOUNT NAME].[DBNAME]`
`limit` | `int` | (optional) Number of logs to retrieve
`after` | | 
`before` | | 


You should use the token associated with the master database (as in, the token you receive from `/api/db/signin`).

For example, to get the 25 most recent logs from `example.default`:

```
Action: POST
Endpoint: https://example.beta.flur.ee/api/db/logs
Headers: {"Authorization": "Bearer [MASTER TOKEN]"}
Body: ["logs",{"db":"example.default","limit": 25}]
```

### `/api/db/signin`

This is a POST request issued to `https://f.beta.flur.ee/api/db/signin`, and it does not require a token. 

This endpoint will return a token for the master database. You will not be able to issue queries or transactions to any of the databases in your account using this token. This token will allow you to query and transaction the **master database** only, which means you will be able to see information about your account and your databases. 

Most usefully, this token will allow you to issue tokens for any databases within your account. 

Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | --
`db` | `f.master` | Required. You must use `f.master`. 
`user` | idsubject | The user idsubject you are logging in with. This can be the `_id` integer of the user record, or any idsubject value, such as `["_user/username", "my_username"]`.
`password` | string | Your password

```
Action: POST
Endpoint: https://f.beta.flur.ee/api/db/signin
Body: {
  "user": ["_user/username", "YOUR EMAIL"],
  "password": "YOUR PASSWORD",
  "db": "f.master"
}
```