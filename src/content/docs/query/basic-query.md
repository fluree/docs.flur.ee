## Basic Query

In this section, we show you how to perform basic queries. All of these queries can be issued to an API endpoint ending in `/query`. 


### Query Keys

Below are all the possible keys that you can include in a basic select query. Usage examples are in subsequent sections on this page.

Key | Required? | Description
-- | -- | -- 
`select` | yes |  An array of predicates or a `*`
`from` | yes | A collection, predicate name, subject id, unique two-tuple, or array of subject ids and two-tuples
`limit` | no | Optional limit (integer) of results to include. Default is 100.
`block` | no | Optional time-travel query specified by block number, duration, or wall-clock time as an ISO-8601 formatted string.
`component` | no | Optional boolean, which specifies whether or not to automatically crawl the graph and retrieve component entities. Default: true. 
`offset`| no | Optional limit (integer) of results to exclude (i.e for pagination).


### Select From Collection

To select all subjects from a collection, you can use the glob character, `*`, and specify a collection in the "from" clause. 

```flureeql
{
  "select": ["*"],
  "from": "chat"
}
```
```curl
curl\
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": "chat"
}'\
   [HOST]/api/db/query
```
```graphql
{ graph {
  chat {
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
 SELECT ?chat ?message ?person ?instant ?comments
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/comments ?comments;
            fd:chat/instant  ?instant.
 }
```

### Select From a Subject

To select all predicates from a subject, you can use the glob character, `*`, in the select clause, and use either a subject id or unique two-tuple in the from clause.

Using a Subject Id: 

```flureeql
{
  "select": ["*"],
  "from": 369435906932737
}
```
```curl
curl\
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": 369435906932737
}'\
   [HOST]/api/db/query
```
```graphql
Not supported
```

```sparql 
 SELECT ?message ?person ?instant ?comments
 WHERE {
    369435906932737   fd:chat/message  ?message;
                    fd:chat/person   ?person;
                    fd:chat/comments ?comments;
                    fd:chat/instant  ?instant.
 }
```

If a predicate is listed as `unique` (such as `person/handle` in our sample data), then you can use the name of the predicate and the object of the predicate to select a subject.

Using a unique two-tuple:

```flureeql
{
  "select": ["*"],
  "from":  ["person/handle", "jdoe"]
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from":  ["person/handle", "jdoe"]
}' \
   [HOST]/api/db/query
```

```graphql
{ graph {
  person (where: "person/handle = \"jdoe\""){
    _id
    handle
    fullName
  }
}
}
```

```sparql
 SELECT ?person ?fullName 
 WHERE {
    ?person fd:person/fullName  ?fullName;
            fd:person/handle    "jdoe".
 }
```

### Select From A Group of Subjects

In your "from" clause, list subject ids and unique-two tuples. Query results will be returned in the same order as we specify them. 


```flureeql
{
  "select": ["*"],
  "from":  [369435906932737, ["person/handle", "jdoe"], 387028092977153,  ["person/handle", "zsmith"] ]
}
```

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from":  [369435906932737, ["person/handle", "jdoe"], 387028092977153,  ["person/handle", "zsmith"] ]
}' \
   [HOST]/api/db/query
```

```graphql
# Note this may show an error in your GraphQL tool, but it will return the expected result. 

{ graph {
  person1(where: "person/handle = \"jdoe\""){
    _id
    handle
    fullName
  }
    person2(where: "person/handle = \"zsmith\""){
    _id
    handle
    fullName
  }
}
}
```

```sparql
Not supported
```

### Select Subjects With Certain Predicate

By specifying a predicate name in the "from" clause, you can select all subjects that contain that predicate.

```flureeql
{
    "select": ["*"],
    "from": "person/handle"
}
```

```curl
curl\
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["*"],
    "from": "person/handle"
}'\
   [HOST]/api/db/query
```

```graphql
{ graph {
  person {
    handle
}
}
```

```sparql
 SELECT ?person ?handle
 WHERE {
    ?person   fd:person/handle ?handle.
 }
```

### Select Certain Predicates

To select one or more specific predicates from a collection, we can specify them in the "select" array. 


```flureeql
{
  "select": ["chat/message", "chat/person"],
  "from": "chat",
  "limit": 100
}
```
```curl
curl\
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["chat/message", "chat/person"],
  "from": "chat",
  "limit": 100
}'\
   [HOST]/api/db/query
```
```graphql
{ graph {
  chat(limit:100) {
    message
    person
  }
}
}
```

```sparql 
 SELECT ?chat ?message ?person
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
 }
 LIMIT 100
```

### Select with Where

To limit the subjects returned, we can specify a where clause. A query cannot have both a where clause and a from clause. 

Where clauses can filter predicates using the following operations:
`>`, `>=`, `<`, `<=`, and `=`.

You can link multiple specifications with `AND`s or `OR`s. You cannot submit a where clause with both an `AND` and an `OR`.

```flureeql
{
  "select": ["chat/message", "chat/instant"],
  "where": "chat/instant > 1517437000000 AND chat/instant < 1517438000000"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["chat/message", "chat/instant"],
  "where": "chat/instant > 1517437000000 AND chat/instant < 1517438000000"
}'\
   [HOST]/api/db/query
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

### Select, As Of Block

We can issue any query as of any point in time by specifying a block number or a ISO-8601 formatted wall-clock time or duration. 

Using a block number: 

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "block": 2
}
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "block": 2}' \
   [HOST]/api/db/query
```
```graphql
{ graph (block: 2) {
  chat {
    _id
    instant
    message
  }
}
}
```
```sparql
 SELECT ?chat ?message ?person ?instant
 WHERE {
    ?chat   fd2:chat/message  ?message;
            fd2:chat/person   ?person;
            fd2:chat/instant  ?instant.
 }
 ```

 Using an ISO-8601 formatted wall clock time: 

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
   -d '{
  "select": ["*"],
  "from": "chat",
  "block": "2017-11-14T20:59:36.097Z"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph (block: "2018-03-08T09:57:13.861Z") {
  chat {
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

Using an ISO-8601 formatted duration (as of 5 minutes ago): 

 ```flureeql
{
  "select": ["*"],
  "from": "chat",
  "block": "PT5M"
}
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": "chat",
  "block": "PT5M"
}' \
   [HOST]/api/db/query
```

```graphql
{ graph (block: "PT5M") {
  chat {
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

### Select With Limit and Offset

To limit the number of responses, add a limit clause with a positive integer. 

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}
```
```curl
curl\
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": "chat",
   "limit": 100
}'\
   [HOST]/api/db/query
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
 SELECT ?chat ?message ?person ?instant ?comments
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/comments ?comments;
            fd:chat/instant  ?instant.
 }
 LIMIT 100
```

To skip a number of results at the beginning of a resultset, add an offset clause with a positive integer. 

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "offset": 100
}
```
```curl
curl\
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": "chat",
   "offset": 100
}'\
   [HOST]/api/db/query
```
```graphql
{ graph {
  chat(offset:100) {
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
 SELECT ?chat ?message ?person ?instant ?comments
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/comments ?comments;
            fd:chat/instant  ?instant.
 }
 OFFSET 100
```

Offset can be used in conjunction with limit. 


```flureeql
{
  "select": ["*"],
  "from": "chat",
  "limit": 10,
  "offset": 100
}
```
```curl
curl\
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": "chat",
   "offset": 100,
   "limit": 10
}'\
   [HOST]/api/db/query
```
```graphql
{ graph {
  chat(offset:100, limit: 10) {
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
 SELECT ?chat ?message ?person ?instant ?comments
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/comments ?comments;
            fd:chat/instant  ?instant.
 }
 LIMIT 10
 OFFSET 100
```
