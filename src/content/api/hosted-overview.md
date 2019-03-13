## Overview

Hosted endpoints can only be used in the hosted versions of Fluree. All requests should be POST requests. The signed endpoints are below, and they are all structured as follows:

`https://db.flur.ee/[ENDPOINT]`.

These endpoints are NOT available in the downloadable version.

The following endpoint require a token (retrievable from `/api/signin`) in the header:

Action | Endpoint | Explanation 
-- | -- | --
Query | `/api/db/NETWORK/DB/query` | Queries in FlureeQL syntax
Multi-Query | `/api/db/NETWORK/DB/multi-query` | Multi-Queries in FlureeQL syntax
Block | `/api/db/NETWORK/DB/block` | Block queries in FlureeQL syntax
History |  `/api/db/NETWORK/DB/history`| History queries in FlureeQL syntax
Transact | `/api/db/NETWORK/DB/transact` | Transactions in FlureeQL syntax
GraphQL | `/api/db/NETWORK/DB/graphql` | Queries or transactions in GraphQL syntax, as a string
SPARQL | `/api/db/NETWORK/DB/sparql` | Queries in SPARQL syntax, as a string
Command | `/api/db/NETWORK/DB/command` | Commands, such as transactions, with a signature in the body. See [signing transactions](/docs/identity/signatures#signed-transactions).
Dbs | `/api/dbs` | Get all of the databases for an account.
Actions | `/api/action` | Actions, such as a a new database, a new user, or archiving a database (not yet supported).
Logs | `/api/fdb/logs/[account]` | Retrieve the logs for a given database. Syntax in [Examples](/api/hosted-endpoints/hosted-examples)

The following endpoints do not require a token in the header:

Action | Endpoint | Explanation 
-- | -- | --
Accounts | `/api/accounts` | Get all of the account associated with a particular account.
Signin | `/api/signin` | Retrieve a token for your account for the master database. Syntax in [Getting Tokens](/api/hosted-endpoints/getting-tokens) and [Examples](/api/hosted-endpoints/hosted-examples)
Reset Password | `/api/reset-pw` | Sends a reset-token to your email, so that you can reset your password.
New Password | `/api/new-pw` | Given a reset token, allows you to reset your password. 

Each account in the hosted environment is its own network.