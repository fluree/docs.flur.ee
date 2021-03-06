## Rules

When creating a rule, you specify a collection, predicate/s, and smart functions. That rule can then be connected to particular auth records. 

For example, an auth can be connected to a role that references rules in the `person` collection and the `person/handle` predicate. If that auth record issues a query or transaction that includes `person/handle`, then the smart functions attached to the auth's roles are triggered. 

- If all of the smart functions return true, then the transaction goes through or the query results get returned. 

- If at least one of the smart functions returns false, then the transaction is rejected, or, in the case of a query, the results are returned without `person/handle`. 

This section goes into detail on the user-auth-role-rule structure. The [next section on Identity](/docs/identity) goes into how rules are connected to identity in Fluree, as well as the role of public and private keys.

### Rules Usage

Predicate and collection specs apply exclusively to transactions, and are universal for everyone in the ledger. Rules, as explained above, can be used for queries as well as transactions. Rules can control what end users* in a ledger see and do. They cannot control what a node-operator or administrator of a hosted Fluree ledger can see, but they can control what those individual can do (transact). Anyone who is running their own node in Fluree, or who is the administrator of a hosted Fluree ledger, always has full access to **view** any item in any ledger in their network. Query peers, however, can be connected to a Fluree ledger or network as a permissioned user. 

When an end user connects to a ledger, effectively their ledger is custom to them (and their requested point in time). Any data they do not have access to doesn't exist in their ledger. This means you can give direct access to the ledger to any user, and they can run ad-hoc queries without concern that data might be leaked. This is a very powerful concept that can drastically simplify end-user applications.

For example, if a supply chain is running a federated Fluree, ledger administrators who manage each supply chain member's transactor group will have root access to view all ledgers. Individuals within each company, however, can all have direct access to the ledger. Those individuals however, will effectively see different ledgers, depending on their permissions.

Rules are useful for the following purposes:

1. Limiting what end-users can see or do. 
2. Creating rules around transactions that are not universal - for either end users or node-operators/hosted ledger admins. 

Universal restrictions, such as "people can only update their own profile page" should be in the relevant collection or predicate specs. However, role-specific restrictions should be placed in rules. For example, in a chat application, you might want a specific type of network participant, a `chatUser` to only be able to edit their own chats, but you could also have a `chatModerator` who can edit anyone's chats. This type of differentiated roles in a ledger are best suited for rules (although they can also be written as collection and predicate specs).

\* End users specifically refer to users who do not directly run a node or manage a hosted ledger. Every end user needs to have their own auth record, and both view and edit restrictions can be attached to that auth record. 


### Auth/Role/Rule Structure

Individual permissions, such as read and write access to a collection, are encoded in rules. The smart functions attached to these rules are listed in the `_rule/fns` predicates. Rules, in turn, are grouped into roles (via the `_role/rules` predicate). For instance, a chatUser role might include the following rules:

- Read access for all chats
- Read access for all people
- Read and write access for own chats

<p class="text-center">
    <img src="https://s3.amazonaws.com/fluree-docs/roleChatUser.svg" alt="Diagram shows a role, chatUser, that is comprised of three rules: read access for all chats and people, as well as read and write access for own chats.">
</p>

Another role, dbAdmin might include read and write access to all users, as well as token issuing permissions (tokens are only relevant to the hosted Fluree).

<p class="text-center">
    <img src="https://s3.amazonaws.com/fluree-docs/roleDbAdmin.svg" alt="Diagram shows a role, dbAdmin, that is comprised of two rules: read and write access for all users and the ability to generate and revoke tokens.">
</p>

These roles are then assigned to different auth entities (via the `_auth/roles` predicate). For instance, an administrator auth subject and a standardUser auth subject. The administrator auth subject would need multiple roles, such as dbAdmin and chatUser. The standardUser auth subject would only need the chatUser role.

<p class="text-center">
    <img src="https://s3.amazonaws.com/fluree-docs/authEntities.svg" alt="Diagram shows two auth entities, adminstrator and standardUser. administrator is assigned two roles: dbAdmin and chatUser. standardUser is only assigned one role - chatUser.">
</p>

Auth entities govern access to a ledger. Auth entities are issued tokens (in the hosted version) or sign queries/transactions, and that auth subject's permissions are applied to every ledger action that they perform. 

An auth subject does not need to be tied a user. All auth entities can be used independently. However, a common use case is to assign auth entities to ledger users (via the `_user/auth` predicate). Users can have multiple auth records, but multiple users cannot share the same auth record.


### User and Auth Entities

Permissions are always linked to an `_auth` subject that is making the request. Roles containing permission rules are referenced from the `_auth` subject (via the `_auth/roles` predicate). Learn how `_auth` records can be tied to a private key in the [Identity section](/docs/identity)

A `_user`, which can be a human or app/system user, can be connected to several different `_auth` entities. However, all transactions are performed as `_auth` records, not as `_user`s.

The predefined predicates for both `_user` and `_auth` are as follows.

#### User Predicates

Predicate | Type | Description
-- | -- | -- 
`_user/username` | `string` |  (optional) A unique username for this user.
`_user/auth` | `[ref]` | (optional) Reference to auth entities available for this user to authenticate. Note if no auth entities exist, the user will be unable to authenticate.
`_user/roles` | `[ref]` | (deprecated) This predicate is no longer used.

#### Auth Predicates

Predicate | Type | Description
-- | -- | -- 
`_auth/id` | `string` |  (optional) Globally unique id for this auth record. 
`_auth/doc` | `string` | (optional) A docstring for this auth record.
`_auth/key` | `string` |  (optional) A unique lookup key for this auth record.
`_auth/type` | `tag` | (optional) The type of authorization this is. Current type tags supported are: `password`. 
`_auth/secret` | `string` | (optional) The hashed secret. When using this as a `password` `_auth/type`, it is the one-way encrypted password. This predicate is not used anywhere in the ledger, but you can create an application using logins and passwords with the help of this predicate. 
`_auth/hashType` | `tag` | (optional) The type of hashing algorithm used on the `_auth/secret`. 
`_auth/resetToken` | `string` | (optional) If the user is currently trying to reset a password/secret, an indexed reset token can be stored here allowing quick access to the specific auth record that is being reset. This predicate is not used anywhere in the ledger, but you can create an application using logins and passwords with the help of this predicate. 
`_auth/roles` | `[ref]` | (optional) Multi-cardinality reference to roles to use if authenticated via this auth record. If not provided, this `_auth` record will not be able to view or change anything in the ledger. 
`_auth/authority` | `[ref]` | (optional) Authorities for this auth record. References another _auth record. Any auth records referenced in `_auth/authority` can sign a transaction in place of this auth record. To use an authority, you must sign your transaction using the authority's auth record. See more about signing transactions and authorities in the [Signing Transactions](/docs/identity/signatures#signed-transactions) section. 
`_auth/fuel` | `long` | Fuel this auth record has. [Fuel](/docs/infrastructure/db-infrastructure#fuel) is used to meter usage in the hosted version of Fluree, but an application can use this predicate to meter fuel usage in the downloadable version as well. 

### Roles

Roles' purpose is simply to group a set of rules under a common name or ID that can be easily assigned to a user.

Roles are assigned to a specific `_auth` subject under the multi-cardinality predicate `_auth/roles`.

Having roles be assigned to an `_auth` record, rather than to a `_user` allows a `_user` to have access to different data, based on which `_auth` they use to authenticate. Additionally, `_auth` records can be added or revoked from a `_user` without having to edit the actual `_auth` record. 

The ability to override roles at the auth subject allows a more limited (or possibly expanded) set of roles to the same user depending on how they authenticate. If, for example, a social media website authenticated as a user, it might only have access to read a limited set of data whereas if the user logged in, they may have their full set of access rights.

 Note that, by default, all ledgers have a built-in `["_role/id", "root"]` role with access to everything inside a ledger.

#### Role predicates

Predicate | Type | Description
-- | -- | -- 
`_role/id` | `string` |  (optional) A unique identifier for this role.
`_role/doc` | `string` | (optional) A docstring for this role.
`_role/rules` | `[ref]` | (required) References to rule entities that this role aggregates.

### Rule Predicates

Rules control the actual permissions and are stored in the special system collection `_rule`. Like all Fluree functionality, it is defined as data that you can transact as you would any data. 

Predicate | Type | Description
-- | -- | -- 
`_rule/id` | `string` |  (optional) A unique identifier for this rule.
`_rule/doc` | `string` | (optional) A docstring for this rule.
`_rule/collection` | `string` | (required) The collection name this rule applies to. In addition to a collection name, the special glob character `*` can be used to indicate all collections (wildcard).
`_rule/collectionDefault` | `boolean` | Indicates if this rule is a default rule for the specified collection. Use either this or `_rule/predicates` on a rule, but not both. Default rules are only executed if a more specific rule does not apply, and can be thought of as a catch-all.
`_rule/predicates` | `[string]`| (optional) A multi-cardinality list of predicates this rule applies to. The special glob character `*` can be used to indicate all predicates (wildcard).
`_rule/fns` | `[ref]` | (required) Multi-cardinality reference to `_fn` subject. The actual function is stored in the `_fn/code` predicate. `_fn/code` can be `true`, `false`, or a ledger function expression. Built-in functions and variables are listed in [Universal Functions](/docs/smart-functions/smart-functions#universal-functions). `true` indicates the user always has access to this collection + predicate combination. `false` indicates the user is always denied access. Functions will return a truthy or false value that has the same meanings.
`_rule/ops` | `[tag]` | (required) Multi-cardinality tag of action(s) this rule applies to. Current tags supported are `query` for query/read access, `transact` for transact/write access, `token` to generate tokens, `logs` to access all ledger logs (users always have access to their own logs), and `all` for all operations.
`_rule/errorMessage` | `string` | (optional) If this rule prevents a transaction from executing, this optional error message can be returned to the client instead of the default error message (which is intentionally generic to limit insights into the ledger configuration).