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

### `/api/dbs`

To view all the databases attached to a particular account, you can either send the following as a GET request or a POST request with an empty body. 

```
Action: POST or GET
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/dbs
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: { }
```

### `/api/action` - New Database

To create a new database, send the following request to `api/action`. Your `db/id` should begin with your account name and a forward slash, followed by a database name (any combination of letters and numbers).

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/action
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: ["new-db", {
  "db/id": [NETWORK NAME]/[DATABASE NAME]
 }]
```


### `/api/action` - New User

To create a new user, send the following request to `api/action`. 

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/action
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: ["new-user", {
  "db/id": [NETWORK NAME]/[DATABASE NAME]
 }]
```

### `/api/action` - Archive Database

Not yet supported.

### `/api/fdb/logs/[account]`

To retrieve the logs for a given database, you would post an array where the first item is "logs", and the second item is a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | --
`db` | Database name | Required. Should be `[ACCOUNT NAME]/[DBNAME]`
`limit` | `int` | (optional) Number of logs to retrieve
`status` | `ok` or `error` | To view just successful requests or just errors, specify `status`. 



<!-- `operation` | | 
`from` | |  -->

For example, to get the 25 most recent logs from `example.default`:

```
Action: POST
Endpoint: https://example.beta.flur.ee/api/fdb/logs/example
Headers: {"Authorization": "Bearer [MASTER TOKEN]"}
Body: ["logs",{"db":"example.default","limit": 25}]
```

### `/api/accounts`

To view all the accounts associated with a particular username and password, you can send a GET request with a token in the header, like below:

```
Action: GET
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/accounts
Headers: {"Authorization": "Bearer [TOKEN]"}
```

Alternatively, you can send a POST request with the username and password and NO token:

```
Action: POST
Endpoint: https://[ACCOUNTNAME].beta.flur.ee/api/accounts
Headers: {"Authorization": "Bearer [TOKEN]"}
Body: {
  "user": ["_user/username", "YOUR EMAIL"],
  "password": "YOUR PASSWORD"
}
```

### `/api/db/signin`

This is a POST request issued to `https://f.beta.flur.ee/api/db/signin`, and it does not require a token. 

This endpoint will return a token for your account. You will be able to issue queries or transactions to all of the databases in your account using this token. 

Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | --
`account` | string | Required. Your account name. Send a request to `/api/accounts` if you don't know the names of your accounts. 
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

### `/api/db/reset-pw`

Submit a request to `api/db/reset-pw` to get a reset token emailed to your email. The email must be a valid username for an account. 

```
Action: POST
Endpoint: https://f.beta.flur.ee/api/db/reset-pw
Body: {
  "username": "YOUR EMAIL"
}
```

### `/api/db/new-pw`

After you receive a reset token in your email, you can set a new password by specifying the reset token and new password. 
```
Action: POST
Endpoint: https://f.beta.flur.ee/api/db/new-pw
Body: {
  "password": "NEW PASSWORD",
  "resetToken": "RESET TOKEN"
}
```
