## Installing Fluree

If you already have a hosted version of FlureeDB, you can jump to [User Interface](#user-interface). To request a hosted version of FlureeDB, you can sign up on [our site](https://www.flur.ee/), but note that free hosted versions may be limited. 

### Installing Fluree

Download and unzip: [latest version of FlureeDB](https://s3.amazonaws.com/fluree-releases-public/flureeDB-latest.zip).

The contents of the folder are as follows:

```all
flureeDB-0.9.5/
├── flureeDB.properties
├── VERSION
├── flureeDB_transactor.sh
├── flureeDB.jar
├── CHANGELOG.md
└── LICENSE
```

Key Files: 

* `flureeDB.properties` - File that specifies the customizeable FlureeDB properties. 
* `flureeDB_transactor.sh` - Shell script to launch FlureeDB.
* `flureeDB.jar` - FlureeDB packaged into a JAR file. 

### Dependencies

FlureeDB requires Java 8 (Java 1.8).

### Launching FlureeDB

To run Fluree with all the default options, navigate to the directory where you downloaded FlureeDB in the terminal then launch Fluree with the following command:

For Mac or Linux systems:
`./flureeDB_transactor.sh` 

Note that for Windows systems, you have to download a Bash emulator, like [Git For Windows](https://gitforwindows.org/) to properly run Fluree. In your Bash emulator, you can run `./flureeDB_transactor.sh` to start Fluree. Alternatively on Windows, you can [download FlureeDB with Chocolatey](#download-fluree-with-chocolatey).

When you launch FlureeDB for the first time or if you choose `none` as your `fdb-storage-type` (see [config options](#config-options) for all options), FlureeDB will create a new network. When Fluree is done starting up, your terminal will log: 

```all
Starting web server on port:   [PORT NUMBER]
```

If the above message is not displaying in your terminal, the terminal should print out a relevant error message. Common errors include your chosen port already being in use and not having Java 8 installed. 

After you launch Fluree for the first time, you will not have any databases. You will need to create a database to begin. 

Creating a database and any other interaction with FlureeDB can happen either through the [API](/api/signed-endpoints/signed-examples#-new-db) or through the [user interface](#user-interface).

### Exiting and Restarting FlureeDB

To exit FlureeDB, simply click `ctrl + c` to quit the current process on your terminal. This will not delete any of the information that was successfully added to your databases (in other words, if you received a 200 response from your transactions, that means it was added to your database). 

To restart FlureeDB, navigate to the folder that contains your Fluree instance and run `./flureeDB_transactor.sh`.

After FlureeDB successfully starts for the first time, if you are using the default `fdb-storage-type` set to `file`, there will be additional items in your FlureeDB instance folder. Your folder will look something like the below: 

```all
flureeDB-0.9.5/
├── data/
│   ├── TRANSACTORNAME/
│   │   ├── raft
│   │   │   ├── snapshots
│   │   │   │   ├── 0.raft
├── flureeDB.properties
├── VERSION
├── flureeDB_transactor.sh
├── flureeDB.jar
├── default_private_key.txt
├── CHANGELOG.md
└── LICENSE
```

#### New Items

- `data/` 
- `default_private_key.txt`

#### fdbdata/
The new `data` folder will contain all of your block data, consensus logs, as well as database indexes. This folder can be moved or copied to a different FlureeDB instance folder and run from the folder if you choose. This is a good option if you want to use a newer FlureeDB version, but to keep all of your previous databases. 

#### default_private_key.txt
This file contains the default private key for your databases. A new (and unique) private key is generated every time you start up a new network, unless you already have a valid private key in `default_private_key.txt`. 

### Config Options
Note: not all of these configuration options are currently being used. Some options are ignored for the time being, because the related features aren't yet released. We are working on updating this section.

For example, if you want to set `fdb-port` and `fdb-mode` when starting up FlureeDB, you would run: 

```all
./flureeDB_transactor.sh -Dfdb-mode=transactor -Dfdb-port=8081
```

You can set various configuration options as either environment variables, Java property flags, or in the `flureeDB.properties` file. `flureeDB.properties` has all of the default configuration settings. 

Environment variables take precedent over both configuration options listed as Java property flags and those in the `flureeDB.properties` file. Java property flags, in turn, take precedent over config options listed in the `flureeDB.properties` file. 

Property | Options | Description   
-- | -- | --
fdb-mode | `dev` `query` `transactor` | Dev runs a standalone version of FlureeDB, which supports both queries and transaction. `Query` and `transactor` are for running FlureeDB as a query or transactor, respectively.
fdb-consensus-type | `raft` | Currently `raft` is the default, and the only consensus algorithm supported. `pbft` will be supported soon.
fdb-license-key | `key` | (Optional) Required for enterprise version
fdb-network | `string` | The name of the network the transactor group will operate in
fdb-group-port | `int` | The communication port for the transactor group
fdb-group-listen-addr | `ip address` | (Optional) Specify an ip address only if you want to bind listening to a specific IP address, otherwise FlureeDB will bind to: tcp://*:<fdb-group-port>
fdb-group-transactors | `server`,`server`, etc | (Optional) A list of transactors that will participate in this transactor group. Include the protocool (tcp:// only supported currently), server name, and port. List multiple servers with comma separating them, i.e.: fdb-group-transactors=tcp://10.0.0.1:9790,tcp://10.0.0.2:9790,tcp://10.0.0.3:9790. Leave this field blank to run when running FlureeDB standalone.
fdb-group-me | `server` | (Optional) "This" transactor must be in the list in fdb-group-transactors. Best practice is to pass this in as an environment variable. Leave this field blank to run when running FlureeDB standalone.
fdb-group-open-api | `boolean` | Set to true if a signature is not required in order to access [signed endpoints](#signed-endpoints).
fdb-storage-type | `file` `memory` `none` `Cassandra` | This option specifies the common storage for blocks and index segments. `file` stores in file directory. `none` stores on-disk, `memory` stores in-memory only and will disappear on server stop, and `Cassandra` allows you to use Apache Cassandra. If you chose Cassandra, there are additional options below you need to specify. 
fdb-storage-file-directory | `directory name` | (Optional) When using the `file` storage-type, this is the name of the file directory. Default is 'fdbdata'
fdb-memory-cache | `size` (i.e. 200mb) | The total memory cache of index segments across all databases. This can be changed per transactor. 
fdb-memory-reindex | `size` | Specify the size of novelty held before reindexing. Transactions will still be processed while reindexing occurs. This setting applies for each database, therefore it is important to make sure that all transactors and query peers have at least this much memory multiplied by the number of databases you expect to be active on those servers. This setting must be consistent across the entire transactor group. 
fdb-memory-reindex-max | `size` | During reindexing transactions are still processed. Once the since of the novelty reaches `fdb-memory-reindex-max` is hit, however, all processing of new transactions stops.
fdb-stats-report-frequency | `time` | How frequently to report out stats as a log entry. 
fdb-port | `int` | The port in which query servers will respond to API calls from client.
fdb-group-private-key | Base58 encoded 256 bit key | (Optional) [Private Key](/docs/identity). Can only be set via environmental variable. 
fdb-group-private-key-file | `string` | (Optional) file location of private key. Can only be set via environmental variable. 


The below options are only used if `fdb-storage-type` is set to 'Cassandra'


Property | Options | Description   
-- | -- | --
fdb-storage-cassandra-servers | `server`,`server`, etc  | Cassandra cluster servers separated by commas
fdb-storage-cassandra-table | `keyspace.table` | Always use `keyspace.table` format for table. Both the keyspace and the table will be created automatically if non-existing. 
fdb-storage-cassandra-data-center | See Cassandra for options | 
fdb-storage-cassandra-replicas | See Cassandra for options. | 

### User Interface

There is a built-in user interface that can be accessed at `localhost:[port]/`. If you did not change the port or IP address, it will be on `localhost:8080/`.

For help using the user interface, read the [Navigating the User Interface](/docs/user-interface) section.

Note that as of version 0.9.5, downloadable FlureeDB databases do not have a username and password. If you are using an older version of FlureeDB, you can log into the Master database with username, `master` and password, `fluree` or into the Test database with username, `test`, and password, `fluree`.

### Fluree with Docker

Instructions and materials for using Fluree with Docker are [available on Gitlab](https://gitlab.com/zer0active/fluree/flureedb-docker). This is contributed by supporter, Allan Tomkinson. 

### Download Fluree with Homebrew

On a Mac machine, you can download Fluree using Homebrew by running: 

```all
brew tap fluree/flureedb
```

```all
brew install fluree/flureedb/flureedb
```

To run Fluree after installing it, run: 

```all
cd /usr/local/Cellar/flureedb/[VERSION]/
```

```all
./flureeDB_transactor.sh
```

To uninstall, run:

```all
brew uninstall fluree/flureedb/flureedb
```

```all
brew untap fluree/flureedb
```

### Download Fluree with Chocolatey

This features is coming soon. 