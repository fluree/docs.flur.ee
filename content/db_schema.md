
# Schema

## Fluree Schemas

The Fluree database is a collection of immutable Flake events. Much like a relational database, in Fluree you must first register streams (similar to tables) and permissible attributes (similar to columns).

Fluree validates all Flakes being written against the database's schema, ensuring each Flake event type and attribute are registered and meet all of the defined restrictions (i.e. data type, multi-cardinality, uniqueness, required). This is analagous to a relational database's schema definition of table names and columns.

Defining and updating schemas is done through regular transactions (in JSON).

Each attribute has a type which can be one of several primitive types (i.e. string, boolean), or it can be a reference to other event types. Fluree makes it trivial to traverse the graph of relationships.


## Attribute Definitions

Attribute definitions can contain the following fields:

Field | Description
---|---
`name` | (required) Actual attribute name. Must be namespaced, and convention is to namespace it using the stream name you intend it to be used within. Technically any attribute can be placed on any entity, but using a `spec` can restrict this behavior.
`doc` | (optional) Doc string for this attribute describing its intention. This description is also used for GraphQL automated schema generation.
`type` | (required) Data type of this event such as `string`, `integer`, or a reference (join) to another entity - `ref`. See table below for valid data types.
`unique` | (optional) True if this event acts as a primary key.  Inserts into this table with the same primary key as an existing entity become "upserts"; they update the existing entity.  (Default false.)
`multi` | (optional) If this is a multi-cardinality attribute (holds multiple values), set to `true`. (Default false.)
`index` | (optional) True if an index should be created on this event. An attribute marked as `unique` automatically will generate an index and will ignore the value specified here. (Default false.)
`upsert` | (optional) Only applicable to attributes marked as `unique`. If a new entity transaction using this attribute resolves to an existing entity, update that entity. By default the transaction will throw an exception if a conflict with a `unique` attribute exists.
`noHistory` | (optional) By default, all history is kept. If you wish to turn this off for a certain entity, set this flag to true. Queries, regardless of time travel, will always show the current value.
`component` | (optional) True if this event is a reference to another table and when this entity is deleted, the referenced entity should also be deleted. (Default false.)
`spec` | (Not in beta yet, optional) Sets the specification rules for this attribute, enabling to you restrict its allowed values.
`deprecated` | (Not in beta yet, optional) True if this event is deprecated.  Reads and writes are still allowed, but might give warnings in the API.
`restrictStream` | (optional) Only applicable to attributes of `ref` (reference) types. It will restrict references to only be allowed from the specified stream.
`encrypted` | (Not in beta yet, optional) Expects the value to come in as an encrypted string. Type checking will be disabled, and database functions won't be permitted on this value.


### Attribute Types

Supported attribute types are as follows:

Type | Description
---|---
`string` | Unicode string (`_type/string`)
`ref` | Reference (join) to another stream (`_type/ref`)
`tag` | A special tag attribute. Tags are auto-generated, and create auto-resolving referred entities. Ideal for use as enum values. Also they allows you to find all entities that use a specific tag.  (`_type/tag`)
`int` | 32 bit signed integer (`_type/int`)
`long` | 64 bit signed integer (`_type/long`)
`bigint` | Arbitrary sized integer (more than 64 bits) (`_type/bigint`)
`float` | 32 bit IEEE double precision floating point (`_type/float`)
`double` | 64 bit IEEE double precision floating point (`_type/double`)
`bigdec` | IEEE double precision floating point of arbitrary size (more than 64 bits) (`_type/bigdec`)
`instant` | Millisecond precision timestamp from unix epoch. Uses 64 bits. (`_type/instant`)
`boolean` | true/false (`_type/boolean`)
`uri` | URI formatted string (`_type/uri`)
`uuid` | A UUID value. (`_type/uuid`)
`bytes` | Byte array (`_type/bytes`)
`json` | Arbitrary JSON data. The JSON is automatically encoded/decoded (UTF-8) with queries and transactions, and JSON structure can be validated with a `spec`. (`_type/json`)


**A note on reference types:**

References, `ref`, allow both forward and reverse traversal of graph queries. 

GraphQL requires additional information to auto-generate a schema that shows relationships, and it forces strict typing. Fluree allows any reference attribute to point to any entity, regardless of stream type. If you wish to restrict a reference attribute to only a specific type of stream, also include `restrictStream` in your attribute definition. In addition to forcing an arribute to only allow a specific stream type, it also enables GraphQL to auto-generate its schema with the proper relationship.


