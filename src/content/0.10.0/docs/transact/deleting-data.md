## Deleting Data 

### Delete Subject
To delete/retract an entire subject, use the `_id` key along with only `"_action": "delete"`. This deletes (retracts) the subject all predicates. In addition, all of the references for that subject anywhere in the ledger are also retracted.

```flureeql
[{
  "_id":      ["person/handle", "zsmith"],
  "_action":  "delete"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "zsmith"],
  "_action":  "delete"
}]' \
   [HOST]/api/db/transact
```
```graphql
mutation deleteAllPredicates ($myDeleteAllPredicatesTx: JSON) {
  transact(tx: $myDeleteAllPredicatesTx)
}

{
  "myDeleteAllPredicatesTx": "[{ \"_id\": [\"person/handle\", \"zsmith\"], \"_action\": \"delete\" }]"
}
```

```sparql
Transactions not supported in SPARQL
```

### Delete Specific Predicates

To delete only specific predicate-objects within an subject, specify the key/value combinations.

You can delete (retract) a single predicate by setting the value of `_id` to a two-tuple of the predicate and predicate value, and then setting the predicate to null. `"_action": "delete"` is inferred. 

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "age":   null
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "age":   null
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation deletePredicate ($myDeletePredicateTx: JSON) {
  transact(tx: $myDeletePredicateTx)
}

{
  "myDeletePredicateTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"age\": null }]"
}
```

```sparql
Transactions not supported in SPARQL
```

### Delete Specific Multi Predicates

To delete (retract) only a single object from a multi predicate, specify the predicate-object, and add `"_action": "delete"`

For example, to delete just the number, 98, from   `["person/handle", "jdoe"]`'s favorite numbers, we would issue:

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "favNums":   [98],
  "_action":   "delete"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "favNums":   [98],
  "_action":   "delete"
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation deletefavNum ($myDeleteFavNumTx: JSON) {
  transact(tx: $myDeleteFavNumTx)
}

{
  "myDeleteFavNumTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"favNum\": [98], \"_action\": \"delete\" }]"
}
```

```sparql
Transactions not supported in SPARQL
```

To delete all of `["person/handle", "jdoe"]`'s favorite numbers, we would issue:


```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "favNums":  null
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "favNums":   null
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation deletefavNums ($myFavNumsTx: JSON) {
  transact(tx: $myFavNumsTx)
}

{
  "myFavNumsTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"favNums\": null }]"
}
```

```sparql
Transactions not supported in SPARQL
```



