## Overview

Downloaded endpoints can only be used in the downloadable versions of Fluree. All requests, except requests to `/storage` and `/health`, should be POST requests. The main downloaded endpoints are below, and they are all structured as follows:

`/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/[ACTION]`

- For the downloadable version, unless you changed the default `fdb-api-port`, the full URL is `http://localhost:8080/fdb/[DBNAME]/[ACTION]`

Action | Endpoint | Explanation 
-- | -- | --
DBs | `/fdb/dbs` | Returns a list of all ledgers in the transactor group. 
New DB | `/fdb/new-db` | Creates a new ledger
Query | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/query` | Queries in FlureeQL syntax
Multi-Query | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/multi-query` | Multi-Queries in FlureeQL syntax
Block | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/block` | Block queries in FlureeQL syntax
History |  `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/history`| History queries in FlureeQL syntax
Transact | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/transact` | Transactions in FlureeQL syntax
GraphQL | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/graphql` | Queries or transactions in GraphQL syntax, as a string
SPARQL | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/sparql` | Queries in SPARQL syntax, as a string
Command | `/fdb/[NETWORK-NAME]/[DBID]/command` | Commands, such as transactions, with a signature in the body. See [signing transactions](/docs/identity/signatures#signed-transactions).

Other endpoints:

Action | Verb | Endpoint | Description
-- | -- | -- | --
Health | ANY | `/fdb/health` | Returns whether or not the server is ready. 
Storage | GET | `/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]` | Get all key-value pairs of a certain type
Storage | GET | `/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]/[KEY]` | Gets the value for the provided key
Sub | POST | `/fdb/sub` | Handles subscriptions


For both queries and transactions, a signature is not required if the option `fdb-open-api` is set to true (default for the downloaded version of Fluree). 

More information on [signing queries](/docs/identity/signatures#signed-queries) and [signing transactions](/docs/identity/signatures#signed-transactions) can be found in the linked sections. 

See [Downloaded Endpoint Examples](/api/downloaded-endpoints/downloaded-examples) for examples of how to use each of the endpoints.