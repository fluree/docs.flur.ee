## Rule Example

In this section, we will create two roles, level1User and level2User, and connect each role to a person in our [Basic Schema](/docs/getting-started/basic-schema).

#### level1User

The level1User will be allowed to view all chats, edit their own chats, and view all people's handles. They will not be able to see any other information about a person.

#### level2User

The level2User will be allowed to view all chats, edit their own chats, and view all people, including people's full names, who people follow, and people's favorite artists. 

### Add Predicate: person/auth

First, we need to create a new predicate, which connects a `person` to a `_auth`. 

```flureeql
[{
  "_id":    "_predicate",
  "name":   "person/auth",
  "doc":    "Reference to a database auth.",
  "type":   "ref",
  "restrictCollection": "_auth"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -d '[{
  "_id":    "_predicate",
  "name":   "person/auth",
  "doc":    "Reference to a database auth.",
  "type":   "ref",
  "restrictCollection": "_auth"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addPersonAuthPredicates ($myPersonAuthPredicateTx: JSON) {
  transact(tx: $myPersonAuthPredicateTx)
}

{
  "myPersonAuthPredicateTx": "[
    { \"_id\": \"_predicate\", \"name\": \"person/auth\", \"doc\": \"Reference to a database auth.\", \"type\": \"ref\", \"restrictCollection\": \"_auth\" }
    ]"
}
```
```sparql
Transactions not supported in SPARQL.
```

### Add level1User Role, Rules

Next, we add the role `level1User`, which holds three rules `viewAllChats`, `viewAllPeopleHandles`, and `editOwnChats`. 

The smart function attached to `viewAllChats` and `viewAllPeopleHandles` is just a function that returns `true`, because we do not have any restrictions on viewing chats or `person/handle`. 

For `editOwnChats`, we needed to write a new function, which checks whether the subject being updated (a chat) belongs to the auth record doing the updating. 

The full function is: `(contains? (get-all (?s \"[{chat/person  [{person/auth [_id] }] }]\") [\"chat/person\" \"person/auth\" \"_id\"]) (?auth_id))`. We break it down below:

1. First, we get the chat's, `chat/person`, and retrieve that person's `person/auth`, and finally get the `_auth`'s `_id`:  `(?s \"[{chat/person  [{person/auth [_id] }] }]\")`. 
2. Then, we retrieve all (just one in this case) of the `_auth` `_id`s by again crawling the results from step 1. `(get-all [\"chat/person\" \"person/auth\" \"_id\"]) `.
3. Finally, we ask, does the set (of one) `_id` contain the `(?auth_id)` who is currently making this update. `(contains? (get-all (?s \"[{chat/person  [{person/auth [_id] }] }]\") [\"chat/person\" \"person/auth\" \"_id\"]) (?auth_id))`.

```flureeql
[
  {
    "_id": "_role",
    "id": "level1User",
    "doc": "A level 1 user. Can view all chats, edit own chats, and view other people's handles.",
    "rules": ["_rule$viewAllChats", "_rule$viewAllPeopleHandles", "_rule$editOwnChats"]
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
    "_id": "_rule$viewAllPeopleHandles",
    "id": "viewAllPeopleHandles",
    "doc": "Can view all people",
    "collection": "person",
    "predicates": ["person/handle"],
    "fns": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$editOwnChats",
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "collection": "chat",
    "predicates": ["chat/message"],
    "fns": ["_fn$ownChats"],
    "ops": ["transact"]
  },
  {
    "_id": "_fn$ownChats",
    "name": "ownChats",
    "code": "(contains? (get-all (?s \"[{chat/person  [{person/auth [_id] }] }]\") [\"chat/person\" \"person/auth\" \"_id\"]) (?auth_id))"
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
    "id": "level1User",
    "doc": "A level 1 user. Can view all chats, edit own chats, and view other people's handles.",
    "rules": ["_rule$viewAllChats", "_rule$viewAllPeopleHandles", "_rule$editOwnChats"]
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
    "_id": "_rule$viewAllPeopleHandles",
    "id": "viewAllPeopleHandles",
    "doc": "Can view all people",
    "collection": "person",
    "predicates": ["person/handle"],
    "fns": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$editOwnChats",
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "collection": "chat",
    "predicates": ["chat/message"],
    "fns": ["_fn$ownChats"],
    "ops": ["transact"]
  },
  {
    "_id": "_fn$ownChats",
    "name": "ownChats",
    "code": "(contains? (get-all (?s \"[{chat/person  [{person/auth [_id] }] }]\") [\"chat/person\" \"person/auth\" \"_id\"]) (?auth_id))"
  }
]' \
   [HOST]/transact
```

```graphql
mutation addRole ($level1RoleTx: JSON) {
  transact(tx: $level1RoleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "level1RoleTx": "[{\"_id\":\"_role\",\"id\":\"level1User\",\"doc\":\"A level 1 user. Can view all chats, edit own chats, and view other people's handles.\",\"rules\":[\"_rule$viewAllChats\",\"_rule$viewAllPeopleHandles\",\"_rule$editOwnChats\"]},{\"_id\":\"_rule$viewAllChats\",\"id\":\"viewAllChats\",\"doc\":\"Can view all chats.\",\"collection\":\"chat\",\"collectionDefault\":true,\"fns\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$viewAllPeopleHandles\",\"id\":\"viewAllPeopleHandles\",\"doc\":\"Can view all people\",\"collection\":\"person\",\"predicates\":[\"person/handle\"],\"fns\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$editOwnChats\",\"id\":\"editOwnChats\",\"doc\":\"Only allow users to edit their own chats\",\"collection\":\"chat\",\"predicates\":[\"chat/message\"],\"fns\":[\"_fn$ownChats\"],\"ops\":[\"transact\"]},{\"_id\":\"_fn$ownChats\",\"name\":\"ownChats\",\"code\":\"(contains? (get-all (?s \\\"[{chat/person  [{person/auth [_id] }] }]\\\") [\\\"chat/person\\\" \\\"person/auth\\\" \\\"_id\\\"]) (?auth_id))\"}]"
}

```
```sparql
Transactions not supported in SPARQL.
```

### Add level2User Role, Rule

Next, we add the role `level2User`, which holds three rules `viewAllChats`, `viewAllPeople`, and `editOwnChats`. 

We've already created the rules, `viewAllChats` and `editOwnChats`, so we just need to use a unique two-tuple to reference them in the `level2User`. 

We will need to create the new rule, `viewAllPeople`. 

```flureeql
[
  {
    "_id": "_role",
    "id": "level2User",
    "doc": "A level 2 user. Can view all chats, edit own chats, and view all people.",
    "rules": [["_rule/id", "viewAllChats"], ["_rule/id", "editOwnChats"], "_rule$viewAllPeople"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people.",
    "collection": "person",
    "collectionDefault": true,
    "fns": [["_fn/name", "true"]],
    "ops": ["query"]
  }
]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -d '[
  {
    "_id": "_role",
    "id": "level2User",
    "doc": "A level 2 user. Can view all chats, edit own chats, and view all people.",
    "rules": [["_rule/id", "viewAllChats"], ["_rule/id", "editOwnChats"], "_rule$viewAllPeople"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people.",
    "collection": "person",
    "collectionDefault": true,
    "fns": [["_fn/name", "true"]],
    "ops": ["query"]
  }
]' \
   [HOST]/transact
```

```graphql
mutation addRole ($level2RoleTx: JSON) {
  transact(tx: $level2RoleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "level1RoleTx": "[{\"_id\":\"_role\",\"id\":\"level2User\",\"doc\":\"A level 2 user. Can view all chats, edit own chats, and view all people.\",\"rules\":[[\"_rule/id\",\"viewAllChats\"],[\"_rule/id\",\"editOwnChats\"],\"_rule$viewAllPeople\"]},{\"_id\":\"_rule$viewAllPeople\",\"id\":\"viewAllPeople\",\"doc\":\"Can view all people.\",\"collection\":\"person\",\"collectionDefault\":true,\"fns\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]}]"
}

```

```sparql
Transactions not supported in SPARQL.
```

### Create Auths, Connect to Roles and People

In order for the people to sign their own transactions and queries, we need to create auth records. Unless we are using [authorities](/docs/identity/auth-records#authority), the `_auth/id` for each auth record needs to be connected to a [public-private key pair](/docs/identity/public-private-keys#auth-id).

There are several different ways to [generate public-private key/auth id triples](/docs/identity/public-private-keys#generating-a-public-private-key-auth-id-triple), and you can either choose to use your own or follow along with the ones provided in our example. Note that if you are using this is a real application, you should create your own. 

Public/Private Key and Account Id (`_auth/id`) for `_auth$jdoe`.

```all
Private: 1787cab58d5b146a049f220c975d5dce7904c63f25d6d834d6980c427b47f412
Public: 0354298fc55b70e0f3650e746ed29b595e5686191bccafdda8f00367776449b585
Account id: TfKYG5F5iCsii1JvGGY2Pv6bPVVbZ2ERjmJ
```

Public/Private Key and Account Id (`_auth/id`) for `_auth$zsmith`.

```all
Private: 78f2ee93ef8008a270ffad949799462474f44c1ee8b29f07ec4fe1ae965b92c
Public: 02528d8f7a893059921bd53e2d743ca4d098c684d1d4677a63d1f74f27a80f1c01
Account id: TfDXiujCGLz3znzfkr7YRH4ewJoHEKUtqSf
```

Now, we'll create the auth records and connect them to both the relevant roles and people. `jdoe` will be a level 1 user, and `zsmith` will be level 2. 

```flureeql
[
  {
    "_id": ["person/handle", "jdoe"],
    "auth": "_auth$jdoe"
  },
  {
    "_id": "_auth$jdoe",
    "id": "TfKYG5F5iCsii1JvGGY2Pv6bPVVbZ2ERjmJ",
    "doc": "Jdoe's auth record",
    "roles": [["_role/id", "level1User"]]
  },
  {
    "_id": ["person/handle", "zsmith"],
    "auth": "_auth$zsmith"
  },
  {
    "_id": "_auth$zsmith",
    "id": "TfDXiujCGLz3znzfkr7YRH4ewJoHEKUtqSf",
    "doc": "Zsmith's auth record",
    "roles": [["_role/id", "level2User"]]
  }
]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -d '[
  {
    "_id": ["person/handle", "jdoe"],
    "auth": "_auth$jdoe"
  },
  {
    "_id": "_auth$jdoe",
    "id": "TfKYG5F5iCsii1JvGGY2Pv6bPVVbZ2ERjmJ",
    "doc": "Jdoe's auth record",
    "roles": [["_role/id", "level1User"]]
  },
  {
    "_id": ["person/handle", "zsmith"],
    "auth": "_auth$zsmith"
  },
  {
    "_id": "_auth$zsmith",
    "id": "TfDXiujCGLz3znzfkr7YRH4ewJoHEKUtqSf",
    "doc": "Zsmith's auth record",
    "roles": [["_role/id", "level2User"]]
  }
]' \
   [HOST]/transact
```

```graphql
mutation addUserAuth($myUserAuthTx: JSON){
  transact(tx: $myUserAuthTx)
}

{
  "myUserAuthTx": "[{\"_id\":[\"person/handle\",\"jdoe\"],\"auth\":\"_auth$jdoe\"},{\"_id\":\"_auth$jdoe\",\"id\":\"TfKYG5F5iCsii1JvGGY2Pv6bPVVbZ2ERjmJ\",\"doc\":\"Jdoe's auth record\",\"roles\":[[\"_role/id\",\"level1User\"]]},{\"_id\":[\"person/handle\",\"zsmith\"],\"auth\":\"_auth$zsmith\"},{\"_id\":\"_auth$zsmith\",\"id\":\"TfDXiujCGLz3znzfkr7YRH4ewJoHEKUtqSf\",\"doc\":\"Zsmith's auth record\",\"roles\":[[\"_role/id\",\"level2User\"]]}]"
}
```

```sparql
Transactions not supported in SPARQL.
```

### Testing Our Rules

If [`fdb-api-open`](/docs/getting-started/installation#config-options) is set to true, then that means that all queries are performed as a root auth. This means that any signatures in your queries will be ignored, and thus hyou will not be able to test the permissioned queries. In the hosted version, you cannot change this option. 

If you are using the downloaded FlureeDB, and then you can stop your server, change the `fdb-api-open` setting, and you will be able to test out the signed queries. 

Regardless of whether you are running the hosted or the downloaded version, you will still be able to test all the signed transactions.  

<!-- #### Testing The Level 1 Roles

A level1User should be allowed to view all chats, edit their own chats, and view all people's handles. They should not be able to see any other information. 



Jdoe -> 

Private: 1787cab58d5b146a049f220c975d5dce7904c63f25d6d834d6980c427b47f412
Public: 0354298fc55b70e0f3650e746ed29b595e5686191bccafdda8f00367776449b585
Account id: TfKYG5F5iCsii1JvGGY2Pv6bPVVbZ2ERjmJ

-> does NOT work as expected

{
  "select": ["*"],
  "from": "chat"
}

-> works, as expected

{
  "select": ["*"],
  "from": "person"
}




zsmith ->

Private: c0588115314065f7949f87f0f6adda3a252105be89b5080c56bb889cd20d841f
Public: 035ad063cc993901f5db216d579a69443392ce7b32321be3be7c9deed1d4d4849b
Account id: TfFzb1tZDkGMBqWr8xMmRVvYmNYFKH9aNpi -->