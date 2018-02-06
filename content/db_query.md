
# Query

## Fluree Queries

Fluree allows you to specify queries using the FlureeQL JSON syntax or with GraphQL. The FlureeQL format, being a JSON data structure, allows for queries to be easily composed within your programming code and is built to support Fluree's advanced capabilities like graph recursion. GraphQL supports a more limited set of query capability, but is robust enough for many applications.

Fluree has permissions embedded within the database itself, which has the effect that every database for every user is potentially customized and contains only data they can view. This capability allows more direct access to the database for front-end UIs or other applications, and means less time spent creating custom API endpoints that simply modify select statements based on who the user is. In addition, multiple apps can share the same database with security consistency.

The graph selection capability of FlureeDB allows query results to be returned as a nested graph instead of 'flat' result sets. This aligns with how data is actually used in applications and makes it simpler to pass data around to various UI components, etc. This also means the role of a client database library is substantially reduced, and for many applications may be unnecessary.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request which reduces round-trips for end-user applications. Both also support *time travel* queries, allowing you to issue any query at any point in history. Any place you might have written code or created extra tables to store a historical log of changes becomes unnecessary when using Fluree. It also gives your apps the ability to 'rewind' to any point in time.

FlureeQL has two main approaches to creating queries that share much of the same syntax. The first is one that closely resembles SQL, and works well for most typical application-based queries. It is simple to use and understand and will get you far. The second approach enables concepts of logic programming embedded directly into the query. This allows very powerful query constructs and exposes analytical features like aggregates, and more. It is also simple, but the approach may not be familiar to those with SQL-only exposure. It is worth learning, and won't take long to get used to.


#### A simple FlureeQL query

```json
{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}
```

#### Specify selection attributes and narrow results with a `where` that does a range scan

```json
{
  "select": ["chat/message", "chat/instant"],
  "from": "chat",
  "where": "chat/instant > 1517437000000 AND chat/instant < 1517438000000"
}
```

#### Time travel by specifying a blockchain block number

```json
{
  "select": ["*"],
  "from": "chat",
  "block": 2
}
```

#### Time travel by specifying a wall clock time

```json
{
  "select": ["*"],
  "from": "chat",
  "block": "2017-11-14T20:59:36.097Z"
}
```

## References and reverse references (crawling the graph)

Entities refer (join) to other entities via any attribute that is of type: `ref`.

To refer to another entity, you can utilize any unique identifier for that attribute. This includes the underlying numeric entity `_id` and using any attribute marked as `unique`.

For example, if a person record had an id of `456356774345` and also had a unique attribute of `email`, either could be used as a reference value. Unique attributes need to use an identity type, so something like `["person/email", "me@you.com"]`.

Within queries, references can be traversed in either order. Note the two query examples here. The first finds all chat messages and show the referenced person who posted the message. The second uses a reverse reference (which uses an underscore to signify the reverse relationship). It instead finds all persons, but then shows all of their chat messages.

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
#### Person query, but follow chat relationship in reverse to find all their chats (note the underscore `_`)

```json
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```


