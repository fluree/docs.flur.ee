## Rule Example

In this section, we will create a chatUser role and connect it to user in our [Basic Schema](/docs/getting-started/basic-schema).

### Add Predicate: person/user

First, we need to create a new predicate, which connects a `person` to a `_user`. 

```flureeql
[{
  "_id":    "_predicate",
  "name":   "person/user",
  "doc":    "Reference to a database user.",
  "type":   "ref",
  "restrictCollection": "_user"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "_predicate",
  "name":   "person/user",
  "doc":    "Reference to a database user.",
  "type":   "ref",
  "restrictCollection": "_user"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addDBUserPredicates ($myDBUserPredicateTx: JSON) {
  transact(tx: $myDBUserPredicateTx)
}

{
  "myDBUserPredicateTx": "[
    { \"_id\": \"_predicate\", \"name\": \"person/user\", \"doc\": \"Reference to a database user.\", \"type\": \"ref\", \"restrictCollection\": \"_user\" }
    ]"
}
```
```sparql
Transactions not supported in SPARQL.
```

### Add Role, Rules

Next, we add a role, `chatUser`, which is there to hold three rules: `viewAllChats`, `viewAllPeople`, and `editOwnChats`. The smart function attached to `viewAllChats` and `viewAllPeople` is just a function that returns `true`, because we do not have any restrictions on viewing chats or people. For `editOwnChats`, we needed to write a new function, which checks whether the subject being updated (a chat) belongs to the person doing the updating (a user). 

The full function is: `(contains? (get-all [\"chat/person\" \"person/user\" \"_id\"]) (?user_id))`. We break it down below:

1. First, we get the chat's, `chat/person`, and retrieve that person's `person/user`, and finally get the `_user`'s `_id`:  `(?s \"[{chat/person  [{person/user [_id] }]\")`. 
2. Then, we retrieve all (just one in this case) of the `_user` `_id`s by again crawling the results from step 1. `(get-all [\"chat/person\" \"person/user\" \"_id\"]) `
3. Finally, we ask, does the set (of one) `_id` contain the `(?user_id)` who is currently making this update. `(contains? (get-all [\"chat/person\" \"person/user\" \"_id\"]) (?user_id))`

```flureeql
[
  {
    "_id": "_role",
    "id": "chatUser",
    "doc": "A standard chat user role",
    "rules": ["_rule$viewAllChats", "_rule$viewAllPeople", "_rule$editOwnChats"]
  },
  {
    "_id": "_rule$viewAllChats",
    "id": "viewAllChats",
    "doc": "Can view all chats.",
    "collection": "chat",
    "collectionDefault": true,
    "fns": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "collection": "person",
    "collectionDefault": true,
    "fns": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$editOwnChats",
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "collection": "chat",
    "predicates": ["chat/message"],
    "fns": ["_fn$editOwnChats"],
    "ops": ["transact"]
  },
  {
    "_id": "_fn$editOwnChats",
    "name": "editOwnChats",
    "code": "(contains? (get-all (?s \"[{chat/person  [{person/user [_id] }]\") [\"chat/person\" \"person/user\" \"_id\"]) (?user_id))"
  }
]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[
  {
    "_id": "_role",
    "id": "chatUser",
    "doc": "A standard chat user role",
    "rules": ["_rule$viewAllChats", "_rule$viewAllPeople", "_rule$editOwnChats"]
  },
  {
    "_id": "_rule$viewAllChats",
    "id": "viewAllChats",
    "doc": "Can view all chats.",
    "collection": "chat",
    "collectionDefault": true,
    "fns": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "collection": "person",
    "collectionDefault": true,
    "fns": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$editOwnChats",
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "collection": "chat",
    "predicates": ["chat/message"],
    "fns": ["_fn$editOwnChats"],
    "ops": ["transact"]
  },
  {
    "_id": "_fn$editOwnChats",
    "name": "editOwnChats",
    "code": "(contains? (get-all (?s \"[{chat/person  [{person/user [_id] }]\") [\"chat/person\" \"person/user\" \"_id\"]) (?user_id))"
  }
]' \
   [HOST]/transact
```

```graphql
mutation addRole ($myRoleTx: JSON) {
  transact(tx: $myRoleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myRoleTx": "[{\"_id\":\"_role\",\"id\":\"chatUser\",\"doc\":\"A standard chat user role\",\"rules\":[\"_rule$viewAllChats\",\"_rule$viewAllPeople\",\"_rule$editOwnChats\"]},{\"_id\":\"_rule$viewAllChats\",\"id\":\"viewAllChats\",\"doc\":\"Can view all chats.\",\"collection\":\"chat\",\"collectionDefault\":true,\"fns\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$viewAllPeople\",\"id\":\"viewAllPeople\",\"doc\":\"Can view all people\",\"collection\":\"person\",\"collectionDefault\":true,\"fns\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$editOwnChats\",\"id\":\"editOwnChats\",\"doc\":\"Only allow users to edit their own chats\",\"collection\":\"chat\",\"predicates\":[\"chat/message\"],\"fns\":[\"_fn$editOwnChats\"],\"ops\":[\"transact\"]},{\"_id\":\"_fn$editOwnChats\",\"name\":\"editOwnChats\",\"code\":\"(contains? (get-all (s \\\"[{chat/person  [{person/user [_id] }]\\\") [\\\"chat/person\\\" \\\"person/user\\\" \\\"_id\\\"]) (?user_id))\"}]"
}

```
```sparql
Transactions not supported in SPARQL.
```

### Add User, Auth

For now, that role is not attached to any users, so we can add a new user, a new auth record, and attach the `_auth` record to the `_user`, and reference the `_user` in `person/user`.  

```flureeql
[
  {
    "_id":    "_user$jdoe",
    "username": "jdoe",
    "auth": ["_auth$jdoe"]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": "_user$jdoe"
  },
  {
    "_id": "_auth$jdoe",
    "id": "jdoe",
    "doc": "Jdoe's auth record",
    "roles": [["_role/id", "chatUser"]],
  }
]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[
  {
    "_id":    "_user$jdoe",
    "username": "jdoe",
    "auth": ["_auth$jdoe"]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": "_user$jdoe"
  },
  {
    "_id": "_auth$jdoe",
    "id": "jdoe",
    "doc": "Jdoe's auth record",
    "roles": [["_role/id", "chatUser"]],
  }
]' \
   [HOST]/transact
```

```graphql
mutation addUserAuth($myUserAuthTx: JSON){
  transact(tx: $myUserAuthTx)
}

{
  "myUserAuthTx": "[{\"_id\":\"_user$jdoe\",\"username\":\"jdoe\",\"auth\":[\"_auth$jdoe\"]},{\"_id\":[\"person/handle\",\"jdoe\"],\"user\":\"_user$jdoe\"},{\"_id\":\"_auth$jdoe\",\"id\":\"jdoe\",\"doc\":\"Jdoe's auth record\",\"roles\":[[\"_role/id\",\"chatUser\"]]}]"
}
```

```sparql
Transactions not supported in SPARQL.
```