## Network Infrastructure

This section is background on the infrastructure of each network in Fluree. This section isn't necessary for using Fluree, but will give you a deeper understanding of the how transactors and query engines work in Fluree, as well as how networks achieve consensus.

To jump right in working with Fluree, you can go to the [Creating a Schema](/docs/basic-schema) section. 

### Overview

When running Fluree, you are typically running a single 'network' and you have a transactor group configured to operate that network. Each network can have millions of databases, and you can think of a network like a top-level domain name, i.e. .com, .net, .org. it is the most coarse type of segmentation available in Fluree.

### Benefits of Different Server Types

In Fluree, the role of a server handling queries (query server) is separated from that providing updates (a transactor). This serves several purposes:

1. Don't Have To Handle All, or Any Transactors

If running your database decentralized, you don't control all the transactors processing updates -- or possibly any. Your apps will require a fast and responsive query engine and by running your own (or Fluree's hosted) query server, you have a dedicated server address you control to issue queries and coordinate transactions you might send it.

2. Allows Query Servers to Scale Linearly

This design allows your query servers to linearly scale to any query workload. You can add (or remove) servers as needed and have as much speed and redundancy desired where apps typically need it the most - querying. Transactions will in no way affect query performance, and vice versa, because they don't fight for the same resources.

3. Allows You To Run Database As a Library

This design opens up the possibility of running your database as a _library_ inside your own application (in-process). This has implications of how you code, as you ask for data as needed with results in the order of _microseconds_, instead of packaging up queries as monolithic requests to send over the wire for responses in the tens, hundreds, or even thousands of milliseconds. Using this pattern, your code becomes simpler, easier to understand, and more efficient.

### Query Engine Types

#### Query Peer

To meet slightly different goals, we have two flavors of query engines. The main type we call a query 'peer', and like any good peer it has direct access to every database, current and historical, and every upate on-hand. It comes in Java and Clojure flavors (Javascript forthcoming) currently and can also run as an independent server exposing a REST and GraphQL APIs for your apps to utlize.

#### Query Client (Not Yet Implemented)

The second flavor is lighter-weight and we call it a query 'client'. The client is designed to run in-process in the client tier and will be available in JavaScript. This allows it to run embedded in your web apps, web sites, as well as the JavaScript engines in iOS/Android for your mobile apps. A query client is typically talking to a single database as a single user, and getting streamed only the permissioned updates that pertain to what the user is looking at through our built-in query introspection. Your apps get new features, essentially for ‘free’, of real-time updates, rewind/time-travel and a development pattern that greatly simplifies client app development. 

For framework users, we will be offering a React wrapper and intend to release an Angular wrapper along with others. Reactive extensions can be used, but are essentially rendered redundant and unnecessary by Fluree, which just 'handles it' transparently for you.

### Transactors and Transactor Groups

The transactor server type handles updates. You can run a single server or set of servers in the role of transactor. If you run a set of transactors as a transactor group, they will act as a single node, as far as consensus is concerned. You can scale transactors in your transactor group as necessary. 

### Consensus Algorithms

If running Fluree in a decentralized manner, you need to choose a consensus algorithm. The consensus algorithm determines how each node in your network agrees upon a series of states (blocks). 

The consensus algorithm for a network is specified in each database in the `_setting/consensus` predicate. 

We currently support Raft and PBFT, and you can learn more in the [Consensus Algorithm](/docs/database-setup/database-settings#consensus-algorithms) section. 