## Basic Transaction

Fluree allows you to specify transaction using FlureeQL JSON array/vector syntax that contains subject maps to create, update, upsert or delete. 

Transactions can also be done with GraphQL, for more information on on GraphQL transactions, reference the [GraphQL Transactions](/docs/query/graphql#transactions) section. 

### Transact Keys

Each map requires an `_id` as specified below along with key/value pairs containing the predicates and values you wish to modify. An `_action` key is always included, but typically inferred and thus optional for most operations.

Key | Type | Description
-- | -- | -- 
`_id` | subject id |  Any subject id value which can include the numeric assigned permanent `_id` for an subject, any predicate marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`, or a temporary id (for new entities). See the [Temporary Ids](#temporary-ids) section in the below Transactions section to learn more. 
`_action` | string | Optional (if it can be inferred). One of: `add`, `update`, `upsert` or `delete`. When using a temporary id, `add` is always inferred. When using an existing subject id, `update` is always inferred. `upsert` is inferred for new entities with a tempid if they include an predicate that was marked as `upsert`.

### Temporary Ids

Every transaction item must have an _id predicate to refer to the subject we are attempting to create/update. A tempid can simply be the collection name, i.e. `_user`. 

FlureeQL example:

```all
[
  {
    "_id":    "_user",
    "username": "jdoe",
  }
]
```

However, if you would like to reference that tempid somewhere else in your transaction, it is necessary to create a unique tempid. To make a unique tempid, just append the collection with any non-valid collection character (anything other than a-z, A-Z, 0-9, _) followed by anything else. For example, `_user$jdoe` or `_user#1 `.

FlureeQL example:
```all
[
  {
    "_id":    "_user$jdoe",
    "username": "jdoe",
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