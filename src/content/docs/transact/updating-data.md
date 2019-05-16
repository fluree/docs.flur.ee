## Updating Data

### Updating Data
In order to update data, you can reference an existing subject by using its `_id` or, for any predicate marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`. Predicates that you wish to update should be included as key-value pairs. 

When referencing an existing subject,  `"_action": "update"` is inferred. Note: When updating and upserting, you can use [nested transactions](/docs/transact/adding-data#nested-transactions).

Update using a two-tuple with a unique predicate. i.e. `person/handle` and relevant object:  

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated"
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation updatePerson($myUpdatePersonTx: JSON) {
  transact(tx: $myUpdatePersonTx)
}

{
  "myUpdatePersonTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"fullName\": \"Jane Doe Updated\" }]"
}
```

```sparql
Transactions not supported in SPARQL
```

<br/>

Update using subject id: 
```flureeql
[{
  "_id":      351843720888321,
  "fullName": "Jane Doe Updated By Numeric _id"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      351843720888321,
  "fullName": "Jane Doe Updated By Numeric _id"
}]' \
  [HOST]/api/db/transact
```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{ \"_id\": 351843720888321, \"fullName\": \"Jane Doe Updated By Numeric _id\" }]"
}
```

```sparql
Transactions not supported in SPARQL
```

### Upserting Data

When a transaction with a tempid resolves to an existing subject, `"_action": "upsert"` is inferred. This is only applicable to predicates marked as unique. By default the transaction will throw an exception if a conflict with a unique predicate exists.

If "person/handle" is marked as unique and `["person/handle", "jdoe"]` is already in our database, this transaction will simply update `["person/handle", "jdoe"]`. If `["person/handle", "jdoe"]` is not yet in the database, it will add the new subject.  

```flureeql
[{
  "_id":      "person",
  "handle":   "jdoe"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "person",
  "handle": "jdoe"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{ \"_id\": \"person\", \"handle\": \"jdoe\" }]"
}
```

```sparql
Transactions not supported in SPARQL
```