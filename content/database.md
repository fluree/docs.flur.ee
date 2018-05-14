# Database

## Database Intro

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
```curl
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d [{
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
}] \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
```curl
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d [{
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
```curl
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d [{
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
}] \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
}]\
```
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact


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
```curl
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d [{
  "_id":       ["chatMessage", -1],
  "message":   "Please let me know the status of the NewCo account.",
  "sender":    ["user/username", "jdoe@company.com"],
  "timestamp": "#(now)"
}] \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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
```curl
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d {
  "tempids": {},
  "block": 5,
  "hash": "sdfsdfsdf",
  "flakes": [],

}\
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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

For each query, the user's permissions (determined according to `_auth` record through which they are authenticated - more on that in the [Fluree Permissions](#fluree-permissions) section) create a special filtered database that only contains what the user can see. You can safely issue any query, never having to worry about accidentally exposing permissioned data.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request, this can be used to reduce round-trips for end-user applications.

### Transactions

### Database Functions

Database functions allow you to update an attribute's value based on the existing value. This allows features such as an atomic counter and compare-and-set. Fluree supports the following database functions, and is expanding the verstility of these functions in future releases.

Function | Example | Description
-- | -- | -- 
`inc` | `$(inc)` |  Increment existing value by 1. Works on `integer`.
`dec` | `$(dec)` | Decrement existing value by 1. Works on `integer`.
`+` | `$(+ 5)` | Increment existing value by specified number. Works on `integer`, `float`.
`-` | `$(- 5)`| Decrement existing value by specific number. Works on `integer`, `float`.
`now` | `$(now)` | Insert current server time. Works on `instant`.
`cas` | `$(cas "brown" "blue")` | Will compare current value to the first argument, and if equal sets the value to the second argument. If not equal, transaction throws an exception. Works on all types.


## Schema

The Fluree database is a collection of immutable Flake events. Much like a relational database, in Fluree you must first register event types (tables) and permissible attributes (columns).

### Schema Overview

Fluree validates all Flakes being written against the database's schema, ensuring each Flake event type and attribute are registered and meet all of the defined restrictions (i.e. data type, multi-cardinality, uniqueness, required). This is analagous to a relational database's schema definition of table names and columns.

Defining and updating schemas is done through JSON files, with each file possibly representing many types of events. A simple chat message schema example is shown here. Each event type (table name) has one or more defined attributes (columns).

Each attribute has a type which can be one of several primitive types (i.e. string, integer), or it can be a reference to other event types. In the example here, the `sender` attribute refers to a User. Fluree makes it trivial to traverse the graph to obtain User attributes from the chat message, and further traverse any references the User type may have defined from there.

#### Example Chat Message Schema

```json
{
  "ChatMessage": {
    "doc": "A chat message schema.",
    "attributes": {
      "message": {
        "doc": "The message content.",
        "type": "string",
        "required": true
      },
      "sender": {
        "doc": "A reference to the user sending the message.",
        "type": "User",
        "required": true
      },
      "timestamp": {
        "doc": "The time this message was sent.",
        "type": "instant"
      }
    }
  }
}
```
```curl
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d {
  "ChatMessage": {
    "doc": "A chat message schema.",
    "attributes": {
      "message": {
        "doc": "The message content.",
        "type": "string",
        "required": true
      },
      "sender": {
        "doc": "A reference to the user sending the message.",
        "type": "User",
        "required": true
      },
      "timestamp": {
        "doc": "The time this message was sent.",
        "type": "instant"
      }
    }
  }
} \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```

### Attribute Definitions

Attribute definitions can contain the following fields:

Field | Description
---|---
`doc` | (optional) Doc string for this event
`type` | (required) Datatype of this event. See table below for valid data types.  If the type is multi-cardinality, use an array around the base type (e.g. ["integer"]).
`required` | (optional) True if this event is required. (Default false.)
`unique` | (optional) True if this event acts as a primary key.  Inserts into this table with the same primary key as an existing entity become "upserts"; they update the existing entity.  (Default false.)
`index` | (optional) True if an index should be created on this event. (Default false.)
`default` | (optional) Default value.
`history` | (optional) True if we should keep history of this event. (Default true for graph database.  Other databases may not have a concept of history.)
`component` | (optional) True if this event is a reference to another table and when this entity is deleted, the referenced entity should also be deleted. (Default false.)
`deprecated` | (optional) True if this event is deprecated.  Reads and writes are still allowed, but might give warnings in the API.


### Attribute Types

Supported attribute types are as follows:

Type | Description
---|---
`string` | Unicode string
`integer` | 64 bit signed integer
`float` | 64 bit IEEE double precision floating point
`instant` | Millisecond precision timestamp with time zone
`boolean` | True/false
`uri` | URI formatted string
`bytes` | Byte array
`json` | Arbitrary JSON blob

Relational references to other tables are simply named by the table name.  Note that multi-cardinality types (whether primitive types or relations) do not specify a join table.  The joins are traversed transparently to the user.  In addition, most database storages allow of easy traversal of relations in both the forward and backward directions.  Details are in the query section.


### Schema JSON File Format



A complete schema JSON file example is pictured to the right, but 

Within the JSON file, the top level keys are the event types (table names) and within each event type the attribute key holds a definition of all the attribute types (analagous to column definitions).





In Fluree, a traditional database table is simply a collection of Flake events of the same type.

Database tables are defined under the `schema` key.  This allows Fluree to create your tables on any datastorage backend (SQL or not) and allows us to build permissions rules and automatic schema checking into the platform.  Furthermore, it serves to document your application's schema to other application writers.

The top-level keys under `schema` are the names of your application's tables.  The event (column) definitions are under the `event` key.


