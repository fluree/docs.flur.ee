---
sidebar_position: 4
---
# Fluree Anywhere

There are two options for running Fluree:

- [Fluree On-Demand](../../overview/on-demand.md)
- Fluree Anywhere

## Download {#download}

To run Fluree, you need Java 11 or above. To verify your version of Java, you can type `java -version` in the terminal.

You will then need to download a version of Fluree:

- Latest stable version: <https://s3.amazonaws.com/fluree-releases-public/fluree-stable.zip>
- Latest version: <https://s3.amazonaws.com/fluree-releases-public/fluree-latest.zip>

You can download the latest Fluree of a particular version (starting with version 13 and up) using the following formula - `https://fluree-releases-public.s3.amazonaws.com/fluree-[MAJOR VERSION].[MINOR VERISON]-latest.zip`. For example:

- <https://fluree-releases-public.s3.amazonaws.com/fluree-0.15-latest.zip>

Or you can download a specific version of Fluree using the following formula - `https://fluree-releases-public.s3.amazonaws.com/fluree-[MAJOR VERSION].[MINOR VERISON].[PATCH].zip`. For example:

- <https://fluree-releases-public.s3.amazonaws.com/fluree-0.15.0.zip>

Download and unzip: [latest stable version of Fluree](https://s3.amazonaws.com/fluree-releases-public/fluree-stable.zip).

Or, you can get the [latest version of Fluree](https://s3.amazonaws.com/fluree-releases-public/fluree-latest.zip).

You can also download the latest Fluree with [Homebrew](./installation.md#homebrew) and [Docker](./installation.md#docker).

## Launching and Exiting Fluree {#launching-and-exiting-fluree}

To run Fluree with all the default options, navigate to the directory where you downloaded Fluree in the terminal then launch Fluree with the following command:

- For Mac or Linux systems: `./fluree_start.sh`

- For Windows systems, you have to download a Bash emulator, like <a href="https://gitforwindows.org/" target="_blank">Git for Windows</a> to properly run Fluree. In your Bash emulator, you can run `./fluree_start.sh` to start Fluree.

When Fluree is done starting up, your terminal will log (exact log message may be different based on version):

```bash
- Starting web server on port: 8090 with an open API. -
-
- http://localhost:8090 -
-
```

To change the location of the webserver (setting name `fdb-api-port`), or any other settings, see [Config Options](#config-options).

### Troubleshooting {#troubleshooting}

If the above message is not displaying in your terminal, the terminal should print out a relevant error message. Common errors include your chosen port already being in use and not having Java 11 or above installed.

- If you see an error "missing 'server' JVM", you need to install Java Server JRE. See <a href="https://docs.oracle.com/en/java/" target="_blank">Oracle documentation</a> to select the appropriate platform, version (e.g., 11) and operating system.

After you launch Fluree for the first time, you will not have any ledgers. You will need to create a ledger to begin.  Creating a ledger and any other interaction with Fluree can happen either through the [API](../../reference/http/examples#-new-db) or through the user interface.

To learn about the Fluree file system, see the [File System](../../concepts/infrastructure/file_system.md) guide.

### Exiting and Restarting Fluree {#exiting-and-restarting-fluree}

To exit Fluree, simply type `ctrl + c` to quit the current process on your terminal. Unless you were running [Fluree in memory]((../../concepts/infrastructure/file_system.md), this will not delete any ledgers or invalidate any successful transactions.

To restart Fluree, navigate to the folder that contains your Fluree instance and run `./fluree_start.sh`. This will restart your Fluree instance with all your previous networks and ledgers.

To completely reset your Fluree instance (erasing ALL ledger and transactor group data), you can shut down your instance and delete `data/` and `default_private_key.txt` (or wherever your private key has been stored if you changed the default location ). Don't do this unless you are sure you want to completely delete everything! See more about the Fluree [File System](../../concepts/infrastructure/file_system.md) in the guides.

## Config Options {#config-options}

The `fluree_sample.properties` contains all configurable properties, as well as short descriptions of the properties themselves. To change properties, you can change the properties file or you can supply environment variables or Java property flags (for example, `./fluree_start.sh -Dfdb-api-port=8081`). Environment variables take precedence over both configuration options listed as Java property flags and those in the `fluree_sample.properties` file. Java property flags, in turn, take precedence over config options listed in the `fluree_sample.properties` file.

To learn about different configurations in-depth, see the following guides:

- Running Fluree [In-Memory](../../concepts/infrastructure/in_memory.md)
- Running a [Transactor Group](../../concepts/infrastructure/transactor_group.md)
- [Consensus Algorithms](../../concepts/infrastructure/consensus_algorithms.md)
- [Password Management](../../concepts/identity/password_management.md)

### Base Settings {#base-settings}

Property | Options | Description
-- | -- | --
`fdb-mode` | `dev` | Currently only the `dev` option is supported (and required!). `Dev` runs a standalone version of Fluree, with a query engine and ledger running together. In the future, `query` and `ledger` will allow you to run  Fluree as a query engine or ledger, respectively.
`fdb-license-key` | `key` | (Optional) Required for enterprise version
`fdb-encryption-secret` | `key` | (Optional) Required for enterprise version
`fdb-json-bigdec-string` | `boolean` | BigDecimals are not currently handled out-of-the-box by JavaScript applications.  This setting determines whether or not to encode java.Math.BigDecimal values as strings for query results, etc.  The default is `true`.

### Transactor Group Options {#transactor-group-options}

Property | Options | Description
-- | -- | --
`fdb-consensus-type` | `raft` or `in-memory` | Currently `raft` is the only option consensus type supported for transactor groups. See the [in-memory](../../concepts/infrastructure/in_memory.md) guide on how to run Fluree in memory.
`fdb-join?` | `boolean` | (Optional) Set this to true if a server is attempting to dynamically join a network. See the [transactor-group](../../concepts/infrastructure/transactor_group.md) guide on how to run Fluree as a transactor group and dynamically change the network configuration.
`fdb-group-catch-up-rounds` | `int` | By default, set to 10. The number of rounds the tx group leader will wait for a new server to catch up get caught up to the network, when dynamically joining a network. See the [transactor-group](../../concepts/infrastructure/transactor_group.md) guide on how to run Fluree as a transactor group and dynamically change the network configuration.
`fdb-group-private-key` | `key` | (Optional) Main private key for ledger group. Will auto-generate if none provided. Must be a [valid private key](../../concepts/identity/auth_records#generating-a-public-private-key-auth-id-triple). This takes precedent over `fdb-group-private-key-file`.
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
`fdb-memory-cache` | `size` | Total memory cache of index segments across all ledgers. This setting can be changed per-ledger.
`fdb-memory-reindex` and `fdb-memory-reindex-max` | `size` | These settings apply per-ledger, make sure all ledgers and query peers have at least this much memory * number of ledgers you expect to be active on those servers. This setting must be consistent across the entire ledger group.
`fdb-stats-report-frequency` | `time` | How frequently to report out stats as a log entry in milliseconds, or can use shorthand like 2m for two minutes, 45s for 45 seconds.

### HTTP API Settings {#http-api-settings}

Property | Options | Description
-- | -- | --
`fdb-api-port` | `int` | Port in which the query peers will respond to API calls from clients
`fdb-open-api` | `boolean` | If fdb-open-api is true, will allow full access on above port for any request and will utilize default auth identity to regulate query/read permissions. If false, every request must be signed, and the auth id associated with the signature will determine query/read permissions.

### Decentralized Ledger Settings {#decentralized-ledger-settings}

Property | Options | Description
-- | -- | --
`fdb-ledger-port`| `int` | External port to expose for external ledger communication. If using a ledger group behind a load balancer then this should be consistent across the ledger group, i.e. fdb-ledger-port=9795
`fdb-ledger-private-keys` | `key@network/dbname,` `key@network/dbname` | List each auth identity private key at each network and/or ledger you are participating in. Format is private-key1@network/db,private-key2@network/db2 where the db is optional and multiple dbs or networks are separated by commas. If only a network is specified, the private key will be  used as a default for all ledgers on that network and it is assumed this server is participating with every ledger, i.e. `fdb-ledger-private-keys=5...3@networka/dbname`
`fdb-ledger-servers` | `networka@some-domain.com:9795,` `networka@10.1.1.2:9795,` `networkb/dbname@external.dot.com:9795` | List of seed servers to contact for each network/db. Like fdb-ledger-identities, the db is optional. Every network/db + server address combination should be separated by a comma, i.e. `fdb-ledger-servers=` `networka@some-domain.com:9795,` `networka@10.1.1.2:9795,networkb/` `dbname@external.dot.com:9795`

### Password and JWT Token Settings {#password-and-jwt-token-settings}

Property | Options | Description
-- | -- | --
`fdb-pw-auth-enable` | `boolean` |This defaults to true, but will only work if there is a signing key for transactions.
`fdb-pw-auth-secret` | `string` | This secret is used to generate a HMAC signature that is used by scrypt to generate a valid private key from a password. Every auth record uses a unique salt ensuring different private keys for identical passwords. A server must have permission to access to the salt (stored in the _auth record) to successfully regenerate a private key - along with the normalized password and the following secret. Without all 3 elements, the private key cannot be regenerated.
`fdb-pw-auth-jwt-secret` | `string` | JWT tokens issued are secured with this secret. If empty, will default to use fdb-pw-auth-secret
`fdb-pw-auth-signing-key` | `string` | A valid Fluree private key with proper permissions must be used to sign any new transaction where new password auth records are created. If a default root key still exists and has proper permission, that will be used by default.
`fdb-pw-auth-jwt-max-exp` | `time in milliseconds, i.e. 86400000` |  Maximum allowed expiration time per JWT token in milliseconds. Blank means any amount of time is valid. (86400000 ms in 24 hours, 31536000000 in 1 year)
`fdb-pw-auth-jwt-max-renewal` | `time, i.e. 1y or 2d` | If renewal JWT tokens are allowed (blank if not allowed), maximum time from initial issuance a token can be renewed for in ms. To make this 'forever', use the maximum long value (9223372036854775807). For example, if you had a JWT token that expires after 120 seconds, but want to allow an active user to not be challenged for a password for up to 1 day, enter "1d" here and an unexpired token can be renewed as many times as desired (swapped for an 'fresh' token) so long as the original token issued from the password was less then this time period ago.
