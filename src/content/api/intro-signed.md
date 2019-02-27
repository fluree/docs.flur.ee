## Overview

Signed endpoints can be used in both the downloadable and the hosted versions of Fluree. All requests,unless otherwise specified, should be POST requests. The main signed endpoints are below, and they are all structured as follows:

`/fdb/[NETWORK-NAME]/[DBID]/[ACTION]`

- For the hosted version, the network is "dev", and the full URL is `https://db.flur.ee/api/db/[NETWORK]/[DBID]/[ACTION]`.
<br/>
<br/>
- For the downloadable version, unless you changed the default `fdb-api-port` or `fdb-network`, the full URL is `http://localhost:8080/fdb/dev/[DBID]/[ACTION]`

Action | Endpoint | Explanation 
-- | -- | --
Query | `/fdb/[NETWORK-NAME]/[DBID]/query` | Queries in FlureeQL syntax
Multi-Query | `/fdb/[NETWORK-NAME]/[DBID]/multi-query` | Multi-Queries in FlureeQL syntax
Block | `/fdb/[NETWORK-NAME]/[DBID]/block` | Block queries in FlureeQL syntax
History |  `/fdb/[NETWORK-NAME]/[DBID]/history`| History queries in FlureeQL syntax
Transact | `/fdb/[NETWORK-NAME]/[DBID]/transact` | Transactions in FlureeQL syntax
GraphQL | `/fdb/[NETWORK-NAME]/[DBID]/graphql` | Queries or transactions in GraphQL syntax, as a string
SPARQL | `/fdb/[NETWORK-NAME]/[DBID]/sparql` | Queries in SPARQL syntax, as a string

Other endpoints:

Action | Verb | Endpoint | Description
-- | -- | -- | --
New Keys | GET | `/fdb/new-keys` | Returns a valid public key, private key, and auth-id.
Dbs | POST | `/fdb/dbs` | Returns all the dbs in the transactor group.
New DB | POST |`/fdb/new-db` | Creates a new database.
Health | ANY | `/fdb/health` | Returns whether or not the server is ready. 
Storage | GET | `/fdb/storage/[NETWORK-NAME]/[DBID]/[TYPE]` | Get all key-value pairs of a certain type
Storage | GET | `/fdb/storage/[NETWORK-NAME]/[DBID]/[TYPE]/[KEY]` | Get a the value for the provided key
Sub | POST | `/fdb/sub` | Handles subscriptions


For both queries and transactions, a signature is not required if the option `fdb-group-open-api` is set to true (default for the downloaded version of Fluree). 

See [Signing Queries](/api/signed-endpoints/signatures#signed-queries) or [Signing Transactions](/api/signed-endpoints/signatures#signed-transactions) for information on how to sign various types of endpoints. 

See [Signed Endpoint Examples](/api/signed-endpoints/signed-examples) for examples of how to use each of the endpoints.