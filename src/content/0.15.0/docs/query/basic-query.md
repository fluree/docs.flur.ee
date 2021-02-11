## Basic Query

In this section, we show you how to perform basic queries using FlureeQL. All code examples are shown in FlureeQL. All of these queries can be issued through the API or the user interface (select `FlureeQL` in the `Query` dropdown in the sidebar). 

To issue these queries using the API, see `/query` in [Fluree Anywhere](/api/downloaded-endpoints/downloaded-examples#-query) or [Fluree On-Demand](/api/hosted-endpoints) (you will need to change the version). You can also issue multiple queries at once using the `/multi-query` endpoints in [Fluree Anywhere](/api/downloaded-endpoints/downloaded-examples#-multi-query) or [Fluree On-Demand](/api/hosted-endpoints) (you will need to change the version).

### Query Keys

Below are all the possible keys that you can include in a basic select query. Usage examples are in subsequent sections on this page.

Key | Required? | Value | Notes
-- | -- | -- | -- 
`select`, `selectOne`, `selectDistinct` | yes |  An array of predicates or a `*`. | `selectOne` is the same as `select`, except it just returns a single value. `select` results are distinct by default, so `select` and `selectDistinct` are equivalent. See [select key](#select-key).
`from` | no | A collection, predicate name, subject id, unique two-tuple, or array of subject ids and two-tuples. | `from` or `where` are required.  See [from key](#from-key)
`where` | no | A series of where expressions connected by AND or OR | Where allows for simple result filters. `from` or `where` must be required.  Can be used with our without `from`. See [where key](#where-key).
`block` | no | Optional time-travel query specified by block number, duration, or wall-clock time as an ISO-8601 formatted string. | See [block key](#block-key)
`opts` | no | Optional map of options. | See [opts key](#opts-key)

### Select Key

A basic query must include one of the following select keys: `select`, `selectOne`, or `selectDistinct`. 

`select` returns all query results. `select` results are distinct by default, so `select` and `selectDistinct` are equivalent.

`selectOne` is the same as `select`, except it just returns a single value. 

The value of the select key is always an array. For the purposes of this section, we will call it a `select-array`. The select-array can include any combination of the following items in any order:

- An `*`:
- Predicate Names: Namespaced or Not
- A map, crawling the graph. 
- Reversely-referenced Predicates
- A map with sub-select options


1. An `*`:

An `*` indicates "select all predicates" using the default options. An `*` may be used in conjunction with other select-array items, especially when the user wants to specify particular options. There are examples of this latter in the list.  

```flureeql
{
  "select": ["*"],
  "from": "chat"
}
```
```sparql
Not supported
```

2. Predicate Names: Namespaced or Not

If a predicate is name-spaced, that means that the collection name is included in the predicate name, like `chat/message`. The way that the predicate is specified in the select-array is how it will be returned in the results. 

Predicates do not have to be namespaced. The collection can often (but not always be inferred). For example, if selecting from the `chat` collection or a specific chat subject, `instant` is inferred to be `chat/instant`. However, with Fluree's flexible schema a predicate in any collection can be attached to any subject. 

```flureeql
{
    "select": ["chat/message", "instant", "*", ],
    "from": "chat"
}
```

```sparql
Not supported
```

3. A map, crawling the graph. 

If selecting predicates that are references, then you can crawl the graph. For example in our basic schema, the `chat/person` predicate is a reference to a person for a particular chat. 

You'll notice that when you just include `chat/person` in the select-array, your results will only show you the subject id (unique identifer) for the person.

```flureeql
{
    "_id": 369435906932739,
    "chat/message": "Hi! I'm a chat from Zach.",
    "person": {
      "_id": 351843720888322      // subject id only is returned
    },
    "chat/instant": 1589570211400
  },
```

```sparql
Not supported
```

However, you may want to see the details for that person. To do so, you can include a map in your select array where the key is the predicate you want to crawl and the value is a select array itself. The syntax for this select-array is identical to the syntax for a top-level select-array. 

In addition, it does not matter whether the predicate you are crawling references one or many subjects - the syntax is identical (i.e. per our schema, a chat can only have one person `chat/person`, but a person can have multiple favorite movies `person/favMovies`. ).

```flureeql
{
    "select": [    {"person": [ "*", "favMovies", "favNums"] }   ],
    "from": "chat"
}
```

```sparql
Not supported
```


There is no limit to how many times we crawl the graph. For example, below we are crawling the graph to get the person associated with all the chats, as well as each person's favorite movies and favorite artists. We are also crawling the graph to get all the information about those favorite artists and favorite movies. This may look confusing at first, but a select-array is simply made up of any combination of the listed items with an unlimited amount of nesting. 

```flureeql
{
    "select": ["*", {"person": ["*", {"favMovies": ["*"] } , {"favArtists": ["*"] } ]}],
    "from": "chat"
}
```
```sparql
Not supported
```

You can crawl the graph with reversely-referenced predicates as well (see below).

4. Reversely-referenced Predicates

In our basic schema, we know that a chat can reference a person. A person can be referenced in multiple chats. By default, when we return a given subject, we don't return all the subjects that reference it- this could potentially pull the entire ledger! In order to pull reverse references, we have to explicitly list those references. 

In the basic schema, a chat references a person via the `chat/person` predicate. We know that the following query works to select all `chat/person`s from the chat collection:

```flureeql
{
  "select": ["chat/person"],
  "from": "chat"
}
```

```sparql
Not supported
```

In order to get all chats that reference `person`s, we simply add an `_` after the `/`. So `chat/person` becomes `chat/_person`. 

```flureeql
{
  "select": ["chat/_person"],
  "from": "person"
}
```

```sparql
Not supported
```

Any predicate that is a reference (it is of type `ref`) can be reversely referenced. For example:
-  `person/favMovies` -> `person/_favMovies`
- `_user/auth` -> `_user/_auth`
- `chat/comments` -> `chat/_comments`


Reverse references can simply return the subject id (as in the query above) or you can crawl the graph with those preferences. Crawling the graph with a reverse reference has the same syntax and behaves the same way as crawling the graph with a regular reference. 

```flureeql
{
  "select": [{"chat/_person": ["*"]}],
  "from": "person"
}
```

```sparql
Not supported
```

5. A map with sub-select options

You can specify granular options that only apply to certain predicates. To do so, you need to create a map where the key is the predicate name and the value is an array with the sub-select option map inside. For example: `{"fullName": [{"_as": "name"}]}`. The sub-select option `as` renames `fullName` to `name` in the results. The full list of sub-select options is in the table below. 

```flureeql
{
    "select": ["handle", {"fullName": [{"_as": "name"}]}], 
    "from": "person"
}
```
```sparql
Not supported
```


A map can BOTH crawl the graph and have sub-select options. For example, `{"comment/_person": ["*", {"_as": "comment", "_limit": 1}]}`


```flureeql
{
    "select": ["handle", {"comment/_person": ["*", {"_as": "comment", "_limit": 1}]}], 
    "from": "person"
}
```

```sparql
Not supported
```

Below is another example using `_recur`. 

```flureeql
{
    "select":["handle", {"person/follows": ["handle", {"_recur": 10}]}],
    "from":"person"
}
```

```sparql
Not supported
```

Certain sub-select options, such as `_recur` are only relevant for refs. While other options, such as `_limit` are only relevant for `multi` predicates.

Key | Description 
-- | -- 
`_limit` | Limit (integer) of results to include. For `multi` predicates. By default, returns 100.  
`_offset` | Offset (integer) number results to include. For `multi` predicates. By default, offset is 0.
`_recur` | Number of times (integer) to follow a relationship. This only works for predicates where the subject referenced is in the same collection as the original subject (i.e. for `person/follows` in our basic schema, this predicate is attached to the `person` collection and must reference another `person`).
`_component` | Whether to automatically crawl the graph for component entities. Overrides the top-level option. For `ref` predicates.
`_as` | An alternate name for the predicate that is being referenced.
`_orderBy` | Specify either a predicate (make sure to use the same name as returned in the results), or a two-tuple, where the first item is either `ASC` or `DESC` and the second item is the predicate name, i.e. `["ASC", "person/handle"]`.  Ordering is done before taking the number of results specified in limit. 
`_compact` | Returns all predicate names in their compact (non-namespaced format). For example, rather than return `person/handle`, would just return `handle`. 

### From Key

Either a `from` key or a `where` key are required in a basic query. Your select options are applied to the field of subjects described by the `from`. A `from` key can be any of the following:

Value Type | Example | Explanation 
-- | -- | --
collection name | `"person"` | Select options will be applied to any subject of the type listed. 
a predicate name | `"person/chat"` | Predicate must be name-spaced. Select options will be applied to any subject, which has the given predicate specified. 
a subject id | `87960930223082` | Applies select options to the given subject
a unique two-tuple | `["person/handle", "jdoe"]` | Applies select options to the given subject, which is identified by a two-tuple where the first item is any predicate marked as `unique` and the second item is the value. 
an array of subject ids and unique two-tuples | `[87960930223082, ["person/handle", "jdoe"]]` | Applies select options to the given subjects. Returns the results as an array

Any select-array can be combined with any type of `from` key. 

```flureeql
{
  "select": ["*", {"chat/_person": ["*", {"_as": "chperson"}]}],
  "from": [87960930223082, ["person/handle", "jdoe"]]
}
```

```sparql
Not supported
```

### Where Key

A where clause filters a given ledger so that select-options are only applied to the field of subjects that meet the filter criteria. Where clauses are a simple way to apply very basic filters to a query. For more complex queries and filters, we recommend using [Analytical Queries](/docs/query/analytical-query).

Where clause statements are simple expressions like `chat/instant > 1517437000000` where the first item is a predicate (not surrounded by quotation marks). This predicate must be indexed (it is either a `ref`, `tag`, or labelled as `unique` or `index`), and it cannot be a reversely-referenced predicate. 

The second item in the expression is any of the following operations `>`, `>=`, `<`, `<=`, `!=`, and `=`. 

The and the third item is a value. String values must be surrounded by escaped quotation marks, i.e. `person/handle != \"jdoe\"`. 

Note: You are able to filter string values with `>`, `>=`, `<`, `<=`, although we do not recommend it. The results may not be sorted in an expected way, and we do not support any type of customizeable alphabetization. 

You can link multiple specifications with `AND`s or `OR`s, for example `chat/instant > 1517437000000 AND chat/instant < 1517438000000`. You cannot submit a where clause with both an `AND` and an `OR`.

```flureeql
{
  "select": ["chat/message", "chat/instant"],
  "where": "chat/instant > 1517437000000"
}
```

```sparql
Not supported
```

```flureeql
{
  "select": ["chat/message", "chat/instant"],
  "where": "chat/person = 351843720888322 OR chat/instant > 1517437000000"
}
```
```sparql
Not supported
```


```flureeql
{
  "select": ["handle"],
  "where": "person/handle != \"jdoe\" AND person/_chat"
}
```
```sparql
Not supported
```

You can optionally apply the where filter to a specific collection by including a `from` key in your query map with a collection as the value. 

```flureeql
{
  "select": ["handle"],
  "where": "person/handle != \"jdoe\" AND person/_chat",
  "from": "person"
}
```

```sparql
Not supported
```

### Block Key

A basic query can optionally have a block key, which issues that query as of a given point in time. The value of the block key can be a block number or a ISO-8601 formatted wall-clock time or duration. 

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


### Opts Key

In the `opts` map, you can have the following optional keys:

Key | Value | Description
-- | -- | ---
`limit` | `int` | Limit of results to include.
`offset`| `int` | Number of results to exclude (i.e for pagination).
`orderBy` | `predicate` or `[ORDER, predicate]` | Predicate name or two-tuple specifying how to order results. If using a two-tuple, the first element must be "ASC" or "DESC" and the second element is the predicate name. For example, `"person/chat"` or `["ASC", "person/handle"]`. Predicate name should match the name in the select clause. Ordering is done before taking the number of results specified in `limit`.
`component` | `boolean` | Whether or not to automatically crawl the graph and retrieve component entities. Default: true. 
`compact` | `boolean` |  All predicates returned are in their compact form (`handle`, rather than `person/handle`).
`syncTo` | `integer` | Waits to return the results of the query until the ledger has reached a given block number. By default, waits for up to 1 minute, but `syncTimeout` (see below) can be changed.  
`syncTimeout` | `integer` | Number of milliseconds to wait for the ledger to reach `syncTo` block. Default is `60000`, and max allowed is `120000`.

For example:

```all
{ 
  "select": ["*"], 
  "from": "person", 
  "opts": { "compact": true, "limit": 10, "offset": 5, "syncTo": 5, "orderBy": "handle" }
}
```
