### QuickStart

This quickstart includes sample transactions to quickly set up and query a database.

\# | Topic
-- | -- 
1 | [Creating Schema - Collections](#creating-schema---collections)
2 | [Creating Schema - Attributes](#creating-schema---attributes)
3 | [Transacting Data](#transacting-data) 
4 | [Querying Data](#querying-data)
5 | [Permissions Introduction](#permissions-introduction)


### Creating Schema - Collections

First make sure you are logged in. The default username is `test` and password: `fluree`. Now, you can create a new database named whatever you like as long as it follows the pattern of `account.dbname`, i.e. `test.one`.

Fluree schema consists of collections and attributes. These are similar to a relational database's tables and columns, however in Fluree both of these concepts are extended and more flexible. Collections organize changes about a type of entity, i.e. customers, invoices, employees. So if you have a new entity type, you'd create a new collection to hold it. Collections differ from tables in that they are an always-present collection of changes about those entities that can be queried at any point in time, not just the latest changes as a traditional database would do.

Everything is data in Fluree. This includes the schemas, permissions, etc. that actually govern how it works. To add new collections we'll do a transaction the exact way we'd add any new data. Here we'll add our new collections and attributes in two separate transactions to explain what is happening, but they could be done in one.

This transaction adds three collections:

- `person` - will hold names/handles for the people that are chatting
- `chatMessage` - will hold the chat message content
- `chatComment` - will hold comments about messages

Here we use a tempid as we are creating new entities in the system collection named `_collection`. `_collection` is a system collection/table that holds the configured collections, and `_attribute` likewise for attributes.

#### Collection schema transaction

```flureeql
[{
 "_id": "_collection",
 "name": "person",
 "doc": "A collection/table to hold our people",
 "version": "1"
},
{
 "_id": "_collection",
 "name": "chat",
 "doc": "A collection/table to hold chat messages",
 "version": "1"
},
{
 "_id": "_collection",
 "name": "comment",
 "doc": "A collection/table to hold comments to chat messages",
 "version": "1"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":     "_collection",
  "name":    "person",
  "doc":     "A collection/table to hold our people",
  "version": "1"
},
{
  "_id":     "_collection",
  "name":    "chat",
  "doc":     "A collection/table to hold chat messages",
  "version": "1"
},
{
  "_id":     "_collection",
  "name":    "comment",
  "doc":     "A collection/table to hold comments to chat messages",
  "version": "1"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addCollections ($myCollectionTx: JSON) {
  transact(tx: $myCollectionTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myCollectionTx": "[{\"_id\": \"_collection\", \"name\": \"person\", \"doc\": \"A collection/table to hold our people\", \"version\": \"1\"},{ \"_id\": \"_collection\", \"name\": \"chat\", \"doc\": \"A collection/table to hold chat messages\", \"version\": \"1\"},{ \"_id\": \"_collection\", \"name\": \"comment\", \"doc\": \"A collection/table to hold comments to chat messages\", \"version\": \"1\"}]"
}

```


### Creating Schema - Attributes

Schema attributes are similar to relational database columns, however there are fewer restrictions.
Any attribute can be attached to any entity, unless a restriction is put in place using a `spec`.

The transaction sample here adds the following attributes:

People
- `person/handle` - The person's unique handle. Being marked as `unique`, it can be used as an `_id` in subsequent queries or transactions.
- `person/fullName` - The person's full name. Because it is marked as `index`, it can be used in `where` clauses.

Chats
- `chat/message` - The actual message content.
- `chat/person` - A reference to the person that made this chat (a join), and because it is a join that refers to a different entity, its `type` is marked as `ref` .
- `chat/instant` - The instant this chat message happened. Its `type` is `instant` and is indexed with `index` which
will allow range queries on this attribute.
- `chat/comments` - Comments about this message, which are also joins (`ref`). `multi` indicates multiple comments can be stored, and `component` indicates these referenced comment entities should be treated as part of this parent, and if the parent (in this case the chat message) is deleted, the comments will also be deleted.

Comments
- `comment/message` - A comment message.
- `comment/person` - A reference to the person who made the comment (a join).

#### Attribute schema transaction

```flureeql
[{
  "_id":    "_attribute",
  "name":   "person/handle",
  "doc":    "The person's unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   "_attribute",
  "name":  "person/fullName",
  "doc":   "The person's full name.",
  "type":  "string",
  "index": true
},
{
  "_id":  "_attribute",
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "string"
},
{
  "_id":  "_attribute",
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id":   "_attribute",
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "instant",
  "index": true
},
{
  "_id":       "_attribute",
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "ref",
  "component": true,
  "multi":     true,
  "restrictCollection": "comment"
},
{
  "_id":  "_attribute",
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "string"
},
{
  "_id":  "_attribute",
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "ref",
  "restrictCollection": "person"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":   "_attribute",
  "name":   "person/handle",
  "doc":    "The persons unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   "_attribute",
  "name":  "person/fullName",
  "doc":   "The persons full name.",
  "type":  "string",
  "index": true
},
{
  "_id":  "_attribute",
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "string"
},
{
  "_id":  "_attribute",
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id":   "_attribute",
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "instant",
  "index": true
},
{
  "_id":       "_attribute",
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "ref",
  "component": true,
  "multi":     true,
  "restrictCollection": "comment"
},
{
  "_id":  "_attribute",
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "string"
},
{
  "_id":  "_attribute",
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "ref",
  "restrictCollection": "person"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addPeopleAttributes ($myPersonTx: JSON) {
  transact(tx: $myPersonTx)
}

mutation addChatAttributes ($myChatTx: JSON) {
  transact(tx: $myChatTx)
}

mutation addCommentAttributes ($myCommentTx: JSON) {
  transact(tx: $myCommentTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{"myPersonTx": "[
  
  { \"_id\": \"_attribute\", \"name\": \"person/handle\", \"doc\": \"The person's unique handle\", \"unique\": true, \"type\": \"string\"},
  { \"_id\": \"_attribute\", \"name\": \"person/fullName\", \"doc\": \"The person's full name.\", \"type\": \"string\", \"index\": true}]"}

{
  "myChatTx": "[
    { \"_id\": \"_attribute\", \"name\": \"chat/message\", \"doc\": \"A chat message\", \"type\": \"string\"},
    { \"_id\": \"_attribute\", \"name\": \"chat/person\", \"doc\": \"A reference to the person that created the message\", \"type\": \"ref\", \"restrictCollection\": \"person\"},
    { \"_id\": \"_attribute\", -12], \"name\": \"chat/instant\", \"doc\": \"The instant in time when this chat happened.\", \"type\": \"instant\", \"index\": true},
    { \"_id\": \"_attribute\", \"name\": \"chat/comments\", \"doc\": \"A reference to comments about this message\", \"type\": \"ref\", \"component\": true, \"multi\": true, \"restrictCollection\": \"comment\"}]"
}

{
  "myCommentTx": "[
    { \"_id\": \"_attribute\", \"name\": \"comment/message\", \"doc\": \"A comment message.\", \"type\": \"string\"},
    { \"_id\": \"_attribute\", \"name\": \"comment/person\", \"doc\": \"A reference to the person that made the comment\", \"type\": \"ref\", \"restrictCollection\": \"person\"}]"
}


```

### Transacting Data

In the first transaction we add a couple of people. The second transaction adds a chat message. Note the value used for the `person` key is an `_id`, but this time instead of it being a tempid it refers to an attribute and its corresponding value, `["person/handle", "jdoe"]`. This method can be used for any attribute marked as `unique`.

Here is what an abbreviated response will look like from this transaction:

```all
{
  "tempids": {
    "chat$1": 4299262263297
  },
  "block": 5,
  "hash": "40bc619be312251493788911cfe1ac6106803bc05166cc776d728b63b415b5c0",
  "time": "17.32ms",
  "status": 200,
  "block-bytes": 400,
  "timestamp": 1527611445038,
  "flakes": [
     [ 4299262263297, 1004, 1527611445050, -589824, true, 0 ],
     [ 4299262263297, 1003, 4294967296001, -589824, true, 0 ],
     [ 4299262263297, 1002, "This is a sample chat from Jane!", -589824, true, 0 ],
     [ -589824, 5, 1527611445038, -589824, true, 0 ],
     [ -589824, 2, "386cede775f6308cb48beaa9e9fac60c8d184db836194566412b798ab36a2cd6", -589824, true, 0 ],
     [ -589824, 1, "40bc619be312251493788911cfe1ac6106803bc05166cc776d728b63b415b5c0", -589824, true, 0 ]
  ]
}
```

Now that we have stored a piece of data, let's query it.


#### Sample person transaction

```flureeql
[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact  
```

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, 
    { \"_id\": \"person\", \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

#### Sample chat message transaction

```flureeql
[{
  "_id":     "chat",
  "message": "This is a sample chat from Jane!",
  "person":  ["person/handle", "jdoe"],
  "instant": "#(now)"
}]
```

```curl
    curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id":     "chat",
    "message": "This is a sample chat from Jane!",
    "person":  ["person/handle", "jdoe"],
    "instant": "#(now)"
    }]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addChatMessage ($myChatTx: JSON) {
  transact(tx: $myChatTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myChatTx": "[
    { \"_id\": \"chat\", \"message\": \"This is a sample chat from Jane!\", \"person\": [\"person/handle\", \"jdoe\"], \"instant\": \"#(now)\" }]"
}

```

### Querying Data

These two example queries will return current chat messages. The second example follows the graph relationship to also include details about the referred person who posted the chat message.

#### Simple query for all chat messages

```flureeql
{
  "select": ["*"],
  "from": "chat"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{ "select": ["*"], "from": "chat"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
<!-- GraphQl does not have wildcard support. You need to list all columns you wish to view. -->

{ graph {
  chat {
    _id
    message
    person
    instant
    comments 
  }  
}
}
```

#### Same chat query, but follow the graph to reveal details about the person

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
curl  \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat {
    _id
    message
    instant
    person {
      _id
      fullName
      handle
    }
  }
}
}
```

#### Person query, but follow chat relationship in reverse to find all their chats (note the underscore `_` or `_Via_`)

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

### Permissions Introduction

We can enable permissions on both query and transaction operations, and the permissions can be as simple as a true/false declaration or an [expressive predicate rule function](#database-functions) that resolves to either true or false. All permissions are stored in the `_fn` collection and are referenced via a `ref` attribute on `_rule/predicate`.

Here we'll go through all the steps needed to add a permission that accomplishes two main things:

1. Users can only see `chat` and `person` collection data, but no other data in the database
2. A user can only create or update a chats of their own (if they are the referenced `chat/person`)

To accomplish this we need to do a few things:

1. Create an actual database user for the chat user(s) along with at least one auth record. Permissions are governed by auth records, users are optional but a user can have multiple auth entities each giving different permissions (the [Fluree Permissions](#fluree-permissions) section explains this in more detail).
2. Link the `person` entities we created to the database user(s) using a `ref` (reference) attribute so we can traverse the graph from the `person` entity to the `_user` database user entity and then to the `_auth` record itself.
3. Create rules to enforce the above desired permissions, and connect them to the user using another `ref` attribute. 
4. Create an assignable role that contains these rules so we can easily add the role to our chat user(s).
5. Assign the new role to the user(s).
6. Execute commands with a token tied to the `_auth` record we create

A token (which governs permissions) is tied to a specific `_auth` entity which can directly have roles assigned to it, or default roles can be assigned to a `_user` entity assuming the `_auth` entity is tied to a `_user` via the `_user/auth` attribute. An `_auth` entity can be independent, and is not required to be tied to a `_user`. Most applications we typically use don't work like this (but most cryptos do work like this). We'll get into different ways of leveraging authentication later, but public/private key cryptography is used, however this is abstracted away with hosted Fluree.


**>> Execute the example transaction to add a new attribute named `person/user` that allows a `ref` from any of our persons to a database user.**


Next, we add a new role called `chatUser` that we can easily assign to all chat users. The role has three rules in it. The first, `viewAllChats`, allows `query` (read) permissions for every attribute in the collection `chat`. The second rule, `viewAllPeople` similarly allows `query` for every attribute in the collection `person`. Note, that every database has two built-in functions, `["_fn$name", "true"]` and `["_fn$name", "false"]`, which either allow or block access, respectively, to a given collection or attribute. The final rule, `editOwnChats`, will restrict `transact` to ensure only chats by the respective `person` can be created or edited.

**>> Execute the example transaction to add the new role and these three rules.**

The final step is to create a new database user, `_user`. Here we'll create one for `jdoe` and link her user record to the `person` entity we already created, and the `_role` we just created. Remember an `_auth` entity is what actually gets tied to a token, so we need to create one of those too. In this case our `_auth` doesn't do anything, it just acts as a stub for the moment.

The rule predicate function in `editOwnChats` follows the graph of a chat message's relationships to determine if the user can see it. In this case, the `get-all` function will take a chat message and traverse:

`chat message ->> chat/person ->> person/user ->> database user`

The rule stipulates, that if the database user found after following the graph equals the current `?user_id`, then creating a new chat message or editing an existing one is allowed.

**>> Execute the final transaction example.**

Now, refresh the Fluree user interface (it does not automatically refresh with detected new user/roles). Select the database you were working on in the UI sidebar, and you should now have a user listed as `jdoe`. If you select `jdoe`, you'll be using the custom database just for her that you created with the aforementioned rules. Try to query different collections, or create/update chat messages. The rules we've defined here will only allow the described behavior.

#### Add a new attribute to link a person to a database user

```flureeql 
[{
  "_id":    "_attribute",
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
  "_id":    "_attribute",
  "name":   "person/user",
  "doc":    "Reference to a database user.",
  "type":   "ref",
  "restrictCollection": "_user"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addDBUserAttributes ($myDBUserAttributeTx: JSON) {
  transact(tx: $myDBUserAttributeTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myDBUserAttributeTx": "[
    { \"_id\": \"_attribute\", \"name\": \"person/user\", \"doc\": \"Reference to a database user.\", \"type\": \"ref\", \"restrictCollection\": \"_user\" }
    ]"
}
```

#### Add a role and rules

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
    "predicate": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "collection": "person",
    "collectionDefault": true,
    "predicate": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$editOwnChats",
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "collection": "chat",
    "attributes": ["chat/message"],
    "predicate": ["_fn$editOwnChats"],
    "ops": ["transact"]
  },
  {
    "_id": "_fn$editOwnChats",
    "name": "editOwnChats",
    "code": "(contains? (get-all (?e \"[{chat/person  [{person/user [_id] }]\") [\"chat/person\" \"person/user\" \"_id\"]) (?user_id))"
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
    "predicate": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "collection": "person",
    "collectionDefault": true,
    "predicate": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$editOwnChats",
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "collection": "chat",
    "attributes": ["chat/message"],
    "predicate": ["_fn$editOwnChats"],
    "ops": ["transact"]
  },
  {
    "_id": "_fn$editOwnChats",
    "name": "editOwnChats",
    "code": "(contains? (get-all (?e \"[{chat/person  [{person/user [_id] }]\") [\"chat/person\" \"person/user\" \"_id\"]) (?user_id))"
  }
]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addRole ($myRoleTx: JSON) {
  transact(tx: $myRoleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myRoleTx": "[{\"_id\":\"_role\",\"id\":\"chatUser\",\"doc\":\"A standard chat user role\",\"rules\":[\"_rule$viewAllChats\",\"_rule$viewAllPeople\",\"_rule$editOwnChats\"]},{\"_id\":\"_rule$viewAllChats\",\"id\":\"viewAllChats\",\"doc\":\"Can view all chats.\",\"collection\":\"chat\",\"collectionDefault\":true,\"predicate\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$viewAllPeople\",\"id\":\"viewAllPeople\",\"doc\":\"Can view all people\",\"collection\":\"person\",\"collectionDefault\":true,\"predicate\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$editOwnChats\",\"id\":\"editOwnChats\",\"doc\":\"Only allow users to edit their own chats\",\"collection\":\"chat\",\"attributes\":[\"chat/message\"],\"predicate\":[\"_fn$editOwnChats\"],\"ops\":[\"transact\"]},{\"_id\":\"_fn$editOwnChats\",\"name\":\"editOwnChats\",\"code\":\"(contains? (get-all (?e \\\"[{chat/person  [{person/user [_id] }]\\\") [\\\"chat/person\\\" \\\"person/user\\\" \\\"_id\\\"]) (?user_id))\"}]"
}

```

#### Create a new user with an auth record containing that role

```flureeql
[
  {
    "_id":    "_user$jdoe",
    "username": "jdoe",
    "roles": [["_role/id", "chatUser"]],
    "auth": ["_auth$temp"]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": "_user$jdoe"
  },
  {
    "_id": "_auth$temp",
    "id": "tempAuthRecord"
  }
]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id":    "_user$jdoe",
    "username": "jdoe",
    "roles": [["_role/id", "chatUser"]],
    "auth": ["_auth$temp"]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": "_user$jdoe"
  },
  {
    "_id": "_auth$temp",
    "id": "tempAuthRecord"
  }]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addUserAuth($myUserAuthTx: JSON){
  transact(tx: $myUserAuthTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myUserAuthTx": "[ 
    { \"_id\": \"_user$jdoe\", \"username\": \"jdoe\", \"roles\": [[\"_role/id\", \"chatUser\"]], \"auth\": [\"_auth$temp\"] }, 
    { \"_id\": [\"person/handle\", \"jdoe\"], \"user\": \"_user\$jdoe" }, 
    { \"_id\": \"_auth$temp\", \"id\": \"tempAuthRecord\" } ]"
}
```
