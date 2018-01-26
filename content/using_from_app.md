
# Your App + FlureeDB

## Overview

Interacting with FlureeDB from your application can be done in one of three ways:

1. The JSON API (i.e. FlureeQL)
2. GraphQL
3. An embeddable FlureeDB client (not yet in beta)

For any of these methods, a valid token must be supplied with the database requests (queries, transactions, etc.). 

Tokens are tied to a specific authorization record stored in the database and govern the permission of the requests. There are several ways to get a token which are subsequently explained.

It is worth noting that transactions are signed using public/private key cryptography. The hosted FlureeDB abstracts this from your application so that a more common username/password authentication scheme can be utilized.


## Getting Tokens

Interacting with the hosted FlureeDB is done using secure tokens that have the authorization identity encoded directly in them. There are several ways to get tokens, and the method you choose is influenced by how you'd like to run FlureeDB.

**Interacting with FlureeDB only from your app server**

FlureeDB can be run in a manner similar to a traditional database server, 'behind' your application server. If you choose to utilize it in this way, you simply need to generate a token with the permissions you desire (likely full access) and pass it to your application. You provide the token to your application like you would any secret, typically via an environment variable.

To get a permanent admin token, follow these steps:

1. Identify the authorization record (or create one) that you wish the token to utilize. A sample transaction is provided here if you need to create a new one.
2. Generate a token tied to that authorization record either via the FlureeDB admin dashboard or via an API call

If you need to create an authorization record, see the example provided.

Remember, authorization is governed by rules (stored in the `_rule` stream). Rules are grouped into roles (stored in the `_role` stream), and roles are assigned to auth entities (`_auth` stream) or default roles can be assigned to users (`_user` stream).

#### Sample rule, role and auth record for admin privileges

```json
[
  {
    "_id":    ["_auth", -1],
    "key":    "db-admin",
    "doc":    "A db admin auth that has full data visibility and can generate tokens for other users.",
    "roles":  [["_role", -10]]
  },
  {
    "_id":   ["_role", -10],
    "id":    "db-admin",
    "doc":   "A role for full access to database.",
    "rules": [["_rule", -100], ["_rule", -101]]
  },
  {
    "_id":       ["_rule", -100],
    "id":        "db-admin",
    "doc":       "Rule that grants full access to all streams.",
    "stream":    "*",
    "streamDefault": true,
    "ops":       ["query", "transact"],
    "predicate": "true"
  },
  {
    "_id":       ["_rule", -101],
    "id":        "db-admin-token",
    "doc":       "Rule allows token generation for other users.",
    "ops":       ["token"],
    "predicate": "true"
  }
]
```

#### Query for all `_auth` records and their respective rules and roles

```json
{
  "select": [ "*", { "_auth/roles": [ "*", {"_role/rules": ["*"]} ] } ],
  "from": "_auth"
}
```

**Interacting with FlureeDB directly from your end-user apps**

FlureeDB is also designed to interact directly with front-end apps/UIs via a set of permissions tied to individual users. The rules-based permissions will 'hide' any data the user is unable to view, and prevent unauthorized transactions. In this case, each user will need a unique token tied to them. There are two ways to generate these user-specific tokens:

1. An API endpoint, `/api/auth/token`, can generate tokens assuming the user generating the token has permission to do so for the given user / auth record. You can roll your own authentication logic within your app server, and once satisfied, use the API endpoint to generate the token and pass it to the client for subsequent use.
2. For hosted FlureeDB, we provide an authentication service you can leverage if you like by having your end-user application POST username + password to the `/api/auth/signin` JSON endpoint, and assuming successful authentication, a token will be returned. Additional options such as token expiration can also be provided. This service also handles password reset requests for you.



## Revoking Tokens

Tokens become useless under two conditions:

1. They reach their token expiration date (assuming one was provided when creating the token).
2. The `_auth` entity the token is associated with no longer has permissions.

A token is tied directly to a specific `_auth` entity, and with every request the roles + rules associated with that entity are retrieved. Therefore, the way to make a token useless is to make the `_auth` entity it is tied to useless. To do so, employ one of these strategies:

1. Delete the auth entity (ensure if it is referenced to a `_user` via the `_user/auth` attribute that the reference is also deleted. When an `_auth` has no roles, it uses the `_user` roles as a default if the relationship exists).
2. Remove current roles referenced by the `_auth` entity, and associate a role that has no permission.

If you think the token was compromised but you still want the same roles + rules, you can copy the existing `_auth` attributes to a new `_auth` entity. Recall a `_user` can have many `_auth` entities. If using Fluree for authorization, the user will be prompted to log in again, and a new token will be issued.

If you have a token but don't know the `_auth` entity it is tied to, you can get that information from the token itself. The middle part of the token (between the two `.`) is JSON that is Base64 encoded. Here is a way to decode it in javascript: `JSON.parse(atob("place_token_here".split('.')[1]))`. The auth `_id` value is in the `sub` key (subject).

You should try to make tokens expire at a reasonable timeframe that balances security with your application's needed convenience.

## API Endpoints

### `/api/db/token`

The token endpoint allows new tokens to be generated on behalf of users. You post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`auth` | identity |  Required auth identity you wish this token to be tied to. Can be the `_id` integer of the auth record,  or any identity value such as `["_auth/id", "my_auth_id"]`.
`expireSeconds` | integer | Optional number of seconds until this token should expire. If not provided, token will never expire.
`db` | string | Only required if using your master authorization token from FlureeDB (from your username/password to flureedb.flur.ee). So long as you are using a token from your own database, it will automatically use the database the token is coming from.


If you are handling authentication for your application but still want users to connect directly to FlureeDB, your authentication code can utilize this endpoint to retrieve tokens on behalf of the user. The user can subsequently use this token to interact directly with FlureeDB from the respective application.

In order to create a token, you must use a token that has the following permission:

1. A role with a rule that grants `token` within the `_rule/ops` attribute.
2. The permission to query the `_auth` record required to generate the token.

For item #2, this allows a permission where someone can generate tokens only for certain user or auth records. Generally you'll use an admin-type rights that have visibility to the entire database in which case you simply need to make sure the `_rule/ops` contains the rights for `token`.

Here is an example request using curl:

```
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer AUTH_TOKEN" \
   -d '{"auth": 25769804776, "expireSeconds": 3600}' \
   https://ACCOUNT_NAME.beta.flur.ee/api/db/token
```
