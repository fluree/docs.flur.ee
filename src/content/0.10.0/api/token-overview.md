TOKEN


## Getting Tokens

Tokens are tied to a specific authorization record stored in the ledger and govern the permission of the requests. There are several ways to get a token which are subsequently explained.

It is worth noting that transactions are signed using public/private key cryptography. The hosted Fluree abstracts this from your application so that a more common username/password authentication scheme can be utilized.


Interacting with the hosted Fluree is done using secure tokens that have the authorization idsubject encoded directly in them. There are several ways to get tokens, and the method you choose is influenced by how you'd like to run Fluree.

**Interacting with Fluree only from your app server**

Fluree can be run in a manner similar to a traditional ledger server, 'behind' your application server. If you choose to utilize it in this way, you simply need to generate a token with the permissions you desire (likely full access) and pass it to your application. You provide the token to your application like you would any secret, typically via an environment variable.

To get a permanent admin token, follow these steps:

1. Identify the authorization record (or create one) that you wish the token to utilize. A sample transaction is provided here if you need to create a new one. Note that, by default, all ledgers have a built-in `["_role/id", "root"]` role with access to everything inside a ledger.
2. Generate a token tied to that authorization record either via the Fluree admin dashboard or via an API call

If you need to create an authorization record, see the example provided.

Remember, authorization is governed by rules (stored in the `_rule` collection). Rule functions (either true/false or more complicated [ledger functions](#ledger-functions)) are stored in the `_fn` collection, and listed in the multi-cardinality predicate, `_rule/fns` as a `ref`. Rules are grouped into roles (stored in the `_role` collection), and roles are assigned to auth entities (`_auth` collection).

## Revoking Tokens

Tokens become useless under two conditions:

1. They reach their token expiration date (assuming one was provided when creating the token).
2. The `_auth` subject the token is associated with no longer has permissions.

A token is tied directly to a specific `_auth` subject, and with every request the roles + rules associated with that subject are retrieved. Therefore, the way to make a token useless is to make the `_auth` subject it is tied to useless. To do so, employ one of these strategies:

1. Delete the auth subject (ensure if it is referenced to a `_user` via the `_user/auth` predicate that the reference is also deleted. 
2. Remove current roles referenced by the `_auth` subject, and associate a role that has no permission.

If you think the token was compromised but you still want the same roles + rules, you can copy the existing `_auth` predicates to a new `_auth` subject. Recall a `_user` can have many `_auth` entities. If using Fluree for authorization, the user will be prompted to log in again, and a new token will be issued.

If you have a token but don't know the `_auth` subject it is tied to, you can get that information from the token itself. The middle part of the token (between the two `.`) is JSON that is Base64 encoded. Here is a way to decode it in javascript: `JSON.parse(atob("place_token_here".split('.')[1]))`. The auth `_id` value is in the `sub` key (subject).

You should try to make tokens expire at a reasonable timeframe that balances security with your application's needed convenience.