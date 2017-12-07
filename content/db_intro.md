# FlureeDB Intro

## Capability

FlureeDB is based on an immutable, time-ordered blockchain of events of database state changes. We call these events Flakes, and each represents a fact about a particular entity at a specific point in time.

The Fluree database features these capabilities:
- ACID transactions.
- Database functions.
- End-user permissions rules, allowing control down to the entity + attribute level with custom predicate functions.
- Ability act as multiple database types simultaneously: a graph database, document database, and an event log (document db in beta soon).
- Automated change feed subscriptions for issued queries. We auto-detect the data a query would contain and can push notifications for those changes to keep user interfaces updated automatically (in beta soon).
- A GraphQL query interface.
- Powerful query language that supports unlimited recursion and can be represented fully in JSON, thus readily composable.
- Scale-out writes by leveraging partitioning (in beta soon).
- Scale-out reads, by separating eventually consistent query engines from the core bockchain transactor. Queries can optionally force consistency to a specific point-in-time or block.
- Point-in-time queries, leveraging the characteristics our immutable blockchain core provides.
- When leveraging Fluree's cloud-hosted private consensus, zero management overhead. Federated and fully decentralized consensus modes are in development.
- FlureeDB will become opensource as we move forward in development.

## Quick Start

Let's create a simple chat message database table with nested comments.

We'll follow these steps to give a sense of FlureeDB basics:

1. Create a schema for our database
2. Transact chat messages
3. Query for those messages
4. Time Travel Query
5. Establish a user's permission
6. Query permissioned DB

### Schema - Streams

A Fluree schema consists of streams and attributes. These are similar to a relational database's tables and columns, however in Fluree both of these concepts are extended and more flexible. Streams organize changes about a type of entity, i.e. customers, invoices, employees. So if you have a new entity type, you'd create a new stream to hold it. Streams differ from tables in that they are an always-present stream of changes about those entities that can be queried at any point in time, not just the latest changes as a traditional database would do.

Everything is data in FlureeDB. The includes the schemas, permissions, etc. that actually govern how it works. To add new streams we'll do a transaction the exact way we'd add any new data. Here we'll add our new streams and attributes in two separate transactions to explain what is happening, but they could be done in one.

This transaction adds three streams:

- `person` - will hold names/handles for the people that are chatting
- `chatMessage` - will hold the chat message content
- `chatComment` - will hold comments about messages

Every transaction item must have an `_id` attribute to refer to the entity we are attempting to create/update. And `_id` can either be an existing entity's unique numeric ID, or a two-tuple of a unique attribute+value, or a two-tuple of stream+tempid, where tempid is a negative integer. Here we use a tempid as we are creating new entities in the system stream named `_stream`. `_stream` is a system stream/table that holds the configured streams, and `_attribute` likewise for attributes.

#### Stream schema transaction

```curl
$ curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}" -d '{"key": "value"}' "https://${INSTANCE}.flur.ee/api/fluree/example/echo"
```

```graphql
{
  graph {
    _user {
      username
    }
  }
}
```

```json
[{
  "_id":     ["_stream", -1],
  "name":    "person",
  "doc":     "A stream/table to hold our people",
  "version": "1"
},
{
  "_id":     ["_stream", -2],
  "name":    "chat",
  "doc":     "A stream/table to hold chat messages",
  "version": "1"
},
{
  "_id":     ["_stream", -3],
  "name":    "comment",
  "doc":     "A stream/table to hold comments to chat messages",
  "version": "1"
}]
```

### Schema - Attributes

Schema attributes are similar to relational database columns, however there are fewer restrictions.
Any attribute can be attached to any entity, unless a restriction is put in place using a `spec`.

The transaction sample here adds the following attributes:

People
- `person/handle` - The person's unique handle. Being marked as `uniqe`, it can be used as an `_id` in subsequent queries or transactions.
- `person/fullName` - The person's full name. Because it is marked as `index`, it can be used in `where` clauses.

Chats
- `chat/message` - The actual message content.
- `chat/person` - A reference to the person that made this chat (a join), and because it is a join that refers to a different entity, its `type` is marked as `_type/ref` .
- `chat/instant` - The instant this chat message happened. Its `type` is `_type/intsant` and is indexed with `index` which
will allow range queries on this attribute.
- `chat/comments` - Comments about this message, which are alos joins (`_type/ref`). `multi` indicates multiple comments can be stored, and `component` indicates these referenced comment entities should be treated as part of this parent, and if the parent (in this case the chat message) is deleted, the comments will also be deleted.

Comments
- `comment/message` - A comment message.
- `comment/person` - A reference to the person who made the comment (a join).

#### Attribute schema transaction

```json
[{
  "_id":    ["_attribute", -1],
  "name":   "person/handle",
  "doc":    "The person's unique handle",
  "unique": true,
  "type":   "_type/string"
},
{
  "_id":   ["_attribute", -2],
  "name":  "person/fullName",
  "doc":   "The person's full name.",
  "type":  "_type/string",
  "index": true
},
{
  "_id":  ["_attribute", -10],
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "_type/string"
},
{
  "_id":  ["_attribute", -11],
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "_type/ref",
  "restrictStream": "person"
},
{
  "_id":   ["_attribute", -12],
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "_type/instant",
  "index": true
},
{
  "_id":       ["_attribute", -13],
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "_type/ref",
  "component": true,
  "multi":     true,
  "restrictStream": "comment"
},
{
  "_id":  ["_attribute", -20],
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "_type/string"
},
{
  "_id":  ["_attribute", -21],
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "_type/ref",
  "restrictStream": "person"
}]
```


### Transacting Data

To write data to the Fluree Database, you submit a collection of statements to the transactor endpoint. All of the statements will be successfully commited together, or all fail together with the error reported back to you. Transactions have ACID guarantees.

While everything transacted here could be done in a single atomic transaction, we split it up to illustrate a couple points.
In the first transaction we add a couple of people. The second transaction adds a chat message. Note the value used for
the `person` key is an `_id`, but this time instead of it being a tempid it refers to an attribute and its corresponding value, `["person/handle", "jdoe"]`. This method can be used for any attribute marked as `unique`.

Also shown is what the result of this transaction will look like. The following table explains these response keys and their meaning. 

A brief explanation of each key used in this transaction:

Key | Description
---|---
`tempids` | A special identifier that allows you to reference an entity in a number of ways. In this case, we are creating new `chatMessage` and don't yet have a unique ID so we assign it a temporary ID (a negative integer). Once the transaction completes, a map of each temporary ID to its permanent ID will be provided, allowing you to refer to the entity in a subsequent query or transaction.
`flakes` | A simple attribute of type `string`. All attributes must be pre-defined in the schema for a transaction to succeed.
`block` | An attribute that references a specific `User` entity. Entities can always be referred to by their globally unique id, or by any attribute that the schema defines as `unique`. In this case `username` is a unique attribute and this transaction will succeed if a user with the specific username exists.
`hash` | This attribute is using the database function `now` which will replace the value with the current instant in time according to the server.

Now that we have stored a piece of data, let's query it.


#### Sample person transaction

```json
[{
  "_id":      ["person", -1],
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      ["person", -2],
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]
```

#### Sample chat message transaction

```json
[{
  "_id":     ["chat", -1],
  "message": "This is a sample chat from Jane!",
  "person":  ["person/handle", "jdoe"],
  "instant": "#(now)"
}]
```

#### Successful chat transaction response

```json
{
  "tempids": {},
  "block":   5,
  "hash":    "sdfsdfsdf",
  "flakes":  [],

}
```

### Querying Data

Fluree allows you to specify queries using our FlureeQL JSON syntax or with GraphQL. The FlureeQL format designed to easily enable code to compose queries, as the query is simply a data structure. 

For each query, the user's permissions create a special filtered database that only contains what the user can see. You can safely issue any query, never having to worry about accidentally exposing permissioned data.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request, this can be used to reduce round-trips for end-user applications.
