## JavaScript Library Examples

The following commands are available in the JavaScript api library.  JavaScript promises are used to return results from long-running processes.   

### **connect**
Connect to a ledger server using an URL address. If using a ledger group, multiple addresses can be supplied, separated by a comma.  
  
#### Parameter(s)
Name | Value
-- | --
`server-string` | a string identifying onr ore more ledger servers

#### Returns
Returns a connection object.

#### JavaScript Example  
     
```all
const flureeServerUrl = "http://localhost:8090";
var myConn = flureedb.connect(flureeServerUrl);
```   

### **close**
Close a connection to a ledger server/group.
  
#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command

#### Returns
Returns a boolean, false when the connection is not currently open; otherwise, true.

#### JavaScript Example  
     
```all
    const flureeServerUrl = "http://localhost:8090";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    flureedb.close(myConn);
```


### **db**
Returns a queryable database from the connection. The database object represents a point-in-time. As such, the database will not contain block updates submitted after acquisition of the channel.

#### Parameter(s)
Key | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 


#### Returns
Returns a queryable database as an asynchronous channel.

#### JavaScript Example  
     
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myDb = flureedb.db(myConn, myLedgerName);
    :
    :
    flureedb.close(myConn);
```
  

### **db_schema**
Generates a schema map for a point-in-time database.

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command 

#### Returns
Returns a JavaScript promise that will eventually deliver the schema map for a database.

#### JavaScript Example  
     
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myDb = flureedb.db(myConn, myLedgerName);
    :
    flureedb.db_schema(myDb)
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});
    :
    flureedb.close(myConn);
```
  

### **new_ledger**
Creates a new ledger given a "network/id". If the network specified does not exist, it creates a new network. This request returns a transaction id, the request does not wait to database to be fully initialized before returning.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 
`options` | an optional map of key/value pairs  

##### Option(s)  
Key | Value
-- | --
`:alias` | an alias for the database, if different than the id
`:root`  | account id to bootstrap with (string). Defaults to connection default account id
`:doc`   | doc string about this ledger
`:fork`  | If forking an existing db, ref to db (actual identity, not db-ident). Must exist in network
`:forkBlock` | If fork is provided, optionally provide the block to fork at. Defaults to latest known.

#### Returns
The JavaScript promise that eventually returns a transaction id.  The transaction id can be used to query the results of the new ledger command.

#### JavaScript Example  
     
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/invoice";
    var myConn = flureedb.connect(flureeServerUrl);
    flureedb.new_ledger( myConn, myLedgerName )
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});
     :
    flureedb.close(myConn);
```

  
### **resolve_ledger**
Resolves a ledger identity in the form of 'network/ledger-or-alias' and returns a two-tuple of [network ledger].  An alias lookup is always performed first, and if an alias doesn't exist it is assumed the provided name is a ledger id.  If you are providing a ledger id, and wish to skip an alias lookup, a prefix of '$' can be used for the name portion of the db-ident. 

 For example,
  - testnet/testledger - Look for ledger with an alias or id of testledger on network testnet.
  - testnet/$testledger - look for a ledger with id testledger on network testnet (skip alias lookup).


#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 

#### Returns
Returns a two-tuple of [network ledger-id]

#### JavaScript Example  
     
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myTuple = flureedb.resolve_ledger(myConn, myLedgerName);
    :
    :
    flureedb.close(myConn);
```

  
### **collection_id**
Returns a JavaScript promise that eventually contains either the id of a collection or nil if the collection does not exist.

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command
`collection` | name of a collection 

#### Returns
The id of a collection or nil when the collection does not exist.

#### JavaScript Example  
     
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myDb = flureedb.db(myConn, myLedgerName);
    :
    :
    var myCollectionName = 'artist';
    flureedb.collection_id( myDb, myCollectionName )
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);})
      ;
    :
    :
    flureedb.close(myConn);
```
  
### **predicate_id**
Returns a JavaScript promise that eventually contains either the id of a predicate or nil if the predicate does not exist.  Predicates can be indentified by name or unique tuple.

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command
`predicate` | name of a predicate 

#### Returns
The id of a predicate or nil when the predicate does not exist.

#### JavaScript Example  
     
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myDb = flureedb.db(myConn, myLedgerName);
    :
    :
      var myPredicateName = 'person/handle';
      flureedb.predicate_id( myDb, myPredicateName )
        .then( resp => {console.log('Success ', resp);})
        .catch( error => {console.log('Error ', error);})
        ;
    :
    :
    flureedb.close(myConn);
```
  
### **subject_id**
Returns a JavaScript promise that eventually contains either the subject id of a subject or nil if the subject does not exist.

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command
`subject` | string identifying the subject identity 

#### Returns
The id of a subject or nil when the subject identity does not exist.

#### JavaScript Example  
     
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myDb = flureedb.db(myConn, myLedgerName);
    :
    :
      var mySubject = [ '_tag/id', '_predicate/type:geojson' ];
      var mySubjectJson = JSON.stringify(mySubject);
      flureedb.subject_id( myDb, mySubjectJson )
        .then( resp => {console.log('Success ', resp);})
        .catch( error => {console.log('Error ', error);})
      ;    
    :
    :
    flureedb.close(myConn);
```
  
### **q**
All single queries in FlureeQL syntax that include a `select` key should be issued through the `q` command. 

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command 
`query-map` | a map of key/value pairs defining the query
`options` | an optional map of key/value pairs

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### JavaScript Example   
An example of an unsigned request to `q` with the network, `test` and the database `chat`:
     
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myDb = flureedb.db(myConn, myLedgerName);
    :
    :
    var myQuery  = {
      select: ['*'],
      from:   '_collection'
    };
    var myQueryJson = JSON.stringify(myQuery);
    flureedb.q(myDb, myQueryJson)
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);})
    ;    
    :
    :
    flureedb.close(myConn);
```
  
&nbsp;&nbsp;
  
### **multi_query**
If you are submitting multiple FlureeQL queries at once (using the [multi-query syntax](/docs/query/advanced-query#multiple-queries)), that should be done through the `multi_query` command. 

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command 
`query-map` | a map of key/value pairs defining the query 
`options` | an optional map of key/value pairs 

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### JavaScript Example  
An example of an unsigned request to `multi_query`:
  
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myDb = flureedb.db(myConn, myLedgerName);
    :
    :
    var myMultiQuery = {
         collections: { select: ['*'], from: '_collection'},
         persons: {select: ['*'], from: 'person'}
        };
    flureedb.multi_query(myDb, JSON.stringify(myMultiQuery))
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);})
    ;    
    :
    :
    flureedb.close(myConn);
```

### **block_query**
FlureeQL [block queries](/docs/query/block-query) should be submitted to the `block_query` command. This does not include other types of queries (basic queries, history queries, etc) that might have a "block" key. This only includes queries like those in the linked section - queries that are returning flakes from a block or set of blocks. 

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 
`query-map` | a map of key/value pairs defining the query
`options` | an optional map of key/value pairs

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### JavaScript Example  
An example of an unsigned request to `block_query`:
  
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    var myBlockQuery = { block: [1,8] };
    flureedb.block_query(myConn, myLedgerName, JSON.stringify(myBlockQuery))
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});    
    :
    :
    flureedb.close(myConn);
```
  
### **block_range**
Given a ledger, returns blocks from a start block (inclusive) to end, if provided (exclusive). Each block is a separate map, containing keys :block and :flakes.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 
`start` | an integer identify the start block; start block is included
`end` | an integer identifying the end block; end block is excluded
`options` | an optional map of key/value pairs

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### JavaScript Example  
An example of an unsigned request to `block_range`:
  
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    flureedb.block_range( myConn, myLedgerName, 1, 8 )
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});    
    :
    :
    flureedb.close(myConn);
```
  
### *forward_time_travel*
Returns a core async chan with a new db based on the provided db, including the provided flakes. Flakes can contain one or more 't's, but should be sequential and start after the current 't' of the provided db. (i.e. if db-t is -14, flakes 't' should be -15, -16, etc.). *Remember 't' is negative and thus should be in descending order.*

A forward-time-travel db can be further forward-time-traveled.

A forward-time travel DB is held in memory, and is not shared across servers. Ensure you have adequate memory to hold the flakes you generate 
and add. If access is provided via an external API, do any desired size restrictions or controls within your API endpoint.

Remember schema operations done via forward-time-travel should be done in a 't' prior to the flakes that end up requiring the schema change.

#### Parameter(s)
Name | Value
-- | --
`db-source` | a database channel supporting time trave
`flakes` | An array of valid flakes

#### Returns
* a core asynchronous channel containing a new, queryable database

#### JavaScript Example  
  
```all
TBD
```
  
### **history_query**
FlureeQL [history queries](/docs/query/history-query) should be submitted to the `history` command. This only includes queries like those in the linked section.

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command 
`query-map` | a map of key/value pairs defining the query 
`options` | an optional map of key/value pairs 

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### JavaScript Example   
An example of an unsigned request to `history_query`:
  
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    var myDb = flureedb.db(myConn, myLedgerName);
    :
    :
    var myQuery  = {
      "history": ["person/handle", "zsmith"],
      "block": 4
    };
    flureedb.history_query(myDb, JSON.stringify(myQuery))
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});    
    :
    :
    flureedb.close(myConn);
```
  
### transact
Submits a transaction for a ledger and a transaction. Returns a promise    that will eventually have the result of the tx, the txid (if :txid-only option used), or an exception due to an invalid transaction or if the timeout occurs prior to a response.

Will locally sign a final transaction command if a private key is provided via :private-key in the options, otherwise will submit the transaction to the connected ledger and request signature, provided the ledger group has a default private key available for signing. 

Options is a map with the following possible keys:
   - private-key - The private key to use for signing. If not present, a default
                   private key will attempt to be used from the connection, if available.
   - auth        - The auth id for the auth record being used. The private key must
                   correspond to this auth record, or an authority of this auth record.
   - expire      - When this transaction should expire if not yet attempted.
                   Defaults to 5 minutes.
   - nonce       - Any long/64-bit integer value that will make this transaction unique.
                   By default epoch milliseconds is used.
   - deps        - List of one or more txids that must be successfully processed before
                   this tx is processed. If any fail, this tx will fail. (not yet implemented)
   - txid-only   - Boolean (default of false). If true, will not wait for a response to the tx,
                   but instead return with the txid once it is successfully persisted by the
                   transactors. The txid can be used to look up/monitor the response at a later time.
   - timeout     - will respond with an exception if timeout reached before response available.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 
`transaction` | a map of key/value pairs defining the transaction
`options` | an optional map of key/value pairs 

#### Returns
A JavaScript promise that eventually contains the transaction id or an error.

#### JavaScript Example  
An example of an unsigned request to `transact`:
  
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    var myTxn = [{
      "_id":    "_user",
      "username": "jdoe",
      }];
    flureedb.transact(myConn, myLedgerName, JSON.stringify(myTxn))
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});    
    :
    :
    flureedb.close(myConn);
```
  
An example of a signed request to `transact`:
  
```all
    import { getSinFromPublicKey, signTransaction } from 'fluree-cryptography';
    :
    :
    const publicKey = '023fa3aad728bcb4b571ee4b4aba77853e6e943307be842f46429bfbac74fc7cb0';
    const privateKey = '2debec18af7f95e099f44007d68603d9b5a17906ebdb77b214dc1a5df89291c9';
    const auth = 'Tf9oNJ2RRFkx8jSUXoyXvhRFDq1S5CW9c1g';
    :
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    var myTxn = [{
      "_id":    "_user",
      "username": "jdoe",
      }];
    var myOpts = {
        "private-key": privateKey,
        auth: auth,
        expire: Date.now() + 30000,
        nonce: 1,
        timeout: 600000,
        fuel: 100000  
    };
    flureedb.transact(myDb, JSON.stringify(myTxn), JSON.stringify(myOpts))
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});    
    :
    :
    flureedb.close(myConn);
```
  
### **monitor_tx**
Monitors a database for a specific transaction id included in a block. Returns a promise that will eventually contain a response or an exception if the timeout period has expired.  Also, the response itself may contain an exception, if the transaction resulted in an exception.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 
`transaction-id` | the transaction id returned by the `transact` command
`timeout` | timeout, in milliseconds

#### Returns
A JavaScript promise that eventually returns the results from the monitor_tx command.

#### JavaScript Example  
An example of an unsigned request to `monitor_tx`:
  
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    var myTxId = 'f27e0b890bbc47e0bd67dc452fded9eb881548015d3e9860cf69bd5f19c20660';
    flureedb.monitor_tx (myConn, myLedgerName, myTxId, 6000)
      .then( resp => {console.log('Returned', resp);})
      .catch( error => {console.log('Error ', error);});
    :
    :
    flureedb.close(myConn);
```
  
### **listen**
Listens to all events of a given ledger. Supply a ledger identity, any key, and a two-argument function that will be called with each event. The key is any arbitrary key, and is only used to close the listener via close-listener, otherwise it is opaque to the listener. The callback function's first argument is the event header/metadata and the second argument is the event data itself.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 
`key` | any arbitrary id
`callback` | callback function/handler

#### Returns
Returns true if the listener is successfully added.  Otherwise, an exception is returned.

#### JavaScript Example  
  
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    var myListenerKey = "supercalifragilisticexpialidocious";
    var someFunction = function() {
        ; // do something
      };
    var listenerAdded? = flureedb.listen(myConn, myDbName, myKey, someFunction);
    console.log("Added listener?", listenerAdded?);
    :
    :
    flureedb.close(myConn);
```
  
### close_listener
Closes a listener associated with a given connection, ledger and key

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger 
`key` | same arbitrary key provided to the `listen` command

#### Returns
Returns true if a callback function was associated with the key and removed.  Otherwise. nil is returned.

#### JavaScript Example  
  
```all
    const flureeServerUrl = "http://localhost:8090";
    const myLedgerName = "test/chat";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    var myListenerKey = "supercalifragilisticexpialidocious";
    var listenerClosed? = flureedb.close_listener(myConn, myDbName, myKey);
    console.log("Closed listener?", listenerClosed?);
    :
    :
    flureedb.close(myConn);
```
  

### listeners
Return a list of listeners currently registered for each ledger along with their respective keys.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command

#### Returns
Returns a list of listeners registered for the given connection object.

#### JavaScript Example  
  
```all
    const flureeServerUrl = "http://localhost:8090";
    var myConn = flureedb.connect(flureeServerUrl);
    :
    :
    var myListeners = flureedb.listeners(myConn);
    console.log('listeners: ', myListeners);
    :
    :
    flureedb.close(myConn);
```

