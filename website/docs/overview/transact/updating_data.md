# Updating Data

## Updating {#updating}

In order to update data, you can reference an existing subject by using its `_id` or, for any predicate marked as unique as a two-tuple, i.e. `["_user/username", "dsanchez"]`. Predicates that you wish to update should be included as key-value pairs.

When referencing an existing subject,  `"_action": "update"` is inferred. Note: When updating and upserting, you can use [nested transactions](/overview/transact/adding_data.md#nested-transactions).

Update using a two-tuple with a unique predicate. i.e. `person/handle` and relevant object:  

```flureeql
[{
  "_id":      ["person/handle", "dsanchez"],
  "age": 71
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "dsanchez"],
  "age": 71
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation updatePerson($myUpdatePersonTx: JSON) {
  transact(tx: $myUpdatePersonTx)
}

{
  "myUpdatePersonTx": "[{\"_id\":[\"person/handle\",\"dsanchez\"],\"age\":71}]"
}
```

```sparql
Transactions not supported in SPARQL
```

Update using subject id:

```flureeql
[{
  "_id":      351843720888324,
  "age": 71
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      351843720888324,
  "age": 71
}]' \
  [HOST]/api/db/transact
```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{\"_id\":351843720888324,\"age\":71}]"
}
```

```sparql
Transactions not supported in SPARQL
```

## Upserting {#upserting}

You can upsert data if you have a unique predicate marked, `"upsert": true`. In this case, when a transaction with a tempid resolves to an existing subject, `"_action": "upsert"` is inferred.

We can make `person/handle` a upsertable predicate with the following

```all
[{
    "_id": ["_predicate/name", "person/handle"],
    "upsert": true
}]
```

After issuing the above transaction, we can issue the below transaction, which will just update jdoe's age, rather than creating a new person.

```flureeql
[{
  "_id":      "person",
  "handle":   "jdoe",
  "age":      26
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      "person",
  "handle":   "jdoe",
  "age":      26
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{\"_id\":\"person\",\"handle\":\"jdoe\",\"age\":26}]"
}
```

```sparql
Transactions not supported in SPARQL
```
