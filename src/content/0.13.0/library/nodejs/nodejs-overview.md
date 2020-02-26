## Overview

Using the NodeJS library, a NodeJS service can be configured as a fully-functioning query peer.  After establishing an initial connection, a web socket is used to communicate to a ledger server/group.  

The main commands are below.

> For the downloadable version, unless you changed the default `fdb-api-port`, the full URL is `http://localhost:8080/`

Action | Command | Explanation 
-- | -- | --
Connect | <ul style="list-style-type:none; padding-left: 0;"><li>`connect`</li><li>`connect_p`</li></ul> | Connect to a ledger server/group using URL address(es)
Close | `close` | Closes a connection
DB | `db` | Returns a queryable database
DB Schema | `db_schema` | Returns the schema map for a database 
New Ledger | `new_ledger` | Creates a new ledger
Resolve Ledger | `resolve_ledger` | Resolves a ledger identity in the current connection
Delete Ledger | `delete_ledger` | Deletes a ledger
Collection Id | `collection_id` | Returns the id of a collection
Predicate Id | `predicate_id` | Returns the id of a predicate
Subject Id | `subject_id` | Returns the subject identity for a given object, that can be used in queries
Query | `q` | Query in FlureeQL syntax
Multi-Query | `multi_query` | Multi-Queries in FlureeQL syntax
Block | `block_query` | Block queries in FlureeQL syntax
Block Range | `block_range` | Block range queries in FlureeQL syntax
History |  `history_query`| History queries in FlureeQL syntax
Signed Query | `signed_query` | Signed query in FlureeQL syntax
Transact | `transact` | Submits a transaction for a ledger.
Monitor Transaction | `monitor_tx` | Returns the results of the monitor transaction request or a timeout
GraphQL | `graphql` | Queries or transactions in GraphQL syntax, as a string
SPARQL | `sparql` | Queries in SPARQL syntax, as a string
Listen | `listen` | Listens to all events of a given ledger
Close Listener | `close_listener` | Closes a listener
Listeners | `listeners` | Returns a list of listeners currently registered for each ledger


For queries and transactions, a signature is not required if the option `fdb-open-api` is set to true (default for the downloaded version of Fluree). 

More information on [signing queries](/docs/identity/signatures#signed-queries) and [signing transactions](/docs/identity/signatures#signed-transactions) can be found in the linked sections. 

See [NodeJS Library Examples](/library/nodejs/nodejs-examples) for examples of how to use each of the commands.