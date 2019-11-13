## Overview

The compiled JavaScript Library (apis) run in the browser, using a web socket to connect to a downloaded ledger server/group.  The main commands are below.

For the downloadable version, unless you changed the default `fdb-api-port`, the full URL is `http://localhost:8080/`

Action | Command | Explanation 
-- | -- | --
Connect | `connect` | Connect to a ledger server/group using URL address(es)
Close | `close` | Closes a connection
DB | `db` | Returns a queryable database
DB Schema | `db_schema` | Returns the schema map for a database 
New Ledger | `new_ledger` | Creates a new ledger
Resolve Ledger | `resolve_ledger` | Resolves a ledger identity in the current connection
Collection Id | `collection_id` | Returns the id of a collection
Predicate Id | `predicate_id` | Returns the id of a predicate
Subject Id | `subject_id` | Returns the subject identity for a given object, that can be used in queries
Query | `q` | Query in FlureeQL syntax
Multi-Query | `multi_query` | Multi-Queries in FlureeQL syntax
Block | `block_query` | Block queries in FlureeQL syntax
Block Range | `block_range` | Block range queries in FlureeQL syntax
History |  `history_query`| History queries in FlureeQL syntax
Transact | `transact` | Submits a transaction for a ledger and a transaction.
Monitor Transaction | `monitor_tx` | Returns the results of the monitor transaction request or a timeout
Listen | `listen` | Listens to all events of a given ledger
Close Listener | `close_listener` | Closes a listener
Listeners | `listeners` | Returns a list of listeners currently registered for each ledger


For both queries and transactions, a signature is not required if the option `fdb-open-api` is set to true (default for the downloaded version of Fluree). 

More information on [signing queries](/docs/identity/signatures#signed-queries) and [signing transactions](/docs/identity/signatures#signed-transactions) can be found in the linked sections. 

See [JavaScript Library Examples](/api/javascript-library/javascript-examples) for examples of how to use each of the commands.