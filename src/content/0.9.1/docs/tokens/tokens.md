## Overview

Interacting with Fluree from your application can be done in one of three ways:

1. The JSON API (i.e. FlureeQL)
2. GraphQL
3. An embeddable Fluree client (not yet in production)

For any of these methods, a valid token must be supplied with the ledger requests (queries, transactions, etc.). 

Tokens are tied to a specific authorization record stored in the ledger and govern the permission of the requests. There are several ways to get a token which are subsequently explained.

It is worth noting that transactions are signed using public/private key cryptography. The hosted Fluree abstracts this from your application so that a more common username/password authentication scheme can be utilized.


### Getting Tokens

Interacting with the hosted Fluree is done using secure tokens that have the authorization identity encoded directly in them. There are several ways to get tokens, and the method you choose is influenced by how you'd like to run Fluree.

**Interacting with Fluree only from your app server**

Fluree can be run in a manner similar to a traditional ledger server, 'behind' your application server. If you choose to utilize it in this way, you simply need to generate a token with the permissions you desire (likely full access) and pass it to your application. You provide the token to your application like you would any secret, typically via an environment variable.

To get a permanent admin token, follow these steps:

1. Identify the authorization record (or create one) that you wish the token to utilize. A sample transaction is provided here if you need to create a new one. Note that, by default, all ledgers have a built-in `["_role/id", "root"]` role with access to everything inside a ledger.
2. Generate a token tied to that authorization record either via the Fluree admin dashboard or via an API call

If you need to create an authorization record, see the example provided.

Remember, authorization is governed by rules (stored in the `_rule` collection). Rule predicates (either true/false or more complicated [ledger functions](#ledger-functions)) are stored in the `_fn` collection, and listed in the multi-cardinality attribute, `_rule/predicate` as a `ref`. Rules are grouped into roles (stored in the `_role` collection), and roles are assigned to auth entities (`_auth` collection).

#### Sample rule, role and auth record for admin privileges

```flureeql
[
  {
    "_id":    "_auth",
    "id":    "db-admin",
    "doc":    "A db admin auth that has full data visibility and can generate tokens for other users.",
    "roles":  [["_role/id" "root"]]
  }
]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[
  {
    "_id":    "_auth",
    "id":    "db-admin",
    "doc":    "A db admin auth that has full data visibility and can generate tokens for other users.",
    "roles":  ["_role$db-admin"] 
  },
  {
    "_id":   "_role$db-admin", 
    "id":    "db-admin",
    "doc":   "A role for full access to ledger.",
    "rules": ["_rule$db-admin",  "_rule$db-token", "_rule$db-logs"] 
  },
  {
    "_id":       "_rule$db-admin" ,
    "id":        "db-admin",
    "doc":       "Rule that grants full access to all collections.",
    "collection":    "*",
    "collectionDefault": true,
    "ops":       ["query", "transact"],
    "predicate": ["_fn$name", "true"]
  },
  {
    "_id":       "_rule$db-token" ,
    "id":        "db-admin-token",
    "doc":       "Rule allows token generation for other users.",
    "ops":       ["token"],
    "predicate": ["_fn$name", "true"]
  },
    {
    "_id":       "_rule$db-logs" ,
    "id":        "db-admin-logs",
    "doc":       "Rule allows user to access account logs.",
    "ops":       ["logs"],
    "predicate": ["_fn$name", "true"]
  }
]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addRoleRuleAuth($myAuthTx: JSON){
  transact(tx: $myAuthTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myAuthTx": "[{\"_id\":\"_auth\",\"id\":\"db-admin\",\"doc\":\"A db admin auth that has full data visibility and can generate tokens for other users.\",\"roles\":[\"_role$db-admin\"]},{\"_id\":\"_role$db-admin\",\"id\":\"db-admin\",\"doc\":\"A role for full access to ledger.\",\"rules\":[\"_rule$db-admin\",\"_rule$db-token\",\"_rule$db-logs\"]},{\"_id\":\"_rule$db-admin\",\"id\":\"db-admin\",\"doc\":\"Rule that grants full access to all collections.\",\"collection\":\"*\",\"collectionDefault\":true,\"ops\":[\"query\",\"transact\"],\"predicate\":[\"_fn$name\",\"true\"]},{\"_id\":\"_rule$db-token\",\"id\":\"db-admin-token\",\"doc\":\"Rule allows token generation for other users.\",\"ops\":[\"token\"],\"predicate\":[\"_fn$name\",\"true\"]},{\"_id\":\"_rule$db-logs\",\"id\":\"db-admin-logs\",\"doc\":\"Rule allows user to access account logs.\",\"ops\":[\"logs\"],\"predicate\":[\"_fn$name\",\"true\"]}]"
}
```

#### Query for all `_auth` records and their respective rules and roles

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": [ "*", { "_auth/roles": [ "*", {"_role/rules": ["*"]} ] } ], "from": "_auth"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```flureeql
{
  "select": [ "*", { "_auth/roles": [ "*", {"_role/rules": ["*"]} ] } ],
  "from": "_auth"
}
```

```graphql
{ graph {
  _auth {
    _id
    id
    doc
    key
    roles {
      id
      _id
      doc
      rules {
        id
        _id
        doc
        collection
        collectionDefault
        predicate
        ops
      }
    }
  }  
}
}
```

**Interacting with Fluree directly from your end-user apps**

Fluree is also designed to interact directly with front-end apps/UIs via a set of permissions tied to individual users. The rules-based permissions will 'hide' any data the user is unable to view, and prevent unauthorized transactions. In this case, each user will need a unique token tied to them. There are two ways to generate these user-specific tokens:

1. An API endpoint, `/api/db/token`, can generate tokens assuming the user generating the token has permission to do so for the given user / auth record. You can roll your own authentication logic within your app server, and once satisfied, use the API endpoint to generate the token and pass it to the client for subsequent use.
2. For hosted Fluree, we provide an authentication service you can leverage if you like by having your end-user application POST username + password to the `/api/signin` JSON endpoint, and assuming successful authentication, a token will be returned. Additional options such as token expiration can also be provided. This service also handles password reset requests for you.


### Revoking Tokens

Tokens become useless under two conditions:

1. They reach their token expiration date (assuming one was provided when creating the token).
2. The `_auth` entity the token is associated with no longer has permissions.

A token is tied directly to a specific `_auth` entity, and with every request the roles + rules associated with that entity are retrieved. Therefore, the way to make a token useless is to make the `_auth` entity it is tied to useless. To do so, employ one of these strategies:

1. Delete the auth entity (ensure if it is referenced to a `_user` via the `_user/auth` attribute that the reference is also deleted. 
2. Remove current roles referenced by the `_auth` entity, and associate a role that has no permission.

If you think the token was compromised but you still want the same roles + rules, you can copy the existing `_auth` attributes to a new `_auth` entity. Recall a `_user` can have many `_auth` entities. If using Fluree for authorization, the user will be prompted to log in again, and a new token will be issued.

If you have a token but don't know the `_auth` entity it is tied to, you can get that information from the token itself. The middle part of the token (between the two `.`) is JSON that is Base64 encoded. Here is a way to decode it in javascript: `JSON.parse(atob("place_token_here".split('.')[1]))`. The auth `_id` value is in the `sub` key (subject).

You should try to make tokens expire at a reasonable timeframe that balances security with your application's needed convenience.

