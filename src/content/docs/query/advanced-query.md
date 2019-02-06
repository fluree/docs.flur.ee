## Advanced Query

In this section, we show you different advanced query capabilities. 

Different query types in this section should be issued to different API endpoints. View the `CURL` versions of the examples to see the proper endpoint for each query type.

### Crawling the Graph

Subjects refer (join) to other subjects via any predicate that is of type `ref`. Every `ref` predicate relationship can be traversed, and can be done so in both directions -- forward and reverse.

For a forward traversal example, note our predicate `chat/person` which is of type `ref` and refers to a person subject. When we select, `*` from `chat`, the results that return only show us the subject id from `chat/person`, they don't automatically crawl the graph to get more information about the `person`.

In order to also include the person details, we add to our select cause with a sub-query within our original query. This new query would look like:

```flureeql
{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}' \
   [HOST]/api/db/query
```

```graphql
{ graph {
  chat {
    _id
    instant
    message
    person {
      _id
      fullName
      handle
    } 
  }
}
}
```

```sparql
 SELECT ?chat ?message ?person ?instant ?fullName ?handle
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/person   ?person;
            fd:chat/instant  ?instant.
    ?person fd:person/fullName ?fullName;
            fd:person/handle ?handle.
 }
 ```

In FlureeQl, this syntax is declarative and looks like the shape of the data you want returned. These sub-queries can continue to whatever depth of the graph you'd like, and for as many ref predicates as you like. Circular graph references are fine and are embraced.

### Crawling the Graph, in Reverse

As mentioned, these relationships can also be traversed in reverse. If instead of listing the person for every chat, what if we wanted to find all chats for a  person? Instead of selecting from `chat`, lets select from `person` and follow the same `chat/person` predicate but in the reverse direction. This query looks like: 

```flureeql
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
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
```sparql
 SELECT ?person ?fullName ?handle ?chat ?message ?instant 
 WHERE {
    ?person fd:person/fullName ?fullName;
            fd:person/handle    ?handle;
            fd:chat/_person   ?chat.
    ?chat   fd:chat/message  ?message;
            fd:chat/instant  ?instant.
 }
```

In FlureeQl and SPARQL, note the underscore `_` that was added to `chat/person`, making it instead `chat/_person`. In GraphQL, note `chat_Via_person`.

This special syntax indicates the same relationship, but in reverse. You'll now see all people, with all their chat messages.

For fun, you can add another sub-query to follow the chat message back to the person. Even though in this case it is redundant, and circular, Fluree exists happily in this paradox: 


```flureeql
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/_person": ["*", {"chat/person": ["*"]}]}
  ],
  "from": "person"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
{ graph {
  person {
    chat_Via_person {
      _id
      instant
      message
      person {
          _id
          fullName
          handle
      }
    }
  }
}
}
```
```sparql
 SELECT ?person ?fullName ?handle ?chat ?message ?instant ?personChat
 WHERE {
    ?person fd:person/fullName ?fullName;
            fd:person/handle    ?handle;
            fd:person/chat      ?personChat
            fd:chat/_person   ?chat.
    ?chat   fd:chat/message  ?message;
            fd:chat/instant  ?instant.
 }
```

### Sub-Selection Options
Within a given select statement, there may be multiple nested select statements in the FlureeQL syntax. GraphQL, by design, is entirely comprised of nested statements. For example in the FlureeQL statement: 

```all
"select": ["*", {"chat/_person": ["*"]}]
```
The nested select, or sub-select, statement is:

```all
{"chat/_person": ["*"]}
```

In both FlureeQL and GraphQL, You can optionally add an additional map of specification to a given sub-select. 

**In FlureeQL**

This map should be listed in the array, alongside either that wildcard `*` or the list of predicates you would like returned. For example, if we wanted to limit the number of chats returned per person, we could specify: `{"chat/_person": ["*", {"_limit": 10}]}`

Available options for sub-select statements are:

Key | Description
-- | -- 
`_limit` | Limit (integer) of results to include.
`_recur` | Number of times (integer) to follow a relationship. See [Recursion](#recursion).
`_component` | Whether to automatically crawl the graph for component entities. Overrides the top-level option. 
`_as` | An alternate name for the predicate that is being referenced.

**In GraphQL** 

Simply list the options inside of parentheses immediately after the chosen predicate. For example, we can limit the `chat_Via_person` predicates to only show 10 chats (in GraphQL, reverse references use _Via_ rather than /_). 

Note that in GraphQL, the options do not have a leading underscore. In GraphQL, the options that you can include are: 

Key | Description
-- | -- 
`limit` | Limit (integer) of results to include.
`recur` | Number of times (integer) to follow a relationship. See [Recursion](#recursion)

```flureeql
{ 
  "select": {"chat/_person": ["*", {"_limit": 10}]},
  "from": "person"
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{ 
  "select": {"chat/_person": ["*", {"_limit": 10}]},
  "from": "person"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  person {
    _id
    handle
    chat_Via_person (limit: 10) {
      instant
      message
      comments {
        message
      }
    }
  }
}}
```

```sparql
Not supported
```


### Recursion

Recur is a sub-select option, which uses recursion to follow `ref` predicates that reference another subject in the same collection. For example, in the [Basic Schema](/docs/getting-started/basic-schema), we have a predicate, `person/follows`, which is a `ref` that points to another person. 

Normally, if we want to query who a person follows, we would submit this query. 

```flureeql
{
    "select":["*", {"person/follows": ["*"]}],
    "from":"person"
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select":["*", {"person/follows": ["*"]}],
    "from":"person"
}' \
   [HOST]/api/db/query
```

```graphql
{ graph {
  person {
    _id
    handle
    fullName
    follows {
        _id

      }
    }
  }
}}
```

```sparql
 SELECT ?person ?instant ?fullName ?handle ?follows
 WHERE {
    ?person fd:person/fullName ?fullName;
            fd:person/handle ?handle.
            fd:person/follows ?follows.
 }
```
However, if you want to keep following the `person/follows` relationship, we can specify the number of times we want to follow the given relationship in the following manner:

```flureeql
{
    "select":["*", {"person/follows": ["*", {"_recur": 10}]}],
    "from":"person"
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select":["*", {"person/follows": ["*", {"_recur": 10}]}],
    "from":"person"
}' \
   [HOST]/api/db/query
```

```graphql
{ graph {
  person {
    _id
    handle
    fullName
    follows (recur: 10) {
        _id

      }
    }
  }
}}
```

```sparql
Not supported
```

The results will only return recursions for as long as their new information in a given recursion. For example, the result of the above query only returns a recursion that is two entities deep. This is because after we follow the `person/follows` relationship twice (in this given example), it will start returning the same information.

### Multiple Queries

FlureeQL allows you to submit multiple queries at once. In order to do this, create unique names for your queries, and set those as the keys of the your JSON query. The values of the keys should be the queries themselves. If you are using GraphQL, you can simply nest your second, third, etc requests within the `graph` level of the request.

For example, this query selects all chats and people at once. 

```flureeql
{
    "chatQuery": {
        "select": ["*"],
        "from": "chat"
    },
    "personQuery": {
         "select": ["*"],
        "from": "person"
    }
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"chatQuery": {"select": ["*"],"from": "chat"},"personQuery": {"select": ["*"],"from": "person"}}' \
   [HOST]/api/db/multi-query
```

```graphql
{ graph {
  chat {
    _id
    comments {
      message
    }
    instant
    message
  }  
  person {
    _id
    handle
    fullName
  }
}
}
```

```sparql
# Although you can submit the below query in SPARQL, unconnected groups of triples will simply return all permutations of grouped results, i.e. every chat will be returned with every person. 

 SELECT ?chat ?message ?instant ?person ?handle ?fullName
 WHERE {
    ?chat   fd:chat/message  ?message;
            fd:chat/instant  ?instant.
    ?person fd:person/fullName ?fullName;
            fd:person/handle ?handle.
 }

```


Any errors will be returned in a separate key, called errors. For example, incorrectQuery is attempting to query an id that does not exist. 

```all
{
    "incorrectID": {
        "select": ["*"],
        "from": 4307852198904
    },
    "personQuery": {
         "select": ["*"],
        "from": "person"
    }
}
```

In FlureeQL, the response will have the error type for incorrectID listed under the key errors.

```flureeql
{
  "errors": {
    "incorrectID": "db/invalid-subject"
  },
  "result": {
    "person": [
      {
        "_id": 4303557230594,
        "person/handle": "zsmith",
        "person/fullName": "Zach Smith",
        "person/karma": 5
      },
      ...
    ]
  },
  "status": 207,
  "block": 463,
  "time": "5.64ms"
}
```
