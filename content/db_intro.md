# FlureeDB Intro

## Beta

Welcome to the FlureeDB beta! Thank you for participating. Please note the following during your participation:

- FlureeDB is focused on typical enterprise applications and their respective workload characteristics. By this we mean we are optimized towards highly relational data that may have very high (and complex) query volume but does not have high transactional volume. While we will have support for some high transactional volume use cases, it is less likely a blockchain database will be an ideal fit for these, and therefore this is not a current focus for this beta.
- The beta is on a shared infrastructure, and we have implemented some limits to ensure fair use. When we are looking for people to try and crash the system (which we will), we'll ask for that feedback. Currently we want feedback on general usage, i.e. does the syntax work well and are you able to query for data in all the ways you wish you could.
- The core has been working well, and we are expanding into more complex analytical queries. This will be the next area of focus for us and you will find expanding information about this primarily in the 'Query' section of the documentation. 
- If you have issues, please do report them! A simple email to support@flur.ee is much appreciated with a description of what happened, and when.
- If you have a use case you'd like to discuss with us please also let us know. We are happy to discuss it on the phone, skype or over email to understand what you are looking to accomplish.
- The following getting started guide begins with a blank database. Based on feedback, we'll soon allow you to fork some sample databases so you can begin with existing data.


## Capability

FlureeDB is an immutable, time-ordered blockchain database. The blockchain at the core is essentially a specially formatted log file of database updates grouped into blocks. Each block is an atomic update that is cryptographically signed to prevent tampering and linked to the previous block in the chain.

We call these log entries Flakes, which have a special format optimized to power the graph database and its unique features. Each Flake is a specific fact at a specific point in time about a specific entity / asset / object. No two Flakes are the same.

The query server(s) powering your applications leverage these Flakes in an optimized way to give you a very fast and very powerful graph database. Your queries alway interact with an immutable version of your database at an exact moment in time. In fact, you can query any point in time in history, instantly.

The Fluree database features these capabilities:
- ACID transactions.
- Database functions.
- End-user permissions rules, allowing control down to the entity + attribute level with custom predicate functions.
- Ability to act as multiple database types simultaneously: a graph database, document database, and an event log (document db in beta soon).
- Automated change feed subscriptions for issued queries. We auto-detect the data a query would contain and can push notifications for those changes to keep user interfaces updated automatically (in beta soon).
- A GraphQL query interface.
- Powerful query language that supports unlimited recursion and can be represented fully in JSON, thus readily composable.
- Scale-out writes by leveraging partitioning (in beta soon).
- Scale-out reads, by separating eventually consistent query engines from the core bockchain transactor. Queries can optionally force consistency to a specific point-in-time or block.
- Point-in-time queries, leveraging the characteristics our immutable blockchain core provides.
- When leveraging Fluree's cloud-hosted private consensus, there is zero management overhead. Federated and fully decentralized consensus modes are in development.
- FlureeDB will be opensource as we move forward in development.

## Quick Start

This quick start is designed to utilize the FlureeDB interactive web console at [https://flureedb.flur.ee](https://flureedb.flur.ee). These transactions could also be performed via your code or REPL utilizing the JSON API, but would require a token. 

This example creates several streams to store chat messages, comments, and people.

We'll follow these steps to give a sense of FlureeDB basics:

1. Create a schema for our database
2. Transact chat messages
3. Query for those messages
4. Time Travel Query
5. Establish a user's permission
6. Query permissioned DB

**>> To begin, log in and select the database you'd like to perform this quick start on in the UI Sidebar. Be sure to use the `root` user.

[FlureeDB Admin Portal (https://flureedb.flur.ee)](https://flureedb.flur.ee)

### Schema - Streams

A Fluree schema consists of streams and attributes. These are similar to a relational database's tables and columns, however in Fluree both of these concepts are extended and more flexible. Streams organize changes about a type of entity, i.e. customers, invoices, employees. So if you have a new entity type, you'd create a new stream to hold it. Streams differ from tables in that they are an always-present stream of changes about those entities that can be queried at any point in time, not just the latest changes as a traditional database would do.

Everything is data in FlureeDB. This includes the schemas, permissions, etc. that actually govern how it works. To add new streams we'll do a transaction the exact way we'd add any new data. Here we'll add our new streams and attributes in two separate transactions to explain what is happening, but they could be done in one.

This transaction adds three streams:

- `person` - will hold names/handles for the people that are chatting
- `chatMessage` - will hold the chat message content
- `chatComment` - will hold comments about messages

Every transaction item must have an `_id` attribute to refer to the entity we are attempting to create/update. An `_id` can either be an existing entity's unique numeric ID, a two-tuple of a unique attribute+value, or a two-tuple of stream+tempid, where tempid is a negative integer. Here we use a tempid as we are creating new entities in the system stream named `_stream`. `_stream` is a system stream/table that holds the configured streams, and `_attribute` likewise for attributes.

#### Stream schema transaction

```json
[{
  "_id":     ["_stream", -1],
  "name":    "person",
  "doc":     "A stream/table to hold our people",
  "version": "1"
},
{
  "_id":     ["_stream", -2],
  "name":    "chat",
  "doc":     "A stream/table to hold chat messages",
  "version": "1"
},
{
  "_id":     ["_stream", -3],
  "name":    "comment",
  "doc":     "A stream/table to hold comments to chat messages",
  "version": "1"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":     ["_stream", -1],
  "name":    "person",
  "doc":     "A stream/table to hold our people",
  "version": "1"
},
{
  "_id":     ["_stream", -2],
  "name":    "chat",
  "doc":     "A stream/table to hold chat messages",
  "version": "1"
},
{
  "_id":     ["_stream", -3],
  "name":    "comment",
  "doc":     "A stream/table to hold comments to chat messages",
  "version": "1"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```

```graphql
mutation addStreams ($myStreamTx: JSON) {
  transact(tx: $myStreamTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myStreamTx": "[{\"_id\": [\"_stream\", -1], \"name\": \"person\", \"doc\": \"A stream/table to hold our people\", \"version\": \"1\"},{ \"_id\": [\"_stream\", -2], \"name\": \"chat\", \"doc\": \"A stream/table to hold chat messages\", \"version\": \"1\"},{ \"_id\": [\"_stream\", -3], \"name\": \"comment\", \"doc\": \"A stream/table to hold comments to chat messages\", \"version\": \"1\"}]"
}

```


### Schema - Attributes

Schema attributes are similar to relational database columns, however there are fewer restrictions.
Any attribute can be attached to any entity, unless a restriction is put in place using a `spec`.

The transaction sample here adds the following attributes:

People
- `person/handle` - The person's unique handle. Being marked as `uniqe`, it can be used as an `_id` in subsequent queries or transactions.
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

```json
[{
  "_id":    ["_attribute", -1],
  "name":   "person/handle",
  "doc":    "The person's unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   ["_attribute", -2],
  "name":  "person/fullName",
  "doc":   "The person's full name.",
  "type":  "string",
  "index": true
},
{
  "_id":  ["_attribute", -10],
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "string"
},
{
  "_id":  ["_attribute", -11],
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "ref",
  "restrictStream": "person"
},
{
  "_id":   ["_attribute", -12],
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "instant",
  "index": true
},
{
  "_id":       ["_attribute", -13],
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "ref",
  "component": true,
  "multi":     true,
  "restrictStream": "comment"
},
{
  "_id":  ["_attribute", -20],
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "string"
},
{
  "_id":  ["_attribute", -21],
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "ref",
  "restrictStream": "person"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":   ["_attribute", -1],
  "name":   "person/handle",
  "doc":    "The persons unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   ["_attribute", -2],
  "name":  "person/fullName",
  "doc":   "The persons full name.",
  "type":  "string",
  "index": true
},
{
  "_id":  ["_attribute", -10],
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "string"
},
{
  "_id":  ["_attribute", -11],
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "ref",
  "restrictStream": "person"
},
{
  "_id":   ["_attribute", -12],
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "instant",
  "index": true
},
{
  "_id":       ["_attribute", -13],
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "ref",
  "component": true,
  "multi":     true,
  "restrictStream": "comment"
},
{
  "_id":  ["_attribute", -20],
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "string"
},
{
  "_id":  ["_attribute", -21],
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "ref",
  "restrictStream": "person"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
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

{
  "myPersonTx": "[{ \"_id\": [\"_attribute\", -1], \"name\": \"person/handle\", \"doc\": \"The person's unique handle\", \"unique\": true, \"type\": \"string\"},{ \"_id\": [\"_attribute\", -2], \"name\": \"person/fullName\", \"doc\": \"The person's full name.\", \"type\": \"string\", \"index\": true}]"
}

{
  "myChatTx": "[{ \"_id\": [\"_attribute\", -10], \"name\": \"chat/message\", \"doc\": \"A chat message\", \"type\": \"string\"},{ \"_id\": [\"_attribute\", -11], \"name\": \"chat/person\", \"doc\": \"A reference to the person that created the message\", \"type\": \"ref\", \"restrictStream\": \"person\"},{ \"_id\": [\"_attribute\", -12], \"name\": \"chat/instant\", \"doc\": \"The instant in time when this chat happened.\", \"type\": \"instant\", \"index\": true},{ \"_id\": [\"_attribute\", -13], \"name\": \"chat/comments\", \"doc\": \"A reference to comments about this message\", \"type\": \"ref\", \"component\": true, \"multi\": true, \"restrictStream\": \"comment\"}]"
}

{
  "myCommentTx": "[{ \"_id\": [\"_attribute\", -20], \"name\": \"comment/message\", \"doc\": \"A comment message.\", \"type\": \"string\"},{ \"_id\": [\"_attribute\", -21], \"name\": \"comment/person\", \"doc\": \"A reference to the person that made the comment\", \"type\": \"ref\", \"restrictStream\": \"person\"}]"
}


```

### Transacting Data

To write data to the Fluree Database, you submit a collection of statements to the transactor endpoint. All of the statements will be successfully committed together, or all fail together with the error reported back to you. Transactions have ACID guarantees.

While everything transacted here could be done in a single atomic transaction, we split it up to illustrate a couple points. In the first transaction we add a couple of people. The second transaction adds a chat message. Note the value used for the `person` key is an `_id`, but this time instead of it being a tempid it refers to an attribute and its corresponding value, `["person/handle", "jdoe"]`. This method can be used for any attribute marked as `unique`.

Here is what an abbreviated response will look like from this transaction, and a brief explanation of the keys:

```
{
  "tempids": [[ ["chat", -1],  4299262263297 ] ],
  "block": 5,
  "hash": "65aeed23724595fa6c0f7b8d4d4d75712749dc12445a34f769636d300165871b",
  "flakes": [
     [ 5, 1, "65aeed23724595fa6c0f7b8d4d4d75712749dc12445a34f769636d300165871b", 5, true, 0 ],
     [ 4299262263297, 1002, "This is a sample chat from Jane!", 5, true, 0 ],
     [ 4299262263297, 1003, 4294967296001, 5, true, 0 ],
     [ 4299262263297, 1004, 1513303413333, 5, true, 0 ],
     [ 5, 2, "41bca4151469ed04b5f62800d8c98d023b792b030091686b590407c987425363", 5, true, 0 ],
     [ 5, 5, 1513303413310, 5, true, 0 ]
  ],
  "time": "39.16ms"
}
```

Key | Description
---|---
`tempids` | A mapping of any temporary id used in a transaction to its final id value that was assigned.
`block` | The blockchain block number that was created with this transaction. These always increment by one.
`hash` | The blockchain hash of this transaction, that can be cryptographically proven with the same `flakes` in the future, and linked to the previous block that creates the chain.
`flakes` | Flakes are the state change of the database, and is the block data itself. Each is a six-tuple of information including the entity-id, attribute-id, value, block-id, true/false for add/delete, and expiration of this piece of data in epoch-milliseconds (0 indicates it never expires).


Now that we have stored a piece of data, let's query it.


#### Sample person transaction

```json
[{
  "_id":      ["person", -1],
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      ["person", -2],
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person", -1],
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      ["person", -2],
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact  
```

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myPeopleTx": "[{ \"_id\": [\"person\", -1], \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, { \"_id\": [\"person\", -2], \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

#### Sample chat message transaction

```json
[{
  "_id":     ["chat", -1],
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
    "_id":     ["chat", -1],
    "message": "This is a sample chat from Jane!",
    "person":  ["person/handle", "jdoe"],
    "instant": "#(now)"
    }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```

```graphql
mutation addChatMessage ($myChatTx: JSON) {
  transact(tx: $myChatTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myChatTx": "[{ \"_id\": [\"chat\", -1], \"message\": \"This is a sample chat from Jane!\", \"person\": [\"person/handle\", \"jdoe\"], \"instant\": \"#(now)\" }]"
}

```

### Querying Data

Fluree allows you to specify queries using our FlureeQL JSON syntax or with GraphQL. The FlureeQL format is designed to easily enable code to compose queries, as the query is simply a data structure. 

For each query, the user's permissions (determined according to `_auth` record through which they are authenticated - more on that in the [Fluree Permissions](#fluree-permissions) section) create a special filtered database that only contains what the user can see. You can safely issue any query, never having to worry about accidentally exposing permissioned data.

These two example queries will return current chat messages. The second example follows the graph relationship to also include details about the referred person who posted the chat message.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request, which can be used to reduce round-trips for applications.

#### Simple query for all chat messages

```json
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
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

```json
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
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

```json
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
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
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

We can enable permissions on both query and transaction operations, and the permissions can be as simple as a true/false declaration or an expressive predicate rule function.

Here we'll go through all the steps needed to add a permission that accomplishes two main things:

1. Users can only see `chat` and `person` stream data, but no other data in the database
2. A user can only create or update a chats of their own (if they are the referenced `chat/person`)

To accomplish this we need to do a few things:

1. Create an actual database user for the chat user(s) along with at least one auth record. Permissions are governed by auth records, users are optional but a user can have multiple auth entities each giving different permissions (the Permissions section explains this in more detail).
2. Link the `person` entities we created to the database user(s) using a `ref` (reference) attribute so we can traverse the graph from the `person` entity to the `_user` database user entity and then to the `_auth` record itself.
3. Create rules to enforce the above desired permissions.
4. Create an assignable role that contains these rules so we can easily add the role to our chat user(s).
5. Assign the new role to the user(s).
6. Execute commands with a token tied to the `_auth` record we create

A token (which governs permissions) is tied to a specific `_auth` entity which can directly have roles assigned to it, or default roles can be assigned to a `_user` entity assuming the `_auth` entity is tied to a `_user` via the `_user/auth` attribute. An `_auth` entity can be independent, and is not required to be tied to a `_user`. Most applications we typically use don't work like this (but most cryptos do work like this). We'll get into different ways ot leveraging authentication later, but public/private key cryptography is used, however this is abstracted away with hosted FlureeDB.


**>> Execute the example transaction to add a new attribute named `person/user` that allows a `ref` from any of our persons to a database user.**


Next, we add a new role called `chatUser` that we can easily assign to all chat users. The role has three rules in it. The first, `viewAllChats`, allows `query` (read) permissions for every attribute in the stream `chat`. The second rule, `viewAllPeople` similarly allows `query` for every attribute in the stream `person`. The final rule, `editOwnChats`, will restrict `transact` (edit) to ensure only chats by the respective `person` can be created or edited.

**>> Execute the example transaction to add the new role and these three rules.**

The final step is to create a new database user, `_user`. Here we'll create one for `jdoe` and link her user record to the `person` entity we already created, and the `_role` we just created. Remember an `_auth` entity is what actually gets tied to a token, so we need to create one of those too. In this case our `_auth` doesn't do anything, it just acts as a stub for the moment.

The rule predicate function in `editOwnChats` follows the graph of a chat message's relationships to determine if the user can see it. In this case, the `get-all` function will take a chat message and traverse:

`chat message ->> chat/person ->> person/user ->> database user`

The rule stipulates, that if the database user found after following the graph equals the current `?user`, then creating a new chat message or editing an existing one is allowed.

**>> Execute the final transaction example.**

Now, refresh the Fluree user interface (it does not automatically refresh with detected new user/roles). Select the database you were working on in the UI sidebar, and you should now have a user listed as `jdoe`. If you select `jdoe`, you'll be using the custom database just for her that you created with the aforementioned rules. Try to query different streams, or create/update chat messages. The rules we've defined here will only allow the described behavior.

**>> Quick Start is now complete. Please see the additional documentation provided here for added references.**

#### Add a new attribute to link a person to a database user

```json 
[{
  "_id":    ["_attribute", -1],
  "name":   "person/user",
  "doc":    "Reference to a database user.",
  "type":   "ref",
  "restrictStream": "_user"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    ["_attribute", -1],
  "name":   "person/user",
  "doc":    "Reference to a database user.",
  "type":   "ref",
  "restrictStream": "_user"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```

```graphql
mutation addDBUserAttributes ($myDBUserAttributeTx: JSON) {
  transact(tx: $myDBUserAttributeTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myDBUserAttributeTx": "[{ \"_id\": [\"_attribute\", -1], \"name\": \"person/user\", \"doc\": \"Reference to a database user.\", \"type\": \"ref\", \"restrictStream\": \"_user\" }]"
}
```

#### Add a role, and a rule

```json 
[
  {
    "_id": [ "_role", -1 ],
    "id": "chatUser",
    "doc": "A standard chat user role",
    "rules": [["_rule", -10], ["_rule", -11], ["_rule", -12]]
  },
  {
    "_id": ["_rule", -10],
    "id": "viewAllChats",
    "doc": "Can view all chats.",
    "stream": "chat",
    "streamDefault": true,
    "predicate": "true",
    "ops": ["query"]
  },
  {
    "_id": ["_rule", -11],
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "stream": "person",
    "streamDefault": true,
    "predicate": "true",
    "ops": ["query"]
  },
  {
    "_id": ["_rule", -12],
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "stream": "chat",
    "attributes": ["chat/message"],
    "predicate": "(contains? (follow ?e [\"chat/person\" \"person/user\"]) ?user)",
    "ops": ["transact"]
  }
]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[
  {
    "_id": [ "_role", -1 ],
    "id": "chatUser",
    "doc": "A standard chat user role",
    "rules": [["_rule", -10], ["_rule", -11], ["_rule", -12]]
  },
  {
    "_id": ["_rule", -10],
    "id": "viewAllChats",
    "doc": "Can view all chats.",
    "stream": "chat",
    "streamDefault": true,
    "predicate": "true",
    "ops": ["query"]
  },
  {
    "_id": ["_rule", -11],
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "stream": "person",
    "streamDefault": true,
    "predicate": "true",
    "ops": ["query"]
  },
  {
    "_id": ["_rule", -12],
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "stream": "chat",
    "attributes": ["chat/message"],
    "predicate": "(contains? (follow ?e [\"chat/person\" \"person/user\"]) ?user)",
    "ops": ["transact"]
  }
]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```

```graphql
mutation addRole ($myRoleTx: JSON) {
  transact(tx: $myRoleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myRoleTx": "[ { \"_id\": [ \"_role\", -1 ], \"id\": \"chatUser\", \"doc\": \"A standard chat user role\", \"rules\": [[\"_rule\", -10], [\"_rule\", -11], [\"_rule\", -12]] }, { \"_id\": [\"_rule\", -10], \"id\": \"viewAllChats\", \"doc\": \"Can view all chats.\", \"stream\": \"chat\", \"streamDefault\": true, \"predicate\": \"true\", \"ops\": [\"query\"] }, { \"_id\": [\"_rule\", -11], \"id\": \"viewAllPeople\", \"doc\": \"Can view all people\", \"stream\": \"person\", \"streamDefault\": true, \"predicate\": \"true\", \"ops\": [\"query\"] }, { \"_id\": [\"_rule\", -12], \"id\": \"editOwnChats\", \"doc\": \"Only allow users to edit their own chats\", \"stream\": \"chat\", \"attributes\": [\"chat/message\"], \"ops\": [\"transact\"] } ]"
}

```

#### Create a new user with an auth record containing that role

```json
[
  {
    "_id":    ["_user", -1],
    "username": "jdoe",
    "roles": [["_role/id", "chatUser"]],
    "auth": [["_auth", -10]]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": ["_user", -1]
  },
  {
    "_id": ["_auth", -10],
    "key": "tempAuthRecord"
  }
]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
     "_id":    ["_user", -1],
    "username": "jdoe",
    "roles": [["_role/id", "chatUser"]],
    "auth": [["_auth", -10]]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": ["_user", -1]
  },
  {
    "_id": ["_auth", -10],
    "key": "tempAuthRecord"
  }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/transact
```

```graphql
mutation addUserAuth($myUserAuthTx: JSON){
  transact(tx: $myUserAuthTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myUserAuthTx": "[ { \"_id\": [\"_user\", -1], \"username\": \"jdoe\", \"roles\": [[\"_role/id\", \"chatUser\"]], \"auth\": [[\"_auth\", -10]] }, { \"_id\": [\"person/handle\", \"jdoe\"], \"user\": [\"_user\", -1] }, { \"_id\": [\"_auth\", -10], \"key\": \"tempAuthRecord\" } ]"
}
```