## Node.js Library Examples

You can dowbload the latest version of the Fluree Node.js library from npm:
```all
npm install @fluree/flureenjs
```


The following commands are available in the Node.js api library. JavaScript promises are used to return results from long-running processes.   


### **connect**
Connect to a ledger server using an URL address. If using a ledger group, multiple addresses can be supplied, separated by a comma.  

There are 2 versions of the connect command:
* `connect` returns a connection object
* `connect_p` returns a connection object via a promise
  
#### Parameter(s)
Name | Value
-- | --
`server-string` | a string identifying one or more ledger servers
`options` | <ul style="list-style-type:none; padding-left: 0;"><li>a JavaScript object containing configuration options.  The following option is currently supported:</li><li>-  `keep-alive-fn`: a JavaScript function that is executed when a connection is abruptly dropped.</li></ul>

#### Returns
Returns a connection object.

#### Code Examples  
An example of the `connect` command:
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);
```   
&nbsp;&nbsp;

An example of the `connect_p` command:
```all
var flureeDbConn;
var flureeIsAvailable = false;
const flureeUrl = "http://localhost:8080";
flureenjs.connect_p(flureeUrl)
    .then(conn => {
        flureeDbConn = conn;
        flureeIsAvailable = true;
    })
    .catch(error => {
        console.error("Error connecting to Fluree DB", error);
        // send alerts, gracefully shutdown Node.js server
    })
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

#### Code Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);
:
:
flureenjs.close(flureeDbConn);
```


### **db**
Returns a queryable database from the connection. The database object represents a point-in-time ledger. As such, the database will not contain block updates submitted after acquisition of the channel.

#### Parameter(s)
Key | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger-id 


#### Returns
Returns a queryable (point-in-time) database as an asynchronous channel.

#### Code Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

const myLedgerName = "test/chat";
var myDb = flureenjs.db(flureeDbConn, myLedgerName);
:
:
flureenjs.close(flureeDbConn);
```
  

### **db_schema**
Generates a schema map for a point-in-time database.

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command 

#### Returns
Returns a JavaScript promise that will eventually deliver the schema map for a database.

#### Code Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

const myLedgerName = "test/chat";
var myDb = flureenjs.db(flureeDbConn, myLedgerName);
:
flureenjs.db_schema(myDb)
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);});
:
flureenjs.close(flureeDbConn);
```
  

### **new_ledger**
Creates a new ledger given a "network/id". If the network specified does not exist, it creates a new network. This request returns a transaction id; the process does not wait for the ledger to be fully initialized before returning.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger-id 
`options` | an optional map of key/value pairs  

##### Option(s)  
Key | Value
-- | --
`:alias` | an alias for the ledger, if different than the id
`:root`  | account id to bootstrap with (string). Defaults to connection default account id
`:doc`   | doc string about this ledger
`:fork`  | If forking an existing ledger, reference to ledger. Must exist in network
`:forkBlock` | If fork is provided, optionally provide the block to fork at. Defaults to latest known.

#### Returns
A JavaScript promise that eventually contains a transaction id.  The transaction id can be used to query the results of the new ledger command.

#### Code Example  
     
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

const myLedgerName = "test/invoice";
flureenjs.new_ledger( flureeDbConn, myLedgerName )
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);});
  :
flureenjs.close(flureeDbConn);
```

  
### delete_ledger
Deletes a ledger, such that a user will no longer be able to query or transact against that ledger. Currently, the files associated with the ledger are not physically deleted from disk. You can choose to delete those files yourself - or keep them. You will not be able to create a new ledger with the same name as the deleted ledger.


#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger-id 

#### Returns
Returns a promise that eventually the results.

#### Code Example  
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

flureenjs.delete_ledger(flureeDbConn, "test/deleteme");

flureenjs.close(flureeDbConn);
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

#### Code Example   
An example of an unsigned request to `q` with the network, `test` and the ledger `chat`:
     
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

const myLedgerName = "test/chat";
var myDb = flureenjs.db(flureeDbConn, myLedgerName);
:
:
var myQuery  = {
  select: ['*'],
  from:   '_collection'
};
flureenjs.q(myDb, myQuery)
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);})
;    
:
:
flureenjs.close(flureeDbConn);
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

#### Code Example  
An example of an unsigned request to `multi_query`:
  
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

const myLedgerName = "test/chat";
var myDb = flureenjs.db(flureeDbConn, myLedgerName);
:
:
var myMultiQuery = {
      collections: { select: ['*'], from: '_collection'},
      persons: {select: ['*'], from: 'person'}
    };
flureenjs.multi_query(myDb, myMultiQuery)
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);})
;    
:
:
flureenjs.close(flureeDbConn);
```

### **block_query**
FlureeQL [block queries](/docs/query/block-query) should be submitted to the `block_query` command. This does not include other types of queries (basic queries, history queries, etc) that might have a "block" key. This only includes queries that are returning flakes from a block or set of blocks. 

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger-id 
`query-map` | a map of key/value pairs defining the query
`options` | an optional map of key/value pairs

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### Code Example  
An example of an unsigned request to `block_query`:
  
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

const myLedgerName = "test/chat";
var myQuery = { block: [2,3] };
flureenjs.block_query(flureeDbConn, myLedgerName, myQuery)
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);});    
:
:
flureenjs.close(flureeDbConn);
```
  
### **block_range**
Given a ledger, returns blocks from a start block (inclusive) to end, if provided (exclusive). Each block is a separate map, containing keys :block and :flakes.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger-id 
`start` | an integer identify the start block; start block is included
`end` | an integer identifying the end block; end block is excluded
`options` | an optional map of key/value pairs

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### Code Example  
An example of an unsigned request to `block_range`:
  
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

const myLedgerName = "test/chat";
flureenjs.block_range( flureeDbConn, myLedgerName, 2, 3 )
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);});    
:
:
flureenjs.close(flureeDbConn);
```

### history_query
FlureeQL [history queries](/docs/query/history-query) should be submitted to the `history` command. This command only supports queries like those in the linked section.

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command 
`query-map` | a map of key/value pairs defining the query 
`options` | an optional map of key/value pairs 

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### Code Example   
An example of an unsigned request to `history_query`:
  
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);

const myLedgerName = "test/chat";
var myDb = flureenjs.db(flureeDbConn, myLedgerName);
:
:
var myQuery  = {
  "history": ["person/handle", "zsmith"],
  "block": 4
};
flureenjs.history_query(myDb, myQuery)
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);});    
:
:
flureenjs.close(flureeDbConn);
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
`ledger` | a string identifying both the network and ledger-id 
`query-map` | a map of key/value pairs defining the query
`options` | an optional map of key/value pairs 
`action` | identifies the type of query to process. Valid actions are `query` (default), `block`, `multi-query`, and `history`. 

#### Returns
A JavaScript promise that eventually contains the results or an error.

#### Code Example  
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
var flureeDbConn = flureenjs.connect(flureeServerUrl);
const myLedgerName = "test/chat";
:
:
var myQuery  = {
    select: ['*'],
    from:   '_collection'
  };
var myOpts = {
    "private-key": privateKey,
    auth: auth,
    expire: Date.now() + 30000,
    nonce: 1,
    timeout: 600000,
    fuel: 100000  
};
flureenjs.signed_query(flureeDbConn, myLedgerName, myQuery, myOpts)
  .then( resp => {console.log('results:', resp);})
  .catch( error => {console.log('Error ', error);});    
:
:
flureenjs.close(flureeDbConn);
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
flureenjs.connect_p(flureeServerUrl)
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
    flureenjs.signed_query(conn, ledger, query, opts)
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
    .finally( () => {flureenjs.close(conn);} )})
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
const flureeServerUrl = "http://localhost:8080";
:
flureenjs.connect_p(flureeServerUrl)
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
      flureenjs.signed_query(conn, ledger, query, opts)
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
      .finally( () => {flureenjs.close(conn);} )
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
const flureeServerUrl = "http://localhost:8080";
:
flureenjs.connect_p(flureeServerUrl)
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
    flureenjs.signed_query(conn, ledger, query, opts)
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
    .finally( () => {flureenjs.close(conn);} )
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
`ledger` | a string identifying both the network and ledger-id 
`transaction` | a map of key/value pairs defining the transaction
`options` | an optional map of key/value pairs 

#### Returns
A JavaScript promise that eventually contains the transaction id or an error.

#### Code Example  
An example of an unsigned request to `transact`:
  
```all
const flureeServerUrl = "http://localhost:8080";
const myLedgerName = "test/chat";
var flureeDbConn = flureenjs.connect(flureeServerUrl);
:
:
var myTxn = [{
  "_id":    "_user",
  "username": "jdoe",
  }];
flureenjs.transact(flureeDbConn, myLedgerName, myTxn)
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);});    
:
:
flureenjs.close(flureeDbConn);
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
var flureeDbConn = flureenjs.connect(flureeServerUrl);
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
flureenjs.transact(flureeDbConn, myLedgerName, myTxn, myOpts)
  .then( resp => {console.log('Success ', resp);})
  .catch( error => {console.log('Error ', error);});    
:
:
flureenjs.close(flureeDbConn);
```
  
### **monitor_tx**
Monitors a ledger for a specific transaction id included in a block. Returns a promise that will eventually contain a response or an exception if the timeout period has expired.  Also, the response itself may contain an exception, if the transaction resulted in an exception.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger-id 
`transaction-id` | the transaction id returned by the `transact` command
`timeout` | timeout, in milliseconds

#### Returns
A JavaScript promise that eventually returns the results from the monitor_tx command.

#### Code Example  
An example of an unsigned request to `monitor_tx`:
  
```all
const flureeServerUrl = "http://localhost:8080";
const myLedgerName = "test/chat";
var flureeDbConn = flureenjs.connect(flureeServerUrl);
:
:
var myTxId = 'f27e0b890bbc47e0bd67dc452fded9eb881548015d3e9860cf69bd5f19c20660';
flureenjs.monitor_tx (flureeDbConn, myLedgerName, myTxId, 6000)
  .then( resp => {console.log('Returned', resp);})
  .catch( error => {console.log('Error ', error);});
:
:
flureenjs.close(flureeDbConn);
```


### **graphQL**
All queries and transactions in GraphQL syntax should be issued through the `graphql` command. If you do not have `fdb-open-api` set to true (it is true by default), then you'll need to sign your query ([signing queries](/docs/identity/signatures#signed-queries)).

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` command
`ledger` | a string identifying both the network and ledger-id 
`query` | JSON-encoded string containing the graphQL query 
`options` | an optional map of key/value pairs 

#### Returns
A JavaScript promise that eventually contains the results of the query.

#### Code Example  
An example of an unsigned query to `graphql`:
  
```all
    const flureeServerUrl = "http://localhost:8080";
    const myLedgerName = "test/chat";
    var flureeDbConn = flureenjs.connect(flureeServerUrl);
    :
    :
    var myGraphQuery = {
      query: '{graph {chat {_id comments instant message person}}}',
      variables: null,
      operationName: null};
    flureenjs.graphql(flureeDbConn, myLedgerName, JSON.stringify(myGraphQuery))
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});      
    :
    :
    flureenjs.close(myConn);
```
  
### **sparql**
All queries in SPARQL syntax, regardless of type, should be issued through the `sparql` command. If you do not have `fdb-open-api` set to true (it is true by default), then you'll need to sign your query ([signing queries](/docs/identity/signatures#signed-queries)).

#### Parameter(s)
Name | Value
-- | --
`db-source` | an asynchronous channel created by the `db` command 
`query` |  a string containing a SPARQL query
`options` | an optional map of key/value pairs 

#### Returns
A JavaScript promise that eventually contains the results of the query or an error.

#### Code Example   
An example of an unsigned request to `sparql` with the network, `test` and the database `chat`:
  
```all
    const flureeServerUrl = "http://localhost:8080";
    const myLedgerName = "test/chat";
    var flureeDbConn = flureenjs.connect(flureeServerUrl);
    var myDb = flureenjs.db(flureeDbConn, myLedgerName);
    :
    :
    var mySparqlQuery = "SELECT ?chat ?message ?person ?instant ?comments
      WHERE {
          ?chat   fd:chat/message  ?message;
                  fd:chat/person   ?person;
                  fd:chat/comments ?comments;
                  fd:chat/instant  ?instant.
      }"
    flureenjs.sparql(myDb, JSON.stringify(mySparqlQuery))
      .then( resp => {console.log('Success ', resp);})
      .catch( error => {console.log('Error ', error);});    
    :
    :
    flureenjs.close(flureeDbConn);
```
  
  
### **listen**
Listens to all events of a given ledger. Supply a ledger identity, any key, and a two-argument function that will be called with each event. The key is any arbitrary key, and is only used to close the listener via close-listener, otherwise it is transparent to the listener. The callback function's first argument is the event header/metadata and the second argument is the event data itself.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger-id 
`key` | any arbitrary id
`callback` | callback function/handler

#### Returns
Returns true if the listener is successfully added.  Otherwise, an exception is returned.

#### Code Example  
  
```all
const flureeServerUrl = "http://localhost:8080";
const myLedgerName = "test/chat";
var myConn;

// connect to fluree using a promise.
// the promise resolves when connection is 
// ready or errors
flureedb.connect_p(flureeServerUrl)
  .then(conn => {
      myConn = conn;
  })
  .catch(error => {
      console.error("Error connecting to Fluree DB", error);
  });

var myListenerKey = "supercalifragilisticexpialidocious";
var someFunction = function(eventType, eventData) {
    // do something
    console.info("eventType: ", eventType);
    console.info("eventData: ", eventData);
  };

// non-blocking wait for connection
(async() => {
        while (!myConn) {
            await new Promise(resolve => setTimeout(resolve,1000));
        }
        addListener(myConn, myLedgerName, myListenerKey, someFunction);
    })().catch(e => console.log(e));
```
  
### close_listener
Closes a listener associated with a given connection, ledger and key

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command
`ledger` | a string identifying both the network and ledger-id 
`key` | same arbitrary key provided to the `listen` command

#### Returns
Returns true if a callback function was associated with the key and removed.  Otherwise. nil is returned.

#### Code Example  
  
```all
const flureeServerUrl = "http://localhost:8080";
const myLedgerName = "test/chat";
var flureeDbConn = flureenjs.connect(flureeServerUrl);
:
:
var myListenerKey = "supercalifragilisticexpialidocious";
var listenerClosed? = flureenjs.close_listener(flureeDbConn, myLedgerName, myKey);
console.log("Closed listener?", listenerClosed?);
:
:
flureenjs.close(flureeDbConn);
```
  

### listeners
Return a list of listeners currently registered for each ledger along with their respective keys.

#### Parameter(s)
Name | Value
-- | --
`connection` | a connection object created using the `connect` or `connect_p` command

#### Returns
Returns a list of listeners registered for the given connection object.

#### Code Example  
  
```all
const flureeServerUrl = "http://localhost:8080";
var flureeDbConn = flureenjs.connect(flureeServerUrl);
:
:
var myListeners = flureenjs.listeners(flureeDbConn);
console.log('listeners: ', myListeners);
:
:
flureenjs.close(flureeDbConn);
```

