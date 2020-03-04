## Overview

Downloaded endpoints can only be used in the downloadable versions of Fluree. All requests, except requests to `/storage` and `/health`, should be POST requests. The main downloaded endpoints are below, and they are all structured as follows:

`/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/[ACTION]`

- For the downloadable version, unless you changed the default `fdb-api-port`, the full URL is `http://localhost:8080/fdb/[DBNAME]/[ACTION]`

### Main Endpoints

Action | Endpoint | Explanation 
-- | -- | --
DBs | `/fdb/dbs` | Returns a list of all ledgers in the transactor group. 
New DB | `/fdb/new-db` | Creates a new ledger
Snapshot | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/snapshot` | Creates a (local) snapshot file from an existing ledger
Export | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/export` | Locally exports an existing ledger into either `.xml` or `.ttl`
Delete DB | `/fdb/delete-db` | Deletes ledger (does not currently delete ledger files)
Add Server | `/fdb/add-server` | (Beta feature) Dynamically adds a server to the network.
Remove Server | `/fdb/remove-server`| (Beta feature) Dynamically removes a server from the network.
Query | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/query` | Queries in FlureeQL syntax
Multi-Query | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/multi-query` | Multi-Queries in FlureeQL syntax
Block | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/block` | Block queries in FlureeQL syntax
History |  `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/history`| History queries in FlureeQL syntax
Transact | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/transact` | Transactions in FlureeQL syntax
GraphQL | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/graphql` | Queries or transactions in GraphQL syntax, as a string
SPARQL | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/sparql` | Queries in SPARQL syntax, as a string
Command | `/fdb/[NETWORK-NAME]/[DBID]/command` | Commands, such as transactions, with a signature in the body. See [signing transactions](/docs/identity/signatures#signed-transactions).
Reindex | `/fdb/[NETWORK-NAME]/[DBID]/reindex` | Reindexes the specified ledger.
Hide | `/fdb/[NETWORK-NAME]/[DBID]/hide` | Hides flakes that match the given pattern. 

### Test endpoints

Action | Endpoint | Explanation 
-- | -- | --
Generate Flakes | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/gen-flakes` | Returns the list of flakes that would be added to a ledger if a given transaction is issued. 
Query With | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/query-with` | Returns the results of a query using the existing database flakes, including flakes that are provided with the query. 
Test Transact With | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/test-transact-with` | Given a valid set of flakes that could be added to the database at a given point in time and a transaction, returns the flakes that would be added to a ledger if a given transaction is issued. 

### Password Authentication Endpoints

You need password authentication enabled to use these endpoints. See [config options](/docs/getting-started/installation#password-and-jwt-token-settings) for all password authentication options. 

Action | Endpoint | Explanation
-- | -- | --
[Generate](/api/downloaded-endpoints/downloaded-examples#-generate) | `/fdb/[NETWORK-NAME]/[DBID]/pw/generate` | Returns a valid token for a given user or role. Sets a valid password for that user or role. 
[Renew](/api/downloaded-endpoints/downloaded-examples#-renew) | `/fdb/[NETWORK-NAME]/[DBID]/pw/renew` | Given a token in the header and a new expiration time, returns a new token for a given user or role. 
[Login](/api/downloaded-endpoints/downloaded-examples#-login) | `/fdb/[NETWORK-NAME]/[DBID]/pw/login` | Given a password and user or auth id, returns a valid token. 


### Other endpoints

Action | Verb | Endpoint | Description
-- | -- | -- | --
Block Stats | POST | `/fdb/[NETWORK-NAME]/[DBID]/block-range-with-txn-async` | Block data, including signatures, instant, hash, flakes and transactions
Health | ANY | `/fdb/health` | Returns whether or not the server is ready. 
Ledger Stats | POST | `/fdb/[NETWORK-NAME]/[DBID]/ledger-stats` | General ledger stats, including status, # flakes, current block, and size (kb).
Storage | GET | `/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]` | Get all key-value pairs of a certain type
Storage | GET | `/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]/[KEY]` | Gets the value for the provided key
Sub | POST | `/fdb/sub` | Handles subscriptions

For both queries and transactions, a signature is not required if the option `fdb-open-api` is set to true (default for the downloaded version of Fluree). 

More information on [signing queries](/docs/identity/signatures#signed-queries) and [signing transactions](/docs/identity/signatures#signed-transactions) can be found in the linked sections. 

See [Downloaded Endpoint Examples](/api/downloaded-endpoints/downloaded-examples) for examples of how to use each of the endpoints.