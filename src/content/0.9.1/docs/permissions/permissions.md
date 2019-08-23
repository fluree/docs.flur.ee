### Signing Transactions

Optionally, in a given transaction, you can include an alternate auth record with which to sign your transaction. This is done by passing in an additional map with your transaction. The additional map should be in the `_tx` collection. The attributes in the `_tx` collection are specified below:

Attribute | Type | Description
-- | -- | -- 
`_tx/id` | `string` |  (optional) A unique identifier for this tx.
`_tx/auth` | `ref` | (optional) A reference to the `_auth` for this transaction. This auth signs the transaction.
`_tx/authority` | `ref` | (optional) A reference to an `_auth` record that acts as an authority for this transaction. 
`_tx/nonce` | `long` | (optional) A nonce that helps ensure identical transactions have unique txids, and also can be used for logic within smart functions. Note this nonce does not enforce uniqueness, use _tx/altId if uniqueness must be enforced.
`_tx/altId` | `string` | (optional) Alternative Unique ID for the transaction that the user can supply.


For example, I could specify a  `_tx/id` and `_tx/nonce` in my transaction as follows. If your database specifies a defaultAuth (see the section [Authority](#authority)), this additional map is completely optional.

```all
[{
    "_id": "_collection",
    "name": "movie"
},
{
    "_id": "_tx",
    "id": "moviesColl",
    "nonce": 123456789
}
```

As you can see in the flakes section of the response below, the `_tx/nonce` that we supplied is recorded (in the last flake, `[ -327680, 103, 123456789, -327680, true, 0 ]`).

```all
{
  "tempids": {
    "_collection$1": 4294968297
  },
  "block": 5,
  "hash": "56f0065c194e0afcbb17efa2d28cd2e5c990cb36ba473405e49c9e865577a242",
  "txid": "b9f52827b30cc234db4766417b80337295210c671079b6fda546f992da123a0b",
  "fuel-remaining": 999430,
  "authority": null,
  "signature": "1c304402200cc359c38f90af3b75ca8178f3953f13b31ba6de0382639790cd22b2b53b43c1022047a7fb73ce1b869bad74a8027926df67b3d162651cbd28165310ca0aa0dbd672",
  "time": "20.28ms",
  "fuel": 0,
  "auth": 25769803776,
  "status": 200,
  "block-bytes": 444,
  "timestamp": 1534884422866,
  "flakes": [
     [ 4294968297, 40, "movie", -327680, true, 0 ],
     [ -327680, 1, "56f0065c194e0afcbb17efa2d28cd2e5c990cb36ba473405e49c9e865577a242", -327680, true, 0 ],
     [ -327680, 2, "93d48741923a2033a23d2116c17729b5bb582ae2c575082540071715b25dd866", -327680, true, 0 ],
     [ -327680, 5, 1534884422866, -327680, true, 0 ],
     [ -327680, 100, "b9f52827b30cc234db4766417b80337295210c671079b6fda546f992da123a0b", -327680, true, 0 ],
     [ -327680, 101, 25769803776, -327680, true, 0 ],
     [ -327680, 103, 123456789, -327680, true, 0 ]
  ]
}
```



### Authority

Every transaction is signed by an `_auth` record. By default, every database includes a default auth record, which is specified with the following entity:

```all
{
      "_setting/id": "db",
      "_setting/defaultAuth": {
        "_id": 25769803776
      },
      "_id": 38654705664
}
```

In order to change or remove the defaultAuth, you can simply change the `["_setting/id", "db"]`. For example, in order to remove the defaultAuth:

```all
[{
      "_id": ["_setting/id", "db"],
      "_setting/defaultAuth": [25769803776],
      "_action": "delete"
}]
```

Additionally, every transaction can specify a `_tx/authority` as part of the `_tx` map included in the transaction. For example, if we have an `_auth` record with the id, "rootAuth", we can submit a transaction as follows: 


```all
[{
    "_id": "_attribute",
    "name": "movie/title",
    "type": "string
},
{
    "_id": "_tx",
    "id": "movieTitle",
    "authority": ["_auth/id", "rootAuth"]
}]

```

Remember, if your database specifies a defaultAuth, this `_tx` map is optional. 

### Fluree Permissions

Fluree allows very granular permissions to control exactly what data users can write and read, down to an entity + attribute level. When a user connects to a database, effectively their database is custom to them (and their requested point in time). Any data they do not have access to doesn't exist in their database. This means you can give direct access to the database to any user, and they can run ad-hoc queries without ever a concern that data might be leaked. This is a very powerful concept that can drastically simplify end-user applications.

Permissions are controlled by restricting (or allowing) access to either collections or attributes, and both of these dimensions of access must be true to allow access.

#### Permission Structure

Individual permissions, such as read and write access to a collection, are encoded in rules. Rules, in turn, are assigned to roles (via the `_role/rules` attribute). For instance, a chatUser role might include the following rules:

- Read access for all chats
- Read access for all people
- Read and write access for own chats

<p class="text-center">
    <img style="height: 250px; width: 310px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/roleChatUser.svg" alt="Diagram shows a role, chatUser, that is comprised of three rules: read access for all chats and people, as well as read and write access for own chats.">
</p>

Another role, dbAdmin might include read and write access to all users, as well as token issuing permissions.

<p class="text-center">
    <img style="height: 200px; width: 300px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/roleDbAdmin.svg" alt="Diagram shows a role, dbAdmin, that is comprised of two rules: read and write access for all users and the ability to generate and revoke tokens.">
</p>

These roles are then assigned to different auth entities (via the `_auth/roles` attribute). For instance, an administrator auth entity and a standardUser auth entity. The administrator auth entity would need multiple roles, such as dbAdmin and chatUser. The standardUser auth entity would only need the chatUser role.

<p class="text-center">
    <img style="height: 140px; width: 520px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/authEntities.svg" alt="Diagram shows two auth entities, adminstrator and standardUser. administrator is assigned two roles: dbAdmin and chatUser. standardUser is only assigned one role - chatUser.">
</p>

Auth entities govern access to a database. Auth entities are issued tokens, and that auth entity's permissions are applied to every database action that they perform. 

An auth entity does not need to be tied a user. All auth entities can be used independently. However, a common use case is to assign auth entities to database users (via the `_user/auth` attribute). Roles can also be assigned directly to users (via the `_user/roles` attribute), however if a user has an auth entity, permissions are determined according to the auth entity, *not* the roles. 

For instance, in the below example, the users, janeDoe and bobBoberson, both have roles assigned directly to their user entities. bobBoberson's permissions are limited to the rules assigned to the chatUser role - namely read access for all chats and peopls, as well as read and write access to one's own chats. 

janeDoe has the dbAdmin role assigned to her user. However, she also has been assigned an auth entity, standardUser. Auth entities assigned to a user (via the `_user/auth` attribute) automatically override any roles that are directly assigned to a user (via the `_user/roles` attribute. In janeDoe's case, she has the permissions associated with a standardUser auth entity. 

<p class="text-center">
    <img style="height: 150px; width: 500px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/userEntities.svg" alt="Diagram shows two user entities, janeDoe and bobBoberson. janeDoe is assigned one role, dbAdmin, and one auth entity, standardUser. bobBoberson is assigned one role, chatUser.">
</p>

#### Query / Read Permissions

Every database that a query is executed against in Fluree can be thought of as a unique, custom database. This concept applies not only for historical (time travel) queries, but also for permissions. Effectively, every piece of data the user does not have access to does not exist in their database. This allows you to query at will.

When a query asks for attributes or entities that don't exist for them, the results are simply empty. An exception is not thrown in this case.


When reading, any data the user does not have access to simply disappears, as though it never existed.

### Transact / Write Permissions

When transacting, any attempts to transact data that the user does not have permission to write will throw an exception.
It is entirely possible to have write access to data, but not read access.

Block collection can always be written: if permissions on certain metadata are desired, the respective attributes must be excluded.

### User and Auth Entities

Permissions are always linked to an `_auth` entity that is making the request via a valid authorization token. Roles containing permission rules are referenced from the `_auth` entity (via the `_auth/roles` attribute).

A `_user`, which can be a human or app/system user, can be connected to several different `_auth` entities. However, tokens are tied to specific `_auth` records, not the `_user` record.

The predefined attributes for both `_user` and `_auth` are as follows.

#### User attributes

Attribute | Type | Description
-- | -- | -- 
`_user/username` | `string` |  (optional) A unique username for this user.
`_user/auth` | `[ref]` | (optional) Reference to auth entities available for this user to authenticate. Note if no auth entities exist, the user will be unable to authenticate.
`_user/roles` | `[ref]` | (optional) References to the default roles that apply to this user. If roles are specified via the `_auth` entity the user is authenticated as, those roles will always override (replace) any role specified here.



#### Auth attributes

Attribute | Type | Description
-- | -- | -- 
`_auth/id` | `string` |  (optional) Globally unique id for this auth record. 
`_auth/doc` | `string` | (optional) A docstring for this auth record.
`_auth/key` | `string` |  (optional) A unique lookup key for this auth record.
`_auth/type` | `tag` | (optional) The type of authorization this is. Current type tags supported are: `password`. When a user uses the `/api/signin` endpoint, the password supplied will be compared to the auth entity containing the `password` type. If there isn't an auth entity of type `password`, the user will be unable to authenticate via that endpoint.
`_auth/secret` | `string` | (optional) The hashed secret. When using this as a `password` `_auth/type`, it is the one-way encrypted password.
`_auth/hashType` | `tag` | (optional) The type of hashing algorithm used on the `_auth/secret`. Fluree's API supports `scrypt`, `bcrypt` and `pbkdf2-sha256`.
`_auth/resetToken` | `string` | (optional) If the user is currently trying to reset a password/secret, an indexed reset token can be stored here allowing quick access to the specific auth record that is being reset. Once used, it is recommended to delete this value so it cannot be used again.
`_auth/roles` | `[ref]` | (optional) Multi-cardinality reference to roles to use if authenticated via this auth record. If not provided, this `_auth` record will not be able to view or change anything in the database. 
`_auth/authority` | `[ref]` | (optional) Authorities for this auth record. References another _auth record. Any auth records referenced in `_auth/authority` can sign a transaction in place of this auth record. To use and authority, you must include it in your transaction. See more in the [Authority](#authority) section. 

### Defining Rules

Rules control the actual permissions and are stored in the special system collection `_rule`. Like all Fluree functionality, it is defined as data that you can transact as you would any data. 

#### Rule attributes

Attribute | Type | Description
-- | -- | -- 
`_rule/id` | `string` |  (optional) A unique identifier for this rule.
`_rule/doc` | `string` | (optional) A docstring for this rule.
`_rule/collection` | `string` | (required) The collection name this rule applies to. In addition to a collection name, the special glob character `*` can be used to indicate all collections (wildcard).
`_rule/collectionDefault` | `boolean` | Indicates if this rule is a default rule for the specified collection. Use either this or `_rule/attributes` on a rule, but not both. Default rules are only executed if a more specific rule does not apply, and can be thought of as a catch-all.
`_rule/attributes` | `[string]`| (optional) A multi-cardinality list of attributes this rule applies to. The special glob character `*` can be used to indicate all attributes (wildcard).
`_rule/predicate` | `[ref]` | (required) Multi-cardinality reference to `_fn` entity. The actual predicate is stored in the `_fn/code` attribute. The predicate function to be applied. Can be `true`, `false`, or a predicate database function expression. Available predicate functions and variables are listed in [Database Functions](#database-functions). `true` indicates the user always has access to this collection + attribute combination. `false` indicates the user is always denied access. Predicate functions will return a truthy or false value that has the same meanings.
`_rule/ops` | `[tag]` | (required) Multi-cardinality tag of action(s) this rule applies to. Current tags supported are `query` for query/read access, `transact` for transact/write access, `token` to generate tokens, `logs` to access all database logs (users always have access to their own logs), and `all` for all operations.
`_rule/errorMessage` | `string` | (optional) If this rule prevents a transaction from executing, this optional error message can be returned to the client instead of the default error message (which is intentionally generic to limit insights into the database configuration).


### Defining Roles

Roles' purpose is simply to group a set of rules under a common name or ID that can be easily assigned to a user.

Roles are assigned to a specific `_auth` entity under the multi-cardinality attribute `_auth/roles`.

Having roles be assigned to an `_auth` record, rather than to a `_user` allows a `_user` to have access to different data, based on which `_auth` they use to authenticate. Additionally, `_auth` records can be added or revoked from a `_user` without having to edit the actual `_auth` record. 

The ability to override roles at the auth entity allows a more limited (or possibly expanded) set of roles to the same user depending on how they authenticate. If, for example, a social media website authenticated as a user, it might only have access to read a limited set of data whereas if the user logged in, they may have their full set of access rights.

 Note that, by default, all databases have a built-in `["_role/id", "root"]` role with access to everything inside a database.

#### Role attributes

Attribute | Type | Description
-- | -- | -- 
`_role/id` | `string` |  (optional) A unique identifier for this role.
`_role/doc` | `string` | (optional) A docstring for this role.
`_role/rules` | `[ref]` | (required) References to rule entities that this role aggregates.

