# Permissions

## Fluree Permissions

Fluree allows very granular permissions to control exactly what data users can write and read, down to an entity + attribute level. When a user connects to a database, effectively their database is custom to them (and their requested point in time). Any data they do not have access to doesn't exist in their database. This means you can give direct access to the database to any user, and they can run ad-hoc queries without ever a concern that data might be leaked. This is a very powerful concept that can drastically simplify end-user applications.






Permissions are controlled by restricting (or allowing) access to either streams or attributes, and both of these dimensions of access must be true to allow access.

Permissions are assigned to a role, and roles assigned to users. Every action in FlureeDB is always performed as a user and will apply that user's permission to the respective action.

By default, users are disallowed access to all streams and allowed access to all attributes. This has the effect of not allowing a user access to anything, as both these access dimensions must allow access for anything to be seen/transacted.

## Query / Read Permissions

Every database that a query is executed against in Fluree can be thought of as a unique, custom database. This concept applies not only for historical (time travel) queries, but also for permissions. Effectively, every piece of data the user does not have access to does not exist in their database. This allows you to query at will.

When a query asks for attributes or entities that don't exist for them, the results are simply empty. An exception is not thrown in this case.


When reading, any data the user does not have access to simply disappears, as though it never existed.

## Transact / Write Permissions

When transacting, any attempts to transact data that the user does not have permission to write will throw an exception.
It is entirely possible to have write access to data, but not read access.

Block stream can always be written: if permissions on certain metadata are desired, the respective attributes must be excluded.

## User and Auth Entities

Permissions are always linked to the `_user` entity that is making the request via a valid authorization token. Users are authorized via a specific `_auth` entity record that is referenced by the `_user` entity via the `_user/auth` attribute.

Roles containing permission rules can either be referenced from the `_auth` entity used to authenticate (via the `_auth/roles` attribute), or, if not specified, the user's default roles will be used which are referenced from the `_user` entity (via the `_user/roles` attribute).

A user can be a human or app/system user.

The predefined attributes for both `_user` and `_auth` are as follows.

### User attributes

Attribute | Type | Description
-- | -- | -- 
`_user/username` | `string` |  (optional) A unique username for this user.
`_user/auth` | `[ref]` | (optional) Reference to auth entities available for this user to authenticate. Note if no auth entities exist, the user will be unable to authenticate.
`_user/roles` | `[ref]` | (optional) References to the default roles that apply to this user. If roles are specified via the `_auth` entity the user is authenticated as, those roles will always over-ride (replace) any role specified here.



### Auth attributes

Attribute | Type | Description
-- | -- | -- 
`_auth/key` | `string` |  (optional) A unique lookup key for this auth record.
`_auth/type` | `tag` | (optional) The type of authorization this is. Current type tags supported are: `password`. When a user uses the `/api/signin` endpoint, the password supplied will be compared to the auth entity containing the `password` type. If there isn't an auth entity of type `password`, the user will be unable to authenticate via that endpoint.
`_auth/secret` | `string` | (optional) The hashed secret. When using this as a `password` `_auth/type`, it is the one-way encrypted password.
`_auth/hashType` | `tag` | (optional) The type of hashing algorithm used on the `_auth/secret`. FlureeDB's API supports `scrypt`, `bcrypt` and `pbkdf2-sha256`.
`_auth/resetToken` | `string` | (optional) If the user is currently trying to reset a password/secret, an indexed reset token can be stored here allowing quick access to the specific auth record that is being reset. Once used, it is recommended to delete this value so it cannot be used again.
`_auth/roles` | `[ref]` | (optional) Multi-cardinality reference to roles to use if authenticated via this auth record. If not provided, the user's default roles as specified on the `_user` entity in `_user/roles` will be used.

## Defining Rules

Rules control the actual permissions and are stored in the special system stream `_rule`. Like all FlureeDB functionality, it is defined as data that you can transact as you would any data.

### Rule attributes

Attribute | Type | Description
-- | -- | -- 
`_rule/id` | `string` |  (optional) A unique identifier for this rule.
`_rule/doc` | `string` | (optional) A docstring for this rule.
`_rule/stream` | `string` | (required) The stream name this rule applies to. In addition to a stream name, the special glob character `*` can be used to indicate all streams (wildcard).
`_rule/streamDefault` | `boolean` | Indicates if this rule is a default rule for the specified stream. Use either this or `_rule/attributes` on a rule, but not both. Default rules are only executed if a more specific rule does not apply, and can be thought of as a catch-all.
`_rule/attributes` | `[string]`| (optional) A multi-cardinality list of attributes this rule applies to. The special glob character `*` can be used to indicate all attributes (wildcard).
`_rule/predicate` | `string` | The predicate function to be applied. Can be `true`, `false`, or a predicate database function expression. Available predicate functions are listed in a subsequent table. `true` indicates the user always has access to this stream + attribute combination. `false` indicates the user is always denied access. Predicate functions will return a truthy or false value that has the same meanings.
`_rule/ops` | `[tag]` | (required) Multi-cardinality tag of action(s) this rule applies to. Current tags supported are `query` for query/read access, `transact` for transact/write access and `all` for all operations.
`_rule/errorMessage` | `string` | (optional) If this rule prevents a transaction from executing, this optional error message can be returned to the client instead of the default error message (which is intentionally generic to limit insights into the database configuration).


## Definining Roles

Roles' purpose is simply to group a set of rules under a common name or ID that can be easily assigned to a user.

Roles assigned to the `_user` entity under the multi-cardinality attribute `_user/roles` act as default roles for the user. Roles may also be assigned to a specific `_auth` entity under the multi-cardinality attribute `_auth/roles`, in which case the specified roles are used instead of the default if a user authenticates via the respective auth record.

The ability to over-ride roles at the auth entity allows a more limited (or possibly expanded) set of roles to the same user depending on how they authenticate. If, for example, a social media website authenticated as a user, it might only have access to read a limited set of data whereas if the user logged in, they may have their full set of access rights.

### Role attributes

Attribute | Type | Description
-- | -- | -- 
`_role/id` | `string` |  (optional) A unique identifier for this role.
`_role/doc` | `string` | (optional) A docstring for this role.
`_role/rules` | `[ref]` | (required) References to rule entities that this role aggregates.

