## JavaScript Library Examples

You can dowbload the latest version of the Fluree JavaScript library from npm:
```all
npm install @fluree/flureedb
```

The following commands are available in the JavaScript api library. JavaScript promises are used to return results from long-running processes.   

>*For the following examples, it is assumed that you are using the downloaded Fluree Community Edition.  Unless you changed the default* `fdb-api-port`*, the full URL is* `http://localhost:8080/`

### **connect**
Connect to a ledger server using an URL address. If using a ledger group, multiple addresses can be supplied, separated by a comma.  

There are 2 versions of the connect command:
* `connect` returns a connection object
* `connect_p` returns a connection object via a promise
  
#### Parameter(s)
Name | Value
-- | --
`server-string` | a string identifying one or more ledger servers
`options` | <ul style="list-style-type:none; padding-left: 0;"><li>a JSON object containing configuration options.  The following option is currently supported:</li><li>-  `keep-alive-fn`: a JavaScript function that is executed when a connection is abruptly dropped.</li></ul>


#### Returns
Returns a connection object.

#### JavaScript Example  
An example of the `connect` command:
```all
const flureeServerUrl = "http://localhost:8080";
var myConn = flureedb.connect(flureeServerUrl);
```   
&nbsp;&nbsp;

An example of the `connect_p` command:
```all
const flureeServerUrl = "http://localhost:8080";
flureedb.connect_p(flureeServerUrl)
.then(conn => { 
  // execute a query or transaction
})
.catch(error => {
  // error handling
})
.finally( () => {
  // close connection
});
```
&nbsp;&nbsp;

An example of using `connect_p` with `keep-alive-fn` option:
```all
function flureeConnect(url, options){
    if (!url) {
        throw "Unable to connect to Fluree: Missing url. "
    }

    var cOpts = {};
    if (options && options.keepAlive && options.keepAlive === true) {
        cOpts = {"keep-alive-fn": function(){ flureeConnect(url,options); }}
    }

    flureedb.connect_p(url, cOpts)
    .then(conn => {
        reConnection = conn;
    })
    .catch(error => {
        console.error("Error connecting to Fluree DB", error);
        //  [  1.771s] [server] "Server contact error: " 
        //  "xhttp error - http://localhost:8080/fdb/health" 
        //  {:url "http://localhost:8080/fdb/health", :error :xhttp/http-error}
        // -> gracefully shutdown
        // -> or add re-try logic
    }) 

    :
    :
    const downloadedInstance = "http://localhost:8080"
    const options = {keepAlive: true};
    flureeConnect(downloadedInstance, options);
```

### **close**
Close a connection to a ledger server/group.
  
#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command

#### Returns
Returns a boolean, false when the connection is not currently open; otherwise, true.

#### JavaScript Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
var myConn = flureedb.connect(flureeServerUrl);
:
:
flureedb.close(myConn);
```


### **db**
Returns a queryable ledger from the connection. The ledger object represents a point-in-time ledger. As such, the ledger will not contain block updates submitted after acquisition of the channel.

#### Parameter(s)
Key | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 


#### Returns
Returns a queryable ledger as an asynchronous channel.

#### JavaScript Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
const myLedgerName = "test/chat";
var myConn = flureedb.connect(flureeServerUrl);
var myDb = flureedb.db(myConn, myLedgerName);
:
:
flureedb.close(myConn);
```
  

### **db_schema**
Generates a schema map for a point-in-time ledger.

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command 

#### Returns
Returns a JavaScript promise that will eventually deliver the schema map for a ledger.

#### JavaScript Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
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
Creates a new ledger given a "network/id". If the network specified does not exist, it creates a new network. This request returns a transaction id, the request does not wait for the ledger to be fully initialized before returning.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 
`options` | an optional map of key/value pairs  

##### Option(s)  
Key | Value
-- | --
`:alias` | an alias for the ledger, if different than the id
`:root`  | account id to bootstrap with (string). Defaults to connection default account id
`:doc`   | doc string about this ledger
`:fork`  | If forking an existing db, ref to db (actual identity, not db-ident). Must exist in network
`:forkBlock` | If fork is provided, optionally provide the block to fork at. Defaults to latest known.

#### Returns
A JavaScript promise that eventually contains a transaction id.  The transaction id can be used to query the results of the new ledger command.

#### JavaScript Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
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
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 

#### Returns
Returns a two-tuple of [network ledger-id]

#### JavaScript Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
const myLedgerName = "test/chat";
var myConn = flureedb.connect(flureeServerUrl);
var myTuple = flureedb.resolve_ledger(myConn, myLedgerName);
:
:
flureedb.close(myConn);
```


### delete_ledger
Deletes a ledger, such that a user will no longer be able to query or transact against that ledger. Currently, the files associated with the ledger are not physically deleted from disk. You can choose to delete those files yourself - or keep them. You will not be able to create a new ledger with the same name as the deleted ledger.


#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 

#### Returns
Returns a promise that eventually the results

#### JavaScript Example  

```all
const flureeServerUrl = "http://localhost:8080";
var myConn = flureedb.connect(flureeServerUrl);

flureedb.delete_ledger(myConn, "test/deleteme");

flureedb.close(flureeDbConn);
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
const flureeServerUrl = "http://localhost:8080";
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
const flureeServerUrl = "http://localhost:8080";
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
const flureeServerUrl = "http://localhost:8080";
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
An example of an unsigned request to `q` with the network, `test` and the ledger `chat`:
     
```all
const flureeServerUrl = "http://localhost:8080";
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
const flureeServerUrl = "http://localhost:8080";
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
FlureeQL [block queries](/docs/query/block-query) should be submitted to the `block_query` command. This does not include other types of queries (basic queries, history queries, etc) that might have a "block" key. This only includes queries that are returning flakes from a block or set of blocks. 

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 
`query-map` | a map of key/value pairs defining the query
`options` | an optional map of key/value pairs

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### JavaScript Example  
An example of an unsigned request to `block_query`:
  
```all
const flureeServerUrl = "http://localhost:8080";
const myLedgerName = "test/chat";
var myConn = flureedb.connect(flureeServerUrl);
:
:
var myQuery = { block: [1,8] };
flureedb.block_query(myConn, myLedgerName, JSON.stringify(myQuery))
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
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 
`start` | an integer identify the start block; start block is included
`end` | an integer identifying the end block; end block is excluded
`options` | an optional map of key/value pairs

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### JavaScript Example  
An example of an unsigned request to `block_range`:
  
```all
const flureeServerUrl = "http://localhost:8080";
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

### history_query
FlureeQL [history queries](/docs/query/history-query) should be submitted to the `history` command. This command only includes queries like those in the linked section.

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
const flureeServerUrl = "http://localhost:8080";
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

### signed_query
Submits a signed query for a ledger to the query peer or transaction server. Returns a promise that will eventually contain the result of the query, or an exception either due to an invalid query request or when a timeout occurs prior to a response.

Options is a map with the following possible keys:
   - private-key - The private key to use for signing. 
   - auth        - The auth id for the auth record being used. 
   - expire      - When this request should expire if not yet attempted.
                   Defaults to 5 minutes.
   - nonce       - Any long/64-bit integer value that will make this request unique.
                   By default epoch milliseconds is used.
   - timeout     - will respond with an exception if timeout reached before response available.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 
`query-map` | a map of key/value pairs defining the query
`options` | an optional map of key/value pairs 
`action` | identifies the type of query to process. Valid actions are `query`, `block`, `multi-query`, and `history`.

#### Returns
A JavaScript promise that eventually contains the results or an error.

#### JavaScript Example  
An example of a signed `query` request to `signed_query`:
  
```all
import { getSinFromPublicKey } from '@fluree/crypto-utils';
:
:
const publicKey = '...';
const privateKey = '...';
const auth = getSinFromPublicKey(publicKey);
:
const flureeServerUrl = "http://localhost:8080";
const myLedgerName = "test/chat";
var myConn = flureedb.connect(flureeServerUrl);
:
:
var myQuery  = JSON.stringify({
    select: ['*'],
    from:   '_collection'
  });
var myOpts = JSON.stringify({
    "private-key": privateKey,
    auth: auth,
    expire: Date.now() + 30000,
    nonce: 1,
    timeout: 600000,
    fuel: 100000  
});
flureedb.signed_query(myConn, myLedgerName, myQuery, myOpts)
  .then( resp => {console.log('results:', resp);})
  .catch( error => {console.log('Error ', error);});    
:
:
flureedb.close(myConn);
```
&nbsp;&nbsp;
&nbsp;&nbsp;

An example of signed `block` request to `signed_query`:

```all
import { getSinFromPublicKey } from '@fluree/crypto-utils';
:
:
const publicKey = '...';
const privateKey = '...';
const auth = getSinFromPublicKey(publicKey);
:
flureedb.connect_p(flureeServerUrl)
.then(conn => 
  {
    var query = { block: 1};
    var opts = {
      "private-key": privateKey,
      auth: auth,
      expire: Date.now() + 60000,
      nonce: nonce,
      timeout: 600000,
      fuel: maxFuel,
      action: "block"
    };
    flureedb.signed_query(conn, ledger, JSON.stringify(query), JSON.stringify(opts))
    .then(results => 
      {
        console.log("block results", results);
        // do something with results
      })
    .catch(error => 
      {
        console.log("block error: ", error );
        // error handling
      })
    .finally( () => {flureedb.close(conn);} )})
.catch(error => {console.log("connection error: ", error)});
```
&nbsp;&nbsp;
&nbsp;&nbsp;

An example of signed `multi-query` request to `signed_query`:

```all
import { getSinFromPublicKey } from '@fluree/crypto-utils';
:
:
const publicKey = '...';
const privateKey = '...';
const auth = getSinFromPublicKey(publicKey);
:
flureedb.connect_p(flureeServerUrl)
  .then(conn => 
    {
      var query = { collections: { select: ["*"], from: "_collection"},
                persons: { select: ["*"], from: "person"}};
      var opts = {
        "private-key": privateKey,
        auth: auth,
        expire: Date.now() + 60000,
        nonce: nonce,
        timeout: 600000,
        fuel: maxFuel,
        action: "multi-query"
      }
      flureedb.signed_query(conn, ledger, JSON.stringify(query), JSON.stringify(opts))
      .then(results => 
        {
          console.log("multi-query results", results);
          // check status returned for 200
          // do something with results
        })
      .catch(error => 
        {
          console.log("multi-query error: ", error );
          // error handling
        })
      .finally( () => {flureedb.close(conn);} )
    })
  .catch(error => {console.log("connection error: ", error)});
```
&nbsp;&nbsp;
&nbsp;&nbsp;

An example of signed `history` request to `signed_query`:

```all
import { getSinFromPublicKey } from '@fluree/crypto-utils';
:
:
const publicKey = '...';
const privateKey = '...';
const auth = getSinFromPublicKey(publicKey);
:
flureedb.connect_p(flureeServerUrl)
  .then(conn => 
  {
    var query = { history: ["person/handle", "zsmith"]};
    var opts = {
      "private-key": "...",
      auth: "...",
      expire: Date.now() + 60000,
      nonce: nonce,
      timeout: 600000,
      fuel: maxFuel,
      action: "history"
    }
    flureedb.signed_query(conn, ledger, JSON.stringify(query), JSON.stringify(opts))
    .then(results => 
      {
        console.log("history results", results);
        // check status returned for 200
        // do something with results
      })
    .catch(error => 
      {
        console.log("history error: ", error );
        // error handling
      })
    .finally( () => {flureedb.close(conn);} )
    })
  .catch(error => {console.log("connection error: ", error)});      
```

### transact
Submits a transaction for a ledger. Returns a promise that will eventually have the result of the tx, the txid (if :txid-only option used), or an exception either due to an invalid transaction or if the timeout occurs prior to a response.

Will locally sign a transaction command if a private key is provided via :private-key in the options, otherwise will submit the transaction to the ledger and request signature, provided the ledger group has a default private key available for signing. 

Options is a map with the following possible keys:
   - private-key - The private key to use for signing. If not present, a default
                   private key will attempt to be used from the connection, if available.
   - auth        - The auth id for the auth record being used. 
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
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 
`transaction` | a map of key/value pairs defining the transaction
`options` | an optional map of key/value pairs 

#### Returns
A JavaScript promise that eventually contains the transaction id or an error.

#### JavaScript Example  
An example of an unsigned request to `transact`:
  
```all
const flureeServerUrl = "http://localhost:8080";
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
&nbsp;&nbsp;
&nbsp;&nbsp;

An example of a signed request to `transact`:
  
```all
import { getSinFromPublicKey } from '@fluree/crypto-utils';
:
:
const publicKey = '...';
const privateKey = '...';
const auth = getSinFromPublicKey(publicKey);
:
const flureeServerUrl = "http://localhost:8080";
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
flureedb.transact(myConn, myLedgerName, JSON.stringify(myTxn), JSON.stringify(myOpts))
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);});    
:
:
flureedb.close(myConn);
```
  
### **monitor_tx**
Monitors a ledger for a specific transaction id included in a block. Returns a promise that will eventually contain a response or an exception if the timeout period has expired.  Also, the response itself may contain an exception, if the transaction resulted in an exception.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 
`transaction-id` | the transaction id returned by the `transact` command
`timeout` | timeout, in milliseconds

#### Returns
A JavaScript promise that eventually returns the results from the monitor_tx command.

#### JavaScript Example  
An example of an unsigned request to `monitor_tx`:
  
```all
const flureeServerUrl = "http://localhost:8080";
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
Listens to all events of a given ledger. Supply a ledger identity, any key, and a two-argument function that will be called with each event. The key is any arbitrary key, and is only used to close the listener via close-listener, otherwise it is transparent to the listener. The callback function's first argument is the event header/metadata and the second argument is the event data itself.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 
`key` | any arbitrary id
`callback` | callback function/handler

#### Returns
Returns true if the listener is successfully added.  Otherwise, an exception is returned.

#### JavaScript Example  
  
```all
const flureeServerUrl = "http://localhost:8080";
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
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger 
`key` | same arbitrary key provided to the `listen` command

#### Returns
Returns true if a callback function was associated with the key and removed.  Otherwise. nil is returned.

#### JavaScript Example  
  
```all
const flureeServerUrl = "http://localhost:8080";
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
`connection` | a connection object created using the `connect` or `connect_p` command

#### Returns
Returns a list of listeners registered for the given connection object.

#### JavaScript Example  
  
```all
const flureeServerUrl = "http://localhost:8080";
var myConn = flureedb.connect(flureeServerUrl);
:
:
var myListeners = flureedb.listeners(myConn);
console.log('listeners: ', myListeners);
:
:
flureedb.close(myConn);
```

