# FlureeDB Intro

## Capability

FlureeDB is based on an immutable<sup>*</sup>, time-ordered blockchain of events. We call these events Flakes, and each represents a fact about a particular entity at a specific point in time.

```TODO - picture of flakes in order```

The Fluree database supports the following capabilities:
- ACID transactions.
- Database functions.
- Rule-based permissions built in, allowing control down to the entity + attribute level with custom predicate functions.
- Ability act as multiple database types simultaneously: a graph database, document database, and an event log.
- Automated change feed subscriptions for issued queries. We auto-detect the data a query would contain and can push notifications for those changes to keep user interfaces updated automatically.
- A GraphQL query interface.
- Powerful query language that supports unlimited recursion and can be represented fully in JSON, thus readily composable.
- Scale-out writes by leveraging partitioning.
- Scale-out reads, by separating eventually consistent query engines from the core bockchain transactor. Queries can optionally force consistency to a specific point-in-time or block.
- Point-in-time queries, leveraging the characteristics our immutable blockchain core provides.
- When leveraging Fluree's cloud-hosted private consensus, zero management overhead. Federated and fully decentralized consensus modes are in development.
- FlureeDB will become opensource as we move forward in development.

<sup>*</sup>Immutability can be turned off for specific attributes when desired.

## Quick Start

Let's create a simple chat message database table with comments.

We'll follow these steps to give a sense of FlureeDB basics:

1. Create a schema for our database
2. Transact chat messages
3. Query for those messages
4. Time Travel Query
5. Establish a user's permission
6. Query permissioned DB

### Schema - Streams

Our schema consists of streams (similar to a relational database tables), and attributes (similar to columns).
We must define these first in order to populate data within them. In FlureeDB, the schema is just data so
we must perform a transaction to do this.

Both streams and attributes would typically be defined in a single atomic transaction, but
here we'll do it in two transactions to explain what is happening.

This transaction adds three streams:

- person - will hold names/handles for those that are chatting
- chatMessage - will hold the chat messages
- chatComment - will hold comments about messages

Every transaction item must have an `_id` attribute to refer to entity we are attempting to create/update.
Here we use a tempid for each, i.e. `["_stream", -1]`, as they are all new. This tells FlureeDB
our intention is to create a new entity in `_stream`. `_stream` is a system stream/table that holds the
configured streams, and `_attribute` likewise for attributes.

#### Stream schema transaction

```json
[{
  "_id":       ["_stream", -1],
  "name": "person",
  "doc": "A stream/table to hold our people",
  "version": "1"
},
{
  "_id":       ["_stream", -2],
  "name": "chat",
  "doc": "A stream/table to hold chat messages",
  "version": "1"
},
{
  "_id":       ["_stream", -3],
  "name": "comment",
  "doc": "A stream/table to hold comments to chat messages",
  "version": "1"
}]
```

### Schema - Attributes

Schema attributes are similar to relational database columns, however there are fewer restrictions.
Any attribute can be attached to any entity, unless a restriction is put in place using a `spec`.

The transaction sample here adds the following attributes:

People
- `person/handle` - The person's unique handle. Being marked as `uniqe`, it can be used as an `_id`.
- `person/fullName` - The person's full name. Because it is marked as `index`, it can be used in `where` clauses.

Chats
- `chat/message` - The actual message content.
- `chat/person` - A reference to the person that made this chat (a join).
- `chat/comments` - Comments about this message, which are a reference (join). `multi` indicates multiple comments can be stored, and `component` indicates these referenced comment entities should be treated as part of this parent, and if the parent (in this case the chat message) is deleted, the comments will also be deleted.

Comments
- `comment/message` - A comment message.
- `comment/person` - A reference to the person who made the comment (a join).

#### Attribute schema transaction

```json
[{
  "_id":       ["_attribute", -1],
  "name": "person/handle",
  "doc": "The person's unique handle",
  "unique": true,
  "type": "_type/string"
},
{
  "_id":       ["_attribute", -2],
  "name": "person/fullName",
  "doc": "The person's full name.",
  "type": "_type/string",
  "index": true
},
{
  "_id":       ["_attribute", -3],
  "name": "chat/message",
  "doc": "A chat message",
  "type": "_type/string"
},
{
  "_id":       ["_attribute", -4],
  "name": "chat/person",
  "doc": "A reference to the person that created the message",
  "type": "_type/ref",
  "restrictStream": "person"
},
{
  "_id":       ["_attribute", -5],
  "name": "chat/comments",
  "doc": "A reference to comments about this message",
  "type": "_type/ref",
  "component": true,
  "multi": true,
  "restrictStream": "comment"
},
{
  "_id":       ["_attribute", -6],
  "name": "comment/message",
  "doc": "A comment message.",
  "type": "_type/string"
},
{
  "_id":       ["_attribute", -7],
  "name": "comment/person",
  "doc": "A reference to the person that made the comment",
  "type": "_type/ref",
  "restrictStream": "person"
}]
```


### Transacting Data

To write data to the Fluree Database, you submit a collection of statements to the transactor endpoint. All of the statements will be successfully commited together, or all fail together with the error reported back to you.

A sample chat message transaction is shown which creates a single new entity. Multiple entities could be created, updated, or deleted within a single atomic transaction. This sample transaction highlights several important concepts, including how to identify an entity using the special `_id` attribute, using temporary ids for new entities, how an attribute can join to another entity, and a simple database function.

#### Sample chat message transaction

```json
[{
  "_id":       ["chatMessage", -1],
  "message":   "Please let me know the status of the NewCo account.",
  "sender":    ["user/username", "jdoe@company.com"],
  "timestamp": "#(now)"
}]
```

#### Successful transaction response

```json
{
  "tempids": {},
  "block": 5,
  "hash": "sdfsdfsdf",
  "flakes": [],

}
```

A brief explanation of each key used in this transaction:

Key | Description
---|---
`_id` | A special identifier that allows you to reference an entity in a number of ways. In this case, we are creating new `chatMessage` and don't yet have a unique ID so we assign it a temporary ID (a negative integer). Once the transaction completes, a map of each temporary ID to its permanent ID will be provided, allowing you to refer to the entity in a subsequent query or transaction.
`message` | A simple attribute of type `string`. All attributes must be pre-defined in the schema for a transaction to succeed.
`sender` | An attribute that references a specific `User` entity. Entities can always be referred to by their globally unique id, or by any attribute that the schema defines as `unique`. In this case `username` is a unique attribute and this transaction will succeed if a user with the specific username exists.
`timestamp` | This attribute is using the database function `now` which will replace the value with the current instant in time according to the server.


Now that we have stored a piece of data, let's query it.


### Querying Data

Fluree allows you to specify queries using our FlureeQL JSON syntax or with GraphQL. The FlureeQL format designed to easily enable code to compose queries, as the query is simply a data structure. 

For each query, the user's permissions create a special filtered database that only contains what the user can see. You can safely issue any query, never having to worry about accidentally exposing permissioned data.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request, this can be used to reduce round-trips for end-user applications.
