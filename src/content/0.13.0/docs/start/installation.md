## Installing Fluree

If you already have a hosted version of Fluree, you can jump to [User Interface](#user-interface). To request a hosted version of Fluree, you can sign up on [our site](https://www.flur.ee/), but note that free hosted versions may be limited. 

### Installing Fluree Locally

Download and unzip: [latest stable version of Fluree](https://s3.amazonaws.com/fluree-releases-public/fluree-stable.zip).

Or, you can get the [latest version of Fluree](https://s3.amazonaws.com/fluree-releases-public/fluree-latest.zip). 

On Mac or Linux, you can issue `wget https://fluree-releases-public.s3.amazonaws.com/fluree-latest.zip` to download the latest zip file into your current directory.

The contents of the folder are as follows (might be slightly different based on your version):

```all
fluree-0.13.0/
├── fluree_sample_.properties
├── VERSION
├── fluree_start.sh
├── fluree_server.jar
├── CHANGELOG.md
└── LICENSE
```

Key Files: 

* `fluree_sample.properties` - File that specifies the customizeable Fluree properties. 
* `fluree_start.sh` - Shell script to launch Fluree.
* `fluree_server.jar` - Fluree packaged into a JAR file. 

### Dependencies

Fluree requires Java Server 8 (Java 1.8) or above. To verify that your version of Java, you can type `java -version` in the terminal.

### Launching Fluree

To run Fluree with all the default options, navigate to the directory where you downloaded Fluree in the terminal then launch Fluree with the following command:

> For Mac or Linux systems: `./fluree_start.sh` 

> For Windows systems, you have to download a Bash emulator, like [Git For Windows](https://gitforwindows.org/) to properly run Fluree. In your Bash emulator, you can run `./fluree_start.sh` to start Fluree. Alternatively on Windows, you will be able to [download Fluree with Chocolatey](#download-fluree-with-chocolatey).

When Fluree is done starting up, your terminal will log: 

```all
Starting web server on port:   [PORT NUMBER]
```

If the above message is not displaying in your terminal, the terminal should print out a relevant error message. Common errors include your chosen port already being in use and not having Java 8 or above installed. 

> If you see an error "missing 'server' JVM", you need to install Java Server JRE. See [Oracle documentation](https://docs.oracle.com/en/java/) to select the appropriate platform, version (e.g., 8) and operating system.

After you launch Fluree for the first time, you will not have any databases. You will need to create a database to begin. 

Creating a ledger and any other interaction with Fluree can happen either through the [API](/api/downloaded-endpoints/downloaded-examples#-new-db) or through the [user interface](#user-interface).

### Exiting and Restarting Fluree

To exit Fluree, simply click `ctrl + c` to quit the current process on your terminal. Unless you were running [Fluree in memory](#in-memory-fluree), this will not delete any of the information that was successfully added to your databases (in other words, if you received a 200 response from your transactions, that means it was added to your database). 

To restart Fluree, navigate to the folder that contains your Fluree instance and run `./fluree_start.sh`.

After Fluree successfully starts for the first time, if you are using the default `fdb-storage-type` set to `file`, there will be additional items in your Fluree instance folder. Your folder will look something like the below: 

```all
fluree-0.13.0/
├── data/
│   ├── TRANSACTORNAME/
│   │   ├── raft
│   │   │   ├── snapshots
│   │   │   │   ├── 0.raft
├── fluree_sample.properties
├── VERSION
├── fluree_start.sh
├── fluree_server.jar
├── default_private_key.txt
├── CHANGELOG.md
└── LICENSE
```

#### New Items

- `data/` 
- `default_private_key.txt`

#### data/
The new `data` folder will contain all of your block data, consensus logs, as well as database indexes. This folder can be moved or copied to a different Fluree instance folder and run from the folder if you choose. This is a good option if you want to use a newer Fluree version, but to keep all of your previous databases. 

#### default_private_key.txt
This file contains the default private key for your databases. A new (and unique) private key is generated every time you start up a new network, unless you already have a valid private key in `default_private_key.txt`. 

### Setting Your Own Private Key
To use your own private key, first please see the section on [public and private keys](/docs/identity/public-private-keys) to see what is and isn't valid as a private key. 

If you have a valid private key, encoded with [Base58Check Encoding](/docs/identity/public-private-keys#base58check-encoding), then you can add your private key to a `default_private_key.txt`. You can also change the name of the file that holds the private key by changing the `fdb-group-private-key-file` config option (see below).

You can also run `./fluree_start.sh :keygen` to generate a public key, private key, and account id. This will not start Fluree, it will just return those three pieces of information.

### In-Memory Fluree

You can run Fluree in memory for testing purposes. To do so, simply specify `fdb-consensus-type` as `in-memory` and `fdb-storage-type` as `memory`. At this time, you can only run a single, centralized ledger in memory. 

### Setting Up a Transactor Group
Currently, transactor groups only support the Raft consensus algorithm to agree on a shared state for a network of databases. With Raft, a total of `n` servers can support `f` failures: n = 2f + 1. This means that anything less than 3 servers can sustain no failures, 5 servers can sustain two failures. 

You can test a decentralized Fluree on a single computer (different ports) or on multiple computers. Each member of Fluree needs to have its own folder containing `fluree_server.jar`, `fluree_sample.properties`, and `fluree_start.sh`. 

Before starting any of the servers, make sure to set `fdb-group-servers` and `fdb-group-this-server`.

All the members of the transactor group need to have the same `fdb-group-servers`. All of the servers participating in ledger-group should be listed in the format of server-id@host:port, for example to run them all on one machine, you would list:

`fdb-group-servers=myserver1@localhost:9790,myserver2@localhost:9791,myserver3@localhost:9792`

Each server should have a different `fdb-group-this-server`, which should be the server-id (from `fdb-group-servers`). 

Other configuration options that are relevant to setting up a transactor group are:

`fdb-group-timeout`, `fdb-group-heartbeat`, `fdb-group-log-directory`, `fdb-group-snapshot-threshhold`, `fdb-group-log-history`.

See the full explanation for those settings in [config options](#config-options). 

### Changing Transactor Group Config

Currently, you cannot change the configuration on Fluree network after that network has started up.

### Config Options
Note: not all of these configuration options are currently being used. Some options are ignored for the time being, because the related features aren't yet released. We are working on updating this section.

For example, if you want to set `fdb-api-port` and `fdb-mode` when starting up Fluree, you would run: 

```all
./fluree_start.sh -Dfdb-mode=transactor -Dfdb-api-port=8081
```

You can set various configuration options as either environment variables, Java property flags, or in the `fluree_sample.properties` file. `fluree_sample.properties` has all of the default configuration settings. 

Environment variables take precedence over both configuration options listed as Java property flags and those in the `fluree_sample.properties` file. Java property flags, in turn, take precedence over config options listed in the `fluree_sample.properties` file. 

#### Base Settings

Property | Options | Description   
-- | -- | --
`fdb-mode` | `dev` `query` `ledger` | Dev runs a standalone version of Fluree, with a query engine and ledger running together. Currently only `dev` is supported. `query` and `ledger` are for running Fluree as a query engine or ledger, respectively.
`fdb-license-key` | `key` | (Optional) Required for enterprise version
`logback.configurationFile` | `file path` | Path to a `logback.xml` file. If it is in the current file, you need to specify `./logback.xml`. A sample `logback.xml` file is below. You can set the level of logging that you want to see (`INFO`, `DEBUG`, `TRACE`), as well as how frequently you want the your logback file scanned for updates. For more information, you can visit [the logback manual](https://logback.qos.ch/manual/index.html).

```all
<configuration scan="true" scanPeriod="10 seconds">

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%highlight(%-5level) %white(%logger{24}) - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="DEBUG">
        <appender-ref ref="STDOUT"/>
    </root>

</configuration>
```


#### Transactor Group Options

Property | Options | Description   
-- | -- | --
`fdb-join?` | `boolean` | (Optional) Set this to true if a server is attempting to dynamically join a network. By default, false. 
`fdb-group-catch-up-rounds` | `int` | By default, set to 10. The number of rounds the tx group leader will wait for a new server that is 
`fdb-group-private-key` | `key` | (Optional) Main private key for ledger group. Will auto-generate if none provided. Must be a [valid private key](/docs/identity/public-private-keys). This takes precedent over `fdb-group-private-key-file`.
`fdb-group-private-key-file` | `file path` | If fdb-group-private-key is not provided, we'll look for it in this file. If not found in this file, we'll generate a default one and place it in this file.
`fdb-group-servers` | `server-id@host:port, server-id@host:port` | List all servers participating in ledger-group with format of server-id@host:port. All tx-group servers should have this same config.
`fdb-group-this-server` | `server-id` | Specify which of the above listed server-ids is this server. Note this must be unique for every server in the tx-group, and is likely easiest to supply this setting via environment variable.
`fdb-group-timeout` | `int` | Tx group's internal communication timeout threshold. Will initiate a leader election between this value and 2x this value if the leader hasn't been heard from. Specify as number of milliseconds, or can use units as well such as 1000ms or 1s. Assuming your tx-group network is local, 1000-3000 ms is a good range. Adjust as needed to avoid unintended leader elections.
`fdb-group-hearbeat` | `int` | Tx group leader will send out a heartbeat at this interval. By default, will be 1/2 of fdb-group-timeout. This can never be less than fdb-group-timeout, and ideally should be 1/3 to 1/2 of that value. A number in milliseconds can be provided, or can be used with units such as 1000ms or 1s.
`fdb-group-log-directory` | `file path` | Where to store tx-group raft log files and snapshots. These logs have fairly frequent disk access.
`fdb-group-snapshot-threshold` | `int` | A snapshot of the current group state will be taken after this many new commits. Larger values mean larger log files, small values mean lots of snapshots which can be time consuming for large networks. Ideally somewhere in the range of 100 to 1000.
`fdb-group-log-history` | `int` | Number of historic tx-group raft logs to keep around. Can be as low as 1. Historic logs take up disk space but can be useful for debugging if something goes wrong. High transactional volume servers may want to retain extra logs as there will be more frequent rotation.
`fdb-storage-type` | `file`, `memory` |  This is where to store index/block segments. Can be replicated on every machine or in a common location all local/group ledgers and FlureeDB library/peers. Currently only `file` is supported. `file` storage is on-disk and replicated on every ledger, `memory` is not currently supported, but this is is replicated on every ledger, but only stored in memory (useful for testing; not currently implemented).
`fdb-storage-file-directory` | `file path` | For file storage, specify directory to place ledger (blockchain) and db indexes
`fdb-memory-cache` | `size` | Total memory cache of index segments across all databases. This setting can be changed per-ledger.
`fdb-memory-reindex` and `fdb-memory-reindex-max` | `size` | These settings apply per-database, make sure all ledgers and query peers have at least this much memory * number of databases you expect to be active on those servers. This setting must be consistent across the entire ledger group.
`fdb-stats-report-frequency` | `time` | How frequently to report out stats as a log entry in milliseconds, or can use shorthand like 2m for two minutes, 45s for 45 seconds.

#### HTTP API Settings

Property | Options | Description   
-- | -- | --
`fdb-api-port` | `int` | Port in which the query peers will respond to API calls from clients
`fdb-open-api` | `boolean` | If fdb-open-api is true, will allow full access on above port for any request and will utilize default auth identity to regulate query/read permissions. If false, every request must be signed, and the auth id associated with the signature will determine query/read permissions.

#### Decentralized Ledger Settings

Property | Options | Description   
-- | -- | --
`fdb-ledger-port`| `int` | External port to expose for external ledger communication. If using a ledger group behind a load balancer then this should be consistent across the ledger group, i.e. fdb-ledger-port=9795
`fdb-ledger-private-keys` | `key@network/dbname,` `key@network/dbname` | List each auth identity private key at each network and/or database you are participating in. Format is private-key1@network/db,private-key2@network/db2 where the db is optional and multiple dbs or networks are separated by commas. If only a network is specified, the private key will be  used as a default for all databases on that network and it is assumed this server is participating with every database, i.e. `fdb-ledger-private-keys=5...3@networka/dbname`
`fdb-ledger-servers` | `networka@some-domain.com:9795,` `networka@10.1.1.2:9795,` `networkb/dbname@external.dot.com:9795` | List of seed servers to contact for each network/db. Like fdb-ledger-identities, the db is optional. Every network/db + server address combination should be separated by a comma, i.e. `fdb-ledger-servers=` `networka@some-domain.com:9795,` `networka@10.1.1.2:9795,networkb/` `dbname@external.dot.com:9795`

#### Password and JWT Token Settings

Property | Options | Description
-- | -- | --
`fdb-pw-auth-enable` | `boolean` |This defaults to true, but will only work if there is a signing key for transactions. 
`fdb-pw-auth-secret` | `string` | This secret is used to generate a HMAC signature that is used by scrypt to generate a valid private key from a password. Every auth record uses a unique salt ensuring different private keys for identical passwords. A server must have permission to access to the salt (stored in the _auth record) to successfully regenerate a private key - along with the normalized password and the following secret. Without all 3 elements, the private key cannot be regenerated.
`fdb-pw-auth-jwt-secret` | `string` | JWT tokens issued are secured with this secret. If empty, will default to use fdb-pw-auth-secret
`fdb-pw-auth-signing-key` | `string` | A valid Fluree private key with proper permissions must be used to sign any new transaction where new password auth records are created. If a default root key still exists and has proper permission, that will be used by default.
`fdb-pw-auth-jwt-max-exp` | `time in milliseconds, i.e. 86400000` |  Maximum allowed expiration time per JWT token in milliseconds. Blank means any amount of time is valid. (86400000 ms in 24 hours, 31536000000 in 1 year)
`fdb-pw-auth-jwt-max-renewal` | `time, i.e. 1y or 2d` | If renewal JWT tokens are allowed (blank if not allowed), maximum time from initial issuance a token can be renewed for in ms. To make this 'forever', use the maximum long value (9223372036854775807). For example, if you had a JWT token that expires after 120 seconds, but want to allow an active user to not be challenged for a password for up to 1 day, enter "1d" here and an unexpired token can be renewed as many times as desired (swapped for an 'fresh' token) so long as the original token issued from the password was less then this time period ago.


</div>

### User Interface

There is a built-in user interface that can be accessed at `localhost:[port]/`. If you did not change the port or IP address, it will be on `localhost:8080/`.

For help using the user interface, read the [Navigating the User Interface](/docs/user-interface) section.

Note that as of version 0.10.0, downloadable Fluree databases do not have a username and password. If you are using an older version of Fluree, you can log into the Master database with username, `master` and password, `fluree` or into the Test database with username, `test`, and password, `fluree`.

### Fluree with Docker

Instructions and materials for using Fluree with Docker are [available on Gitlab](https://github.com/fluree/fluree-docker-example). 

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
./fluree_start.sh
```

To uninstall, run:

```all
brew uninstall fluree/flureedb/flureedb
```

```all
brew untap fluree/flureedb
```

### Download Fluree with Chocolatey

This feature is coming soon. 

### Fluree Command Line Tool

We have a command line tool that you can [download](https://fluree-cli-releases-public.s3.amazonaws.com/fluree_cli-latest.zip) to explore your ledger even without Fluree running. To see all the tool's capabilities, visit the [documentation](https://github.com/fluree/fluree.cli).