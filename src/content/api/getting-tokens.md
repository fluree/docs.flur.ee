## Getting Tokens

Tokens are tied to a specific authorization record stored in the database and govern the permission of the requests. You can get two types of tokens:

- Master database tokens
- Own database tokens

**Master database tokens** - Master database tokens are retreived via the [api/db/signin](/api/hosted-endpoints/hosted-examples#-api-db-signin) endpoint. These tokens give you access to the master hosted FlureeDB database. You are not able to use that token via the user interface, but you can use that token through other interfaces to query the master database. Using that token, you can view only your own databases and accounts. You also need a master database token to get a token for any of your own databases (see below).  

**Own database tokens** - In order to get a token for one of your own databases, you need to submit a request to [api/db/token](/api/hosted-endpoints/hosted-examples#-api-db-token).  In the Authorization header, you need to have a master database token or a token with [token-creating permissions](/docs/smart-functions/rules#rules) (see `_rule/ops` in the `Rule Predicates` section). The tokens for your own database can either be connected to a `root` user or to any `_auth` record in the relevant database.  

### Cryptography

It is worth noting that transactions are signed using public/private key cryptography. The hosted FlureeDB abstracts this from your application so that a more common username/password authentication scheme can be utilized.

Interacting with the hosted FlureeDB is done using secure tokens that have the authorization id subject encoded directly in them. There are several ways to get tokens, and the method you choose is influenced by how you'd like to run FlureeDB.

### Revoking Tokens

Tokens become useless under two conditions:

1. They reach their token expiration date (assuming one was provided when creating the token).
2. The `_auth` subject the token is associated with no longer has permissions.

A token is tied directly to a specific `_auth` subject, and with every request the roles + rules associated with that subject are retrieved. Therefore, the way to make a token useless is to make the `_auth` subject it is tied to useless. To do so, employ one of these strategies:

1. Delete the auth subject.
2. Remove current roles referenced by the `_auth` subject, and associate a role that has no permission.

If you think the token was compromised but you still want the same roles + rules, you can copy the existing `_auth` predicates to a new `_auth` subject. Recall a `_user` can have many `_auth` entities. If using Fluree for authorization, the user will be prompted to log in again, and a new token will be issued.

If you have a token but don't know the `_auth` subject it is tied to, you can get that information from the token itself. The middle part of the token (between the two `.`) is JSON that is Base64 encoded. Here is a way to decode it in javascript: `JSON.parse(atob("place_token_here".split('.')[1]))`. The auth `_id` value is in the `sub` key (subject).

You should try to make tokens expire at a reasonable timeframe that balances security with your application's needed convenience.

### Token Permissions

Root tokens have full access to query, transact, create tokens, and view logs in the relevant database. There are two ways to create root tokens:

1. Submit a request to [api/db/token](/api/hosted-endpoints/hosted-examples#-api-db-token) with `"root": true`. (Full specifications for what can be included in this request can be found in the [token examples](/api/hosted-endpoints/hosted-examples#-api-db-token)).

```
Action: POST
Endpoint: https://[ACCOUNT NAME].beta.flur.ee/api/db/token
Headers: {"Authorization": "Bearer [MASTER TOKEN]"}
Body: {
  "root": true,
  "expireSeconds": 3599,
  "db": "[ACCOUNT].[DBNAME]"
}
```

2. Request a token using a root auth record. 

Note that all databases have a built-in `["_role/id", "root"]` role with access to everything inside a database. If you need to create an authorization record, see the example provided:

```
[
  {
    "_id":    "_auth",
    "id":    "db-admin",
    "doc":    "A db admin auth that has full data visibility and can generate tokens for other users.",
    "roles":  [["_role/id" "root"]]
  }
]
```

You can then request a token using that auth as follows:

```
Action: POST
Endpoint: https://[ACCOUNT NAME].beta.flur.ee/api/db/token
Headers: {"Authorization": "Bearer [MASTER TOKEN]"}
Body: {
  "auth": ["_auth/id", "db-admin"],
  "expireSeconds": 3599,
  "db": "[ACCOUNT].[DBNAME]"
}
```

Remember, authorization is governed by rules (stored in the `_rule` collection). Rule functions (either true/false or more complicated [smart functions](/docs/smart-functions)) are stored in the `_fn` collection, and listed in the multi-cardinality predicate, `_rule/fns` as a `ref`. Rules are grouped into roles (stored in the `_role` collection), and roles are assigned to auth entities (`_auth` collection).
