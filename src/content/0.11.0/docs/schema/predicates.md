## Predicates

Schema predicates are similar to relational database columns, however there are fewer restrictions (any predicate can be attached to any subject, unless a restriction is put in place using a spec).

Remember that Fluree schema are stored in the database in the same way as any other type of information. This means that because `_predicate` is a type of thing in our database, there is a `_predicate` collection (similar to a relational database table). Furthermore, the `_predicate` collection has its own predicates. 

### _predicate Predicates

Below are the built-in predicates for the `_predicate` collection. As mentioned  in the [collection section](/docs/schema/collections), you can add additional predicates if you wish. You are also able to delete predicates, although this is strongly discouraged and may break parts of your database.  

Predicate | Type | Description
---|---|---
`_predicate/name` | `string` | (required) Actual predicate name. Must be namespaced, and convention is to namespace it using the collection name you intend it to be used within. Technically any predicate can be placed on any subject, but using a `spec` can restrict this behavior.
`_predicate/doc` | `string` | (optional) Doc string for this predicate describing its intention. This description is also used for GraphQL automated schema generation.
`_predicate/type` | `tag` | (required) Data type of this predicate such as `string`, `integer`, or a reference (join) to another subject - `ref`. See table below for valid data types.
`_predicate/unique` | `boolean` | (optional) True if this predicate acts as a primary key.  Unique predicates can be used for idsubject (as the `_id` value in a transaction or query).  (Default false.)
`_predicate/multi` | `boolean` | (optional) If this is a multi-cardinality predicate (holds multiple values), set to `true`. (Default false.)
`_predicate/index` | `boolean` | (optional) True if an index should be created on this predicate. An predicate marked as `unique` automatically will generate an index and will ignore the value specified here. (Default false.)
`_predicate/upsert` | `boolean` | (optional) Only applicable to predicates marked as `unique`. If a new subject transaction using this predicate resolves to an existing subject, update that subject. By default the transaction will throw an exception if a conflict with a `unique` predicate exists.
`_predicate/noHistory` | `boolean` | (optional) By default, all history is kept. If you wish to turn this off for a certain subject, set this flag to true. Queries, regardless of time travel, will always show the current value. Currently not working.
`_predicate/component` | `boolean` | (optional) For type 'ref' predicates only. Mark true if this predicate refers to an subject which only exists as part of the parent subject. If true, and the parent subject is deleted, the subject referenced by this predicate will also be deleted automatically. (Default false.)
`_predicate/spec` | [`ref`] | (optional) A multi-cardinality list of `ref`s, which reference entities in the `_fn` collection. These specs restricts what is allowed in this _predicate. To learn more, visit the [Collection and Predicate Specs](#collection-and-predicate-specs) section. 
`_predicate/specDoc` | `string` | (optional) Optional docstring to describe the specs. Is thrown when any spec fails. 
`_predicate/deprecated` | `boolean` | (Not in production yet, optional) True if this v is deprecated.  Reads and writes are still allowed, but might give warnings in the API.
`_predicate/txSpec` | [`ref`] | (optional)  A multi-cardinality list of `ref`s, which reference entities in the `_fn` collection. This predicate allows you to set specifications for all of the flakes pertaining to a certain predicate. To learn more, visit the [Predicate Tx Specs](#predicate-tx-specs) section. 
`_predicate/txSpecDoc` | `string` | (optional) Optional docstring to describe the txSpecs. Is thrown when any txSpec fails. 
`_predicate/restrictCollection` | `string` | (optional) Only applicable to predicates of `ref` (reference) types. It will restrict references to only be allowed from the specified collection.
`_predicate/restrictTag` | `boolean` | (optional) Only applicable to predicates of type `tag`. If true, a tag, which corresponds to this predicate object must exist before adding predicate-object pair.
`_predicate/encrypted` | `boolean` | (Not in production yet, optional) Expects the value to come in as an encrypted string. Type checking will be disabled, and database functions won't be permitted on this value.

### Predicate Types

Supported predicate types (`_predicate/type`) are as follows:

Type | Description
---|---
`string` | Unicode string (`_type/string`)
`ref` | Reference (join) to another collection (`_type/ref`)
`tag` | A special tag predicate. Tags are auto-generated, and create auto-resolving referred entities. Ideal for use as enum values. Also they allow you to find all entities that use a specific tag.  (`_type/tag`)
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
`bytes` | Must input bytes as a lowercase, hex-encoded string (`_type/bytes`)
`json` | Arbitrary JSON data. The JSON is automatically encoded/decoded (UTF-8) with queries and transactions, and JSON structure can be validated with a `spec`. (`_type/json`)

Notice there is no `array` type. If you want a predicate to have multiple objects (values), you need to specify a `_predicate/type`, and then also specify `"multi": true`. 

### Creating Predicates

In order to create a predicate, you only need to specify what type of subject you are creating (`_predicate`), a name, and a type. The name for a predicate should be namespaced with the relevant collection (as in all predicates in the `person` collection should begin with `person/`). There are also a host of other [predicate predicates](#_predicate-predicates), which are listed in the linked section, but they are not required. 

If you would like a `_predicate/spec`, you should follow [Fluree Best Practices](/docs/infrastructure/application-best-practices) and read the [Smart Functions](/docs/smart-functions/smart-functions) section in full to understand how to incorporate smart functions into your schema. 

```flureeql
[{
  "_id":    "_predicate",
  "name":   "person/handle",
  "doc":    "The person's unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   "_predicate",
  "name":  "person/fullName",
  "doc":   "The person's full name.",
  "type":  "string",
  "index": true
},
{
  "_id":   "_predicate",
  "name":  "person/follows",
  "doc":   "Any persons this subject follows",
  "type": "ref",
  "restrictCollection": "person"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "_predicate",
  "name":   "person/handle",
  "doc":    "The person's unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   "_predicate",
  "name":  "person/fullName",
  "doc":   "The person's full name.",
  "type":  "string",
  "index": true
},
{
  "_id":   "_predicate",
  "name":  "person/follows",
  "doc":   "Any persons this subject follows",
  "type": "ref",
  "restrictCollection": "person"
}]' \
   [HOST]/transact
```

```graphql
mutation addPredicates ($myPredicateTx: JSON) {
  transact(tx: $myPredicateTx)
}

{
  "myPredicateTx": "[{\"_id\":\"_predicate\",\"name\":\"person/handle\",\"doc\":\"The person's unique handle\",\"unique\":true,\"type\":\"string\"},{\"_id\":\"_predicate\",\"name\":\"person/fullName\",\"doc\":\"The person's full name.\",\"type\":\"string\",\"index\":true},{\"_id\":\"_predicate\",\"name\":\"person/follows\",\"doc\":\"Any persons this subject follows\",\"type\":\"ref\",\"restrictCollection\":\"person\"}]"
}
```

```sparql
Transactions not support in SPARQL
```

### Adding a Predicate to `_predicate`
`_predicate` is a built-in database collection with built-in predicates. This does not mean, for instance, that you cannot add predicates. For example, you may want to add a `_predicate/longDescription` predicate, where you store a longer version of `_predicate/doc`. 

You can do this by adding a new predicate:

```flureeql
[{
    "_id": "_predicate",
    "name": "_predicate/longDescription",
    "type": "string"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_predicate",
    "name": "_predicate/longDescription",
    "type": "string"
}]' \
   [HOST]/transact
```

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":\"_predicate\",\"name\":\"_predicate/longDescription\",\"type\":\"string\"}]"
}
```

```sparql
Transactions not support in SPARQL
```

After you add this predicate, you can update any existing predicates to include a long description:

```flureeql
[{
    "_id": ["_predicate/name", "person/handle"],
    "longDescription": "I have a lot to say about this predicate, so this is a longer description about the person/handle predicate"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "person/handle"],
    "longDescription": "I have a lot to say about this predicate, so this is a longer description about the person/handle predicate"
}]' \
   [HOST]/transact
```

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":[\"_predicate/name\",\"person/handle\"],\"longDescription\":\"I have a lot to say about this predicate, so this is a longer description about the person/handle predicate\"}]"
}
```

```sparql
Transactions not support in SPARQL
```

Add you can create new predicates with a `_predicate/longDescription`:


```flureeql
[{
    "_id": "_predicate",
    "name": "_user/age",
    "type": "int",
    "longDescription": "I have a lot to say about this predicate, so this is a longer description about the _user/age predicate"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_predicate",
    "name": "_user/age",
    "type": "int",
    "longDescription": "I have a lot to say about this predicate, so this is a longer description about the _user/age predicate"
}]' \
   [HOST]/transact
```

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":\"_predicate\",\"name\":\"user/age\",\"longDescription\":\"I have a lot to say about this predicate, so this is a longer description about the _user/age predicate\"}]"
}
```

```sparql
Transactions not support in SPARQL
```

### Updating a Predicate in `_predicate`

Although you can change built-in collection predicates, we do not recommend doing so, as your changes may break certain aspects of schema validation. 

One commonly-requested safe change, however, is to allow `_predicate/name` to be upsertable. By default, `_predicate/name` does not allow upsert, meaning if you try to create a new predicate with the name of already existing predicate, an error will be thrown. You can change this, however, by editing the predicate, `_predicate/name`. To see all the existing predicates for the `_predicate/name` predicate, you can issue the following query:


```flureeql 
{
    "select": ["*"],
    "from": ["_predicate/name", "_predicate/name"]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["*"],
    "from": ["_predicate/name", "_predicate/name"]
}' \
   [HOST]/query
```

```graphql
Not supported
```

```sparql
SELECT ?predicate
WHERE {
    ?predicate fd:_predicate/name "_predicate/name".
}
```

The default features of `_predicate/name` are:

```all
{
  "_predicate/name": "_predicate/name",
  "_predicate/doc": "Predicate name",
  "_predicate/type": "string",
  "_predicate/unique": true,
  "_id": 10             // id depends on Fluree version
}
```

As we can see, there is no `upsert` key in the predicate, so by default upsert is false. To change this, we can issue:

```flureeql
[{
    "_id": ["_predicate/name", "_predicate/name"],
    "upsert": true
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "_predicate/name"],
    "upsert": true
}]' \
   [HOST]/transact
```

```graphql
mutation addUpsert ($addUpsertTx: JSON) {
  transact(tx: $addUpsertTx)
}

{
  "addUpsertTx": "[{\"_id\":[\"_predicate/name\",\"_predicate/name\"],\"upsert\":true}]"
}
```

```sparql
Transactions not support in SPARQL
```

Now, we allow upsert for the `_predicate/name` predicate.

### Query All Predicates

To see all of the predicates in a collection, you can use an analytical query with a filter, like below. To see all the predicates from any given collection, just replace `_collection` with the name of any collection. 

```flureeql
{
    "select": {"?predicate": ["*"]},
    "where": [
        ["?predicate", "_predicate/name", "?name"]
        ],
    "filter": [ "(re-find (re-pattern \"^_collection\") ?name)"],
    "prettyPrint": true
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": {"?predicate": ["*"]},
    "where": [
        ["?predicate", "_predicate/name", "?name"]
        ],
    "filter": [ "(re-find (re-pattern \"^_collection\") ?name)"],
    "prettyPrint": true
}' \
   [HOST]/query
```

```graphql
Not currently supported
```

```sparql
Not currently supported
```