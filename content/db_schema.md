
# Schema

## Fluree Schemas

Much like a relational database, before storing your records in a Fluree database, you must first register a schema which consists of collections (similar to tables) and permissible attributes (similar to columns).

Fluree validates all Flakes being written against the database's schema, ensuring each Flake event type and attribute are registered and meet all of the defined restrictions (i.e. data type, multi-cardinality, uniqueness, required).

Defining and updating schemas is done through regular database transactions (in JSON) by writing to the special pre-defined system collections.

FlureeDB attributes can be of many different types documented in the types table (i.e. string, boolean). Being a graph database, the special type of `ref` (reference) is core to traversing through data. Any attribute of type `ref` refers (links/joins) to another entity. These relationships can be navigated in both directions. For example, listing all invoices from a customer record is trivial if the invoice is of type `ref`, and once established an invoice automatically links back to the customer.

Beyond validating types, FlureeDB allows custom validation that can further restrict attribute values. This level of validation is done by specifying an optional [`spec` for a collection or attribute](#schema-specs).

## Collections

Collections are like relational database tables. We call them collections because they hold an event-collection of changes pertaining to a specific type of entity. For each type of entity/object you have, there should be a collection defined to hold it (i.e. customers, chat messages, addresses).

To create a new collection, submit a transaction against the system collection named `_collection`. A sample collection transaction is provided here to create a new collection.


```json
[{
 "_id": "_collection",
 "name": "person",
 "doc": "A collection/table to hold our people",
 "version": "1"
},
{
 "_id": "_collection",
 "name": "chat",
 "doc": "A collection/table to hold chat messages",
 "version": "1"
},
{
 "_id": "_collection",
 "name": "comment",
 "doc": "A collection/table to hold comments to chat messages",
 "version": "1"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":     "_collection",
  "name":    "person",
  "doc":     "A collection/table to hold our people",
  "version": "1"
},
{
  "_id":     "_collection",
  "name":    "chat",
  "doc":     "A collection/table to hold chat messages",
  "version": "1"
},
{
  "_id":     "_collection",
  "name":    "comment",
  "doc":     "A collection/table to hold comments to chat messages",
  "version": "1"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```

```graphql
mutation addCollections ($myCollectionTx: JSON) {
  transact(tx: $myCollectionTx)
}

/* myCollectionTx is saved as a variable. Learn more about using GraphQL in the section, 'GraphQL' */
/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{


{
  "myCollectionTx": "[{\"_id\": \"_collection\", \"name\": \"person\", \"doc\": \"A collection/table to hold our people\", \"version\": \"1\"},{ \"_id\": \"_collection\", \"name\": \"chat\", \"doc\": \"A collection/table to hold chat messages\", \"version\": \"1\"},{ \"_id\": \"_collection\", \"name\": \"comment\", \"doc\": \"A collection/table to hold comments to chat messages\", \"version\": \"1\"}]"
}
```

An entity in a collection can have any defined attribute assigned to it, but convention is for attributes intended for a specific collection to have the attribute namespace be the same as the collection name (see documentation on attributes and namespaces). For example, if there were a `person` collection, an attribute intended to hold a person's email might be `person/email`.

In places where there is no ambiguity, attributes containing the same namespace as the collection do not need to include the namespace portion of the attribute. For example, note that the full attribute name of `person/email` is shortened below because the entity is in the `person` collection. You can of course always include the full attribute name.

```
{
  "_id": "person",
  "email": "sample@email.com"
}
```

Collections can optionally have a `spec` defined that restricts the allowed attributes.

## Collection Attributes

The following table shows all `_collection` attributes and their meaning.

Attribute | Type | Description
---|---|---
`_collection/name` | `string` | (required) The name of the collection. Collection names are aliases to an underlying collection integer identifier, and therefore it is possible to change collection alias to a different collection ID.
`_collection/doc` | `string` | (optional) Optional docstring describing this collection.
`_collection/spec` | `string` | (optional) A `spec` that restricts what is allowed in this collection.
`_collection/specDoc` | `string` | (optional) Option docstring to describe the spec. Is thrown when spec fails. 
`_collection/version` | `string` | (optional) For your optional use, if a collection's spec or intended attributes change over time this version number can be used to determine which schema version a particular application may be using.

## Attribute Definitions

The following table shows all `_attribute` attributes and their meaning

Attribute | Type | Description
---|---|---
`_attribute/name` | `string` | (required) Actual attribute name. Must be namespaced, and convention is to namespace it using the collection name you intend it to be used within. Technically any attribute can be placed on any entity, but using a `spec` can restrict this behavior.
`_attribute/doc` | `string` | (optional) Doc string for this attribute describing its intention. This description is also used for GraphQL automated schema generation.
`_attribute/type` | `tag` | (required) Data type of this attribute such as `string`, `integer`, or a reference (join) to another entity - `ref`. See table below for valid data types.
`_attribute/unique` | `boolean` | (optional) True if this attribute acts as a primary key.  Unique attributes can be used for identity (as the `_id` value in a transaction or query).  (Default false.)
`_attribute/multi` | `boolean` | (optional) If this is a multi-cardinality attribute (holds multiple values), set to `true`. (Default false.)
`_attribute/index` | `boolean` | (optional) True if an index should be created on this attribute. An attribute marked as `unique` automatically will generate an index and will ignore the value specified here. (Default false.)
`_attribute/upsert` | `boolean` | (optional) Only applicable to attributes marked as `unique`. If a new entity transaction using this attribute resolves to an existing entity, update that entity. By default the transaction will throw an exception if a conflict with a `unique` attribute exists.
`_attribute/noHistory` | `boolean` | (optional) By default, all history is kept. If you wish to turn this off for a certain entity, set this flag to true. Queries, regardless of time travel, will always show the current value.
`_attribute/component` | `boolean` | (optional) For type 'ref' attributes only. Mark true if this attribute refers to an entity which only exists as part of the parent entity. If true, and the parent entity is deleted, the entity referenced by this attribute will also be deleted automatically. (Default false.)
`_attribute/spec` | `json` | (Not in beta yet, optional) Sets the specification rules for this attribute, enabling to you restrict its allowed values.
`_attribute/deprecated` | `boolean` | (Not in beta yet, optional) True if this v is deprecated.  Reads and writes are still allowed, but might give warnings in the API.
`_attribute/restrictCollection` | `string` | (optional) Only applicable to attributes of `ref` (reference) types. It will restrict references to only be allowed from the specified collection.
`_attribute/encrypted` | `boolean` | (Not in beta yet, optional) Expects the value to come in as an encrypted string. Type checking will be disabled, and database functions won't be permitted on this value.


### Attribute Types

Supported attribute types are as follows:

Type | Description
---|---
`string` | Unicode string (`_type/string`)
`ref` | Reference (join) to another collection (`_type/ref`)
`tag` | A special tag attribute. Tags are auto-generated, and create auto-resolving referred entities. Ideal for use as enum values. Also they allow you to find all entities that use a specific tag.  (`_type/tag`)
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

GraphQL requires additional information to auto-generate a schema that shows relationships, and it forces strict typing. Fluree allows any reference attribute to point to any entity, regardless of collection type. If you wish to restrict a reference attribute to only a specific type of collection, also include `restrictCollection` in your attribute definition. In addition to forcing an attribute to only allow a specific collection type, it also enables GraphQL to auto-generate its schema with the proper relationship.

## Schema Specs

Both _attribute and _collection specs allow you to specify the contents of an attribute or a collection with a high level of control. Specs may simply be true or false, or they can be statements, which resolve to true or false. They are evaluated for every entity that is updated within a collection or attribute. 

Attribute and collection specs are built using [database functions](#database-functions). 

Spec | Description
---|---
"(= [1 2 3])" | You will *not* be able to add or edit any values to this collection or attribute. 
"(= [3 (max [1 2 3])]) | You will be able to add and edit any values to this collection or attribute. Given you have access to that attribute or collection.
true | You will be able to add any values to this collection or attribute. Given you have access to that attribute or collection.
false | You will *not* be able to add any values to this collection or attribute.

Specs using just database functions or true/false, will allow users who have access to that attribute or collection edit or add values for any given attribute or collection. While this is possible, Fluree allows very [granular permissions](#fluree-permissions) through a system of auth records, roles, and rules. 

Specs are best suited for controlling the actual values of attributes through either specs that govern a specific attribute, or through specs that govern an entire collection. In order to make this possible, `_attribute/spec` and `_collection/spec` both give you access to certain information about the entity you are updating through built-in variables and functions. The functions below are also listed in [Database Functions](#database-functions). 

Symbol | Description | Type | Access
---|---|---|---
`?v` | This gives you access to the value of the attribute you are updating. | Variable | Only available through `_attribute/spec`
(`?v` attribute) | Input a variable name into this function, and you will have access to that attribute's value. If you are attempting to edit that attribute's value, this function will return the value that you are attempting to add. | Function | Both specs
(`?e`) | This function returns an object of the entity you are attempting to edit with all of that entity's attribute-values, including the ones you are attemping to add. | Function | Both specs


There are many ways to use database functions to control the value of an attribute or attributes in a collection. Below is a small series of examples:

### Ex: Check If an Email Is Valid

Fluree has a built-in database function, `valid-email?` that checks whether an email is valid (using the following pattern, "`[a-z0-9!#$%&'*+/=?^_`\``{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`\``{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`". You can also create your own email pattern using the function, `re-find`). 

Suppose we want to add a spec to `person/email`, which checks whether the syntax of an email is valid. The `specDoc` attribute is the error message that is thrown when a value does not pass the spec, so we want to make sure that it is descriptive. 

```
{
  "_id": ["_attribute/name", "person/email"],
  "spec": "(valid-email? ?v)",
  "specDoc": "Please enter a valid email address."
}
```

### Ex: Ensure a Password Has At Least One Letter, and One Number

Let's say that we want to add an attribute, `person/password`, but we want to make sure that it has at least one letter and one number. We could do that using the following spec. 

```
{
  "_id": "_attribute",
  "name": "person/password",
  "type": "string",
  "spec": "(re-find \"^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$\" ?v)",
  "specDoc": "Passwords must have at least one letter and one number"
}
```

### Ex: Level Needs To Be Between 0 and 100. 

Let's say that we want to add an attribute, `person/level`, but we want to make sure that their level is between 0 and 100. 

```
{
  "_id": "_attribute",
  "name": "person/level",
  "type": "int",
  "spec": "(and [(> [100 ?v]) (< [0 ?v])])",
  "specDoc": "Levels must be between 0 and 100."
}
```

### Ex: Both Person/Handle and Person/fullName are Required Attributes in a Collection

The most common usage for collection specs is to require certain attributes within a collection. For instance, requiring both a `person/handle` and a `person/fullName`. The below spec first gets the handle and fullName from the entity in question, and then checks if both of them are not nil. 

```
{
  "_id": ["_collection/name" "person"],
  "spec": " (and [(get (?e) \"person/handle\") (get (?e) \"person/fullName\")]) ",
  "specDoc": "A person is required to have both a fullName and a handle."
}
```


