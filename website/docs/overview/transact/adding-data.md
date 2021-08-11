# Adding Data

In order to add data, you must use a [temporary id](/docs/transact/basics#temporary-ids), i.e. `"chat$1"`. In this case, `"_action": "add"` is inferred. Any predicates that you wish to add to this subject should be included as key-value pairs.

The keys can contain the full predicate name including the namespace, i.e. `chat/message` or you can leave off the namespace if it is the same as the collection the subject is within. i.e. when the subject is within the `chat` collection, just `message` can be used which is translated to `chat/message` by Fluree.

```flureeql
[{
  "_id":      "person",
  "handle":   "oRamirez",
  "fullName": "Oscar Ramirez"
},
{
  "_id":      "person",
  "handle":   "cStuart",
  "fullName": "Chana Stuart"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      "person",
  "handle":   "oRamirez",
  "fullName": "Oscar Ramirez"
},
{
  "_id":      "person",
  "handle":   "cStuart",
  "fullName": "Chana Stuart"
}]' \
   [HOST]/fdb/[NETWORK]/[LEDGER]/transact  
```

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"oRamirez\", \"fullName\": \"Oscar Ramirez\" }, 
    { \"_id\": \"person\", \"handle\": \"cStuart\", \"fullName\": \"Chana Stuart\" }]"
}
```

```sparql
Transactions not supported in SPARQL
```

## Nested Transactions {#nested-transactions}

If you are updating or creating a new subject, for example a new chat and that chat contains a reference to a new subject, such as the `chat/person`, then you can use two transactions: one to create the chat, and the second to create the person.

FlureeQL example:

```all
[{
  "_id":     "chat",
  "message": "This is my first comment ever! So smart.",
  "person":  "person$alana",
  "instant": "#(now)"
},
{
  "_id":    "person$alana",
  "handle": "adean",
  "fullName": "Alana Dean"
}]

```

Alternatively, you can nest transactions by simply declaring the new person directly within the chat transaction.

FlureeQL example:

```all
[{
  "_id":     "chat",
  "message": "I have something to say!",
  "person":  {
    "_id":    "person$bBolton",
    "handle": "bbolton",
    "fullName": "Bob Bolton"
    },
  "instant": "#(now)"
}]
```
