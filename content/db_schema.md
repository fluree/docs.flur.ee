
# Schema

The Fluree database is a collection of immutable Flake events. Much like a relational database, in Fluree you must first register event types (tables) and permissible attributes (columns).

## Schema Overview

Fluree validates all Flakes being written against the database's schema, ensuring each Flake event type and attribute are registered and meet all of the defined restrictions (i.e. data type, multi-cardinality, uniqueness, required). This is analagous to a relational database's schema definition of table names and columns.

Defining and updating schemas is done through JSON files, with each file possibly representing many types of events. A simple chat message schema example is shown here. Each event type (table name) has one or more defined attributes (columns).

Each attribute has a type which can be one of several primitive types (i.e. string, integer), or it can be a reference to other event types. In the example here, the `sender` attribute refers to a User. Fluree makes it trivial to traverse the graph to obtain User attributes from the chat message, and further traverse any references the User type may have defined from there.

### Example Chat Message Schema

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


## Attribute Definitions

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


## Attribute Types

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


## Schema JSON File Format



A complete schema JSON file example is pictured to the right, but 

Within the JSON file, the top level keys are the event types (table names) and within each event type the attribute key holds a definition of all the attribute types (analagous to column definitions).





In Fluree, a traditional database table is simply a collection of Flake events of the same type.

Database tables are defined under the `schema` key.  This allows Fluree to create your tables on any datastorage backend (SQL or not) and allows us to build permissions rules and automatic schema checking into the platform.  Furthermore, it serves to document your application's schema to other application writers.

The top-level keys under `schema` are the names of your application's tables.  The event (column) definitions are under the `event` key.



