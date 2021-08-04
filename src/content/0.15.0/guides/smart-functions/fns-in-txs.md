## Functions in Transactions

Smart functions can also be used directly in transaction to derive a particular value. The role of smart functions directly used in transactions is to derive objects NOT to accept/reject transactions.

To use smart functions directly in transactions, we need to put our code inside of a string, and prefix the code with a `#`. 

For example, to add ", Sr." to the end of a person's full name, we can use two built-in smart functions, `str` and `?pO`. `str` concatenates strings, and `?pO` retrieves the previous object. In this case, we expect the final object of `person/fullName` to be `Jane Doe, Sr.`.

```flureeql
[{
  "_id": ["person/handle", "jdoe"],
  "fullName": "#(str (?pO) \", Sr.\")"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": ["person/handle", "jdoe"],
  "fullName": "#(str (?pO) \", Sr.\")"
}]' \
   [HOST]/api/db/transact
```
```graphql
mutation addSr ($addSrTx: JSON) {
  transact(tx: $addSrTx)
}

{
  "addSrTx": "[{\"_id\":[\"person/handle\",\"jdoe\"],\"fullName\":\"#(str (?pO) \\\", Sr.\\\")\"}]"
}
```

```sparql
Transactions not supported in SPARQL
```
