### Fluree Queries

Fluree allows you to specify queries using the FlureeQL JSON syntax or with GraphQL. The FlureeQL format, being a JSON data structure, allows for queries to be easily composed within your programming code and is built to support Fluree's advanced capabilities like graph recursion. GraphQL supports a more limited set of query capability, but is robust enough for many applications. If you don't already know and want to use GraphQL, we definitely recommend using FlureeQL.

Fluree has permissions embedded within the database itself, which has the effect that every database for every user is potentially customized and contains only data they can view. This capability allows more direct access to the database for front-end UIs or other applications, and means less time spent creating custom API endpoints that simply modify select statements based on who the user is. In addition, multiple apps can share the same database with security consistency.

The graph selection capability of Fluree allows query results to be returned as a nested graph instead of 'flat' result sets. This aligns with how data is actually used in applications and makes it simpler to pass data around to various UI components, etc. This also means the role of a client database library is substantially reduced, and for many applications may be unnecessary.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request which reduces round-trips for end-user applications. Both also support *time travel* queries, allowing you to issue any query at any point in history. Any place you might have written code or created extra tables to store a historical log of changes becomes unnecessary when using Fluree. It also gives your apps the ability to 'rewind' to any point in time.

FlureeQL has two main approaches to creating queries that share much of the same syntax, we call these *Graph Queries* and *Analytical Queries*. Graph Queries closely resembles SQL but allows your results to 'crawl the graph' and return nested data sets. This approach is very simple and works well for most application-based queries. Analytical Queries enables concepts of logic programming embedded directly into the query. This allows very powerful query constructs and exposes analytical features like aggregates, and more. It is also simple, but the approach may not be familiar to those with SQL-only exposure. It is worth learning, and won't take long to get used to.


#### A simple FlureeQL Graph Query

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
#### FlureeQL Graph Query attribute selection and a `where` that does a range scan

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
#### FlureeQL Graph Query with time travel using a block number

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
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
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
#### FlureeQL Graph Query  with time travel using wall clock time

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
{ graph (time: "2018-03-08T09:57:13.861Z") {
  chat {
    _id
    instant
    message
  }
}
}
```
### FlureeQL Graph Queries

FlureeQL Graph Queries are structured as a JSON object/map and may contain the following keys:

Key | Required? | Description
-- | -- | -- 
`select` | yes |  [Select syntax](#select-syntax)
`from` | yes | [From syntax](#from-syntax)
`limit` | no | Optional limit (integer) of results to include.
`block` | no | Optional time-travel query specified by block number or wall-clock time as a ISO-8601 formatted string.

#### A simple FlureeQL Graph Query that returns all direct attributes for last 100 chat messages

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
   -d '{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}' \
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

#### Abbreviated response

```flureeql

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
  ],
  "fuel": 3,
  "time": "1.75ms",
  "fuel-remaining": 999999987903
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
  "fuel": 3,
  "block": 12,
  "time": "1.75ms",
  "fuel-remaining": 999999987903
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

The syntax isn't just a way to specify the data you'd like returned, but inherently represents **how** the data looks as it is returned. This can often remove complicated data transformation steps needed to deal with returned database data, and even negates the need for a fairly substantial role of client-side database drivers.


#### FlureeQL Graph Query with specific attribute selection

```flureeql
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
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
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

```flureeql 
{
  "block": 12,
  "status": 200,
  "time": "0.57ms",
  "result": [
    {
      "chat/message": "A sample chat message"
    },
    {"..."}
  ],
  "fuel": 3,
  "time": "0.80ms",
  "fuel-remaining": 999999987900
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
   "fuel": 3,
   "time": "0.80ms",
   "fuel-remaining": 999999987900
}
```

### Crawling the Graph with select

Entities refer (join) to other entities via any attribute that is of type `ref`. Every `ref` attribute relationship can be traversed, and can be done so in both directions -- forward and reverse.

For a forward traversal example, note our attribute `chat/person` which is of type `ref` and refers to a person entity. In the previous section we selected all attributes for all chat messages (`{"select": ["*"], "from": "chat"}`) and the response contained a reference to the person, but did not automatically include the person details. The value for `chat/person` looked like this: `"chat/person": {"_id": 4294967296001}`. We know it refers to some person with an `_id` of `4294967296001` but nothing else.

In order to also include the person details, we add to our select cause with a sub-query within our original query. This new query would look like: `{"select": ["*", {"chat/person": ["*"]}], "from": "chat"}`. This syntax is declarative and looks like the shape of the data you want returned. These sub-queries can continue to whatever depth of the graph you'd like, and for as many `ref` attributes as you like. Circular graph references are fine and are embraced.

As mentioned, these relationships can also be traversed in reverse. If instead of listing the person for every chat, what if we wanted to find all chats for a  person? Instead of selecting from `chat`, lets select from `person` and follow the same `chat/person` attribute but in the reverse direction. This query looks like: `{"select": ["*", {"chat/_person": ["*"]}], "from": "person"}`. Note the underscore `_` that was added to `chat/person`, making it instead `chat/_person`. This special syntax indicates the same relationship, but in reverse. You'll now see all people, with all their chat messages.

For fun, you can add another sub-query to follow the chat message back to the person. Even though in this case it is redundant, and circular, Fluree exists happily in this paradox: `{"select": ["*", {"chat/_person": ["*", {"chat/person": ["*"]}]}], "from": "person"}`. Keep it going if you'd like.

#### Query for all chat messages, following reference to user that posted message.

```flureeql
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
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
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

```flureeql
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
  ],
  "fuel": 5,
  "fuel-remaining": 999999987883
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
  "fuel": 9,
  "time": "6.62ms",
  "fuel-remaining": 999999987890
}
```

#### Person query, but follow chat relationship in reverse to find all their chats (note the underscore `_` or `_Via_`)

```flureeql
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
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
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

### Using Recursion with select

We can also use recursion to follow `ref` attributes that reference another entity in the same collection. For example, we can add an attribute, `person/follows`, which is a `ref` attribute that is restricted to the `person` collection. 

```all
[{
  "_id": "_attribute",
  "name": "person/follows",
  "type": "ref",
  "restrictCollection": "person"
}]
```

```all
[{
    "_id": ["person/fullName", "Zach Smith"],
    "follows": ["person/fullName", "Jane Doe"]
},
{
    "_id": ["person/fullName", "Jane Doe"],
    "follows": ["person/fullName", "Zach Smith"]
}]
```


Normally, if we want to query who a person follows, we would submit this query. 

```all
{
    "select":["*", {"person/follows": ["*"]}],
    "from":"person"
}
```

However, if you want to keep following the `person/follows` relationship, we can include the `{"_recur": some-integer}` option inside of the expanded `person/follows`
map. The value we specify for the `_recur` key is the number of times to follow the given relationship. 

```all
{
    "select":["*", {"person/follows": ["*", {"_recur": 10}]}],
    "from":"person"
}
```

The results will only return recursions for as long as their new information in a given recursion. For example, the result of the above query only returns a recursion that is two entities deep. This is because after we follow the `person/follows` relationship twice (in this given example), it will start returning the same information.


```all
{
  "status": 200,
  "result": [
    {
      "person/handle": "zsmith",
      "person/fullName": "Zach Smith",
      "person/follows": {
        "person/handle": "jdoe",
        "person/fullName": "Jane Doe",
        "person/follows": {
          "person/handle": "zsmith",
          "person/fullName": "Zach Smith",
          "person/follows": {
            "_id": 4294967296001
          },
          "_id": 4294967296002
        },
        "_id": 4294967296001
      },
      "_id": 4294967296002
    },
    {
      "person/handle": "jdoe",
      "person/fullName": "Jane Doe",
      "person/follows": {
        "person/handle": "zsmith",
        "person/fullName": "Zach Smith",
        "person/follows": {
          "person/handle": "jdoe",
          "person/fullName": "Jane Doe",
          "person/follows": {
            "_id": 4294967296002
          },
          "_id": 4294967296001
        },
        "_id": 4294967296002
      },
      "_id": 4294967296001
    }
  ],
  "fuel": 18,
  "fuel-remaining": 999999987865,
  "block": 8,
  "time": "4.54ms"
}

```

### "from" syntax


Fluree allows you select from:

1. A collection name:

```all
{
  "select": ["*"],
  "from": "movie"
}

```

2. An Entity - Either an _id or any attribute marked as unique as a two-tuple. 

For example, to select a specific person, we could use either "from": 4294967296001 or a unique attribute like "from": ["person/handle", "jdoe"]. Both results will be identical. The results are a map/object in this case, and not a collection.

```all
{
  "select": ["*"],
  "from":  4294967296001
}

```

```all
{
  "select": ["*"],
  "from":  ["person/handle", "jdoe"]
}

```

3. A Sequence of Entity Identities

Query results will be returned in the same order as we specify them. For example, we could do a query like:

```all
{
  "select": ["*"],
  "from":  [4294967296001, ["person/handle", "jdoe"], 4299262263302,  ["person/handle", "zsmith"] ]
}

```

4. Attribute Name

Selecting from an attribute name will return all entities that contain that attribute. For example, the below transaction will return any entities that contain a `person/fullName` attribute.


```all
{
  "select": ["*"],
  "from": "person/fullName"
}

```

In all cases, the `select` syntax and its rules are identical.

We give you the ability to break out of collection-only or entity-only queries using Fluree's Analytical Query format which we'll cover next.

### FlureeQL Analytical Queries

FlureeQL Analytical Queries are used to answer more sophisticated questions about your data. They can be used to calculate aggregates, have complicated joining rules and even incorporate custom logic. We utilized concepts of logic programming and variable binding to give an immense amount of query potential that can largely be designed by you.

We are gradually making this capability available to users and will be expanding the available documentation shortly.

Fluree Analytical Queries are also structured as a JSON object/map and may contain the following keys:

Key | Required? | Description
-- | -- | -- 
`select` | yes | Analytical select statement, which can include aggregate functions, bound variables and descriptors for data return shape (single result, collection, tuple).
`selectOne` | yes | Same as `select` statement, but returns only a single result.
`where` | yes | A collection of tuples which contain matching logic, variable binding or functions.
`block` | no | Optional time-travel query specified by block number or wall-clock time as a ISO-8601 formatted string.
`limit` | no | Optional limit (integer) of results to include.

We suggest reading the [Where Clause](#where-clause) section before reading the [Select or Select One Clauses](#select-or-select-one-clauses) section. 

### Where Clause
Where clauses in analytical queries are structured as three-tuples, where the first value is an entity (optional), the second value is an attribute, and the third value is a variable binding. The where clause allow us to specify which flakes will be part of the analytical query. 

Before looking at examples of where clauses, it will be best to add a new attribute, `person/favNums` in order to better illustrate some of the use cases for analytical queries. 

The below transaction creates a multi, integer attribute to hold a person's favorite numbers.

```all
[{
    "_id": "_attribute",
    "name": "person/favNums",
    "type": "int",
    "multi": true
}]
```

We can then add favorite numbers to some of the people in our database. 

```all
[{
    "_id": ["person/handle","jdoe"],
    "favNums": [1223, 12, 98, 0, -2]
},
{
    "_id": ["person/handle","zsmith"],
    "favNums": [5, 645, 28, -1]
}]
```

Now, if we want to specify all of `zsmith`'s flakes, which contain the values of his favorite numbers, our where clause could be:

```all
"where": [ [["person/handle", "zsmith"], "person/favNums", "?nums"] ]
```

Our where clause only contains one tuple, `[["person/handle", "zsmith"], "person/favNums", "?nums"]` within the main tuple (we'll see examples of multiple tuples later). There are three values in this tuple: 

1. `["person/handle", "zsmith"]`
As mentioned earlier, the first value in where-clause tuple represents the entity. Our entity is a two-tuple, `["person/handle", "zsmith"]`, but we can alternatively use a Zach Smith's `_id` or any two-tuple, which specifies a unique attribute and that attribute value. 

2. `"person/favNums"`
The second value in a where-clause tuple is the attribute. In this case, the specified attribute is a `multi` attribute of type `int`. We can specify any type and cardinality of attribute.

3. `"?nums"`
The third value is for variable findings. In this case, we are binding any of the flake values specified by entity, `["person/handle", "zsmith"]` and attribute `person/favNums` to the variable `"?nums"`. Variables have to begin with a `?`. These variables can be used in the `select` or `selectOne` statements. 


Alternatively, if we want to specify every flake that contains favorite numbers, we can leave the first value empty. 

```all
"where": [ [null, "person/favNums", "?nums"] ]
```

If we want to specify several people's favorite numbers, we can list multiple where-clause tuples, as seen below.

```all
"where": [ [["person/handle", "zsmith"], "person/favNums", "?nums1"], [["person/handle", "jdoe"], "person/favNums", "?nums2"] ]
```

### Select or Select One Clauses

After binding variables in your where clauses, you can use those variables in conjunction with the following aggregate functions in your select or selectOne clauses. 

Function | Description
-- | --
`avg` | Returns the average of the values. 
`count` | Returns a count of the values.  
`count-distinct` | Returns a count of the distinct values.  
`distinct` | Returns all of the distinct values. 
`max` | Returns the largest value. 
`median` | Returns the median of the values. 
`min` | Returns the smallest value. 
`rand` | Returns a random value from the specified values. 
`sample` | Given a sample size and a set of values, returns an appropriately sized sample, i.e. `(sample 2 ?age)` returns two ages from values bound to the variable, `?age`.
`stddev` | Returns the standard deviation of the values. 
`sum` | Returns the sum of the values. 
`variance` | Returns the variance of the values. 


For example, in order to see the average of all of Zach Smith's favorite numbers, we could query:

```all
{
  "selectOne": "(sum ?nums)",
  "where": [ [["person/handle", "zsmith"], "person/favNums", "?nums1"]] 
}
```

If we want to see a sample of size, 10, from all the favorite numbers in the database, we could issue the query: 
```all
{
  "selectOne": "(sample 10 ?nums)",
  "where": [ [null, "person/favNums", "?nums"]] 
}
```

While, it is possible to bind multiple variables in the where clause, i.e. `[ [["person/handle", "zsmith"], "person/favNums", "?nums1"], [["person/handle", "jdoe"], "person/favNums", "?nums2"] ]`, it is not currently possible to use multiple variables in a select clause. We are expanding this feature and will expand the documentation accordingly. 

### Fluree Block Queries
Fluree allows you to select data from an entire block or block range. 

To query a single block, you simply need to provide the block number. 
```{"block": 3}```

To query a range of blocks, provide the first and last blocks you want to include. 
```{"block": [3, 5]}```

To query all of the blocks after a certain block number, provide the lower limit.
```{"block": [3]}```

#### Query a single block
```flureeql
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
  block(from: 3, to: 5)
}
```
#### Query a range of blocks
```flureeql
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
 https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
query  {
  block(from: 3, to: 5)
}
```
#### Query a range of blocks starting from a lower limit
```flureeql
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
 https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
query  {
  block(from: 3)
}
```

### Multiple Queries

Fluree allows you to submit multiple queries at once. In order to do this, create unique names for your queries, and set those as the keys of the your JSON query. The values of the keys should be the queries themselves. If you are using GraphQL, you can simply nest your second, third, etc requests within the `graph` level of the request.

For example, this query selects all chats and people at once. 

```all
{
    "chatQuery": {
        "select": ["*"],
        "from": "chat"
    },
    "personQuery": {
         "select": ["*"],
        "from": "person"
    }
}
```

A sample response will look like the following, with each query's responses nested within the "result" value, with the provided query names as keys. 

```all
{
  "result": {
    "chatQuery": [
      { 
        "_id": 4307852197898,
        "chat/instant": 1532617367174
      },
       ...
    ],
    "personQuery": [
      {
        "_id": 4303557230594,
        "person/handle": "zsmith",
        "person/fullName": "Zach Smith",
        "person/karma": 5
      },
      ...
    ]
  },
  "status": 200,
  "fuel": 7,
  "block": 5,
  "time": "5.31ms",
  "fuel-remaining": 999999987876
}
```

Any errors will be returned in a separate key, called errors. For example, incorrectQuery is attempting to query an id that does not exist. 

```all
{
    "incorrectID": {
        "select": ["*"],
        "from": 4307852198904
    },
    "personQuery": {
         "select": ["*"],
        "from": "person"
    }
}
```

Therefore, the response will look like the following with the error type for incorrectID listed under the key errors.

```all
{
  "errors": {
    "incorrectID": "db/invalid-entity"
  },
  "result": {
    "person": [
      {
        "_id": 4303557230594,
        "person/handle": "zsmith",
        "person/fullName": "Zach Smith",
        "person/karma": 5
      },
      ...
    ]
  },
  "status": 207,
  "block": 463,
  "time": "5.64ms"
}
```

#### Submit Multiple Queries at Once

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"chatQuery": {"select": ["*"],"from": "chat"},"personQuery": {"select": ["*"],"from": "person"}}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```flureeql
{
    "chatQuery": {
        "select": ["*"],
        "from": "chat"
    },
    "personQuery": {
         "select": ["*"],
        "from": "person"
    }
}
```

```graphql
{ graph {
  chat {
    _id
    comments
    person
    instant
    message
  }  
  person {
    _id
    handle
    fullName
  }
}
}
```

