## GraphQL

Fluree supports queries and transactions using both the FlureeQL JSON format as well as GraphQL. All GraphQL queries and transactions should be run through the [hosted endpoints](/api/hosted-endpoints/endpoints#-api-db-graphql) or [downloaded endpoints](/api/downloaded-endpoints/downloaded-examples#-graphql-query) ending in `/graphql`.

GraphQL supports a more limited set of query capability, but is robust enough for many applications. Fluree's version of GraphQL supports a wide-range of GraphQL features, but not all of them. 

If you don't already know and want to use GraphQL, we definitely recommend using FlureeQL. This section is an overview of GraphQL, and highlights key differences between FlureeQL and GraphQL. Throughout the rest of the documentation, you can toggle the left sidebar to see all applicable examples in GraphQL.

Because FlureeQL is a JSON format, this allows queries to be more easily composed within your programming code and is built to support Fluree's advanced capabilities like graph recursion. 

### Queries 

Using GraphQL, you can only retrieve predicates from within the namespace that you specify. In the below example, we indicate that we are looking in the `chat` collection. 

Therefore, we can only retrieve predicates like `_id`, `message`, `person`, or `comments`, which are in the `chat` namespace. 

```all
{ graph {
  chat {
    _id
    message
  }
}
}
```

Fluree allows any reference predicate to point to any subject, regardless of collection type. 

However, in order to retrieve references using GraphQL, the `restrictCollection` property of that predicate has to be set to a valid collection. This second example retrieves not only the `_id` and `message` for each chat, but the `_id` and `handle` predicates for the `person` associated with each `chat`. 

```all
{ graph {
  chat {
    _id
    message
    person {
        _id
        handle
    }
  }
}
}
```

### Wildcards
GraphQL does not usually support the use of wildcards ( `*`), so most GraphQL interfaces will show an error when you attempt to use a wildcard. However, if you submit, the following query, the expected results will be returned.

```all
{ graph {
  person {
    *
  }
}
}
```

### Reverse References

In addition to retrieving information in a forward-direction, we can also traverse the graph backwards. 

The syntax for doing so differs from FlureeQL to GraphQL. While FlureeQL uses the format `chat/_person`, GraphQL performs the same query with `chat_Via_person`. 

Using GraphQL: 

```all
{ graph {
  person {
    chat_Via_person {
      _id
      instant
      message
    }
  }
}
}
```

Using FlureeQL
```all
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```

### Block Queries

In order to query a specific block or range of blocks in GraphQL, you need to use a specific type of block query and specify the range of blocks you would like to see. 

Querying a single block 

```all
query  {
  block(from: 3, to: 3)
}
```

Querying a range of blocks

```all
query  {
  block(from: 3, to: 5)
}
```

Querying a range of blocks starting from a lower limit

```all
query  {
  block(from: 3)
}
```

### Sort By 

GraphQL queries allow you to sort any field at any level in the graph. In order to perform a sort, you need to specify both the predicate name and whether you would like to sort the values by ascending or descending values. 

In the below example, we are sorting chat messages in alphabetical order. 

```all
{ graph {
  chat (sort: {predicate: "message", order: ASC}) {
    _id
    instant 
    message
  }
}
}
```
The below query sorts every person alphabetically by their full name, and then sorts all of their comments from oldest to newest. 

```all
{ graph {
   person (sort: {predicate: "fullName", order: ASC}) {
    fullName
    comment_Via_person (sort:{predicate: "instant", order: ASC}) {
      message
      instant
    }
  }
}
}
```

### Transactions
We can perform transactions in GraphQL by passing a variable to a GraphQL mutation. This variable should contain a JSON-formatted parcel of data without line breaks. 

As you can see in the below example, in order to add people, we store the JSON-formatted data in a variable called `myPeopleTx` and use the variable `myPeopleTx` in the mutation statement.

We also need to ensure that all `"` are escaped, like so `\"`. If you use `$` anywhere in your transaction, that also needs to be escaped. If using GraphQL for transactions, we recommend using `#` as the delimiting characters in tempids (i.e. `person#1` rather than `person$1`), as `#` does not need to be escaped. 

```all
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

{
  "myPeopleTx": "[{ \"_id\": \"person\", \"handle\": \"aSmith\", \"fullName\": \"Alice Smith\" }, { \"_id\": \"person\", \"handle\": \"aVargas\", \"fullName\": \"Alex Vargas\" }]"
}
```

If you are using the UI, you can place your variable in the "Query Variables" section on the lower left hand side of the GraphQL interface. If you are using the API, you should add a new key, "variables" to your request body and include your variables (more information in the API sections on [hosted](/api/hosted-endpoints/endpoints#-api-db-graphql) and [downloaded](/api/downloaded-endpoints/downloaded-examples#-graphql-transaction) GraphQL endpoints.

### Other Features

Fluree's version of GraphQL supports both variables (as evident in [Transactions](#transactions)) and fragments. 

We support introspection and type queries, as well. 