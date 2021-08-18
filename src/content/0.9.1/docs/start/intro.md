## NOT ACTIVELY SUPPORTED - Version: 0.9.1

Welcome to the Fluree documentation for Fluree version 0.9.1. This version is currently only available as a standalone version (.jar file) that you can download (we no longer support a version 0.9.1. as a hosted, on-demand ledger). We have made significant changes since 0.9.1, and we recommend using a more current version if you are just starting out with Fluree.

If you have issues as you are you working with Fluree, please do report them! A simple email to [support@flur.ee](mailto:support@flur.ee) is much appreciated with a description of what happened and when. 

In addition, our [Fluree Slack](https://flureedb.slack.com/) is a great place to connect with other developers, ask questions, and chat about all things Fluree. If you are not already part of the Slack, please [join here](https://launchpass.com/flureedb).

### What is Fluree?

Fluree is an immutable, time-ordered blockchain ledger. 

Each block is an atomic update that is cryptographically signed to prevent tampering and linked to the previous block in the chain.

<p>
    <img style="height: 400px; width: 600px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/blockContents.png" alt="A series of 5 blocks stacked on top of each other vertically. The middle block is deconstructed to show: the previous block's hash, the current block's hash, data, a timestamp, and the block index.">
</p>

At its core, every block contains a group of specially formatted log files of ledger updates, as well as block meta-data. We call these log files Flakes. Each Flake is a specific fact at a specific point in time about a specific entity. No two Flakes are the same.

Below is an example of ledger block. We will go into detail about the contents of the blocks in the [Transaction Response](#transaction-response) section. However, below you can see that, among other things, every block contains a hash, a timestamp, and the size of the block data (block-bytes). This block also contains an array of six Flakes. These Flakes contain all the data that is added, updated, or deleted in block 5, as compared to block 4. 

```all
{
  "tempids": {
    "chat$1": 4299262263297
  },
  "block": 5,
  "hash": "2ae4ca39e8d1e5291b574370dedf36bcdeaf649ad627f826be971a84e636c968",
  "txid": "a9b5c6ade8782eea1a91b6ea2c7b1461bf848193a35bb65f022be09cca287a44",
  "fuel-remaining": 999999987906,
  "authority": null,
  "signature": "1b3045022100f2fd74db3a95b66e3189effbf75ba7356fc501aa94ea01f0061ceb1d26689706022036aff56bad1f7bf7fd9a104781254a57c91070e4c17bec8e550cc3286b6020d5",
  "time": "17.91ms",
  "fuel": 1831,
  "auth": 25769803776,
  "tx-entid": -327680,
  "tx": "[{\"_id\":\"chat\",\"message\":\"This is a sample chat from Jane!\",\"person\":[\"person/handle\",\"jdoe\"],\"instant\":\"#(now)\"}]",
  "status": 200,
  "block-bytes": 607,
  "timestamp": 1535469747975,
  "flakes": [
     [ 4299262263297, 1002, "This is a sample chat from Jane!", -327680, true, null ],
     [ 4299262263297, 1003, 4294967296001, -327680, true, null ],
     [ 4299262263297, 1004, 1535469747977, -327680, true, null ],
     [ -327680, 1, "2ae4ca39e8d1e5291b574370dedf36bcdeaf649ad627f826be971a84e636c968", -327680, true, null ],
     [ -327680, 2, "f0f147cacff392fe8d487f16a03910de353b9ee8033cdd041266ee282c1c1aa0", -327680, true, null ],
     [ -327680, 5, 1535469747975, -327680, true, null ],
     [ -327680, 100, "a9b5c6ade8782eea1a91b6ea2c7b1461bf848193a35bb65f022be09cca287a44", -327680, true, null ],
     [ -327680, 101, 25769803776, -327680, true, null ],
     [ -327680, 103, 1535469747972, -327680, true, null ]
  ]
}
```

We can think of the ledger at any given point in time as the combination of all the Flakes up until that point. For example, the ledger at block 5 is the result of "playing all of the Flakes forward" from blocks 1 through 5. 

We will go into detail about how to create schema and transact data in the ledger later. But for now, the below image shows you a simplified representation of five blocks worth of Flakes. In the first two blocks, we create our simple schema (a user with a user/handle and a user/chat). In block 3, we add a new user named 'bob' and a chat message for Bob. In block 4, we create a new user with the handle 'jane', and finally in block 5, we attribute a chat to 'jane'.

<p class="text-center">
    <img style="height: 190px; width: 550px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/flakeLogBlocks1-5.png" alt="A table with the columns: 'entity', 'attribute', 'value', 'block', and 'add.' There are seven rows in this table, and each contains sample data, which is explained in the accompanying paragraph">
</p>

Rather than storing a copy of the entire ledger in each block, every block contains only Flakes, or facts about entities, that are different as of that block.

The [Fluree Whitepaper](https://flur.ee/assets/pdf/flureedb_whitepaper_v1.pdf) goes into more depth about how Fluree works. 

### Capabilities

We are focused on typical enterprise applications, which means we are optimized for:

- Highly relational data
- Very high (and complex) query volume

While we will have support for some high transactional volume use cases, it is less likely a blockchain ledger will be an ideal fit for these, and therefore this is not a current focus.

The Fluree ledger features these capabilities:

- ACID transactions
- ledger functions
- Granular user permissions
- A GraphQL query interface
- Powerful query language that supports unlimited recursion and can be represented fully in JSON
- Scale-out writes by leveraging partitioning (in production soon).
- Scale-out reads, by separating eventually consistent query engines from the core blockchain transactor. Queries can optionally force consistency to a specific point-in-time or block.
- Point-in-time queries (in other words, time-travel), allowing you to query the same information at different points in time
- When leveraging Fluree's cloud-hosted private consensus, there is zero management overhead. Federated and fully decentralized consensus modes are in development.
- Fluree will be open source as we move forward in development.

### Standalone Fluree

To launch the standalone version of Fluree, download and unzip the [version 0.9.1 of Fluree](https://fluree-releases-public.s3.amazonaws.com/flureeDB-0.9.1.zip). The contents of the folder are as follows:

* flureeDB_transactor.sh - Shell script to launch Fluree.
* flureeDB.jar - Fluree packaged into a JAR file. 
* flureeDB.properties - File that specifies the customizeable Fluree properties. 
* Version - The version number.

#### Setting the DB Configuration Options

The following are the properties that you can set in the flureeDB.properties file. Java property flages (i.e. -Dfdb-mode=dev) take precedence over properties in the flureeDB.properties file. Additionally. environment variables take precedence over both Java property flags and properties specified in flureeDB.properties.


Property | Options | Description   
-- | -- | --
fdb-mode | `dev` `query` `transactor` | Dev runs a standalone version of Fluree, which supports both queries and transaction. `Query` and `transactor` are for running Fluree as a query or transactor, respectively.
fdb-license-key | `key` | (Optional) Required for enterprise version
fdb-network | `string` | The name of the network the transactor group will operate in
fdb-group-port | `int` | The communication port for the transactor group
fdb-group-listen-addr | `ip address` | (Optional) Specify an ip address only if you want to bind listening to a specific IP address, otherwise Fluree will bind to: tcp://*:<fdb-group-port>
fdb-group-transactors | `server`,`server`, etc | (Optional) A list of transactors that will participate in this transactor group. Include the protocool (tcp:// only supported currently), server name, and port. List multiple servers with comma separating them, i.e.: fdb-group-transactors=tcp://10.0.0.1:9790,tcp://10.0.0.2:9790,tcp://10.0.0.3:9790. Leave this field blank to run when running Fluree standalone.
fdb-group-me | `server` | (Optional) "This" transactor must be in the list in fdb-group-transactors. Best practice is to pass this in as an environment variable. Leave this field blank to run when running Fluree standalone.
fdb-group-open-api | `boolean` | Set to true if a signature is not required in order to access [signed endpoints](#signed-endpoints).
fdb-storage-type | `file` `memory` `none` `Cassandra` | This option specifies the common storage for blocks and index segments. `file` stores in file directory. `none` stores on-disk, `memory` stores in-memory only and will disappear on server stop, and `Cassandra` allows you to use Apache Cassandra. If you chose Cassandra, there are additional options below you need to specify. 
fdb-storage-file-directory | `directory name` | (Optional) When using the `file` storage-type, this is the name of the file directory. 
fdb-memory-cache | `size` (i.e. 200mb) | The total memory cache of index segments across all ledgers. This can be changes per transactor. 
fdb-memory-reindex | `size` | Specify the size of novelty held before reindexing. Transactions will still be processed while reindexing occurs. This setting applies for each ledger, therefore it is important to make sure that all transactors and query peers have at least this much memory multiplied by the number of ledgers you expect to be active on those servers. This setting must be consistent across the entire transactor group. 
fdb-memory-reindex-max | `size` | During reindexing transactions are still processed. Once the since of the novelty reaches `fdb-memory-reindex-max` is hit, however, all processing of new transactions stops.
fdb-stats-report-frequency | `time` | How frequently to report out stats as a log entry. 
fdb-port | `int` | The port in which query servers will respond to API calls from client. 

The below options are only used if fdb-storage-type is set to 'Cassandra'

Property | Options | Description   
-- | -- | --
fdb-storage-cassandra-servers | `server`,`server`, etc  | Cassandra cluster servers separated by commas
fdb-storage-cassandra-table | `keyspace.table` | Always use `keyspace.table` format for table. Both the keyspace and the table will be created automatically if non-existing. 
fdb-storage-cassandra-data-center | See Cassandra for options | 
fdb-storage-cassandra-replicas | See Cassandra for options. | 

### Start Fluree

Navigate to the directory where you downloaded Fluree in the terminal. The command to launch Fluree is:

`./flureeDB_transactor.sh` 

When you launch Fluree for the first time or if you choose `none` as your `fdb-storage-type`, Fluree will create the following ledgers:

1. Master ledger with username: `master` and password: `fluree`
2. Test ledger with username: `test` and password: `fluree`

In order to set your own username and password for the master ledger, you can either create environment variables or pass in a Java property flag at start-up with the keys: `username` and `password`. Username and password cannot be set in the flureeDB.properties file. 

For example, if you want to set your own username and password, you could run:

`./flureeDB_transactor.sh -Dusername=myusername -Dpassword=mypassword`

The password that you set for the master ledger, by default, is the same password as the password for the test ledger. 

### Launch Packaged UI

If Fluree is running on `fdb-group-port` 8090, then there is a built-in user interface that can be accessed at `localhost:8090/index.html`.