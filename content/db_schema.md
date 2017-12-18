
# Schema

## Fluree Schemas

Much like a relational database, before storing your records in a Fluree database, you must first register a schema which consists of streams (similar to tables) and permissible attributes (similar to columns).

Fluree validates all Flakes being written against the database's schema, ensuring each Flake event type and attribute are registered and meet all of the defined restrictions (i.e. data type, multi-cardinality, uniqueness, required).

Defining and updating schemas is done through regular database transactions (in JSON) by writing to the special pre-defined system streams.

FlureeDB attributes can be of many different types documented in the types table (i.e. string, boolean). Being a graph database, the special type of `ref` (reference) is core to traversing through data. Any attribute of type `ref` refers (links/joins) to another entity. These relationships can be navigated in both directions. For example, listing all invoices from a customer record is trivial if the invoice is of type `ref`, and once established an invoice automatically links back to the customer.

Beyond validating types, FlureeDB allows custom validation that can further restrict attribute values. This can be specific enum values, strings matching regular expressions, or even custom predicate functions. This level of validation is done by specifying an optional `spec` for a stream or attribute.

## Streams

Streams are like relational database tables. We call them streams because they hold an event-stream of changes pertaining to a specific type of entity. For each type of entity/object you have, there should be a stream defined to hold it (i.e. customers, chat messages, addresses).

To create a new stream, submit a transaction against the system stream named `_stream`. A sample stream transaction is provided here to create a new stream.

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

An entity in a stream can have any defined attribute assigned to it, but convention is for attributes intended for a specific stream to have the attribute namespace be the same as the stream name (see documentation on attributes and namespaces). For example, if there were a `person` stream, an attribute intended to hold a person's email might be `person/email`.

In places where there is no ambiguity, attributes containing the same namespace as the stream do not need to include the namespace portion of the attribute. For example, note that the full attribute name of `person/email` is shortened below because the entity is in the `person` stream. You can of course always include the full attribute name.

```
{
  "_id": ["person", -1],
  "email": "sample@email.com"
}
```

Streams can optionally have a `spec` defined that restricts the allowed attributes.

## Stream Attributes

The following table shows all `_stream` attributes and their meaning.

Attribute | Type | Description
---|---|---
`_stream/name` | `string` | (required) The name of the stream. Stream names are aliases to an underlying stream integer identifier, and therefore it is possible to change stream alias to a different stream ID.
`_stream/doc` | `string` | (optional) Optional docstring describing this stream.
`_stream/spec` | `json` | (optional) A `spec` that restricts what is allowed in this stream.
`_stream/version` | `string` | (optional) For your optional use, if a stream's spec or intended attributes change over time this version number can be used to determine which schema version a particular application may be using.

## Attribute Definitions

The following table shows all `_attribute` attributes and their meaning

Attribute | Type | Description
---|---|---
`_attribute/name` | `string` | (required) Actual attribute name. Must be namespaced, and convention is to namespace it using the stream name you intend it to be used within. Technically any attribute can be placed on any entity, but using a `spec` can restrict this behavior.
`_attribute/doc` | `string` | (optional) Doc string for this attribute describing its intention. This description is also used for GraphQL automated schema generation.
`_attribute/type` | `tag` | (required) Data type of this event such as `string`, `integer`, or a reference (join) to another entity - `ref`. See table below for valid data types.
`_attribute/unique` | `boolean` | (optional) True if this event acts as a primary key.  Inserts into this table with the same primary key as an existing entity become "upserts"; they update the existing entity.  (Default false.)
`_attribute/multi` | `boolean` | (optional) If this is a multi-cardinality attribute (holds multiple values), set to `true`. (Default false.)
`_attribute/index` | `boolean` | (optional) True if an index should be created on this event. An attribute marked as `unique` automatically will generate an index and will ignore the value specified here. (Default false.)
`_attribute/upsert` | `boolean` | (optional) Only applicable to attributes marked as `unique`. If a new entity transaction using this attribute resolves to an existing entity, update that entity. By default the transaction will throw an exception if a conflict with a `unique` attribute exists.
`_attribute/noHistory` | `boolean` | (optional) By default, all history is kept. If you wish to turn this off for a certain entity, set this flag to true. Queries, regardless of time travel, will always show the current value.
`_attribute/component` | `boolean` | (optional) True if this event is a reference to another table and when this entity is deleted, the referenced entity should also be deleted. (Default false.)
`_attribute/spec` | `json` | (Not in beta yet, optional) Sets the specification rules for this attribute, enabling to you restrict its allowed values.
`_attribute/deprecated` | `boolean` | (Not in beta yet, optional) True if this event is deprecated.  Reads and writes are still allowed, but might give warnings in the API.
`_attribute/restrictStream` | `string` | (optional) Only applicable to attributes of `ref` (reference) types. It will restrict references to only be allowed from the specified stream.
`_attribute/encrypted` | `boolean` | (Not in beta yet, optional) Expects the value to come in as an encrypted string. Type checking will be disabled, and database functions won't be permitted on this value.


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


