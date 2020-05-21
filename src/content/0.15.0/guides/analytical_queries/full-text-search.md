## Full Text Search




### Full Text Search

You can use analytical queries to search objects of a given predicate or within a given collection. In order to do this, you first need to enable full text search on any predicates you want to be able to search. For example, we're going to enable full text search on `person/fullName`, `person/handle`, and `chat/message`. 

```flureeql
[{
    "_id": ["_predicate/name", "person/fullName"],
    "fullText": true
},
{
    "_id": ["_predicate/name", "person/handle"],
    "fullText": true
},
{
    "_id": ["_predicate/name", "chat/message"],
    "fullText": true
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "person/fullName"],
    "fullText": true
},
{
    "_id": ["_predicate/name", "person/handle"],
    "fullText": true
},
{
    "_id": ["_predicate/name", "chat/message"],
    "fullText": true
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation makeFullText ($myFullTextTx: JSON) {
  transact(tx: $myFullTextTx)
}

{
  "myFullTextTx": "[{\"_id\":[\"_predicate/name\",\"person/fullName\"],\"fullText\":true},{\"_id\":[\"_predicate/name\",\"person/handle\"],\"fullText\":true},{\"_id\":[\"_predicate/name\",\"chat/message\"],\"fullText\":true}]"
}
```

```sparql
Transactions not supported in SPARQL.
```

```

A predicate can be removed from the full-text search index (and thus from full-text search capability) at any time by simply setting `fullText` to false:

```flureeql
[{
    "_id": ["_predicate/name", "person/fullName"],
    "fullText": false
}]
```


```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "person/fullName"],
    "fullText": false
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation unmakeFullText ($myFullTextRemoveTx: JSON) {
  transact(tx: $myFullTextRemoveTx)
}

{
  "myFullTextRemoveTx": "[{\"_id\":[\"_predicate/name\",\"person/fullName\"],\"fullText\":false}]"
}
```

```sparql
Transactions not supported in SPARQL.
```

#### Note
A few things to note with full text searching:

1. The full-text search index is not guaranteed to be fully up-to-date. It may take some time for index to become synchronized.
2. Full-text search is only available for the current Fluree database. 