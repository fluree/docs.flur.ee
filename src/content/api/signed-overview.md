## Overview

Signed endpoints can be used in both the downloadable and the hosted versions of FlureeDB. All requests, except requests to `/storage` and `/health`, should be POST requests. The main signed endpoints are below, and they are all structured as follows:

`/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/[ACTION]`

- For the hosted version, the network is "dev", and the full URL is `https://[ACCOUNTNAME].beta.flur.ee/fdb/dev/[DBNAME]/[ACTION]`.
<br/>
<br/>
- For the downloadable version, unless you changed the default `fdb-port` or `fdb-network`, the full URL is `http://localhost:8080/fdb/dev/[DBNAME]/[ACTION]`

Action | Endpoint | Explanation 
-- | -- | --
Query | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/query` | Queries in FlureeQL syntax
Multi-Query | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/multi-query` | Multi-Queries in FlureeQL syntax
Block | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/block` | Block queries in FlureeQL syntax
History |  `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/history`| History queries in FlureeQL syntax
Transact | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/transact` | Transactions in FlureeQL syntax
GraphQL | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/graphql` | Queries or transactions in GraphQL syntax, as a string
SPARQL | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/sparql` | Queries in SPARQL syntax, as a string

Other endpoints:

Action | Verb | Endpoint | Description
-- | -- | -- | --
Health | ANY | `/fdb/health` | Returns whether or not the server is ready. 
Storage | GET | `/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]` | Get all key-value pairs of a certain type
Storage | GET | `/fdb/storage/[NETWORK-NAME]/[DBNAME-OR-DBID]/[TYPE]/[KEY]` | Gets the value for the provided key
Sub | POST | `/fdb/sub` | Handles subscriptions


For both queries and transactions, a signature is not required if the option `fdb-group-open-api` is set to true (default for the downloaded version of FlureeDB). 

Any requests sent to `/query`, `/multi-query`, `/block`, `/history`, `/sparql`, and any queries submitted through `/graphql` should have a signature in Authorization header (if `fdb-group-open-api` is set to false) - see [signed queries](/docs/identity/signatures#signed-queries). Any transactions submitted, either through `/transact` or `/graphql`, should include a signature in the transaction map - see [signed transactions](/docs/identity/signatures#signed-transactions).

See [Signed Endpoint Examples](/api/signed-endpoints/signed-examples) for examples of how to use each of the endpoints.