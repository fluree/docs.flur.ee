## Signed Endpoint Examples

In order to ensure speed of processing queries and transactions, different types of queries and transactions should be issued to different endpoints. All requests, except requests to `/storage`, should be POST requests. 

### /query
All single queries in FlureeQL syntax that include a `select` key should be issued through the `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/query` endpoint. If you do not have `fdb-group-open-api` set to true (it is true by default), then you'll need to sign your query ([signing queries](/docs/identity/signatures#signed-queries)).

An example of an unsigned request to `/query`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/query
Headers: None
Body: { "select": ["*"], "from": "_collection"}
```

An example of a signed request to `/query`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/query
Headers: {"Authorization": "Bearer [SIGNATURE]"}
Body: { "select": ["*"], "from": "_collection"}
```

### /multi-query
If you are submitting multiple FlureeQL queries at once (using the [multi-query syntax](/docs/query/advanced-query#multiple-queries)), that should be done through the `/multi-query` endpoint. 

An example of an unsigned request to `/multi-query`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/multi-query
Headers: None
Body: { "query1": { "select": ["*"], "from": "_collection"}, 
        "query2": { "select": ["*"], "from": "_predicate"}}
```

An example of a signed request to `/multi-query`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/multi-query
Headers: {"Authorization": "Bearer [SIGNATURE]"}
Body: { "query1": { "select": ["*"], "from": "_collection"}, 
        "query2": { "select": ["*"], "from": "_predicate"}}
```

### /block
FlureeQL [block queries](/docs/query/block-query) should be submitted to the `/block` endpoint. This does not include other types of queries (basic queries, history queries, etc) that might have a "block" key. This only includes queries like those in the linked section - queries that are returning flakes from a block or set of blocks. 

An example of an unsigned request to `/block`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/block
Headers: None
Body: { "block": 5 }
```

An example of a signed request to `/block`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/multi-query
Headers: {"Authorization": "Bearer [SIGNATURE]"}
Body: { "block": 5}
```

### /history

FlureeQL [history queries](/docs/query/history-query) should be submitted to the `/history` endpoint. This only includes queries like those in the linked section.

An example of an unsigned request to `/history`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/history
Headers: None
Body: {
  "history": ["person/handle", "zsmith"],
  "block": 4
}
```

An example of a signed request to `/block`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/multi-query
Headers: {"Authorization": "Bearer [SIGNATURE]"}
Body: {
  "history": ["person/handle", "zsmith"],
  "block": 4
}
```

### /transact

All transactions, except transaction issued through the GraphQL syntax, should be issued to the `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/transact` endpoint. If you do not have `fdb-group-open-api` set to true (it is true by default), then you'll need to sign your transaction ([signing queries](/docs/identity/signatures#signed-transaction)).

An example of an unsigned request to `/transact`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/transact
Headers: None
Body: [{
    "_id":    "_user",
    "username": "jdoe",
  }]
```

An example of a signed request to `/transact`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/query
Headers: None
Body: [{
    "_id":    "_user",
    "username": "jdoe",
  },
  {
      "_id": "_tx",
      "auth": ["_auth/id", "jdoe"]
  }]
```

### /graphql Query

All queries and transactions in GraphQL syntax should be issued through the `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/graphql` endpoint. If you do not have `fdb-group-open-api` set to true (it is true by default), then you'll need to sign your query ([signing queries](/docs/identity/signatures#signed-queries)).

An example of an unsigned request to `/graphql`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/graphql
Headers: None
Body: "{ graph {
  chat {
    _id
    comments
    instant
    message
    person
  }
}
}"
```

An example of a signed request to `/graphql`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/query
Headers: {"Authorization": "Bearer [SIGNATURE]"}
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

### /graphql Transaction

All queries and transactions in GraphQL syntax should be issued through the `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/graphql` endpoint. If you do not have `fdb-group-open-api` set to true (it is true by default), then you'll need to sign your transactions ([signing transactions](/docs/identity/signatures#signed-transactions)).

An example of an unsigned request to `/graphql`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/graphql
Headers: None
Body: {"query": "mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}, 
"variables": {
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"oRamirez\", \"fullName\": \"Oscar Ramirez\" }, 
    { \"_id\": \"person\", \"handle\": \"cStuart\", \"fullName\": \"Chana Stuart\" }]"
}}
```

An example of an signed request to `/graphql`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/graphql
Headers: {"Authorization": "Bearer [SIGNATURE]"}
Body: {"query": "mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}, 
"variables": {
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"oRamirez\", \"fullName\": \"Oscar Ramirez\" }, 
    { \"_id\": \"person\", \"handle\": \"cStuart\", \"fullName\": \"Chana Stuart\" }]"
}}
```

### /sparql

All queries in SPARQL syntax, regardless of type, should be issued through the `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/sparql` endpoint. If you do not have `fdb-group-open-api` set to true (it is true by default), then you'll need to sign your query ([signing queries](/docs/identity/signatures#signed-queries)).

An example of an unsigned request to `/sparql`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/sparql
Headers: None
Body: "SELECT ?chat ?message ?person ?instant ?comments
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/comments ?comments;
            fd:chat/instant  ?instant.
 }"
```

An example of a signed request to `/sparql`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/dev/main/sparql
Headers: {"Authorization": "Bearer [SIGNATURE]"}
Body: "SELECT ?chat ?message ?person ?instant ?comments
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/comments ?comments;
            fd:chat/instant  ?instant.
 }"
```

### /health

A GET request to `/fdb/health` returns whether the server is ready or not. You are not able to test this endpoint in the sidebar. 

```
Action: GET
Endpoint: http://localhost:8080/fdb/health
```

### /storage

A GET request to `/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]` returns all key-value pairs of a certain type. You are not able to test this endpoint in the sidebar. 

```
Action: GET
Endpoint: http://localhost:8080/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]
```

A GET request to `/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]/[KEY]` returns the value for the provided key.

```
Action: GET
Endpoint: http://localhost:8080/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]/[KEY]
```

### /sub

A POST request to `/fdb/sub` handles subscriptions. More documentation on this feature coming soon. You are not able to test this endpoint in the sidebar. 


### /new-keys

A POST request with an empty object or a GET request to `/fdb/new-keys` returns a valid public key, private key, and auth-id. Learn more about [how identity is established in Fluree](/docs/identity/public-private-keys).

### /dbs

A POST request with an empty object or a GET request to `/fdb/dbs` returns all the dbs in the transactor group.

### /new-db

A database id must begin with a network name followed by a `/` and a dbid. Network names and dbids may only contain letters and numbers. In your request, you must specify `db/id`. No other options are currently supported. 

For example, `test/one` is the `one` database in the `one` network. If you specify a network that doesn't exist, then Fluree will create a new network for you, as well as the new database.

An example of a signed request to `/new-db`:
```
Action: POST
Endpoint: http://localhost:8080/fdb/new-db
Headers: {"Authorization": "Bearer [SIGNATURE]"}
Body: {
  "db/id": "test.one"
}
```
