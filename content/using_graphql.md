# Using GraphQL

## GraphQL

Fluree supports queries and transactions using both the FlureeQL JSON format as well as GraphQL. Because FlureeQL is a JSON format, this allows queries to be more easily composed within your programming code and is built to support Fluree's advanced capabilities like graph recursion. 

GraphQL supports a more limited set of query capability, but is robust enough for many applications. If you don't already know and want to use GraphQL, we definitely recommend using FlureeQL.

The following sections outline key differences when using GraphQL.

## GraphQL Queries 

Using GraphQL, you can only retrieve attributes from within the namespace that you specify. In the below example, we indicate that we are looking in the `chat` stream. 

Therefore, we can only retrieve attributes like `_id`, `message`, `person`, or `comments`, which are in the `chat` namespace. 

```
{ graph {
  chat {
    _id
    message
  }
}
}
```

Fluree allows any reference attribute to point to any entity, regardless of stream type. 

However, in order to retrieve references using GraphQL, the `restrictStream` property of that attribute has to be set to a valid stream. This second example retrieves not only the `_id` and `message` for each chat, but the `_id` and `handle` attributes for the `person` associated with each `chat`. 

```
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
GraphQL does not support the use of wildcards ( `*`). When performing a query using GraphQL, you need to list all of the attributes you would like included in the response.

In the below example, we are retrieving the `_id` and `handle` attributes from the `person` stream.  

```
{ graph {
  person {
    _id
    handle
  }
}
}
```

### Reverse References

In addition to retrieving information in a forward-direction, we can also traverse the graph backwards. 

In the previous section, we requested every person attribute associated with a chat. If we wanted to travel the graph in reverse, we could query people and retrieve information about the chats they have made.

The syntax for doing so differs from FlureeQL to GraphQL. While FlureeQL uses the format `chat/_person`, GraphQL performs the same query with `chat_Via_person`. 

Using GraphQL: 
```
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
```
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

```
query  {
  block(from: 3, to: 3)
}
```

Querying a range of blocks

```
query  {
  block(from: 3, to: 5)
}
```

Querying a range of blocks starting from a lower limit

```
query  {
  block(from: 3)
}
```

## GraphQL Transactions
We can perform transactions in GraphQL by passing a variable to a GraphQL mutation. This variable should contain a JSON-formatted parcel of data without line breaks. 

As you can see in the below example, in order to add people, we store the JSON-formatted data in a variable called `myPeopleTx` and use the variable `myPeopleTx` in the mutation statement.

We also need to ensure that all `"` are escaped, like so `\"`.

```
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

{
  "myPeopleTx": "[{ \"_id\": [\"person\", -1], \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, { \"_id\": [\"person\", -2], \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

If you are using the UI, you can place your variable in the "Query Variables" section on the lower left hand side of the GraphQL interface.