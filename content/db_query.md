
# Query

## Fluree Queries

Fluree allows you to specify queries using the FlureeQL JSON syntax or with GraphQL. The FlureeQL format, being a JSON data structure, allows for queries to be easily composed within your programming code and is built to support Fluree's advanced capabilities like graph recursion. GraphQL supports a more limited set of query capability, but is robust enough for many applications. If you don't already know and want to use GraphQL, we definitely recommend using FlureeQL.

Fluree has permissions embedded within the database itself, which has the effect that every database for every user is potentially customized and contains only data they can view. This capability allows more direct access to the database for front-end UIs or other applications, and means less time spent creating custom API endpoints that simply modify select statements based on who the user is. In addition, multiple apps can share the same database with security consistency.

The graph selection capability of FlureeDB allows query results to be returned as a nested graph instead of 'flat' result sets. This aligns with how data is actually used in applications and makes it simpler to pass data around to various UI components, etc. This also means the role of a client database library is substantially reduced, and for many applications may be unnecessary.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request which reduces round-trips for end-user applications. Both also support *time travel* queries, allowing you to issue any query at any point in history. Any place you might have written code or created extra tables to store a historical log of changes becomes unnecessary when using FlureeDB. It also gives your apps the ability to 'rewind' to any point in time.

FlureeQL has two main approaches to creating queries that share much of the same syntax, we call these *Graph Queries* and *Analytical Queries*. Graph Queries closely resembles SQL but allows your results to 'crawl the graph' and return nested data sets. This approach is very simple and works well for most application-based queries. Analytical Queries enables concepts of logic programming embedded directly into the query. This allows very powerful query constructs and exposes analytical features like aggregates, and more. It is also simple, but the approach may not be familiar to those with SQL-only exposure. It is worth learning, and won't take long to get used to.


#### A simple FlureeQL Graph Query

```json
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
#### FlureeQL Graph Query attribute selection and a `where` that does a range scan

```json
{
  "select": ["chat/message", "chat/instant"],
  "from": "chat",
  "where": "chat/instant > 1517437000000 AND chat/instant < 1517438000000"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["chat/message", "chat/instant"],
  "from": "chat",
  "where": "chat/instant > 1517437000000 AND chat/instant < 1517438000000"
}'\
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
#### FlureeQL Graph Query with time travel using a block number

```json
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```
```graphql
<!-- Not supported -->
```
#### FlureeQL Graph Query  with time travel using wall clock time

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
   -d '{
  "select": ["*"],
  "from": "chat",
  "block": "2017-11-14T20:59:36.097Z"
}' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
<!-- Not supported -->
```
## FlureeQL Graph Queries

FlureeQL Graph Queries are structured as a JSON object/map and may contain the following keys:

Key | Required? | Description
-- | -- | -- 
`select` | yes |  Select syntax.
`from` | yes | Either a stream name or an individual identity via its `_id` number or identity (unique attribute) name + value.
`where` |  | Optional where clause specified a SQL-like string.
`limit` |  | Optional limit (integer) of results to include.
`block` |  | Optional time-travel query specified by block number (integer) or wall-clock time as a ISO-8601 formatted string.


#### A simple FlureeQL Graph Query that returns all direct attributes for last 100 chat messages

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
   -d '{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}' \
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

#### Abbreviated response

```json

{
  "block": 12,
  "status": 200,
  "time": "0.93ms",
  "result": [
    {
      "_id": 4299262263302,
      "chat/message": "A sample chat message",
      "chat/person": {
        "_id": 4294967296001
      }
    },
    {"..."}
  ]
}
```

```graphql 
{
  "data": {
    "graph": {
      "chat": 
        [{
          "_id": 4299262263298,
          "comments": [],
          "instant": 1520348922345,
          "message": "This is a sample chat from Jane!",
          "person": {...}
        },
        {...}]
    }
  },
  "status": 200,
  "time": "3.86ms"
}
```


### "select" syntax

Select statements are placed in the `select` key of a FlureeQL statement take the format of either a graph selection syntax or one of variable binding for analytical queries. The graph selection syntax is the focus here, and is a declarative and powerful way of selecting hierarchical information.

The graph selection syntax is a vector / array of selection attributes. They can include:

1. A simple list of attribute names, i.e.: `select: ["person/name", "person/email"]`
2. A wildcard "select all", i.e.:  `select: ["*"]`
3. A hierarchical selection statement that navigates forward (or backwards) into a relationship, i.e.: `select: [{person/address: ["address/street", "address/city"]}]`. 
4. Any combination of the above, at any level of nested graph

Additional options can also allow recursion to specified depths (or infinite recursion).

The syntax isn't just a way to specify the data you'd like returned, but inheretly represents **how** the data looks as it is returned. This can often remove complicated data transformation steps needed to deal with returned database data, and even negates the need for a fairly substantial role of client-side database drivers.


#### FlureeQL Graph Query with specific attribute selection

```json
{
  "select": ["chat/message"],
  "from": "chat"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["chat/message"],
  "from": "chat"
}' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
{ graph {
  chat {
    message
  }
}
}
```

#### Abbreviated response

```json 
{
  "block": 12,
  "status": 200,
  "time": "0.57ms",
  "result": [
    {
      "chat/message": "A sample chat message"
    },
    {"..."}
  ]
}
```

```graphql 
{
  "data": {
    "graph": {
      "chat": [{ "message": "This is a sample chat from Jane!"}]
    }
  },
  "status": 200,
  "time": "3.86ms"
}
```

### Crawling the Graph with select

Entities refer (join) to other entities via any attribute that is of type `ref`. Every `ref` attribute relationship can be traversed, and can be done so in both directions -- forward and reverse.

For a forward traversal example, note our attribute `chat/person` which is of type `ref` and refers to a person entity. In the previous section we selected all attributes for all chat messages (`{"select": ["*"], "from": "chat"}`) and the response contained a reference to the person, but did not automatically include the person details. The value for `chat/person` looked like this: `"chat/person": {"_id": 4294967296001}`. We know it refers to some person with an `_id` of `4294967296001` but nothing else.

In order to also include the person details, we add to our select cause with a sub-query within our original query. This new query would look like: `{"select": ["*", {"chat/person": ["*"]}], "from": "chat"}`. This syntax is declarative and looks like the shape of the data you want returned. These sub-queries can continue to whatever depth of the graph you'd like, and for as many `ref` attributes as you like. Circular graph references are fine and are embraced.

As mentioned, these relationships can also be traversed in reverse. If instead of listing the person for every chat, what if we wanted to find all chats for a  person? Instead of selecting from `chat`, lets select from `person` and follow the same `chat/person` attribute but in the reverse direction. This query looks like: `{"select": ["*", {"chat/_person": ["*"]}], "from": "person"}`. Note the underscore `_` that was added to `chat/person`, making it instead `chat/_person`. This special syntax indicates the same relationship, but in reverse. You'll now see all people, with all their chat messages.

For fun, you can add another sub-query to follow the chat message back to the person. Even though in this case it is redundant, and circular, FlureeDB exists happily in this paradox: `{"select": ["*", {"chat/_person": ["*", {"chat/person": ["*"]}]}], "from": "person"}`. Keep it going if you'd like.

#### Query for all chat messages, following reference to user that posted message.

```json
{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
{ graph {
  chat {
    _id
    instant
    message
    person {
      _id
      fullName
      handle
    } 
  }
}
}
```

#### Abbreviated response

```json
{
  "block": 12,
  "status": 200,
  "time": "1.86ms",
  "result": [
    {
      "_id": 4299262263302,
      "chat/message": "A sample chat message",
      "chat/person": {
        "_id": 4294967296001,
        "person/handle": "jdoe",
        "person/fullName": "Jane Doe"
      }
    },
    {"..."}
  ]
}
```

```graphql 
{
  "data": {
    "graph": {
      "chat": [
        {
          "_id": 4299262263298,
          "instant": 1520348922345,
          "message": "This is a sample chat from Jane!",
          "person": {...}
        },
        {...}
      ]
    }
  },
  "status": 200,
  "time": "32.11ms"
}
```

#### Person query, but follow chat relationship in reverse to find all their chats (note the underscore `_` or `_Via_`)

```json
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```
```graphql
{ graph {
  person {
    chat_Via_person {
      _id
      instant
      message
    }
  }
}
}
```
### "from" syntax

FlureeDB allows you to select a collection from an entire stream, much like our examples thus far, or you can also specify a single entity.

An single entity can be selected using any valid identity, which includes the unique `_id` long integer if you know it, or any `unique` attribute's name and value.

To select all chats as we previously have done, we used `"from": "chat"`. To select all people we used `"from": "person"`. The returned results is a collection (vector/array), and you simply need to utilize the stream.

To select a specific person, we could use either `"from": 4294967296001` or a unique attribute like `"from": ["person/handle", "jdoe"]`. Both results will be identical. The results are a map/object in this case, and not a collection.

In both cases, the `select` syntax and its rules are identical.

We give you the ability to break out of stream-only or entity-only queries using Fluree's Analytical Query format which we'll cover next.



## FlureeQL Analytical Queries

FlureeQL Analytical Queries are used to answer more sophisticated questions about your data. They can be used to calculate aggregates, have complicated joining rules and even incorporate custom logic. We utilized concepts of logic programming and variable binding to give an immense amount of query potential that can largely be designed by you.

We are gradually making this capability available to beta users and will be expanding the available documentation shortly.

Fluree Analytical Queries are also structured as a JSON object/map and may contain the following keys:

Key | Required? | Description
-- | -- | -- 
`select` | yes | Analytical select statement, which can include aggregate functions, bound variables and descriptors for data return shape (single result, collection, tuple).
`where` | yes | A collection of tuples which contain matching logic, variable binding or functions.
`block` |  | Optional time-travel query specified by block number (integer) or wall-clock time as a ISO-8601 formatted string.

## Fluree Block Queries
FlureeDB allows you to select data from an entire block or block range. 

To query a single block, you simply need to provide the block number. 
```{"block": 3}```

To query a range of blocks, provide the first and last blocks you want to include. 
```{"block": [3, 5]}```

To query all of the blocks over a certain block number, provide the lower limit 
```{"block": [3]}```

#### Query a single block
```json
{
  "block": 3
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": 3
}' \
```
```graphql
query  {
  block(from: 3, to: 3)
}
```
#### Query a range of blocks
```json
{
  "block": [3,5]
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": [3, 5]
}' \
 https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```
```graphql
query  {
  block(from: 3, to: 5)
}
```
#### Query a range of blocks starting from a lower limit
```json
{
  "block": [3]
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": [3]
}' \
 https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```
```graphql
query  {
  block(from: 3)
}
```