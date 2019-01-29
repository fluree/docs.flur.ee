## Collections

A collection is analogous to a relational database table. Every time you want a **new type of item** in your database, you would create a new collection. For example, collections in your database might be person, company, and city.

Collections are recorded in the database in the same way as any other type of data. The syntax for updating the `_collection` collection or `_collection` predicates is the same as updating any other type of information. Furthermore, if you wanted to add additional predicates to the `_collection` collection, you can. 

### _collection Predicates

Below are the built-in predicates for the `_collection` collection. As mentioned above, you can add additional predicates if you wish. You are also able to delete predicates, although this is strongly discouraged and may break parts of your database.  

Predicate | Type | Description
---|---|---
`_collection/name` | `string` | (required) The name of the collection. Collection names are aliases to an underlying collection integer identifier, and therefore it is possible to change collection alias to a different collection ID.
`_collection/doc` | `string` | (optional) Optional docstring describing this collection.
`_collection/spec` | [`ref`] | (optional) A multi-cardinality list of `ref`s, which reference entities in the `_fn` collection. These specs restricts what is allowed in this collection. To learn more, visit the [Collection and Predicate Specs](#collection-and-predicate-specs) section. 
`_collection/specDoc` | `string` | (optional) Optional docstring to describe the specs. Is thrown when any spec fails. 
`_collection/version` | `string` | (optional) For your optional use, if a collection's spec or intended predicates change over time this version number can be used to determine which schema version a particular application may be using.

### Creating Collections

Creating collections is done in the same way as creating any other type of subject in the database. In the below example, we create four new collections: person, chat, comment, and artist. We strongly discourage adding smart functions to your `_collection/spec` when you initially create a collection. If you would like a `_collection/spec`, you should follow [FlureeDB Best Practices](/docs/infrastructure/application-best-practices) and read the [Smart Functions](/docs/smart-functions/smart-functions) section in full to understand how to incorporate smart functions into your schema. 

```flureeql
[{
 "_id": "_collection",
 "name": "person",
 "doc": "A collection to hold all the people in our database",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "chat",
  "doc": "A collection to hold all the chats in our database",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "comment",
 "doc": "A collection to hold all the comments in our database",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "artist",
  "doc": "A collection to hold all the artists in our database",
  "version": 1 
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
 "_id": "_collection",
 "name": "person",
 "doc": "A collection to hold all the people in our database",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "chat",
  "doc": "A collection to hold all the chats in our database",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "comment",
 "doc": "A collection to hold all the comments in our database",
 "version": 1 
},
{
 "_id": "_collection",
 "name": "artist",
  "doc": "A collection to hold all the artists in our database",
  "version": 1 
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation addCollections ($myCollectionTx: JSON) {
  transact(tx: $myCollectionTx)
}

{
  "myCollectionTx": "[{\"_id\":\"_collection\",\"name\":\"person\",\"doc\":\"A collection to hold all the people in our database\",\"version\":1},{\"_id\":\"_collection\",\"name\":\"chat\",\"doc\":\"A collection to hold all the chats in our database\",\"version\":1},{\"_id\":\"_collection\",\"name\":\"comment\",\"doc\":\"A collection to hold all the comments in our database\",\"version\":1},{\"_id\":\"_collection\",\"name\":\"artist\",\"doc\":\"A collection to hold all the artists in our database\",\"version\":1}]"
}
```

```sparql
Transactions not support in SPARQL
```

### Adding a Predicate to `_collection`
`_collection` is a built-in database collection with built-in predicates. This does not mean, for instance, that you cannot add predicates. For example, you may want to add a `_collection/longDescription` predicate, where you store a longer version of `_collection/doc`. 

You can do this by adding a new predicate:

```flureeql
[{
    "_id": "_predicate",
    "name": "_collection/longDescription",
    "type": "string"
}]
```

```curl
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

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":\"_predicate\",\"name\":\"_collection/longDescription\",\"type\":\"string\"}]"
}
```

```sparql
Transactions not support in SPARQL
```

After you add this predicate, you can update any existing collections to include a long description:

```flureeql
[{
    "_id": ["_collection/name", "person"],
    "longDescription": "I have a lot to say about this collection, so this is a longer description about the person collection"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_collection/name", "person"],
    "longDescription": "I have a lot to say about this collection, so this is a longer description about the person collection"
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":[\"_collection/name\",\"person\"],\"longDescription\":\"I have a lot to say about this collection, so this is a longer description about the person collection\"}]"
}
```

```sparql
Transactions not support in SPARQL
```

Add you can create new collections with a `_collection/longDescription`:


```flureeql
[{
    "_id": "_collection",
    "name": "animal",
    "longDescription": "I have a lot to say about this collection, so this is a longer description about the animal collection"
}]
```

```curl
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

```graphql
mutation addLongDesc ($addLongDescTx: JSON) {
  transact(tx: $addLongDescTx)
}

{
  "addLongDescTx": "[{\"_id\":\"_collection\",\"name\":\"animal\",\"longDescription\":\"I have a lot to say about this collection, so this is a longer description about the animal collection\"}]"
}
```

```sparql
Transactions not support in SPARQL
```

### Updating a Predicate in `_collection`

Although you can change built-in collection predicates, we do not recommend doing so, as your changes may break certain aspects of schema validation. 

One commonly-requested safe change, however, is to allow `_collection/name` to be upsertable. By default, `_collection/name` does not allow upsert, meaning if you try to create a new collection with the name of already existing collection, an error will be thrown. You can change this, however, by editing the predicate, `_collection/name`. To see all the existing predicates for the `_collection/name` predicate, you can issue the following query:


```flureeql 
{
    "select": ["*"],
    "from": ["_predicate/name", "_collection/name"]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["*"],
    "from": ["_predicate/name", "_collection/name"]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?predicate
WHERE {
    ?predicate fd:_predicate/name "_collection/name".
}
```

The default features of `_collection` name are:

```all
{
  "_predicate/name": "_collection/name",
  "_predicate/doc": "Schema collection name",
  "_predicate/type": "string",
  "_predicate/unique": true,
  "_id": 40             // id depends on FlureeDB version
}
```

As we can see, there is no `upsert` key in the predicate, so by default upsert is false. To change this, we can issue:

```flureeql
[{
    "_id": ["_predicate/name", "_collection/name"],
    "upsert": true
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "_collection/name"],
    "upsert": true
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation addUpsert ($addUpsertTx: JSON) {
  transact(tx: $addUpsertTx)
}

{
  "addUpsertTx": "[{\"_id\":[\"_predicate/name\",\"_collection/name\"],\"upsert\":true}]"
}
```

```sparql
Transactions not support in SPARQL
```

Now, we allow upsert for the `_collection/name` predicate.