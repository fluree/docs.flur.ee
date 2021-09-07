import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Collections

A collection is analogous to a relational database table. Every time you want a **new type of item** in your ledger, you would create a new collection. For example, collections in your ledger might be person, company, and city.

Collections are recorded in the ledger in the same way as any other type of data. The syntax for updating the `_collection` collection or `_collection` predicates is the same as updating any other type of information. Furthermore, if you wanted to add additional predicates to the `_collection` collection, you can.

## _collection Predicates {#_collection-predicates}

Below are the built-in predicates for the `_collection` collection. As mentioned above, you can add additional predicates if you wish. You are also able to delete predicates, although this is strongly discouraged and may break parts of your ledger.  

Predicate | Type | Description
---|---|---
`_collection/name` | `string` | (required) The name of the collection. Collection names are aliases to an underlying collection integer identifier, and therefore it is possible to change collection alias to a different collection ID.
`_collection/doc` | `string` | (optional) Optional docstring describing this collection.
`_collection/spec` | [`ref`] | (optional) A multi-cardinality list of reference to the `_fn` collection. These specs restricts what is allowed in this collection. To see how to write a function, see the [function section](/docs/schema/functions).
`_collection/specDoc` | `string` | (optional) Optional docstring to describe the specs. Is thrown when any spec fails.
`_collection/version` | `string` | (optional) For your optional use, if a collection's spec or intended predicates change over time this version number can be used to determine which schema version a particular application may be using.

## Creating Collections {#creating-collections}

Creating collections is done in the same way as creating any other type of subject in the ledger. In the below example, we create four new collections: person, chat, comment, and artist. We strongly discourage adding smart functions to your `_collection/spec` when you initially create a collection. If you would like a `_collection/spec`, visit the [functions](/docs/schema/functions) section to understand how to incorporate smart functions into your schema.

<Tabs
defaultValue="json"
values={[{label: 'FlureeQL', value: 'json'},
{label: 'Curl', value: 'bash'},
{label: 'GraphQL', value: 'graphql'},
{label: 'SparQL', value: 'sparql'}]}>
<TabItem value="json">

```json
[{
 "_id": "_collection",
 "name": "person",
 "doc": "A collection to hold all the people in our ledger",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "chat",
  "doc": "A collection to hold all the chats in our ledger",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "comment",
 "doc": "A collection to hold all the comments in our ledger",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "artist",
  "doc": "A collection to hold all the artists in our ledger",
  "version": 1 
}]
```

</TabItem>

<TabItem value="bash">

```bash
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
 "_id": "_collection",
 "name": "person",
 "doc": "A collection to hold all the people in our ledger",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "chat",
  "doc": "A collection to hold all the chats in our ledger",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "comment",
 "doc": "A collection to hold all the comments in our ledger",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "artist",
  "doc": "A collection to hold all the artists in our ledger",
  "version": 1 
}]' \
   [HOST]/api/db/transact
```

</TabItem>

<TabItem value="graphql">

```graphql
mutation addCollections ($myCollectionTx: JSON) {
  transact(tx: $myCollectionTx)
}

{
  "myCollectionTx": "[{\"_id\":\"_collection\",\"name\":\"person\",\"doc\":\"A collection to hold all the people in our ledger\",\"version\":1},{\"_id\":\"_collection\",\"name\":\"chat\",\"doc\":\"A collection to hold all the chats in our ledger\",\"version\":1},{\"_id\":\"_collection\",\"name\":\"comment\",\"doc\":\"A collection to hold all the comments in our ledger\",\"version\":1},{\"_id\":\"_collection\",\"name\":\"artist\",\"doc\":\"A collection to hold all the artists in our ledger\",\"version\":1}]"
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Transactions not supported in SPARQL
```

</TabItem>
</Tabs>

## Adding a Predicate to `_collection` {#adding-a-predicate-to-_collection}

`_collection` is a built-in ledger collection with built-in predicates. This does not mean, for instance, that you cannot add predicates. For example, you may want to add a `_collection/longDescription` predicate, where you store a longer version of `_collection/doc`.

You can do this by adding a new predicate:

<Tabs
defaultValue="json"
values={[{label: 'FlureeQL', value: 'json'},
{label: 'Curl', value: 'bash'},
{label: 'GraphQL', value: 'graphql'},
{label: 'SparQL', value: 'sparql'}]}>
<TabItem value="json">

```json
[{
    "_id": "_predicate",
    "name": "_collection/longDescription",
    "type": "string"
}]
```

</TabItem>

<TabItem value="bash">

```bash
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_predicate",
    "name": "_collection/longDescription",
    "type": "string"
}]' \
   [HOST]/api/db/transact
```

</TabItem>

<TabItem value="graphql">

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":\"_predicate\",\"name\":\"_collection/longDescription\",\"type\":\"string\"}]"
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Transactions not supported in SPARQL
```

</TabItem>
</Tabs>

After you add this predicate, you can update any existing collections to include a long description:

<Tabs
defaultValue="json"
values={[{label: 'FlureeQL', value: 'json'},
{label: 'Curl', value: 'bash'},
{label: 'GraphQL', value: 'graphql'},
{label: 'SparQL', value: 'sparql'}]}>
<TabItem value="json">

```json
[{
    "_id": ["_collection/name", "person"],
    "longDescription": "I have a lot to say about this collection, so this is a longer description about the person collection"
}]
```

</TabItem>

<TabItem value="json">

```bash
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_collection/name", "person"],
    "longDescription": "I have a lot to say about this collection, so this is a longer description about the person collection"
}]' \
   [HOST]/api/db/transact
```

</TabItem>

<TabItem value="graphql">

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":[\"_collection/name\",\"person\"],\"longDescription\":\"I have a lot to say about this collection, so this is a longer description about the person collection\"}]"
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Transactions not supported in SPARQL
```

</TabItem>
</Tabs>

And you can create new collections with a `_collection/longDescription`:

<Tabs
defaultValue="json"
values={[{label: 'FlureeQL', value: 'json'},
{label: 'Curl', value: 'bash'},
{label: 'GraphQL', value: 'graphql'},
{label: 'SparQL', value: 'sparql'}]}>
<TabItem value="json">

```json
[{
    "_id": "_collection",
    "name": "animal",
    "longDescription": "I have a lot to say about this collection, so this is a longer description about the animal collection"
}]
```

</TabItem>

<TabItem value="bash">

```bash
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_collection",
    "name": "animal",
    "longDescription": "I have a lot to say about this collection, so this is a longer description about the animal collection"
}]' \
   [HOST]/transact
```

</TabItem>

<TabItem value="graphql">

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":\"_collection\",\"name\":\"animal\",\"longDescription\":\"I have a lot to say about this collection, so this is a longer description about the animal collection\"}]"
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Transactions not supported in SPARQL
```

</TabItem>
</Tabs>

## Updating a Predicate in `_collection` {#updating-a-predicate-in-_collection}

Although you can change built-in collection predicates, we do not recommend doing so, as your changes may break certain aspects of schema validation.

One commonly-requested safe change, however, is to allow `_collection/name` to be upsertable. By default, `_collection/name` does not allow upsert, meaning if you try to create a new collection with the name of already existing collection, an error will be thrown. You can change this, however, by editing the predicate, `_collection/name`. To see all the existing predicates for the `_collection/name` predicate, you can issue the following query:

<Tabs
defaultValue="json"
values={[{label: 'FlureeQL', value: 'json'},
{label: 'Curl', value: 'bash'},
{label: 'GraphQL', value: 'graphql'},
{label: 'SparQL', value: 'sparql'}]}>
<TabItem value="json">

```json
{
    "select": ["*"],
    "from": ["_predicate/name", "_collection/name"]
}
```

</TabItem>

<TabItem value="bash">

```bash
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["*"],
    "from": ["_predicate/name", "_collection/name"]
}' \
   [HOST]/api/db/query
```

</TabItem>

<TabItem value="graphql">

```graphql
Not supported
```

</TabItem>

<TabItem value="sparql">

```sparql
SELECT ?predicate
WHERE {
    ?predicate fd:_predicate/name "_collection/name".
}
```

</TabItem>
</Tabs>

The default features of `_collection` name are:

```json
{
  "_predicate/name": "_collection/name",
  "_predicate/doc": "Schema collection name",
  "_predicate/type": "string",
  "_predicate/unique": true,
  "_id": 40             // id depends on Fluree version
}
```

As we can see, there is no `upsert` key in the predicate, so by default upsert is false. To change this, we can issue:

<Tabs
defaultValue="json"
values={[{label: 'FlureeQL', value: 'json'},
{label: 'Curl', value: 'bash'},
{label: 'GraphQL', value: 'graphql'},
{label: 'SparQL', value: 'sparql'}]}>
<TabItem value="json">

```json
[{
    "_id": ["_predicate/name", "_collection/name"],
    "upsert": true
}]
```

</TabItem>

<TabItem value="bash">

```bash
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "_collection/name"],
    "upsert": true
}]' \
   [HOST]/api/db/transact
```

</TabItem>

<TabItem value="graphql">

```graphql
mutation addUpsert ($addUpsertTx: JSON) {
  transact(tx: $addUpsertTx)
}

{
  "addUpsertTx": "[{\"_id\":[\"_predicate/name\",\"_collection/name\"],\"upsert\":true}]"
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Transactions not supported in SPARQL
```

</TabItem>
</Tabs>

Now, we allow upsert for the `_collection/name` predicate.
