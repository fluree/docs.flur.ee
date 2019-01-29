# Intro

## Welcome

Welcome to the FlureeDB documentation!

**Where to Start?** 

*Option 1*. To learn a little bit about how our database works, begin with the [What is FlureeDB?](#what-is-flureedb-) section. 

*Option 2*. To get your hands dirty right away, visit the [Quick Start](#quickstart) guide to use Fluree in the [FlureeDB interactive web console](#https://flureedb.flur.ee/). 

*Option 3*. To launch a standalone version of FlureeDB, visit the [Standalone FlureeDB](#standalone-flureedb) section. 

If you have issues, please do report them! A simple email to [support@flur.ee](mailto:support@flur.ee) is much appreciated with a description of what happened, and when. 

In addition, our [Fluree Slack](https://flureedb.slack.com/) is a great place to connect with other developers, ask questions, and chat about all things FlureeDB. If you are not already part of the Slack, please [join here](https://launchpass.com/flureedb).

## What is FlureeDB?

FlureeDB is an immutable, time-ordered blockchain database. 

Each block is an atomic update that is cryptographically signed to prevent tampering and linked to the previous block in the chain.

<p class="float-left">
    <img style="height: 400px; width: 600px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/blockContents.png" alt="A series of 5 blocks stacked on top of each other vertically. The middle block is deconstructed to show: the previous block's hash, the current block's hash, data, a timestamp, and the block index.">
</p>

At its core, every block contains a group of specially formatted log files of database updates, as well as block meta-data. We call these log files Flakes. Each Flake is a specific fact at a specific point in time about a specific entity. No two Flakes are the same.

Below is an example of database block. We will go into detail about the contents of the blocks in the [Transaction Response](#transaction-response) section. However, below you can see that, among other things, every block contains a hash, a timestamp, and the size of the block data (block-bytes). This block also contains an array of six Flakes. These Flakes contain all the data that is added, updated, or deleted in block 5, as compared to block 4. 

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

We can think of the database at any given point in time as the combination of all the Flakes up until that point. For example, the database at block 5 is the result of "playing all of the Flakes forward" from blocks 1 through 5. 

We will go into detail about how to create schema and transact data in the database later. But for now, the below image shows you a simplified representation of five blocks worth of Flakes. In the first two blocks, we create our simple schema (a user with a user/handle and a user/chat). In block 3, we add a new user named 'bob' and a chat message for Bob. In block 4, we create a new user with the handle 'jane', and finally in block 5, we attribute a chat to 'jane'.

<p class="text-center">
    <img style="height: 190px; width: 550px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/flakeLogBlocks1-5.png" alt="A table with the columns: 'entity', 'attribute', 'value', 'block', and 'add.' There are seven rows in this table, and each contains sample data, which is explained in the accompanying paragraph">
</p>

Rather than storing a copy of the entire database in each block, every block contains only Flakes, or facts about entities, that are different as of that block.

The [FlureeDB Whitepaper](https://flur.ee/assets/pdf/flureedb_whitepaper_v1.pdf) goes into more depth about how FlureeDB works. 

## Capabilities

We are focused on typical enterprise applications, which means we are optimized for:

- Highly relational data
- Very high (and complex) query volume

While we will have support for some high transactional volume use cases, it is less likely a blockchain database will be an ideal fit for these, and therefore this is not a current focus.

The Fluree database features these capabilities:

- ACID transactions
- Database functions
- Granular user permissions
- A GraphQL query interface
- Powerful query language that supports unlimited recursion and can be represented fully in JSON
- Scale-out writes by leveraging partitioning (in production soon).
- Scale-out reads, by separating eventually consistent query engines from the core blockchain transactor. Queries can optionally force consistency to a specific point-in-time or block.
- Point-in-time queries (in other words, time-travel), allowing you to query the same information at different points in time
- When leveraging Fluree's cloud-hosted private consensus, there is zero management overhead. Federated and fully decentralized consensus modes are in development.
- FlureeDB will be open source as we move forward in development.

## Standalone FlureeDB

To launch the standalone version of FlureeDB, download and unzip the [latest version of FlureeDB](#https://flur.ee/). The contents of the folder are as follows:

* flureeDB_transactor.sh - Shell script to launch FlureeDB.
* flureeDB.jar - FlureeDB packaged into a JAR file. 
* flureeDB.properties - File that specifies the customizeable FlureeDB properties. 
* Version - The version number.

### Setting the DB Configuration Options

The following are the properties that you can set in the flureeDB.properties file. Java property flages (i.e. -Dfdb-mode=dev) take precedent over properties in the flureeDB.properties file. Additionally. environment variables take precedent over both Java property flags and properties specified in flureeDB.properties.


Property | Options | Description   
-- | -- | --
fdb-mode | `dev` `query` `transactor` | Dev runs a standalone version of FlureeDB, which supports both queries and transaction. `Query` and `transactor` are for running FlureeDB as a query or transactor, respectively.
fdb-license-key | `key` | (Optional) Required for enterprise version
fdb-network | `string` | The name of the network the transactor group will operate in
fdb-group-port | `int` | The communication port for the transactor group
fdb-group-listen-addr | `ip address` | (Optional) Specify an ip address only if you want to bind listening to a specific IP address, otherwise FlureeDB will bind to: tcp://*:<fdb-group-port>
fdb-group-transactors | `server`,`server`, etc | (Optional) A list of transactors that will participate in this transactor group. Include the protocool (tcp:// only supported currently), server name, and port. List multiple servers with comma separating them, i.e.: fdb-group-transactors=tcp://10.0.0.1:9790,tcp://10.0.0.2:9790,tcp://10.0.0.3:9790. Leave this field blank to run when running FlureeDB standalone.
fdb-group-me | `server` | (Optional) "This" transactor must be in the list in fdb-group-transactors. Best practice is to pass this in as an environment variable. Leave this field blank to run when running FlureeDB standalone.
fdb-group-open-api | `boolean` | Set to true if a signature is not required in order to access [signed endpoints](#signed-endpoints).
fdb-storage-type | `file` `memory` `none` `Cassandra` | This option specifies the common storage for blocks and index segments. `file` stores in file directory. `none` stores on-disk, `memory` stores in-memory only and will disappear on server stop, and `Cassandra` allows you to use Apache Cassandra. If you chose Cassandra, there are additional options below you need to specify. 
fdb-storage-file-directory | `directory name` | (Optional) When using the `file` storage-type, this is the name of the file directory. 
fdb-memory-cache | `size` (i.e. 200mb) | The total memory cache of index segments across all databases. This can be changes per transactor. 
fdb-memory-reindex | `size` | Specify the size of novelty held before reindexing. Transactions will still be processed while reindexing occurs. This setting applies for each database, therefore it is important to make sure that all transactors and query peers have at least this much memory multiplied by the number of databases you expect to be active on those servers. This setting must be consistent across the entire transactor group. 
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

### Launching FlureeDB

Navigate to the directory where you downloaded FlureeDB in the terminal. The command to launch FlureeDB is:

`./flureeDB_transactor.sh` 

When you launch FlureeDB for the first time or if you choose `none` as your `fdb-storage-type`, FlureeDB will create the following databases:

1. Master Database with username: `master` and password: `fluree`
2. Test Database with username: `test` and password: `fluree`

In order to set your own username and password for the master database, you can either create environment variables or pass in a Java property flag at start-up with the keys: `username` and `password`. Username and password cannot be set in the flureeDB.properties file. 

For example, if you want to set your own username and password, you could run:

`./flureeDB_transactor.sh -Dusername=myusername -Dpassword=mypassword`

The password that you set for the master database, by default, is the same password as the password for the test database. 

### Launching Packaged UI

If FlureeDB is running on `fdb-group-port` 8080, then there is a built-in user interface that can be accessed at `localhost:8080/index.html`.

## QuickStart

This quick start is designed to utilize the [FlureeDB interactive web console](https://flureedb.flur.ee). These transactions could also be performed via your code or REPL utilizing the JSON API, but that would require a token.

The first six topics in the Quick Start guide will show you how to query and transact using an already populated database. The next five topics will show you how to set up a brand new database. 

\# | Topic
-- | -- 
1 | [Forking a Database](#forking-a-database)
2 | [Selecting All Actors, Movies, Credits](#selecting-all-actors-movies-credits)
3 | [Selecting a Specific Actor or Movie](#selecting-a-specific-actor-or-movie)
4 | [Selecting All Actors From a Movie](#selecting-all-actors-from-a-movie)
5 | [Selecting All Actor Names From a Movie](#selecting-all-actor-names-from-a-movie)
6 | [Adding a Movie to the Database](#adding-a-movie-to-the-database)
7 | [Creating Schema - Collections](#creating-schema---collections)
8 | [Creating Schema - Attributes](#creating-schema---attributes)
9 | [Transacting Data](#transacting-data) 
10 | [Querying Data](#querying-data)
11 | [Permissions Introduction](#permissions-introduction)

### Forking a Database
To begin, log in to the [FlureeDB Admin Portal (https://flureedb.flur.ee)](https://flureedb.flur.ee) and click "Add Database" in the bottom left-hand side of the page. 

When you create a new database, you have the option of starting from a blank database or forking a sample database. For this portion of the Quick Start, select "Movie Database" from the "Database Templates" options.

<p class="text-center">
    <img style="height: 345px; width: 550px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/forkMovieDb.png" alt='A form from the Admin Portal, heading is "Create New Database". There are two fields in the form, one with the label "Database Name" and the other with the label "Database Templates." "Movie Database" is selected as the option in "Database Templates.'>
</p>


Refresh, and then select your new database and the user "root" from the sidebar of the administrative portal.  

Now, select FlureeQL in the sidebar to go to the [FlureeQL interface](https://flureedb.flur.ee/flureeql). Make sure that the "Query" option is selected in the header. Now you are ready to start querying the database!

### Selecting All Actors, Movies, Credits

A Fluree schema consists of collections and attributes. Collections are similar to a relational database's tables. Collections organize changes about a type of entity, i.e. customers, invoices, employees. So if you have a new entity type, you'd create a new collection to hold it. You can learn more about collections in the [Collections](#collections) section. 

The movie database that we forked contains eight collections: actor, credit, keyword, genre, language, country, productionCompany, and movie. 

Fluree allows you to specify queries using our FlureeQL JSON syntax or with GraphQL. The FlureeQL format is designed to easily enable code to compose queries, as the query is simply a data structure.

For each query, the user's permissions (determined according to _auth record through which they are authenticated - more on that in the [Fluree Permissions](#fluree-permissions) section) create a special filtered database that only contains what the user can see. You can safely issue any query, never having to worry about accidentally exposing permissioned data.

We can select all attributes (*) for all actors in the database with the following query:

```all
{
 "select": ["*"],
 "from": "actor"
}
```

Your result will look similiar to this. 

```all
{
  "block": 12,
  "result": [
    {
      "_id": 4325032121660,
      "actor/gender": 0,
      "actor/name": "Skip P. Welch",
      "actor/id": 1893207
    },
    {
      "_id": 4325032121659,
      "actor/gender": 0,
      "actor/name": "Matthew Withers",
      "actor/id": 1893206
    }
    .
    .
    .
     ],
    "fuel": 292,
    "block": 3385,
    "time": "1.90ms"
}
```

Although there are more than 1,000 actors, by default FlureeDB only returns 1,000 results, although this can be changed by setting the [limit options](#apidbquery).

We can do the same thing for any other collection by just replacing "actor" with "movie" or "credit" for instance.

```all
{
 "select": ["*"],
 "from": "anyCollectionNameHere"
}
```

Note that only the FlureeQL syntax will work on the FlureeQL page, but we have also provided the GraphQL and curl syntax here if you prefer to follow along with the Quick Start through those modes.

#### Selecting All Actors 
```flureeql
{
 "select": ["*"],
 "from": "actor"
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
 "select": ["*"],
 "from": "actor"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
{
  graph {
    actor {
      /* Note that GraphQL does not support wildcards. */
      gender
      name
      id
    }
  }
}

```
#### Selecting All Movies
```flureeql
{
 "select": ["*"],
 "from": "movie"
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
 "select": ["*"],
 "from": "movie"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
{
  graph {
    movie {
      /* Note that GraphQL does not support wildcards. */
      title
      id
      genres
      budget
      credits
    }
  }
}

```

#### Selecting All Credits
```flureeql
{
 "select": ["*"],
 "from": "credit"
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
 "select": ["*"],
 "from": "credit"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
{
  graph {
    credit {
      /* Note that GraphQL does not support wildcards. */
      id
      actor
      character
      order
    }
  }
}

```

### Selecting A Specific Actor or Movie

FlureeDB allows you to select a collection from an entire collection, much like our examples thus far, or you can also specify a single entity.

An single entity can be selected using any valid identity, which includes the unique _id long integer if you know it, or any unique attribute's name and value.

For example, if you knew an actor's _id, you could select them using "from": that _id.

```all
{
  "select": ["*"],
  "from": 4316442136599
}
```

You could also use a unique attribute like "from": ["actor/name", "Angelina Jolie"]. Both results will be identical. The results are a map/object in this case, and not a collection.

```all
{
  "select": ["*"],
  "from": ["actor/name", "Angelina Jolie"]
}
```

Try it yourself. First query all the movies, then note down the _id for the movie you would like to select, and use that _id to select only that single movie. 

```all
{
  "select": ["*"],
  "from":  4294967299233
}
```

You can do the same thing by select a movie by its title, for example:

```all
{
  "select": ["*"],
  "from": ["movie/title", "Pulp Fiction"]
}
```

#### Selecting an Actor Using Their _id

```flureeql
{
  "select": ["*"],
  "from": 4316442136599
}
```

```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": 4316442136599
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```


#### Selecting an Actor Using Their Name
```flureeql
{
  "select": ["*"],
  "from": ["actor/name", "Angelina Jolie"]
}
```

```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": ["actor/name", "Angelina Jolie"]
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
{ graph {
  actor (where: "actor/name = \"Angelina Jolie\""){
    _id
    id
    name
  }
}
}
```

### Selecting All Actors From a Movie
FlureeDB support unlimited recursion in our queries. As a graph database, any FlureeDB query can follow a chain of relationships across multiple collections (and back).

For instance, let's suppose that we want to get all the actors from the movie, "Pulp Fiction". We can select all the attributes from `["movie/title", "Pulp Fiction"]` using this query:

```all
{
  "select": ["*"],
  "from": ["movie/title", "Pulp Fiction"]
}
```
However, the response only shows us the _id's for each credit/actor. 

```all
Abbreviated Response: 

{
  "block": 182,
  "result": {
    "movie/credits": [
      {
        "_id": 4312147222525,
        "credit/actor": {
          "_id": 4316442169628
        },
        "credit/order": 51,
        "credit/character": "Hopalong Cassidy (uncredited)",
        "credit/id": "52fe426ac3a36847f801cbc7"
      },
      {
        "_id": 4312147222596,
        "credit/actor": {
          "_id": 4316442156359
        },
        "credit/order": 39,
        "credit/character": "Gawker #1",
        "credit/id": "52fe426ac3a36847f801cba3"
      }
    ...
  }
}

```

Each movie/credit attribute is a reference to the credit collection. We can follow this relationship with a nested query.

```all
{
  "select": ["*", {
    "movie/credits": ["*"]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}
```

```all
Abbreviated Response: 
{
  "block": 182,
  "result": {
    "movie/credits": [
      {
        "_id": 4312147222525,
        "credit/actor": {
          "_id": 4316442169628
        },
        "credit/order": 51,
        "credit/character": "Hopalong Cassidy (uncredited)",
        "credit/id": "52fe426ac3a36847f801cbc7"
      },
      {
        "_id": 4312147222596,
        "credit/actor": {
          "_id": 4316442156359
        },
        "credit/order": 39,
        "credit/character": "Gawker #1",
        "credit/id": "52fe426ac3a36847f801cba3"
      }
      ...
  }
}
```

This query follows the relationship between the movie and the credit collections. It does not, however, show us actor names - only their _ids. In order to get actor names, we have to continue following the relationship from movie/credits to credit/actor. 

```all
{
  "select": ["*", {
    "movie/credits": ["*", 
    {
      "credit/actor": ["*"]
    }]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}
```

```all
Abbreviated Response: 
{
  "block": 182,
  "result": {
    "movie/credits": [
      {
        "_id": 4312147222525,
        "credit/actor": {
          "_id": 4316442169628,
          "actor/gender": 0,
          "actor/name": "Devan Richardson",
          "actor/id": 1274298
        },
        "credit/order": 51,
        "credit/character": "Hopalong Cassidy (uncredited)",
        "credit/id": "52fe426ac3a36847f801cbc7"
      },
      {
        "_id": 4312147222596,
        "credit/actor": {
          "_id": 4316442156359,
          "actor/gender": 1,
          "actor/name": "Karen Maruyama",
          "actor/id": 157865
        },
        "credit/order": 39,
        "credit/character": "Gawker #1",
        "credit/id": "52fe426ac3a36847f801cba3"
      }
      ...
  }
}
```

#### Selecting All Attributes From Movie
```flureeql
{
  "select": ["*"],
  "from": ["movie/title", "Pulp Fiction"]
}
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": ["movie/title", "Pulp Fiction"]
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
{ graph {
  movie (where: "movie/title = \"Pulp Fiction\""){
    title
    _id
    id
    credits {
      _id
    }
  }
}
}
```

#### Selecting All Attributes From Movie and Movie/Credits
```flureeql
{
  "select": ["*", {
    "movie/credits": ["*"]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*", {
    "movie/credits": ["*"]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
{ graph {
  movie (where: "movie/title = \"Pulp Fiction\""){
    title
    _id
    id
    credits {
      _id
      actor {
        _id
      }
    }
  }
}
}
```
#### Selecting All Attributes From Movie and Movie/Credits and Credit/Actor
```flureeql
{
  "select": ["*", {
    "movie/credits": ["*", 
    {
      "credit/actor": ["*"]
    }]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*", {
    "movie/credits": ["*", 
    {
      "credit/actor": ["*"]
    }]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
{ graph {
  movie (where: "movie/title = \"Pulp Fiction\""){
    title
    _id
    id
    credits {
      _id
      actor {
        _id
        name
        gender
        id
      }
    }
  }
}
}
```

### Selecting All Actor Names From a Movie
Suppose that instead of getting all of the attributes for every credit and actor from "Pulp Fiction," we only wanted to see actor/name. We can do this by only including actor/name in our "select" clause. 

```all
Abbreviated Response:
{
  "block": 182,
  "result": {
    "movie/credits": [
      {
        "credit/actor": {
          "actor/name": "Devan Richardson"
        }
      },
      {
        "credit/actor": {
          "actor/name": "Karen Maruyama"
        }
      },
      {
        "credit/actor": {
          "actor/name": "Emil Sitka"
        }
      }
      ...
  }
}
```

#### Selecting All Actor Names From Movie and Movie/Credits and Credit/Actor
```flureeql
{
  "select": [{
    "movie/credits": [
    {
      "credit/actor": ["actor/name"]
    }]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [{
    "movie/credits": [
    {
      "credit/actor": ["actor/name"]
    }]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
{ graph {
  movie (where: "movie/title = \"Pulp Fiction\""){
    credits {
      actor {
        name
      }
    }
  }
}
}
```

### Adding a Movie to the Database

To write data to the Fluree Database, you submit a collection of statements to the transactor endpoint. All of the statements will be successfully committed together, or all fail together with the error reported back to you. Transactions have ACID guarantees.

While everything transacted here could be done in a single atomic transaction, we split it up to illustrate a couple points.

Every transaction item must have an `_id` attribute to refer to the entity we are attempting to create/update. An `_id` can either be an existing entity's unique numeric ID, a two-tuple of a unique attribute+value, or a [tempid](#temporary-ids). A tempid can simply be the collection name, i.e. `movie` or it can be a collection name with unique reference. To make a unique tempid, just append the collection with any non-valid collection character (anything other than a-z, A-Z, 0-9, _) followed by anything else. For example, `_movie$1` or `movie&movie-one`.

In the first transaction we add a couple of movies. 

```all
{
  "tempids": {
    "movie$1": 4294967300804,
    "movie$2": 4294967300805
  },
  "block": 183,
  "hash": "6cfc0b1de70cb9c6c437b2b045db9d985253ac6dcc03e1a6d50ccd1b3c3fb69f",
  "time": "174.68ms",
  "status": 200,
  "block-bytes": 538,
  "timestamp": 1529941815751,
  "flakes": [
     [ 4294967300805, 1010, 1, -11993088, true, 0 ],
     [ 4294967300805, 1003, "A low-budget remake of 'Pulp Fiction.' With less pulp.", -11993088, true, 0 ],
     [ 4294967300805, 1001, "Less-Pulp Fiction", -11993088, true, 0 ],
     [ 4294967300804, 1010, 1000, -11993088, true, 0 ],
     [ 4294967300804, 1001, "Loudness of the Hams", -11993088, true, 0 ],
     [ -11993088, 5, 1529941815751, -11993088, true, 0 ],
     [ -11993088, 2, "26d01a820a93a15dfed16c1394881a980ff37cc2ac79899b270e05748408251b", -11993088, true, 0 ],
     [ -11993088, 1, "6cfc0b1de70cb9c6c437b2b045db9d985253ac6dcc03e1a6d50ccd1b3c3fb69f", -11993088, true, 0 ]
  ]
}
```

The second transaction adds two new credits. Note that the values used for the actor keys are `_id`s, but rather than being tempids or the resolved integer `_id`s, they refers to an attribute and a value, ["actor/name", "John Travolta"] and ["actor/name", "Samuel L. Jackson"]. This method can be used for any attribute marked as `unique`.

```all
{
  "tempids": {
    "credit$1": 4312147271442,
    "credit$2": 4312147271443
  },
  "block": 184,
  "hash": "f6880054df8b6bc6e49921a86efd78f0640f64321031f8a6dcf586ca64e6d7eb",
  "time": "219.12ms",
  "status": 200,
  "block-bytes": 454,
  "timestamp": 1529942472956,
  "flakes": [
     [ 4312147271443, 1032, 4316442133412, -12058624, true, 0 ],
     [ 4312147271443, 1030, "Jewels Spinnfield", -12058624, true, 0 ],
     [ 4312147271442, 1032, 4316442135748, -12058624, true, 0 ],
     [ 4312147271442, 1030, "Mince Vega", -12058624, true, 0 ],
     [ -12058624, 5, 1529942472956, -12058624, true, 0 ],
     [ -12058624, 2, "6cfc0b1de70cb9c6c437b2b045db9d985253ac6dcc03e1a6d50ccd1b3c3fb69f", -12058624, true, 0 ],
     [ -12058624, 1, "f6880054df8b6bc6e49921a86efd78f0640f64321031f8a6dcf586ca64e6d7eb", -12058624, true, 0 ]
  ]
}
```

After the first and second transactions, we have two new movies in our database and two new credits in our database, but they are not connected. In the third transaction, we add a new attribute, `movie/credits` to one of our new movies. Note that `movie/credits` is an attribute that accepts multiple values (a movie has more than one credit after all!), so we reference the credit's _ids inside an array, `[4312147271442,  4312147271443]`.

```all
{
  "tempids": {},
  "block": 185,
  "hash": "4896f4b0dcc95a8dd590ae246e584549f434ec033333d77b9a5a47d09b1e71f8",
  "time": "78.63ms",
  "status": 200,
  "block-bytes": 345,
  "timestamp": 1529942605730,
  "flakes": [
     [ 4294967300805, 1019, 4312147271442, -12124160, true, 0 ],
     [ 4294967300805, 1019, 4312147271443, -12124160, true, 0 ],
     [ -12124160, 5, 1529942605730, -12124160, true, 0 ],
     [ -12124160, 2, "f6880054df8b6bc6e49921a86efd78f0640f64321031f8a6dcf586ca64e6d7eb", -12124160, true, 0 ],
     [ -12124160, 1, "4896f4b0dcc95a8dd590ae246e584549f434ec033333d77b9a5a47d09b1e71f8", -12124160, true, 0 ]
  ]
}
```

Note that all transactions must be sent to the transactor endpoint as arrays, as seen in the previous examples. 

#### Adding Movies
```flureeql
[{
  "_id": "movie",
  "title": "Loudness of the Hams",
  "budget": 1000
},
{
  "_id": "movie",
  "title": "Less-Pulp Fiction",
  "budget": 1,
  "overview": "A low-budget remake of 'Pulp Fiction.' With less pulp."
}]
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": "movie",
  "title": "Loudness of the Hams",
  "budget": 1000
},
{
  "_id": "movie",
  "title": "Less-Pulp Fiction",
  "budget": 1,
  "overview": "A low-budget remake of 'Pulp Fiction.' With less pulp."
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
mutation addMovies ($myMovieTx: JSON) {
  transact(tx: $myMovieTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myMovieTx": "[
    {\"_id\":\"movie\",\"title\":\"Loudness of the Hams\",\"budget\":1000}, 
    {\"_id\":\"movie\",\"title\":\"Less-Pulp Fiction\",\"budget\":1,
    \"overview\": \"A low-budget remake of 'Pulp Fiction.' With less pulp.\"}
    ]"
}
```

#### Creating New Credits

```flureeql
[{
  "_id": "credit",
  "character": "Mince Vega",
  "actor": ["actor/name", "John Travolta"]
},
{
  "_id": "credit",
  "character": "Jewels Spinnfield",
  "actor": ["actor/name", "Samuel L. Jackson"]
}]
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": "credit",
  "character": "Mince Vega",
  "actor": ["actor/name", "John Travolta"]
},
{
  "_id": "credit",
  "character": "Jewels Spinnfield",
  "actor": ["actor/name", "Samuel L. Jackson"]
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
mutation addCredit ($myCreditTx: JSON) {
  transact(tx: $myCreditTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myCreditTx": "[
    {\"_id\":\"credit\",\"character\":\"Mince Vega\",\"actor\":[\"actor/name\",\"John Travolta\"]},
    {\"_id\": \"credit\", \"character\": \"Jewels Spinnfield\", \"actor\": [\"actor/name\", \"Samuel L. Jackson\"]}
  ]"
}
```

#### Updating A Movie With Credit References

```flureeql
[{
  "_id": ["movie/title", "Less-Pulp Fiction"],
  "credits": [4312147271442,  4312147271443]
}]
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": ["movie/title", "Less-Pulp Fiction"],
  "credits": [4312147271442,  4312147271443]
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
mutation addMovieCredit ($myMovieCreditTx: JSON) {
  transact(tx: $myMovieCreditTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myMovieCreditTx": "[{
    \"_id\": [\"movie/title\", \"Less-Pulp Fiction\"],
    \"credits\": [[4312147271442,  4312147271443]]
  }]"
}
```

### Creating Schema - Collections

Up until this point, we have been using an already-populated database. Now, we will create and transact using our own schema. 

To follow along with this portion of the Quick Start guide, create a new database and select "Blank Database" as your database template.

Fluree schema consists of collections and attributes. These are similar to a relational database's tables and columns, however in Fluree both of these concepts are extended and more flexible. Collections organize changes about a type of entity, i.e. customers, invoices, employees. So if you have a new entity type, you'd create a new collection to hold it. Collections differ from tables in that they are an always-present collection of changes about those entities that can be queried at any point in time, not just the latest changes as a traditional database would do.

Everything is data in FlureeDB. This includes the schemas, permissions, etc. that actually govern how it works. To add new collections we'll do a transaction the exact way we'd add any new data. Here we'll add our new collections and attributes in two separate transactions to explain what is happening, but they could be done in one.

This transaction adds three collections:

- `person` - will hold names/handles for the people that are chatting
- `chatMessage` - will hold the chat message content
- `chatComment` - will hold comments about messages

Here we use a tempid as we are creating new entities in the system collection named `_collection`. `_collection` is a system collection/table that holds the configured collections, and `_attribute` likewise for attributes.

#### Collection schema transaction

```flureeql
[{
 "_id": "_collection",
 "name": "person",
 "doc": "A collection/table to hold our people",
 "version": "1"
},
{
 "_id": "_collection",
 "name": "chat",
 "doc": "A collection/table to hold chat messages",
 "version": "1"
},
{
 "_id": "_collection",
 "name": "comment",
 "doc": "A collection/table to hold comments to chat messages",
 "version": "1"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":     "_collection",
  "name":    "person",
  "doc":     "A collection/table to hold our people",
  "version": "1"
},
{
  "_id":     "_collection",
  "name":    "chat",
  "doc":     "A collection/table to hold chat messages",
  "version": "1"
},
{
  "_id":     "_collection",
  "name":    "comment",
  "doc":     "A collection/table to hold comments to chat messages",
  "version": "1"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addCollections ($myCollectionTx: JSON) {
  transact(tx: $myCollectionTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myCollectionTx": "[{\"_id\": \"_collection\", \"name\": \"person\", \"doc\": \"A collection/table to hold our people\", \"version\": \"1\"},{ \"_id\": \"_collection\", \"name\": \"chat\", \"doc\": \"A collection/table to hold chat messages\", \"version\": \"1\"},{ \"_id\": \"_collection\", \"name\": \"comment\", \"doc\": \"A collection/table to hold comments to chat messages\", \"version\": \"1\"}]"
}

```


### Creating Schema - Attributes

Schema attributes are similar to relational database columns, however there are fewer restrictions.
Any attribute can be attached to any entity, unless a restriction is put in place using a `spec`.

The transaction sample here adds the following attributes:

People
- `person/handle` - The person's unique handle. Being marked as `unique`, it can be used as an `_id` in subsequent queries or transactions.
- `person/fullName` - The person's full name. Because it is marked as `index`, it can be used in `where` clauses.

Chats
- `chat/message` - The actual message content.
- `chat/person` - A reference to the person that made this chat (a join), and because it is a join that refers to a different entity, its `type` is marked as `ref` .
- `chat/instant` - The instant this chat message happened. Its `type` is `instant` and is indexed with `index` which
will allow range queries on this attribute.
- `chat/comments` - Comments about this message, which are also joins (`ref`). `multi` indicates multiple comments can be stored, and `component` indicates these referenced comment entities should be treated as part of this parent, and if the parent (in this case the chat message) is deleted, the comments will also be deleted.

Comments
- `comment/message` - A comment message.
- `comment/person` - A reference to the person who made the comment (a join).

#### Attribute schema transaction

```flureeql
[{
  "_id":    "_attribute",
  "name":   "person/handle",
  "doc":    "The person's unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   "_attribute",
  "name":  "person/fullName",
  "doc":   "The person's full name.",
  "type":  "string",
  "index": true
},
{
  "_id":  "_attribute",
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "string"
},
{
  "_id":  "_attribute",
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id":   "_attribute",
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "instant",
  "index": true
},
{
  "_id":       "_attribute",
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "ref",
  "component": true,
  "multi":     true,
  "restrictCollection": "comment"
},
{
  "_id":  "_attribute",
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "string"
},
{
  "_id":  "_attribute",
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "ref",
  "restrictCollection": "person"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":   "_attribute",
  "name":   "person/handle",
  "doc":    "The persons unique handle",
  "unique": true,
  "type":   "string"
},
{
  "_id":   "_attribute",
  "name":  "person/fullName",
  "doc":   "The persons full name.",
  "type":  "string",
  "index": true
},
{
  "_id":  "_attribute",
  "name": "chat/message",
  "doc":  "A chat message",
  "type": "string"
},
{
  "_id":  "_attribute",
  "name": "chat/person",
  "doc":  "A reference to the person that created the message",
  "type": "ref",
  "restrictCollection": "person"
},
{
  "_id":   "_attribute",
  "name":  "chat/instant",
  "doc":   "The instant in time when this chat happened.",
  "type":  "instant",
  "index": true
},
{
  "_id":       "_attribute",
  "name":      "chat/comments",
  "doc":       "A reference to comments about this message",
  "type":      "ref",
  "component": true,
  "multi":     true,
  "restrictCollection": "comment"
},
{
  "_id":  "_attribute",
  "name": "comment/message",
  "doc":  "A comment message.",
  "type": "string"
},
{
  "_id":  "_attribute",
  "name": "comment/person",
  "doc":  "A reference to the person that made the comment",
  "type": "ref",
  "restrictCollection": "person"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addPeopleAttributes ($myPersonTx: JSON) {
  transact(tx: $myPersonTx)
}

mutation addChatAttributes ($myChatTx: JSON) {
  transact(tx: $myChatTx)
}

mutation addCommentAttributes ($myCommentTx: JSON) {
  transact(tx: $myCommentTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{"myPersonTx": "[
  
  { \"_id\": \"_attribute\", \"name\": \"person/handle\", \"doc\": \"The person's unique handle\", \"unique\": true, \"type\": \"string\"},
  { \"_id\": \"_attribute\", \"name\": \"person/fullName\", \"doc\": \"The person's full name.\", \"type\": \"string\", \"index\": true}]"}

{
  "myChatTx": "[
    { \"_id\": \"_attribute\", \"name\": \"chat/message\", \"doc\": \"A chat message\", \"type\": \"string\"},
    { \"_id\": \"_attribute\", \"name\": \"chat/person\", \"doc\": \"A reference to the person that created the message\", \"type\": \"ref\", \"restrictCollection\": \"person\"},
    { \"_id\": \"_attribute\", -12], \"name\": \"chat/instant\", \"doc\": \"The instant in time when this chat happened.\", \"type\": \"instant\", \"index\": true},
    { \"_id\": \"_attribute\", \"name\": \"chat/comments\", \"doc\": \"A reference to comments about this message\", \"type\": \"ref\", \"component\": true, \"multi\": true, \"restrictCollection\": \"comment\"}]"
}

{
  "myCommentTx": "[
    { \"_id\": \"_attribute\", \"name\": \"comment/message\", \"doc\": \"A comment message.\", \"type\": \"string\"},
    { \"_id\": \"_attribute\", \"name\": \"comment/person\", \"doc\": \"A reference to the person that made the comment\", \"type\": \"ref\", \"restrictCollection\": \"person\"}]"
}


```

### Transacting Data

In the first transaction we add a couple of people. The second transaction adds a chat message. Note the value used for the `person` key is an `_id`, but this time instead of it being a tempid it refers to an attribute and its corresponding value, `["person/handle", "jdoe"]`. This method can be used for any attribute marked as `unique`.

Here is what an abbreviated response will look like from this transaction:

```all
{
  "tempids": {
    "chat$1": 4299262263297
  },
  "block": 5,
  "hash": "40bc619be312251493788911cfe1ac6106803bc05166cc776d728b63b415b5c0",
  "time": "17.32ms",
  "status": 200,
  "block-bytes": 400,
  "timestamp": 1527611445038,
  "flakes": [
     [ 4299262263297, 1004, 1527611445050, -589824, true, 0 ],
     [ 4299262263297, 1003, 4294967296001, -589824, true, 0 ],
     [ 4299262263297, 1002, "This is a sample chat from Jane!", -589824, true, 0 ],
     [ -589824, 5, 1527611445038, -589824, true, 0 ],
     [ -589824, 2, "386cede775f6308cb48beaa9e9fac60c8d184db836194566412b798ab36a2cd6", -589824, true, 0 ],
     [ -589824, 1, "40bc619be312251493788911cfe1ac6106803bc05166cc776d728b63b415b5c0", -589824, true, 0 ]
  ]
}
```

Now that we have stored a piece of data, let's query it.


#### Sample person transaction

```flureeql
[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact  
```

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, 
    { \"_id\": \"person\", \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

#### Sample chat message transaction

```flureeql
[{
  "_id":     "chat",
  "message": "This is a sample chat from Jane!",
  "person":  ["person/handle", "jdoe"],
  "instant": "#(now)"
}]
```

```curl
    curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id":     "chat",
    "message": "This is a sample chat from Jane!",
    "person":  ["person/handle", "jdoe"],
    "instant": "#(now)"
    }]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addChatMessage ($myChatTx: JSON) {
  transact(tx: $myChatTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myChatTx": "[
    { \"_id\": \"chat\", \"message\": \"This is a sample chat from Jane!\", \"person\": [\"person/handle\", \"jdoe\"], \"instant\": \"#(now)\" }]"
}

```

### Querying Data

These two example queries will return current chat messages. The second example follows the graph relationship to also include details about the referred person who posted the chat message.

#### Simple query for all chat messages

```flureeql
{
  "select": ["*"],
  "from": "chat"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{ "select": ["*"], "from": "chat"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
<!-- GraphQl does not have wildcard support. You need to list all columns you wish to view. -->

{ graph {
  chat {
    _id
    message
    person
    instant
    comments 
  }  
}
}
```

#### Same chat query, but follow the graph to reveal details about the person

```flureeql
{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}
```

```curl
curl  \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat {
    _id
    message
    instant
    person {
      _id
      fullName
      handle
    }
  }
}
}
```

#### Person query, but follow chat relationship in reverse to find all their chats (note the underscore `_` or `_Via_`)

```flureeql
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  person {
    chat_Via_person {
      _id
      instant
      message
    }
  }
}
}

```

### Permissions Introduction

We can enable permissions on both query and transaction operations, and the permissions can be as simple as a true/false declaration or an [expressive predicate rule function](#database-functions) that resolves to either true or false. All permissions are stored in the `_fn` collection and are referenced via a `ref` attribute on `_rule/predicate`.

Here we'll go through all the steps needed to add a permission that accomplishes two main things:

1. Users can only see `chat` and `person` collection data, but no other data in the database
2. A user can only create or update a chats of their own (if they are the referenced `chat/person`)

To accomplish this we need to do a few things:

1. Create an actual database user for the chat user(s) along with at least one auth record. Permissions are governed by auth records, users are optional but a user can have multiple auth entities each giving different permissions (the [Fluree Permissions](#fluree-permissions) section explains this in more detail).
2. Link the `person` entities we created to the database user(s) using a `ref` (reference) attribute so we can traverse the graph from the `person` entity to the `_user` database user entity and then to the `_auth` record itself.
3. Create rules to enforce the above desired permissions, and connect them to the user using another `ref` attribute. 
4. Create an assignable role that contains these rules so we can easily add the role to our chat user(s).
5. Assign the new role to the user(s).
6. Execute commands with a token tied to the `_auth` record we create

A token (which governs permissions) is tied to a specific `_auth` entity which can directly have roles assigned to it, or default roles can be assigned to a `_user` entity assuming the `_auth` entity is tied to a `_user` via the `_user/auth` attribute. An `_auth` entity can be independent, and is not required to be tied to a `_user`. Most applications we typically use don't work like this (but most cryptos do work like this). We'll get into different ways of leveraging authentication later, but public/private key cryptography is used, however this is abstracted away with hosted FlureeDB.


**>> Execute the example transaction to add a new attribute named `person/user` that allows a `ref` from any of our persons to a database user.**


Next, we add a new role called `chatUser` that we can easily assign to all chat users. The role has three rules in it. The first, `viewAllChats`, allows `query` (read) permissions for every attribute in the collection `chat`. The second rule, `viewAllPeople` similarly allows `query` for every attribute in the collection `person`. Note, that every database has two built-in functions, `["_fn$name", "true"]` and `["_fn$name", "false"]`, which either allow or block access, respectively, to a given collection or attribute. The final rule, `editOwnChats`, will restrict `transact` to ensure only chats by the respective `person` can be created or edited.

**>> Execute the example transaction to add the new role and these three rules.**

The final step is to create a new database user, `_user`. Here we'll create one for `jdoe` and link her user record to the `person` entity we already created, and the `_role` we just created. Remember an `_auth` entity is what actually gets tied to a token, so we need to create one of those too. In this case our `_auth` doesn't do anything, it just acts as a stub for the moment.

The rule predicate function in `editOwnChats` follows the graph of a chat message's relationships to determine if the user can see it. In this case, the `get-all` function will take a chat message and traverse:

`chat message ->> chat/person ->> person/user ->> database user`

The rule stipulates, that if the database user found after following the graph equals the current `?user_id`, then creating a new chat message or editing an existing one is allowed.

**>> Execute the final transaction example.**

Now, refresh the Fluree user interface (it does not automatically refresh with detected new user/roles). Select the database you were working on in the UI sidebar, and you should now have a user listed as `jdoe`. If you select `jdoe`, you'll be using the custom database just for her that you created with the aforementioned rules. Try to query different collections, or create/update chat messages. The rules we've defined here will only allow the described behavior.

**>> Quick Start is now complete. Please see the additional documentation provided here for added references.**

#### Add a new attribute to link a person to a database user

```flureeql 
[{
  "_id":    "_attribute",
  "name":   "person/user",
  "doc":    "Reference to a database user.",
  "type":   "ref",
  "restrictCollection": "_user"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "_attribute",
  "name":   "person/user",
  "doc":    "Reference to a database user.",
  "type":   "ref",
  "restrictCollection": "_user"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addDBUserAttributes ($myDBUserAttributeTx: JSON) {
  transact(tx: $myDBUserAttributeTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myDBUserAttributeTx": "[
    { \"_id\": \"_attribute\", \"name\": \"person/user\", \"doc\": \"Reference to a database user.\", \"type\": \"ref\", \"restrictCollection\": \"_user\" }
    ]"
}
```

#### Add a role and rules

```flureeql 
[
  {
    "_id": "_role",
    "id": "chatUser",
    "doc": "A standard chat user role",
    "rules": ["_rule$viewAllChats", "_rule$viewAllPeople", "_rule$editOwnChats"]
  },
  {
    "_id": "_rule$viewAllChats",
    "id": "viewAllChats",
    "doc": "Can view all chats.",
    "collection": "chat",
    "collectionDefault": true,
    "predicate": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "collection": "person",
    "collectionDefault": true,
    "predicate": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$editOwnChats",
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "collection": "chat",
    "attributes": ["chat/message"],
    "predicate": ["_fn$editOwnChats"],
    "ops": ["transact"]
  },
  {
    "_id": "_fn$editOwnChats",
    "name": "editOwnChats",
    "code": "(contains? (get-all (?e \"[{chat/person  [{person/user [_id] }]\") [\"chat/person\" \"person/user\" \"_id\"]) (?user_id))"
  }
]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[
  {
    "_id": "_role",
    "id": "chatUser",
    "doc": "A standard chat user role",
    "rules": ["_rule$viewAllChats", "_rule$viewAllPeople", "_rule$editOwnChats"]
  },
  {
    "_id": "_rule$viewAllChats",
    "id": "viewAllChats",
    "doc": "Can view all chats.",
    "collection": "chat",
    "collectionDefault": true,
    "predicate": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "collection": "person",
    "collectionDefault": true,
    "predicate": [["_fn/name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$editOwnChats",
    "id": "editOwnChats",
    "doc": "Only allow users to edit their own chats",
    "collection": "chat",
    "attributes": ["chat/message"],
    "predicate": ["_fn$editOwnChats"],
    "ops": ["transact"]
  },
  {
    "_id": "_fn$editOwnChats",
    "name": "editOwnChats",
    "code": "(contains? (get-all (?e \"[{chat/person  [{person/user [_id] }]\") [\"chat/person\" \"person/user\" \"_id\"]) (?user_id))"
  }
]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addRole ($myRoleTx: JSON) {
  transact(tx: $myRoleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myRoleTx": "[{\"_id\":\"_role\",\"id\":\"chatUser\",\"doc\":\"A standard chat user role\",\"rules\":[\"_rule$viewAllChats\",\"_rule$viewAllPeople\",\"_rule$editOwnChats\"]},{\"_id\":\"_rule$viewAllChats\",\"id\":\"viewAllChats\",\"doc\":\"Can view all chats.\",\"collection\":\"chat\",\"collectionDefault\":true,\"predicate\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$viewAllPeople\",\"id\":\"viewAllPeople\",\"doc\":\"Can view all people\",\"collection\":\"person\",\"collectionDefault\":true,\"predicate\":[[\"_fn/name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$editOwnChats\",\"id\":\"editOwnChats\",\"doc\":\"Only allow users to edit their own chats\",\"collection\":\"chat\",\"attributes\":[\"chat/message\"],\"predicate\":[\"_fn$editOwnChats\"],\"ops\":[\"transact\"]},{\"_id\":\"_fn$editOwnChats\",\"name\":\"editOwnChats\",\"code\":\"(contains? (get-all (?e \\\"[{chat/person  [{person/user [_id] }]\\\") [\\\"chat/person\\\" \\\"person/user\\\" \\\"_id\\\"]) (?user_id))\"}]"
}

```

#### Create a new user with an auth record containing that role

```flureeql
[
  {
    "_id":    "_user$jdoe",
    "username": "jdoe",
    "roles": [["_role/id", "chatUser"]],
    "auth": ["_auth$temp"]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": "_user$jdoe"
  },
  {
    "_id": "_auth$temp",
    "id": "tempAuthRecord"
  }
]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id":    "_user$jdoe",
    "username": "jdoe",
    "roles": [["_role/id", "chatUser"]],
    "auth": ["_auth$temp"]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": "_user$jdoe"
  },
  {
    "_id": "_auth$temp",
    "id": "tempAuthRecord"
  }]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addUserAuth($myUserAuthTx: JSON){
  transact(tx: $myUserAuthTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myUserAuthTx": "[ 
    { \"_id\": \"_user$jdoe\", \"username\": \"jdoe\", \"roles\": [[\"_role/id\", \"chatUser\"]], \"auth\": [\"_auth$temp\"] }, 
    { \"_id\": [\"person/handle\", \"jdoe\"], \"user\": \"_user\$jdoe" }, 
    { \"_id\": \"_auth$temp\", \"id\": \"tempAuthRecord\" } ]"
}
```


# Your App + FlureeDB

## Overview

Interacting with FlureeDB from your application can be done in one of three ways:

1. The JSON API (i.e. FlureeQL)
2. GraphQL
3. An embeddable FlureeDB client (not yet in production)

For any of these methods, a valid token must be supplied with the database requests (queries, transactions, etc.). 

Tokens are tied to a specific authorization record stored in the database and govern the permission of the requests. There are several ways to get a token which are subsequently explained.

It is worth noting that transactions are signed using public/private key cryptography. The hosted FlureeDB abstracts this from your application so that a more common username/password authentication scheme can be utilized.


## Getting Tokens

Interacting with the hosted FlureeDB is done using secure tokens that have the authorization identity encoded directly in them. There are several ways to get tokens, and the method you choose is influenced by how you'd like to run FlureeDB.

**Interacting with FlureeDB only from your app server**

FlureeDB can be run in a manner similar to a traditional database server, 'behind' your application server. If you choose to utilize it in this way, you simply need to generate a token with the permissions you desire (likely full access) and pass it to your application. You provide the token to your application like you would any secret, typically via an environment variable.

To get a permanent admin token, follow these steps:

1. Identify the authorization record (or create one) that you wish the token to utilize. A sample transaction is provided here if you need to create a new one. Note that, by default, all databases have a built-in `["_role/id", "root"]` role with access to everything inside a database.
2. Generate a token tied to that authorization record either via the FlureeDB admin dashboard or via an API call

If you need to create an authorization record, see the example provided.

Remember, authorization is governed by rules (stored in the `_rule` collection). Rule predicates (either true/false or more complicated [database functions](#database-functions)) are stored in the `_fn` collection, and listed in the multi-cardinality attribute, `_rule/predicate` as a `ref`. Rules are grouped into roles (stored in the `_role` collection), and roles are assigned to auth entities (`_auth` collection).

#### Sample rule, role and auth record for admin privileges

```flureeql
[
  {
    "_id":    "_auth",
    "id":    "db-admin",
    "doc":    "A db admin auth that has full data visibility and can generate tokens for other users.",
    "roles":  [["_role/id" "root"]]
  }
]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[
  {
    "_id":    "_auth",
    "id":    "db-admin",
    "doc":    "A db admin auth that has full data visibility and can generate tokens for other users.",
    "roles":  ["_role$db-admin"] 
  },
  {
    "_id":   "_role$db-admin", 
    "id":    "db-admin",
    "doc":   "A role for full access to database.",
    "rules": ["_rule$db-admin",  "_rule$db-token", "_rule$db-logs"] 
  },
  {
    "_id":       "_rule$db-admin" ,
    "id":        "db-admin",
    "doc":       "Rule that grants full access to all collections.",
    "collection":    "*",
    "collectionDefault": true,
    "ops":       ["query", "transact"],
    "predicate": ["_fn$name", "true"]
  },
  {
    "_id":       "_rule$db-token" ,
    "id":        "db-admin-token",
    "doc":       "Rule allows token generation for other users.",
    "ops":       ["token"],
    "predicate": ["_fn$name", "true"]
  },
    {
    "_id":       "_rule$db-logs" ,
    "id":        "db-admin-logs",
    "doc":       "Rule allows user to access account logs.",
    "ops":       ["logs"],
    "predicate": ["_fn$name", "true"]
  }
]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addRoleRuleAuth($myAuthTx: JSON){
  transact(tx: $myAuthTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myAuthTx": "[{\"_id\":\"_auth\",\"id\":\"db-admin\",\"doc\":\"A db admin auth that has full data visibility and can generate tokens for other users.\",\"roles\":[\"_role$db-admin\"]},{\"_id\":\"_role$db-admin\",\"id\":\"db-admin\",\"doc\":\"A role for full access to database.\",\"rules\":[\"_rule$db-admin\",\"_rule$db-token\",\"_rule$db-logs\"]},{\"_id\":\"_rule$db-admin\",\"id\":\"db-admin\",\"doc\":\"Rule that grants full access to all collections.\",\"collection\":\"*\",\"collectionDefault\":true,\"ops\":[\"query\",\"transact\"],\"predicate\":[\"_fn$name\",\"true\"]},{\"_id\":\"_rule$db-token\",\"id\":\"db-admin-token\",\"doc\":\"Rule allows token generation for other users.\",\"ops\":[\"token\"],\"predicate\":[\"_fn$name\",\"true\"]},{\"_id\":\"_rule$db-logs\",\"id\":\"db-admin-logs\",\"doc\":\"Rule allows user to access account logs.\",\"ops\":[\"logs\"],\"predicate\":[\"_fn$name\",\"true\"]}]"
}
```

#### Query for all `_auth` records and their respective rules and roles

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": [ "*", { "_auth/roles": [ "*", {"_role/rules": ["*"]} ] } ], "from": "_auth"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```flureeql
{
  "select": [ "*", { "_auth/roles": [ "*", {"_role/rules": ["*"]} ] } ],
  "from": "_auth"
}
```

```graphql
{ graph {
  _auth {
    _id
    id
    doc
    key
    roles {
      id
      _id
      doc
      rules {
        id
        _id
        doc
        collection
        collectionDefault
        predicate
        ops
      }
    }
  }  
}
}
```

**Interacting with FlureeDB directly from your end-user apps**

FlureeDB is also designed to interact directly with front-end apps/UIs via a set of permissions tied to individual users. The rules-based permissions will 'hide' any data the user is unable to view, and prevent unauthorized transactions. In this case, each user will need a unique token tied to them. There are two ways to generate these user-specific tokens:

1. An API endpoint, `/api/db/token`, can generate tokens assuming the user generating the token has permission to do so for the given user / auth record. You can roll your own authentication logic within your app server, and once satisfied, use the API endpoint to generate the token and pass it to the client for subsequent use.
2. For hosted FlureeDB, we provide an authentication service you can leverage if you like by having your end-user application POST username + password to the `/api/signin` JSON endpoint, and assuming successful authentication, a token will be returned. Additional options such as token expiration can also be provided. This service also handles password reset requests for you.



## Revoking Tokens

Tokens become useless under two conditions:

1. They reach their token expiration date (assuming one was provided when creating the token).
2. The `_auth` entity the token is associated with no longer has permissions.

A token is tied directly to a specific `_auth` entity, and with every request the roles + rules associated with that entity are retrieved. Therefore, the way to make a token useless is to make the `_auth` entity it is tied to useless. To do so, employ one of these strategies:

1. Delete the auth entity (ensure if it is referenced to a `_user` via the `_user/auth` attribute that the reference is also deleted. 
2. Remove current roles referenced by the `_auth` entity, and associate a role that has no permission.

If you think the token was compromised but you still want the same roles + rules, you can copy the existing `_auth` attributes to a new `_auth` entity. Recall a `_user` can have many `_auth` entities. If using Fluree for authorization, the user will be prompted to log in again, and a new token will be issued.

If you have a token but don't know the `_auth` entity it is tied to, you can get that information from the token itself. The middle part of the token (between the two `.`) is JSON that is Base64 encoded. Here is a way to decode it in javascript: `JSON.parse(atob("place_token_here".split('.')[1]))`. The auth `_id` value is in the `sub` key (subject).

You should try to make tokens expire at a reasonable timeframe that balances security with your application's needed convenience.

## API Endpoints

### `/api/db/query`

Main query interface for FlureeQL. Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`select` | select-spec |  Selection specification in the form of an array/vector. To select all attributes use `[ "*" ]`. If you were storing customers and wanted to select just the customer name and products they own, the select statement might look like: `[ "customer/name", "customer/products"]`.
`from` | from-spec | Optional. Can be an entity (represented as an identity or integer), or an entire collection of entities utilizing the collection name. If selecting from customers as per the prior example, it would simply be `"from": "customer"`. If selecting a specific customer, it would for example be `"from": 4299262263299` or `"from": "[\"customer/name\", \"Newco Inc.\"]"`. 
`where` | where-spec | Optional. Can be in the simple SQL-like string format or more sophisticated queries can be specified in the datalog format. For the simple format, might include something like: `"where": "customer/name = 'ABC Corp'"` or `"where": "person/age >= 22 AND person/age <= 50"`.
`block` | integer or ISO-8601 date string | Optional time-travel query, specified either by the block the query results should be of, or a wall-clock time in ISO-8601 fromat. When no block is specified, the most current database is always queried.
`limit` | integer | Optional limit for result quantity. Fluree uses a default of 1000.


Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "person"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

#### Query with a limit. Get all attributes from every entity in the `chat` collection

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "limit": 100}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat(limit:100) {
    _id
    comments
    instant
    message
    person
  }
}
}
```

#### Time travel by specifying a block number

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "block": 2
}
```

```graphql
Not supported
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "block": 2}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
#### Time travel by specifying a time

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "block": "2017-11-14T20:59:36.097Z"
}
```
```curl
    curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "block": "2017-11-14T20:59:36.097Z"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
Not supported
```

#### Query with a where clause

```flureeql
{
  "select": ["*"],
  "where": "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"
}
```
```curl
    curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "where": "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat(where: "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"){
    _id
    instant 
    message
  }
}
}


```
### `/api/db/transact`

Main transaction interface for FlureeQL. Post a JSON array/vector that contains entity maps to create, update, upsert or delete.

Each map requires an `_id` as specified below along with key/value pairs containing the attributes and values you wish to modify. An `_action` key is always included, but typically inferred and thus optional for most operations.

Key | Type | Description
-- | -- | -- 
`_id` | identity |  Any identity value which can include the numeric assigned permanent `_id` for an entity, any attribute marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`, or a temporary id (for new entities). See the "Temporary Ids" section in Transactions to learn more. 
`_action` | string | Optional (if it can be inferred). One of: `add`, `update`, `upsert` or `delete`. When using a temporary id, `add` is always inferred. When using an existing identity, `update` is always inferred. `upsert` is inferred for new entities with a tempid if they include an attribute that was marked as `upsert`.

To delete/retract an entire entity, use the `_id` key along with only `"_action": "delete"`. To delete only specific values within an entity, specify the key/value combinations.

The keys can contain the full attribute name including the namespace, i.e. `chat/message` or you can leave off the namespace if it is the same as the collection the entity is within. i.e. when the entity is within the `chat` collection, just `message` can be used which is translated to `chat/message` by Fluree.


Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{"_id": "chat", "message": "Hello, sample chat message."}]' \
   https://ACCOUNT_NAME.flur.ee/api/db/transact
```

#### Insert two new entities using temp-ids (note `"_action": "add"` is inferred)

```flureeql
[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]'\
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, 
    { \"_id\": \"person\", \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

#### Update an existing entity using an identity value (note `"_action": "update"` is inferred)

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Identity"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Identity"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation updatePerson($myUpdatePersonTx: JSON) {
  transact(tx: $myUpdatePersonTx)
}

{
  "myUpdatePersonTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"fullName\": \"Jane Doe Updated By Identity\" }]"
}
```
#### Update an existing entity using internal `_id` value (note `"_action": "update"` is inferred)

```flureeql
[{
  "_id":      4294967296001,
  "fullName": "Jane Doe Updated By Numeric _id"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      4294967296001,
  "fullName": "Jane Doe Updated By Numeric _id"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{ \"_id\": 4294967296001, \"fullName\": \"Jane Doe Updated By Numeric _id\" }]"
}
```

#### Delete (retract) a single attribute

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "handle":   null
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "handle":   null
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation deleteAttribute ($myDeleteAttributeTx: JSON) {
  transact(tx: $myDeleteAttributeTx)
}

{
  "myDeleteAttributeTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"handle\": null }]"
}
```

#### Delete (retract) all attributes for an entity

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "_action":  "delete"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "_action":  "delete"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
mutation deleteAllAttributes ($myDeleteAllAttributesTx: JSON) {
  transact(tx: $myDeleteAllAttributesTx)
}

{
  "myDeleteAllAttributesTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"_action\": \"delete\" }]"
}
```

### `/api/db/graphql`

We can run both GraphQL queries and transactions using the same endpoint. Both queries and transactions are performed by sending a JSON map/object containing the following keys:

Key | Required | Description
-- | -- | -- 
`operationName` | False |  The name of the GraphQl query or transaction 
`query` | True | The GraphQL query or transaction. Note that transaction use the same endpoint, but in order to perform a transaction, you must specify the "mutation" root. See the 'GraphQL Transactions' section for more information. 
`variables` | False | Variables that you are passing into your query. 


```all
{
  "query": "{ graph {chat { _id instant message}}}","variables": null,
  "operationName": null
  }
```


```graphql
{
  "query": "{ graph {chat { _id instant message}}}","variables": null,
  "operationName": null
  }
```

### `/api/db/token`

The token endpoint allows new tokens to be generated on behalf of users. Post a JSON map/object containing the following keys:

Key | Type | Description
-- | -- | -- 
`auth` | identity |  Required auth identity you wish this token to be tied to. Can be the `_id` integer of the auth record,  or any identity value such as `["_auth/id", "my_admin_auth_id"]`.
`expireSeconds` | integer | Optional number of seconds until this token should expire. If not provided, token will never expire.
`db` | string | Only required if using your master authorization token from FlureeDB (from your username/password to flureedb.flur.ee). So long as you are using a token from your own database, it will automatically use the database the token is coming from.


If you are handling authentication for your application but still want users to connect directly to FlureeDB, your authentication code can utilize this endpoint to retrieve tokens on behalf of the user. The user can subsequently use this token to interact directly with FlureeDB from the respective application.

In order to create a token, you must use a token that has the following permission:

1. A role with a rule that grants `token` within the `_rule/ops` attribute.
2. The permission to query the `_auth` record required to generate the token.

For item #2, this allows a permission where someone can generate tokens only for certain user or auth records. Generally you'll use an admin-type rights that have visibility to the entire database in which case you simply need to make sure the `_rule/ops` contains the rights for `token`.

Here is an example request using curl. Be sure to replace your auth token, account name and auth-id in the request:

Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "auth": 25769804776,
  "expireSeconds": 3600
}' \
https://$FLUREE_ACCOUNT.flur.ee/api/db/token
```


#### Token request using the `_id` numeric identifier for `auth`

```flureeql
{
  "auth": 25769804776,
  "expireSeconds": 3600
}
```
```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "auth": 25769804776,
  "expireSeconds": 3600
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/token
```
```graphql
Not supported
```
#### Token request using an identity value (an attribute marked as `unique`) for `auth`

```flureeql
{
  "auth": ["_auth/id", "my_unique_id"],
  "expireSeconds": 3600
}
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "auth": ["_auth/key", "db-admin"],
  "expireSeconds": 3600
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/token
  ```
```graphql
Not supported
```

### Signed Endpoints 

As an alternative to using JSON Web Tokens, it is possible to hit all of the endpoints with a signature. See more information about signatures in the [Signing Transactions](#signing-transactions) section. 

The endpoints are:

`/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/[ACTION]`

Action | Endpoint
-- | -- 
Query | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/query`
Transact | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/transact`
GraphQL | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/graphql`
New DB | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/new-db`
Delete DB | `/fdb/[NETWORK-NAME]/[DBNAME-OR-DBID]/delete-db`

For example, if you are in the `test` network using the `test.one` database, you could post a query to the `/fdb/test/test.one/query` endpoint. For queries, the signature needs to be included in the Authorization header. For transactions, the signature can be included in the signature map. See [Signing Transactions](#signing-transactions).

A signature is not required is the option `fdb-group-open-api` is set to true (default for the downloaded version of FlureeDB). Deleting and adding a database only works if `fdb-group-open-api` is set to true. 


# Query

## Fluree Queries

Fluree allows you to specify queries using the FlureeQL JSON syntax or with GraphQL. The FlureeQL format, being a JSON data structure, allows for queries to be easily composed within your programming code and is built to support Fluree's advanced capabilities like graph recursion. GraphQL supports a more limited set of query capability, but is robust enough for many applications. If you don't already know and want to use GraphQL, we definitely recommend using FlureeQL.

Fluree has permissions embedded within the database itself, which has the effect that every database for every user is potentially customized and contains only data they can view. This capability allows more direct access to the database for front-end UIs or other applications, and means less time spent creating custom API endpoints that simply modify select statements based on who the user is. In addition, multiple apps can share the same database with security consistency.

The graph selection capability of FlureeDB allows query results to be returned as a nested graph instead of 'flat' result sets. This aligns with how data is actually used in applications and makes it simpler to pass data around to various UI components, etc. This also means the role of a client database library is substantially reduced, and for many applications may be unnecessary.

Both FlureeQL and GraphQL give the ability to issue multiple queries in the same request which reduces round-trips for end-user applications. Both also support *time travel* queries, allowing you to issue any query at any point in history. Any place you might have written code or created extra tables to store a historical log of changes becomes unnecessary when using FlureeDB. It also gives your apps the ability to 'rewind' to any point in time.

FlureeQL has two main approaches to creating queries that share much of the same syntax, we call these *Graph Queries* and *Analytical Queries*. Graph Queries closely resembles SQL but allows your results to 'crawl the graph' and return nested data sets. This approach is very simple and works well for most application-based queries. Analytical Queries enables concepts of logic programming embedded directly into the query. This allows very powerful query constructs and exposes analytical features like aggregates, and more. It is also simple, but the approach may not be familiar to those with SQL-only exposure. It is worth learning, and won't take long to get used to.


#### A simple FlureeQL Graph Query

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}
```
```curl
curl\
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}'\
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
{ graph {
  chat(limit:100) {
    _id
    comments
    instant
    message
    person
  }
}
}
```
#### FlureeQL Graph Query attribute selection and a `where` that does a range scan

```flureeql
{
  "select": ["chat/message", "chat/instant"],
  "where": "chat/instant > 1517437000000 AND chat/instant < 1517438000000"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["chat/message", "chat/instant"],
  "where": "chat/instant > 1517437000000 AND chat/instant < 1517438000000"
}'\
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
{ graph {
  chat(where: "chat/instant >= 1516051090000 AND chat/instant <= 1516051100000"){
    _id
    instant 
    message
  }
}
}
```
#### FlureeQL Graph Query with time travel using a block number

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "block": 2
}
```
```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": ["*"], "from": "chat", "block": 2}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
{ graph (block: 2) {
  chat {
    _id
    instant
    message
  }
}
}
```
#### FlureeQL Graph Query  with time travel using wall clock time

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "block": "2017-11-14T20:59:36.097Z"
}
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": "chat",
  "block": "2017-11-14T20:59:36.097Z"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph (time: "2018-03-08T09:57:13.861Z") {
  chat {
    _id
    instant
    message
  }
}
}
```
## FlureeQL Graph Queries

FlureeQL Graph Queries are structured as a JSON object/map and may contain the following keys:

Key | Required? | Description
-- | -- | -- 
`select` | yes |  [Select syntax](#select-syntax)
`from` | yes | [From syntax](#from-syntax)
`limit` | no | Optional limit (integer) of results to include.
`block` | no | Optional time-travel query specified by block number or wall-clock time as a ISO-8601 formatted string.

#### A simple FlureeQL Graph Query that returns all direct attributes for last 100 chat messages

```flureeql
{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}

```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["*"],
  "from": "chat",
  "limit": 100
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat(limit:100) {
    _id
    comments
    instant
    message
    person
  }
}
}
```

#### Abbreviated response

```flureeql

{
  "block": 12,
  "status": 200,
  "time": "0.93ms",
  "result": [
    {
      "_id": 4299262263302,
      "chat/message": "A sample chat message",
      "chat/person": {
        "_id": 4294967296001
      }
    },
    {"..."}
  ],
  "fuel": 3,
  "time": "1.75ms",
  "fuel-remaining": 999999987903
}
```

```graphql 
{
  "data": {
    "graph": {
      "chat": 
        [{
          "_id": 4299262263298,
          "comments": [],
          "instant": 1520348922345,
          "message": "This is a sample chat from Jane!",
          "person": {...}
        },
        {...}]
    }
  },
  "fuel": 3,
  "block": 12,
  "time": "1.75ms",
  "fuel-remaining": 999999987903
}
```

### "select" syntax

Select statements are placed in the `select` key of a FlureeQL statement take the format of either a graph selection syntax or one of variable binding for analytical queries. The graph selection syntax is the focus here, and is a declarative and powerful way of selecting hierarchical information.

The graph selection syntax is a vector / array of selection attributes. They can include:

1. A simple list of attribute names, i.e.: `select: ["person/name", "person/email"]`
2. A wildcard "select all", i.e.:  `select: ["*"]`
3. A hierarchical selection statement that navigates forward (or backwards) into a relationship, i.e.: `select: [{person/address: ["address/street", "address/city"]}]`. 
4. Any combination of the above, at any level of nested graph

Additional options can also allow recursion to specified depths (or infinite recursion).

The syntax isn't just a way to specify the data you'd like returned, but inherently represents **how** the data looks as it is returned. This can often remove complicated data transformation steps needed to deal with returned database data, and even negates the need for a fairly substantial role of client-side database drivers.


#### FlureeQL Graph Query with specific attribute selection

```flureeql
{
  "select": ["chat/message"],
  "from": "chat"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["chat/message"],
  "from": "chat"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat {
    message
  }
}
}
```

#### Abbreviated response

```flureeql 
{
  "block": 12,
  "status": 200,
  "time": "0.57ms",
  "result": [
    {
      "chat/message": "A sample chat message"
    },
    {"..."}
  ],
  "fuel": 3,
  "time": "0.80ms",
  "fuel-remaining": 999999987900
}
```

```graphql 
{
  "data": {
    "graph": {
      "chat": [{ "message": "This is a sample chat from Jane!"}]
    }
  },
  "status": 200,
   "fuel": 3,
   "time": "0.80ms",
   "fuel-remaining": 999999987900
}
```

### Crawling the Graph with select

Entities refer (join) to other entities via any attribute that is of type `ref`. Every `ref` attribute relationship can be traversed, and can be done so in both directions -- forward and reverse.

For a forward traversal example, note our attribute `chat/person` which is of type `ref` and refers to a person entity. In the previous section we selected all attributes for all chat messages (`{"select": ["*"], "from": "chat"}`) and the response contained a reference to the person, but did not automatically include the person details. The value for `chat/person` looked like this: `"chat/person": {"_id": 4294967296001}`. We know it refers to some person with an `_id` of `4294967296001` but nothing else.

In order to also include the person details, we add to our select cause with a sub-query within our original query. This new query would look like: `{"select": ["*", {"chat/person": ["*"]}], "from": "chat"}`. This syntax is declarative and looks like the shape of the data you want returned. These sub-queries can continue to whatever depth of the graph you'd like, and for as many `ref` attributes as you like. Circular graph references are fine and are embraced.

As mentioned, these relationships can also be traversed in reverse. If instead of listing the person for every chat, what if we wanted to find all chats for a  person? Instead of selecting from `chat`, lets select from `person` and follow the same `chat/person` attribute but in the reverse direction. This query looks like: `{"select": ["*", {"chat/_person": ["*"]}], "from": "person"}`. Note the underscore `_` that was added to `chat/person`, making it instead `chat/_person`. This special syntax indicates the same relationship, but in reverse. You'll now see all people, with all their chat messages.

For fun, you can add another sub-query to follow the chat message back to the person. Even though in this case it is redundant, and circular, FlureeDB exists happily in this paradox: `{"select": ["*", {"chat/_person": ["*", {"chat/person": ["*"]}]}], "from": "person"}`. Keep it going if you'd like.

#### Query for all chat messages, following reference to user that posted message.

```flureeql
{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/person": ["*"]}
  ],
  "from": "chat"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```graphql
{ graph {
  chat {
    _id
    instant
    message
    person {
      _id
      fullName
      handle
    } 
  }
}
}
```

#### Abbreviated response

```flureeql
{
  "block": 12,
  "status": 200,
  "time": "1.86ms",
  "result": [
    {
      "_id": 4299262263302,
      "chat/message": "A sample chat message",
      "chat/person": {
        "_id": 4294967296001,
        "person/handle": "jdoe",
        "person/fullName": "Jane Doe"
      }
    },
    {"..."}
  ],
  "fuel": 5,
  "fuel-remaining": 999999987883
}
```

```graphql 
{
  "data": {
    "graph": {
      "chat": [
        {
          "_id": 4299262263298,
          "instant": 1520348922345,
          "message": "This is a sample chat from Jane!",
          "person": {...}
        },
        {...}
      ]
    }
  },
  "status": 200,
  "fuel": 9,
  "time": "6.62ms",
  "fuel-remaining": 999999987890
}
```

#### Person query, but follow chat relationship in reverse to find all their chats (note the underscore `_` or `_Via_`)

```flureeql
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
{ graph {
  person {
    chat_Via_person {
      _id
      instant
      message
    }
  }
}
}
```

### Using Recursion with select

We can also use recursion to follow `ref` attributes that reference another entity in the same collection. For example, we can add an attribute, `person/follows`, which is a `ref` attribute that is restricted to the `person` collection. 

```all
[{
  "_id": "_attribute",
  "name": "person/follows",
  "type": "ref",
  "restrictCollection": "person"
}]
```

```all
[{
    "_id": ["person/fullName", "Zach Smith"],
    "follows": ["person/fullName", "Jane Doe"]
},
{
    "_id": ["person/fullName", "Jane Doe"],
    "follows": ["person/fullName", "Zach Smith"]
}]
```


Normally, if we want to query who a person follows, we would submit this query. 

```all
{
    "select":["*", {"person/follows": ["*"]}],
    "from":"person"
}
```

However, if you want to keep following the `person/follows` relationship, we can include the `{"_recur": some-integer}` option inside of the expanded `person/follows`
map. The value we specify for the `_recur` key is the number of times to follow the given relationship. 

```all
{
    "select":["*", {"person/follows": ["*", {"_recur": 10}]}],
    "from":"person"
}
```

The results will only return recursions for as long as their new information in a given recursion. For example, the result of the above query only returns a recursion that is two entities deep. This is because after we follow the `person/follows` relationship twice (in this given example), it will start returning the same information.


```all
{
  "status": 200,
  "result": [
    {
      "person/handle": "zsmith",
      "person/fullName": "Zach Smith",
      "person/follows": {
        "person/handle": "jdoe",
        "person/fullName": "Jane Doe",
        "person/follows": {
          "person/handle": "zsmith",
          "person/fullName": "Zach Smith",
          "person/follows": {
            "_id": 4294967296001
          },
          "_id": 4294967296002
        },
        "_id": 4294967296001
      },
      "_id": 4294967296002
    },
    {
      "person/handle": "jdoe",
      "person/fullName": "Jane Doe",
      "person/follows": {
        "person/handle": "zsmith",
        "person/fullName": "Zach Smith",
        "person/follows": {
          "person/handle": "jdoe",
          "person/fullName": "Jane Doe",
          "person/follows": {
            "_id": 4294967296002
          },
          "_id": 4294967296001
        },
        "_id": 4294967296002
      },
      "_id": 4294967296001
    }
  ],
  "fuel": 18,
  "fuel-remaining": 999999987865,
  "block": 8,
  "time": "4.54ms"
}

```

### "from" syntax


FlureeDB allows you select from:

1. A collection name:

```all
{
  "select": ["*"],
  "from": "movie"
}

```

2. An Entity - Either an _id or any attribute marked as unique as a two-tuple. 

For example, to select a specific person, we could use either "from": 4294967296001 or a unique attribute like "from": ["person/handle", "jdoe"]. Both results will be identical. The results are a map/object in this case, and not a collection.

```all
{
  "select": ["*"],
  "from":  4294967296001
}

```

```all
{
  "select": ["*"],
  "from":  ["person/handle", "jdoe"]
}

```

3. A Sequence of Entity Identities

Query results will be returned in the same order as we specify them. For example, we could do a query like:

```all
{
  "select": ["*"],
  "from":  [4294967296001, ["person/handle", "jdoe"], 4299262263302,  ["person/handle", "zsmith"] ]
}

```

4. Attribute Name

Selecting from an attribute name will return all entities that contain that attribute. For example, the below transaction will return any entities that contain a `person/fullName` attribute.


```all
{
  "select": ["*"],
  "from": "person/fullName"
}

```

In all cases, the `select` syntax and its rules are identical.

We give you the ability to break out of collection-only or entity-only queries using Fluree's Analytical Query format which we'll cover next.

## FlureeQL Analytical Queries

FlureeQL Analytical Queries are used to answer more sophisticated questions about your data. They can be used to calculate aggregates, have complicated joining rules and even incorporate custom logic. We utilized concepts of logic programming and variable binding to give an immense amount of query potential that can largely be designed by you.

We are gradually making this capability available to users and will be expanding the available documentation shortly.

Fluree Analytical Queries are also structured as a JSON object/map and may contain the following keys:

Key | Required? | Description
-- | -- | -- 
`select` | yes | Analytical select statement, which can include aggregate functions, bound variables and descriptors for data return shape (single result, collection, tuple).
`selectOne` | yes | Same as `select` statement, but returns only a single result.
`where` | yes | A collection of tuples which contain matching logic, variable binding or functions.
`block` | no | Optional time-travel query specified by block number or wall-clock time as a ISO-8601 formatted string.
`limit` | no | Optional limit (integer) of results to include.

We suggest reading the [Where Clause](#where-clause) section before reading the [Select or Select One Clauses](#select-or-select-one-clauses) section. 

### Where Clause
Where clauses in analytical queries are structured as three-tuples, where the first value is an entity (optional), the second value is an attribute, and the third value is a variable binding. The where clause allow us to specify which flakes will be part of the analytical query. 

Before looking at examples of where clauses, it will be best to add a new attribute, `person/favNums` in order to better illustrate some of the use cases for analytical queries. 

The below transaction creates a multi, integer attribute to hold a person's favorite numbers.

```all
[{
    "_id": "_attribute",
    "name": "person/favNums",
    "type": "int",
    "multi": true
}]
```

We can then add favorite numbers to some of the people in our database. 

```all
[{
    "_id": ["person/handle","jdoe"],
    "favNums": [1223, 12, 98, 0, -2]
},
{
    "_id": ["person/handle","zsmith"],
    "favNums": [5, 645, 28, -1]
}]
```

Now, if we want to specify all of `zsmith`'s flakes, which contain the values of his favorite numbers, our where clause could be:

```all
"where": [ [["person/handle", "zsmith"], "person/favNums", "?nums"] ]
```

Our where clause only contains one tuple, `[["person/handle", "zsmith"], "person/favNums", "?nums"]` within the main tuple (we'll see examples of multiple tuples later). There are three values in this tuple: 

1. `["person/handle", "zsmith"]`
As mentioned earlier, the first value in where-clause tuple represents the entity. Our entity is a two-tuple, `["person/handle", "zsmith"]`, but we can alternatively use a Zach Smith's `_id` or any two-tuple, which specifies a unique attribute and that attribute value. 

2. `"person/favNums"`
The second value in a where-clause tuple is the attribute. In this case, the specified attribute is a `multi` attribute of type `int`. We can specify any type and cardinality of attribute.

3. `"?nums"`
The third value is for variable findings. In this case, we are binding any of the flake values specified by entity, `["person/handle", "zsmith"]` and attribute `person/favNums` to the variable `"?nums"`. Variables have to begin with a `?`. These variables can be used in the `select` or `selectOne` statements. 


Alternatively, if we want to specify every flake that contains favorite numbers, we can leave the first value empty. 

```all
"where": [ [null, "person/favNums", "?nums"] ]
```

If we want to specify several people's favorite numbers, we can list multiple where-clause tuples, as seen below.

```all
"where": [ [["person/handle", "zsmith"], "person/favNums", "?nums1"], [["person/handle", "jdoe"], "person/favNums", "?nums2"] ]
```

### Select or Select One Clauses

After binding variables in your where clauses, you can use those variables in conjunction with the following aggregate functions in your select or selectOne clauses. 

Function | Description
-- | --
`avg` | Returns the average of the values. 
`count` | Returns a count of the values.  
`count-distinct` | Returns a count of the distinct values.  
`distinct` | Returns all of the distinct values. 
`max` | Returns the largest value. 
`median` | Returns the median of the values. 
`min` | Returns the smallest value. 
`rand` | Returns a random value from the specified values. 
`sample` | Given a sample size and a set of values, returns an appropriately sized sample, i.e. `(sample 2 ?age)` returns two ages from values bound to the variable, `?age`.
`stddev` | Returns the standard deviation of the values. 
`sum` | Returns the sum of the values. 
`variance` | Returns the variance of the values. 


For example, in order to see the average of all of Zach Smith's favorite numbers, we could query:

```all
{
  "selectOne": "(sum ?nums)",
  "where": [ [["person/handle", "zsmith"], "person/favNums", "?nums1"]] 
}
```

If we want to see a sample of size, 10, from all the favorite numbers in the database, we could issue the query: 
```all
{
  "selectOne": "(sample 10 ?nums)",
  "where": [ [null, "person/favNums", "?nums"]] 
}
```

While, it is possible to bind multiple variables in the where clause, i.e. `[ [["person/handle", "zsmith"], "person/favNums", "?nums1"], [["person/handle", "jdoe"], "person/favNums", "?nums2"] ]`, it is not currently possible to use multiple variables in a select clause. We are expanding this feature and will expand the documentation accordingly. 

## Fluree Block Queries
FlureeDB allows you to select data from an entire block or block range. 

To query a single block, you simply need to provide the block number. 
```{"block": 3}```

To query a range of blocks, provide the first and last blocks you want to include. 
```{"block": [3, 5]}```

To query all of the blocks after a certain block number, provide the lower limit.
```{"block": [3]}```

#### Query a single block
```flureeql
{
  "block": 3
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": 3
}' \
```
```graphql
query  {
  block(from: 3, to: 5)
}
```
#### Query a range of blocks
```flureeql
{
  "block": [3,5]
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": [3, 5]
}' \
 https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
query  {
  block(from: 3, to: 5)
}
```
#### Query a range of blocks starting from a lower limit
```flureeql
{
  "block": [3]
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": [3]
}' \
 https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```
```graphql
query  {
  block(from: 3)
}
```

## Multiple Queries

Fluree allows you to submit multiple queries at once. In order to do this, create unique names for your queries, and set those as the keys of the your JSON query. The values of the keys should be the queries themselves. If you are using GraphQL, you can simply nest your second, third, etc requests within the `graph` level of the request.

For example, this query selects all chats and people at once. 

```all
{
    "chatQuery": {
        "select": ["*"],
        "from": "chat"
    },
    "personQuery": {
         "select": ["*"],
        "from": "person"
    }
}
```

A sample response will look like the following, with each query's responses nested within the "result" value, with the provided query names as keys. 

```all
{
  "result": {
    "chatQuery": [
      { 
        "_id": 4307852197898,
        "chat/instant": 1532617367174
      },
       ...
    ],
    "personQuery": [
      {
        "_id": 4303557230594,
        "person/handle": "zsmith",
        "person/fullName": "Zach Smith",
        "person/karma": 5
      },
      ...
    ]
  },
  "status": 200,
  "fuel": 7,
  "block": 5,
  "time": "5.31ms",
  "fuel-remaining": 999999987876
}
```

Any errors will be returned in a separate key, called errors. For example, incorrectQuery is attempting to query an id that does not exist. 

```all
{
    "incorrectID": {
        "select": ["*"],
        "from": 4307852198904
    },
    "personQuery": {
         "select": ["*"],
        "from": "person"
    }
}
```

Therefore, the response will look like the following with the error type for incorrectID listed under the key errors.

```all
{
  "errors": {
    "incorrectID": "db/invalid-entity"
  },
  "result": {
    "person": [
      {
        "_id": 4303557230594,
        "person/handle": "zsmith",
        "person/fullName": "Zach Smith",
        "person/karma": 5
      },
      ...
    ]
  },
  "status": 207,
  "block": 463,
  "time": "5.64ms"
}
```

#### Submit Multiple Queries at Once

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"chatQuery": {"select": ["*"],"from": "chat"},"personQuery": {"select": ["*"],"from": "person"}}' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/query
```

```flureeql
{
    "chatQuery": {
        "select": ["*"],
        "from": "chat"
    },
    "personQuery": {
         "select": ["*"],
        "from": "person"
    }
}
```

```graphql
{ graph {
  chat {
    _id
    comments
    person
    instant
    message
  }  
  person {
    _id
    handle
    fullName
  }
}
}
```


# Schema

## Fluree Schemas

Much like a relational database, before storing your records in a Fluree database, you must first register a schema which consists of collections (similar to tables) and permissible attributes (similar to columns).

Fluree validates all Flakes being written against the database's schema, ensuring each Flake event type and attribute are registered and meet all of the defined restrictions (i.e. data type, multi-cardinality, uniqueness, required).

Defining and updating schemas is done through regular database transactions (in JSON) by writing to the special pre-defined system collections.

FlureeDB attributes can be of many different types documented in the types table (i.e. string, boolean). Being a graph database, the special type of `ref` (reference) is core to traversing through data. Any attribute of type `ref` refers (links/joins) to another entity. These relationships can be navigated in both directions. For example, listing all invoices from a customer record is trivial if the invoice is of type `ref`, and once established an invoice automatically links back to the customer.

Beyond validating types, FlureeDB allows custom validation that can further restrict attribute values. This level of validation is done by specifying an optional [`spec` for a collection or attribute](#collection-and-attribute-specs).

## Collections

Collections are like relational database tables. We call them collections because they hold an event-collection of changes pertaining to a specific type of entity. For each type of entity/object you have, there should be a collection defined to hold it (i.e. customers, chat messages, addresses).

To create a new collection, submit a transaction against the system collection named `_collection`. A sample collection transaction is provided here to create a new collection.


```flureeql
[{
 "_id": "_collection",
 "name": "person",
 "doc": "A collection/table to hold our people",
 "version": "1"
},
{
 "_id": "_collection",
 "name": "chat",
 "doc": "A collection/table to hold chat messages",
 "version": "1"
},
{
 "_id": "_collection",
 "name": "comment",
 "doc": "A collection/table to hold comments to chat messages",
 "version": "1"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":     "_collection",
  "name":    "person",
  "doc":     "A collection/table to hold our people",
  "version": "1"
},
{
  "_id":     "_collection",
  "name":    "chat",
  "doc":     "A collection/table to hold chat messages",
  "version": "1"
},
{
  "_id":     "_collection",
  "name":    "comment",
  "doc":     "A collection/table to hold comments to chat messages",
  "version": "1"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation addCollections ($myCollectionTx: JSON) {
  transact(tx: $myCollectionTx)
}

/* myCollectionTx is saved as a variable. Learn more about using GraphQL in the section, 'GraphQL' */
/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{


{
  "myCollectionTx": "[{\"_id\": \"_collection\", \"name\": \"person\", \"doc\": \"A collection/table to hold our people\", \"version\": \"1\"},{ \"_id\": \"_collection\", \"name\": \"chat\", \"doc\": \"A collection/table to hold chat messages\", \"version\": \"1\"},{ \"_id\": \"_collection\", \"name\": \"comment\", \"doc\": \"A collection/table to hold comments to chat messages\", \"version\": \"1\"}]"
}
```

An entity in a collection can have any defined attribute assigned to it, but convention is for attributes intended for a specific collection to have the attribute namespace be the same as the collection name (see documentation on attributes and namespaces). For example, if there were a `person` collection, an attribute intended to hold a person's email might be `person/email`.

In places where there is no ambiguity, attributes containing the same namespace as the collection do not need to include the namespace portion of the attribute. For example, note that the full attribute name of `person/email` is shortened below because the entity is in the `person` collection. You can of course always include the full attribute name.

```all
{
  "_id": "person",
  "email": "sample@email.com"
}
```

Collections can optionally have a `spec` defined that restricts the allowed attributes.

## Collection Attributes

The following table shows all `_collection` attributes and their meaning.

Attribute | Type | Description
---|---|---
`_collection/name` | `string` | (required) The name of the collection. Collection names are aliases to an underlying collection integer identifier, and therefore it is possible to change collection alias to a different collection ID.
`_collection/doc` | `string` | (optional) Optional docstring describing this collection.
`_collection/spec` | [`ref`] | (optional) A multi-cardinality list of `ref`s, which reference entities in the `_fn` collection. These specs restricts what is allowed in this collection. To learn more, visit the [Collection and Attribute Specs](#collection-and-attribute-specs) section. 
`_collection/specDoc` | `string` | (optional) Optional docstring to describe the specs. Is thrown when any spec fails. 
`_collection/version` | `string` | (optional) For your optional use, if a collection's spec or intended attributes change over time this version number can be used to determine which schema version a particular application may be using.

## Attribute Definitions

The following table shows all `_attribute` attributes and their meaning

Attribute | Type | Description
---|---|---
`_attribute/name` | `string` | (required) Actual attribute name. Must be namespaced, and convention is to namespace it using the collection name you intend it to be used within. Technically any attribute can be placed on any entity, but using a `spec` can restrict this behavior.
`_attribute/doc` | `string` | (optional) Doc string for this attribute describing its intention. This description is also used for GraphQL automated schema generation.
`_attribute/type` | `tag` | (required) Data type of this attribute such as `string`, `integer`, or a reference (join) to another entity - `ref`. See table below for valid data types.
`_attribute/unique` | `boolean` | (optional) True if this attribute acts as a primary key.  Unique attributes can be used for identity (as the `_id` value in a transaction or query).  (Default false.)
`_attribute/multi` | `boolean` | (optional) If this is a multi-cardinality attribute (holds multiple values), set to `true`. (Default false.)
`_attribute/index` | `boolean` | (optional) True if an index should be created on this attribute. An attribute marked as `unique` automatically will generate an index and will ignore the value specified here. (Default false.)
`_attribute/upsert` | `boolean` | (optional) Only applicable to attributes marked as `unique`. If a new entity transaction using this attribute resolves to an existing entity, update that entity. By default the transaction will throw an exception if a conflict with a `unique` attribute exists.
`_attribute/noHistory` | `boolean` | (optional) By default, all history is kept. If you wish to turn this off for a certain entity, set this flag to true. Queries, regardless of time travel, will always show the current value.
`_attribute/component` | `boolean` | (optional) For type 'ref' attributes only. Mark true if this attribute refers to an entity which only exists as part of the parent entity. If true, and the parent entity is deleted, the entity referenced by this attribute will also be deleted automatically. (Default false.)
`_attribute/spec` | [`ref`] | (optional) A multi-cardinality list of `ref`s, which reference entities in the `_fn` collection. These specs restricts what is allowed in this _attribute. To learn more, visit the [Collection and Attribute Specs](#collection-and-attribute-specs) section. 
`_attribute/specDoc` | `string` | (optional) Optional docstring to describe the specs. Is thrown when any spec fails. 
`_attribute/deprecated` | `boolean` | (Not in production yet, optional) True if this v is deprecated.  Reads and writes are still allowed, but might give warnings in the API.
`_attribute/txSpec` | [`ref`] | (optional)  A multi-cardinality list of `ref`s, which reference entities in the `_fn` collection. This attribute allows you to set specifications for all of the flakes pertaining to a certain attribute. To learn more, visit the [Attribute Tx Specs](#attribute-tx-specs) section. 
`_attribute/txSpecDoc` | `string` | (optional) Optional docstring to describe the txSpecs. Is thrown when any txSpec fails. 
`_attribute/restrictCollection` | `string` | (optional) Only applicable to attributes of `ref` (reference) types. It will restrict references to only be allowed from the specified collection.
`_attribute/encrypted` | `boolean` | (Not in production yet, optional) Expects the value to come in as an encrypted string. Type checking will be disabled, and database functions won't be permitted on this value.


### Attribute Types

Supported attribute types are as follows:

Type | Description
---|---
`string` | Unicode string (`_type/string`)
`ref` | Reference (join) to another collection (`_type/ref`)
`tag` | A special tag attribute. Tags are auto-generated, and create auto-resolving referred entities. Ideal for use as enum values. Also they allow you to find all entities that use a specific tag.  (`_type/tag`)
`int` | 32 bit signed integer (`_type/int`)
`long` | 64 bit signed integer (`_type/long`)
`bigint` | Arbitrary sized integer (more than 64 bits) (`_type/bigint`)
`float` | 32 bit IEEE double precision floating point (`_type/float`)
`double` | 64 bit IEEE double precision floating point (`_type/double`)
`bigdec` | IEEE double precision floating point of arbitrary size (more than 64 bits) (`_type/bigdec`)
`instant` | Millisecond precision timestamp from unix epoch. Uses 64 bits. (`_type/instant`)
`boolean` | true/false (`_type/boolean`)
`uri` | URI formatted string (`_type/uri`)
`uuid` | A UUID value. (`_type/uuid`)
`bytes` | Byte array (`_type/bytes`)
`json` | Arbitrary JSON data. The JSON is automatically encoded/decoded (UTF-8) with queries and transactions, and JSON structure can be validated with a `spec`. (`_type/json`)


**A note on reference types:**

References, `ref`, allow both forward and reverse traversal of graph queries. 

GraphQL requires additional information to auto-generate a schema that shows relationships, and it forces strict typing. Fluree allows any reference attribute to point to any entity, regardless of collection type. If you wish to restrict a reference attribute to only a specific type of collection, also include `restrictCollection` in your attribute definition. In addition to forcing an attribute to only allow a specific collection type, it also enables GraphQL to auto-generate its schema with the proper relationship.

## Collection and Attribute Specs

Both _attribute and _collection specs allow you to specify the contents of an attribute or a collection with a high level of control. Both attribute and collection specs are multi-cardinality references to `_fn`, and the `_fn/code` attribute may simply be true or false, or it can be statements, which resolves to true or false. Specs are evaluated for every entity that is updated within a collection or attribute. 

Attribute and collection specs are built using [database functions](#database-functions). 

Spec | Description
---|---
"(= [1 2 3])" | You will *not* be able to add or edit any values to this collection or attribute. 
"(= [3 (max [1 2 3])]) | You will be able to add and edit any values to this collection or attribute. Given you have access to that attribute or collection.
true | You will be able to add any values to this collection or attribute. Given you have access to that attribute or collection.
false | You will *not* be able to add any values to this collection or attribute.

Specs using just true/false or basic arithmetical database functions, will determine whether users have access to that attribute or collection may edit or add values for any given attribute or collection. While this is possible, Fluree allows very [granular permissions](#fluree-permissions) through a system of auth records, roles, and rules. 

Specs are best suited for controlling the actual values of attributes through either specs that govern a specific attribute, or through specs that govern an entire collection. In order to make this possible, `_attribute/spec` and `_collection/spec` both have access to special functions which can give you certain information about the entity you are editing or the database in general. The functions below, as well as all general purpose database functions, are also listed in [Database Functions](#database-functions). 

Function| Description | Access
---|---|---
(`?v`) | The value of the attribute that you are adding or editing. | _attribute/spec
(`?pV`) | The previous value of the attribute that you are adding or editing. | _attribute/spec
(`?eid`) | The `_id` of the entity you are currently transacting. | Both
(`?e`) | All of the attributes of the entity you are currently transacting. | Both
(`?auth_id`) | The `_id` of the current _auth, if any. | Both
(`?user_id`) | The `_id` of the current user, if any. | Both
(`db`) | Returns a database object with the following keys: dbid, block, and permissions. | Both

There are many ways to use database functions to control the value of an attribute or attributes in a collection. Below is a small series of examples:

### Ex: Check If an Email Is Valid

Fluree has a built-in database function, `valid-email?` that checks whether an email is valid (using the following pattern, "`[a-z0-9!#$%&'*+/=?^_`\``{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`\``{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`". You can also create your own email pattern using the function, `re-find`). 

Suppose we want to add a spec to `person/email`, which checks whether the syntax of an email is valid. The `specDoc` attribute is the error message that is thrown when a value does not pass the spec, so we want to make sure that it is descriptive. 

```all
[{
  "_id": ["_attribute/name", "person/email"],
  "spec": ["_fn$validEmail"],
  "specDoc": "Please enter a valid email address."
},
{
  "_id": "_fn$validEmail",
  "name": "validEmail?",
  "code": "(valid-email? (?v))"
}]
```

#### Ex: Check If an Email Is Valid

```flureeql 
[{
  "_id": ["_attribute/name", "person/email"],
  "spec": ["_fn$validEmail"],
  "specDoc": "Please enter a valid email address."
},
{
  "_id": "_fn$validEmail",
  "name": "validEmail?",
  "code": "(valid-email? (?v))"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": ["_attribute/name", "person/email"],
  "spec": ["_fn$validEmail"],
  "specDoc": "Please enter a valid email address."
},
{
  "_id": "_fn$validEmail",
  "name": "valid-email?",
  "code": "(validEmail? (?v))"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation validEmail ($validEmailTx: JSON) {
  transact(tx: $validEmailTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "validEmailTx": "[
    {\"_id\":[\"_attribute/name\",\"person/email\"],\"spec\":[\"_fn$valid-email\"],\"specDoc\":\"Please enter a valid email address.\"},
    {\"_id\":\"_fn$valid-email\",\"name\":\"valid-email?\",\"code\":\"(valid-email? (?v))\"}]"
}

```

### Ex: Ensure a Password Has At Least One Letter, and One Number

Let's say that we want to add an attribute, `person/password`, but we want to make sure that it has at least one letter and one number. We could do that using the following spec. 

```all
[{
  "_id": "_attribute",
  "name": "person/password",
  "type": "string",
  "spec": ["_fn$validPassword"],
  "specDoc": "Passwords must have at least one letter and one number"
},
{
  "_id": "_fn$validPassword",
  "name": "validPassword?",
  "code": "(re-find \"^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$\" (?v))"
}]
```

#### Ex: Ensure a Password Has At Least One Letter, and One Number

```flureeql 
[{
  "_id": "_attribute",
  "name": "person/password",
  "type": "string",
  "spec": ["_fn$validPassword"],
  "specDoc": "Passwords must have at least one letter and one number"
},
{
  "_id": "_fn$validPassword",
  "name": "validPassword?",
  "code": "(re-find \"^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$\" (?v))"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": "_attribute",
  "name": "person/password",
  "type": "string",
  "spec": ["_fn$validPassword"],
  "specDoc": "Passwords must have at least one letter and one number"
},
{
  "_id": "_fn$validPassword",
  "name": "validPassword?"
  "code": "(re-find \"^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$\" (?v))"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation valid-password ($validPasswordTx: JSON) {
  transact(tx: $validPasswordTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "validPasswordTx": "[
    {\"_id\":\"_attribute\",\"name\":\"person/password\",\"type\":\"string\",\"spec\":[\"_fn$validPassword\"],\"specDoc\":\"Passwords must have at least one letter and one number\"},
    {\"_id\":\"_fn$validPassword\",\"name\":\"validPassword?\",\"code\":\"(re-find \\\"^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$\\\" ?v)\"}]"
}

```

### Ex: Level Needs To Be Between 0 and 100. 

Let's say that we want to add an attribute, `person/level`, but we want to make sure that their level is between 0 and 100. 

```all
[{
  "_id": "_attribute",
  "name": "person/level",
  "type": "int",
  "spec": ["_fn$checkLevel"],
  "specDoc": "Levels must be between 0 and 100."
},
{
  "_id": "_fn$checkLevel",
  "name": "checkLevel",
  "code": "(and [(> [100 ?v]) (< [0 ?v])])"
}]
```
#### Ex: Level Needs To Be Between 0 and 100. 

```flureeql 
[{
  "_id": "_attribute",
  "name": "person/level",
  "type": "int",
  "spec": ["_fn$checkLevel"],
  "specDoc": "Levels must be between 0 and 100."
},
{
  "_id": "_fn$checkLevel",
  "name": "checkLevel",
  "code": "(and [(> [100 ?v]) (< [0 ?v])])"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": "_attribute",
  "name": "person/level",
  "type": "int",
  "spec": ["_fn$checkLevel"],
  "specDoc": "Levels must be between 0 and 100."
},
{
  "_id": "_fn$checkLevel",
  "name": "checkLevel",
  "code": "(and [(> [100 ?v]) (< [0 ?v])])"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation check-level ($checkLevelTx: JSON) {
  transact(tx: $checkLevelTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "checkLevelTx": "[
    {\"_id\":\"_attribute\",\"name\":\"person/level\",\"type\":\"int\",\"spec\":[\"_fn$checkLevel\"],\"specDoc\":\"Levels must be between 0 and 100.\"},{\"_id\":\"_fn$checkLevel\",\"name\":\"checkLevel\",\"code\":\"(and [(> [100 ?v]) (< [0 ?v])])\"}]"
}

```
### Ex: Both Person/handle and Person/fullName are Required Attributes in a Collection

The most common usage for collection specs is to require certain attributes within a collection. For instance, requiring both a `person/handle` and a `person/fullName`. The below spec first gets the handle and fullName from the entity in question, and then checks if both of them are not nil. 

```all
[{
  "_id": ["_collection/name" "person"],
  "spec": ["_fn$handleAndFullName"],
  "specDoc": "A person is required to have both a fullName and a handle."
},
{
  "_id": "_fn$handleAndFullName",
  "name": "handleAndFullName",
  "code": "(and [(get (?e) \"person/handle\") (get (?e) \"person/fullName\")])"
}]
```

#### Ex: Both Person/Handle and Person/fullName are Required Attributes in a Collection

```flureeql 
[{
  "_id": ["_collection/name", "person"],
  "spec": ["_fn$handleAndFullName"],
  "specDoc": "A person is required to have both a fullName and a handle."
},
{
  "_id": "_fn$handleAndFullName",
  "name": "handleAndFullName",
  "code": "(and [(get (?e) \"person/handle\") (get (?e) \"person/fullName\")])"
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": ["_collection/name", "person"],
  "spec": ["_fn$handleAndFullName"],
  "specDoc": "A person is required to have both a fullName and a handle."
},
{
  "_id": "_fn$handleAndFullName",
  "name": "handleAndFullName",
  "code": "(and [(get (?e) \"person/handle\") (get (?e) \"person/fullName\")])"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation handle-and-full-name ($handleAndFullNameTx: JSON) {
  transact(tx: $handleAndFullNameTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "handleAndFullNameTx": "[
    {\"_id\":[\"_collection/name\",\"person\"],\"spec\":[\"_fn$handleAndFullName\"],\"specDoc\":\"A person is required to have both a fullName and a handle.\"},{\"_id\":\"_fn$handleAndFullName\",\"name\":\"handleAndFullName\",\"code\":\"(and [(get (?e) \\\"person/handle\\\") (get (?e) \\\"person/fullName\\\")])\"}]"
}

```

## Attribute Tx Specs

The attribute `_attribute/txSpec` allows you to set specifications for all of the flakes pertaining to a certain attribute. Flakes are accessed via the `(flakes)` function.  

You can get the value of all the true flakes (flakes being added) with the `(valT)` function, as well as all of the false flakes (flakes being retracted) with the `(valF)` function. Like all other specs, `_attribute/txSpec` is a multi-cardinality ref attribute, which references entities in the `_fn` collection. 

For example, the below `_attribute/txSpec` ensures that the `crypto/balance` being added is equal to the `crypto/balance` being retracted. View the full [cryptocurrency example](#cryptocurrency) to see this 

```all
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(valT)  (valF) ] )",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]
```

The following special database functions are available in `txSpec`, and give the user information about the group of flakes being edits. The functions below, as well as all general purpose database functions, are also listed in [Database Functions](#database-functions). 

Function| Description 
---|---
(`?aid`) | The `_id` of the attribute you are currently transacting. 
(`?auth_id`) | The `_id` of the current _auth, if any. 
(`flakes`) | The transaction flakes that edit the specified attribute.  
(`?user_id`) | The `_id` of the current user, if any. 
(`db`) | Returns a database object with the following keys: dbid, block, and permissions. 

# Transactions

## Transactions
Fluree allows you to specify transaction using FlureeQL JSON array/vector syntax that contains entity maps to create, update, upsert or delete. Transactions can also be done with GraphQL, for more information on on GraphQL transactions, reference the GraphQL Transactions section. 

Each map requires an `_id` as specified below along with key/value pairs containing the attributes and values you wish to modify. An `_action` key is always included, but typically inferred and thus optional for most operations.

Key | Type | Description
-- | -- | -- 
`_id` | identity |  Any identity value which can include the numeric assigned permanent `_id` for an entity, any attribute marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`, or a temporary id (for new entities). See the "Temporary Ids" section in the below Transactions section to learn more. 
`_action` | string | Optional (if it can be inferred). One of: `add`, `update`, `upsert` or `delete`. When using a temporary id, `add` is always inferred. When using an existing identity, `update` is always inferred. `upsert` is inferred for new entities with a tempid if they include an attribute that was marked as `upsert`.

To delete/retract an entire entity, use the `_id` key along with only `"_action": "delete"`. To delete only specific values within an entity, specify the key/value combinations.

The keys can contain the full attribute name including the namespace, i.e. `chat/message` or you can leave off the namespace if it is the same as the collection the entity is within. i.e. when the entity is within the `chat` collection, just `message` can be used which is translated to `chat/message` by Fluree.

## Temporary Ids

Every transaction item must have an _id attribute to refer to the entity we are attempting to create/update. A tempid can simply be the collection name, i.e. `_user`. 

FlureeQL example:

```all
[
  {
    "_id":    "_user",
    "username": "jdoe",
  }
]
```

However, if you would like to reference that tempid somewhere else in your transaction, it is helpful to create a unique tempid. To make a unique tempid, just append the collection with any non-valid collection character (anything other than a-z, A-Z, 0-9, _) followed by anything else. For example, `_user$jdoe` or `_user#1 `.

FlureeQL example:
```all
[
  {
    "_id":    "_user$jdoe",
    "username": "jdoe",
    "roles": [["_role/id", "chatUser"]],
    "auth": ["_auth$temp"]
  },
  {
    "_id": ["person/handle", "jdoe"],
    "user": "_user$jdoe"
  },
  {
    "_id": "_auth$temp",
    "key": "tempAuthRecord"
  }
]
```

## Adding Data

In order to add data, you must use a temporary `_id`, i.e. `["_chat", -1]`. In this case, `"_action": "add"` is inferred. Any attributes that you wish to add to this entity should be included as key-value pairs. 

Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{"_id": ["chat", -1], "message": "Hello, sample chat message."}]' \
   https://ACCOUNT_NAME.flur.ee/api/db/transact
```

#### Insert two new entities using temp-ids (note `"_action": "add"` is inferred)

```flureeql
[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      "person",
  "handle":   "jdoe",
  "fullName": "Jane Doe"
},
{
  "_id":      "person",
  "handle":   "zsmith",
  "fullName": "Zach Smith"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact  
```

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

/* You can learn more about structuring GraphQL transactions in the section, 'GraphQL Transactions'. */

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, 
    { \"_id\": \"person\", \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

## Updating Data

In order to update data, you can reference an existing entity by using its `_id` or, for any attribute marked as unique as a two-tuple, i.e. `["_user/username", "jdoe"]`. Attributes that you wish to update should be included as key-value pairs.

When referencing an existing entity,  `"_action": "update"` is inferred.

Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Identity"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

#### Update an existing entity using an identity value (note `"_action": "update"` is inferred)

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Identity"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "fullName": "Jane Doe Updated By Identity"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

```graphql
mutation updatePerson($myUpdatePersonTx: JSON) {
  transact(tx: $myUpdatePersonTx)
}

{
  "myUpdatePersonTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"fullName\": \"Jane Doe Updated By Identity\" }]"
}
```
#### Update an existing entity using internal `_id` value (note `"_action": "update"` is inferred)

```flureeql
[{
  "_id":      4294967296001,
  "fullName": "Jane Doe Updated By Numeric _id"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      4294967296001,
  "fullName": "Jane Doe Updated By Numeric _id"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{ \"_id\": 4294967296001, \"fullName\": \"Jane Doe Updated By Numeric _id\" }]"
}
```
## Upserting Data

When a transaction with a tempid resolves to an existing entity, `"_action": "upsert"` is inferred. This is only applicable to attributes marked as unique. By default the transaction will throw an exception if a conflict with a unique attribute exists.

If "person/handle" is marked as unique and `["person/handle", "jdoe"]` is already in our database, this transaction will simply update `["person/handle", "jdoe"]`. If `["person/handle", "jdoe"]` is not yet in the database, it will add the new entity.  

Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "person",
  "handle": "jdoe"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```

#### Upsert into an existing entity (note `"_action": "upsert"` is inferred when a tempid resolves to an existing entity with a unique attribute)

```flureeql
[{
  "_id":      "person",
  "handle":   "jdoe"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":    "person",
  "handle": "jdoe"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation updateById ($myUpdateByIdTx: JSON) {
  transact(tx: $myUpdateByIdTx)
}

{
  "myUpdateByIdTx": "[{ \"_id\": \"person\", \"handle\": \"jdoe\" }]"
}
```

## Deleting Data 

You can delete (retract) a single attribute by setting the value of `_id` to a two-tuple of the attribute and attribute value, and then setting the attribute to null. `"_action": "delete"` is inferred. 


Curl example:

```all
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "handle":   null
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   
```

You can delete (retract) all attributes for an entity by setting the value of `_id` to a two-tuple of the attribute and attribute value, and then specifying `"_action": "delete"`. 


#### Delete (retract) a single attribute

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "handle":   null
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "handle":   null
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
   ```

```graphql
mutation deleteAttribute ($myDeleteAttributeTx: JSON) {
  transact(tx: $myDeleteAttributeTx)
}

{
  "myDeleteAttributeTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"handle\": null }]"
}
```

#### Delete (retract) all attributes for an entity

```flureeql
[{
  "_id":      ["person/handle", "jdoe"],
  "_action":  "delete"
}]
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id":      ["person/handle", "jdoe"],
  "_action":  "delete"
}]' \
   https://$FLUREE_ACCOUNT.flur.ee/api/db/transact
```
```graphql
mutation deleteAllAttributes ($myDeleteAllAttributesTx: JSON) {
  transact(tx: $myDeleteAllAttributesTx)
}

{
  "myDeleteAllAttributesTx": "[{ \"_id\": [\"person/handle\", \"jdoe\"], \"_action\": \"delete\" }]"
}
```

## Transaction Response

After submitting a successful transaction, the response will have the following keys: 

Key | Description
---|---
`tempids` | A mapping of any temporary id used in a transaction to its final id value that was assigned.
`block` | The blockchain block number that was created with this transaction. These increment by one. 
`hash` | The blockchain hash of this transaction, that can be cryptographically proven with the same `flakes` in the future, and linked to the previous block that creates the chain.
`txid` | A unique id for that transaction. 
`fuel-remaining` | Daily fuel allowance remaining. 
`authority` | The authority that signed the transaction, if any. 
`signature` | The signature for the transaction.
`time` | The amount of time that the transaction took to complete.
`fuel` | The amount of fuel that a transaction took to complete. 
`auth` | The auth record that issued the transaction.
`tx-entid` | The `_id` for the `_tx` entity issued.
`status` | The status of the transactions. These map to HTML status codes, i.e. 200 is OK. 
`block-bytes` | The size of the block, in bytes.
`timestamp` | A timestamp for the transaction. 
`flakes` | Flakes are the state change of the database, and is the block data itself. Each is a six-tuple of information including the entity-id, attribute-id, value, block-id, true/false for add/delete, and expiration of this piece of data in epoch-milliseconds (0 indicates it never expires).


# Database Functions
## Database Functions

The `_fn` collection is where the code that governs `_rule/predicate`, `_attribute/spec`, `_attribute/txSpec`, and `_collection/spec` is used. In addition, any [custom functions](#custom-functions) created can be used in transactions.

## Function Attributes

Attribute | Type | Description
-- | -- | -- 
`_fn/name` | `string` |  (optional) A unique identifier for this role.
`_fn/params` | `[string]` | (optional) A vector of parameters that this function supports.
`_fn/code` | `string` | (required) The actual function code. Syntax detailed [here](#function-syntax). 
`_fn/doc` | `string` | (optional) An optional docstring describing this function.
`_fn/spec` | `json` | (optional, not yet implemented) An optional spec for parameters. Spec should be structured as a map, parameter names are keys and the respective spec is the value.
`_fn/language` | `tag` | (optional, not yet implemented) Programming language used.

Note, that every database has two built-in functions, `["_fn$name", "true"]` and `["_fn$name", "false"]`, which either allow or block access, respectively, to a given collection or attribute.

## Function Syntax

Database functions allow you to update an attribute's value based on the existing value. This allows features such as an atomic counter and timestamps. Database functions are stored in `_fn/code` and referenced by `_rule/predicate`, `_attribute/spec`, `_attribute/txSpec`, or `_collection/spec`. Database functions can also be used directly in transactions by prefacing the transaction with a `#`.

Using database functions in:

* Transactions - Pass database functions into transactions with a #, for example, `	#(inc)`. Resolves to any type of value. 
* `_attribute/spec` - A multi-cardinality ref attribute. Control the values that can be held in an attribute. Resolves to true or false. 
* `_attribute/txSpec` - A multi-cardinality ref attribute. Controls all the flakes for a given attribute in a single transaction. Resolves to true or false. 
* `_collection/spec` - A multi-cardinality ref attribute. Control the values of the attributes in a specific collection. Resolves to true or false. 
* `_rule/predicate` - A multi-cardinality ref attribute. Controls whether an auth record can view a certain attribute or collection. Resolves to true or false. 

The below functions are available to use in any of the above listed usages, including transactions, schema specs, and rule predicate. Remember that all of the usages, with the exception of transactions require the function to return either true or false. 

Function | Arguments | Example | Description | Cost (in fuel)
-- | -- | -- | -- | -- 
`inc` | `n` optional | `#(inc)` |  Increment existing value by 1. Works on `integer`. | 10
`dec` | `n` optional | `#(dec)` | Decrement existing value by 1. Works on `integer`. | 10
`now` | none | `#(now)` | Insert current server time. Works on `instant`. | 10
`==` | `[s]` |`#(== [1 1 1 1])` | Returns true if all items within the vector are equal.  Works on `integer`, `string`, and `boolean`. | 9 + count of objects in ==
`+` | `[s]` | `#(+ [1 2 3])` | Returns the sum of the provided values. Works on `integer` and `float`. | 9 + count of objects in +
`-` | `[s]` | `#(- [10 9 3])` | Returns the difference of the numbers. The first, as the minuend, the rest as the subtrahends. Works on `integer` and `float`. | 9 + count of objects in -
`*` | `[s]` | `#(* [90 10 2])` | Returns the product of the provided values. Works on `integer` and `float`. | 9 + count of objects in *
`/` | `[s]` | `#(/ [36 3 4])` | If only one argument supplied, returns 1/first argument, else returns first argument divided by all of the other arguments. Works on `integer` and `float`. | 9 + count of objects in /
`quot` | `n` `d` | `#(quot 60 10)` | Returns the quotient of dividing the first argument by the second argument. Rounds the answer towards 0 to return the nearest integer. Works on `integer` and `float`. | 10 
`rem` | `n` `d` | `#(rem 64 10)` | Remainder of dividing the first argument by the second argument. Works on `integer` and `float`. | 10
`mod` | `n` `d` | `#(mod 64 10)` | Modulus of the first argument divided by the second argument. The mod function takes the rem of the two arguments, and if the either the numerator or denominator are negative, it adds the denominator to the remainder, and returns that value. Works on `integer` and `float`. | 10
`max` | `[s]` |  `#(max [1 2 3])`| Returns the max of the provided values. Works on `integer`, `float`.  | 9 + count of objects in max
`min` | `[s]` |  `#(min [1 2 3])`| Returns the min of the provided values. Works on `integer`, `float`.  | 9 + count of objects in min
`max-attr-val` | `"#(max-attr-val \"person/age\")"`| Returns the max of the provided attribute. Works on `integer`, `float`.  | 10 + cost of fuel to query max-attr-val
`str` | `[s]` | `#(str [\"flur.\" \"ee\"])` | Concatenates all strings in the vector. Works on `integer`, `string`, `float`, and `boolean`. | 10
`if-else` | `test` `true` `false` | `#(if-else (= [1 1]) \"John\" \"Jane\")` | Takes a test as a first argument. If the test succeeds, return the second argument, else return the third argument. | 10
`and` | `[s]` | `#(and [(= [1 1]) (= [2 2]) ])` | Returns true if all objects within the vector are non-nil and non-false, else returns false. | 9 + count of objects in and
`or` | `[s]` | `#(or [(= [1 1]) (= [2 3]) ])` | Returns true if any of the objects within the vector are non-nil and non-false, else returns false. | 9 + count of objects in or
`boolean` | `x` | `#(boolean 1)` | Coerces any non-nil and non-false value to true, else returns false. | 10
`count` | `[s]` or `string` | `#(count  \"Appleseed\")`, `#(count  [1 2 3])` | Returns the count of letters in a string or the number of items in a vector. | 9 + count of objects in count
`get` | `entity` `attribute` | `#(get (?e) \"_id\" )` | Returns the value of an attribute within an object. In this example, we extract the _id of the entity using get. | 10
`contains?` | `entity` `attribute` | `(contains? (get-all (?e) [\"person/user\"]) ?user)` | Checks whether an object or vector contains a specific value. In this example, `get-all` checks whether the person user contains the current user. | 10
`get-all` | `entity` `[path]` | `(contains? (get-all ?e [\"chat/person\" \"person/user\"]) ?user)` | Gets all of a certain attribute (or attribute-path from an entity. | 9 + length of path
`valid-email?` | `x` | `(valid-email? ?v)` | Checks whether a value is a valid email using the following pattern, "`[a-z0-9!#$%&'*+/=?^_`\``{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`\``{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`. | 10
`re-find` | `pattern` `string` | `#(re-find "^[a-zA-Z0-9_][a-zA-Z0-9\.\-_]{0,254}" \"apples1\")` | Checks whether a string follows a given regex pattern. | 10 
`db` | none | `#(== [(get db \"dbid\") 2])` | Returns a database object with the following keys: dbid, block, and permissions. | 10
`query` | `select-string` `from-string` `where-string` `block-string` `limit-string` |  `#(get (query \"[*]\" [\"book/editor\" \"Penguin\"] nil nil nil) \"book/year\")` | Allows you to query the current database. The select-string should be inputted without any commas. The select-string and can be inputted without any quotation marks, for example, `"[* {person/user [*]}]"`, or you can optionally doubly-escape those strings `"[\\\"*\\\" {\\\"person/user\\\" [\\\"*\\\"]}]"`. | Fuel required for the query.  


Database function can also be combined, for instance `#(inc (max [1.5 2 3]))` will return 4. 

The below functions are available through some function interfaces, but not others. For instance, an `_attribute/spec` can access the value `(?v)` of that given attribute, but this function does not make sense in a transaction. The functions are listed below, along with a list of places where those functions are valid. 


1. Value: `?v`
- Arguments: None.
- Example:  `(< [1000 (?v)])` 
- Use: Allows you to access the value of the attribute that the user is attempting to add or update. In the example spec, the value must be greater than 1,000.
- Available in: `_attribute/spec`
- Cost: 10

2. Past Value: `?pV` 
- Arguments: None.
- Example: `(< [(?pV) (?v)])`
- Use: you to access the previous value of the attribute that the user is attempting to add or update, nil if no previous value. In the example spec, the new value `(?v)` must be greater than the previous value `(?pV)`.
- Available in: `_attribute/spec`
- Cost: 10 plus cost of fuel

3. Entity: `?e` 
- Arguments: Optional `string` of additional-select-parameters. By default, this function will query {"select": ["*"], from: `entity`}, however, if you would like to follow the entity's relationships further, you can optionally include an additional select string. You do not need to include the glob character, `*`, in your select string. You can either not include any quotes in the select string, or doubly-escape them, for example: `"[{person/user [*]}]"` or `"[{\\\"person/user\\\" [\\\"*\\\"]}]"`. Your select string needs to be inside of a vector, `[]`.
- Example: `(== [(get (?e) \"movie/director\") \"Quentin Tarantino\"])`
- Use:  Allows you to access all the attributes of the entity that the spec is being applied to. In the example, the spec is checking whether the director of the current entity is Quentin Tarantino.
- Available in: `_attribute/spec`, `_collection/spec`, `_rule/predicate`
- Cost: 10 plus cost of fuel


4. Entity _id: `?eid` 
- Arguments: None
- Example: `(== [?user_id ?eid])`
- Use: Allows you to access all the `_id` of the entity that the spec is being applied to. In the example, the spec is checking whether the current entity _id is the same as the user _id.
- Available in: `_attribute/spec`, `_collection/spec`, `_rule/predicate`
- Cost: 10 plus cost of fuel

5. Auth _id: `?auth_id`
- Arguments: None
- Example: `(== [?auth_id ?eid])`
- Use: Allows you to access all the `_id` of the auth that is currently in use. In the example, the spec is checking whether the current entity _id is the same as the auth_id.
- Available in: `_attribute/spec`, `_collection/spec`, `_rule/predicate`, transactions
- Cost: 10


6. User _id: `?user_id`
- Arguments: None
- Example: `(== [?user_id ?eid])`
- Use: Allows you to access all the `_id` of the user that is currently in use, or nil if no user. In the example, the spec is checking whether the current entity _id is the same as the user_id.
- Available in: `_attribute/spec`, `_collection/spec`, `_rule/predicate`, transactions
- Cost: 10

6. User _id: `flakes`
- Arguments: None
- Example: `(flakes)`
- Use: Returns an array of all flakes in the current spec. For `_attribute/spec` and `_collection/spec` this is a single flake. For
`_attribute/txSpec` this is all the flakes in a given transaction that pertain to the specified attribute. 
- Available in: `_attribute/spec`, `_collection/spec`, `_attribute/txSpec`
- Cost: 10


7. User _id: `valT`
- Arguments: None
- Example: `(valT)`
- Use: Sum of the value of all flakes being added in the current spec.
- Available in: `_attribute/spec`, `_collection/spec`, `_attribute/txSpec`
- Cost: 10


8. User _id: `valF`
- Arguments: None
- Example: `(valF)`
- Use: Sum of the value of all flakes being retracted in the current spec.
- Available in: `_attribute/spec`, `_collection/spec`, `_attribute/txSpec`
- Cost: 10


9. Attribute _id: `?aid`
- Arguments: None
- Example: `(?aid)`
- Use: Allows you to access all the `_id` of the attribute that the spec is being applied to. 
- Available in: `_attribute/spec`, `_attribute/txSpec`, transaction
- Cost: 10

10. Attribute _id: `?a`
- Arguments: Optional `string` of additional-select-parameters. By default, this function will query {"select": ["*"], from: `aid`}, however, if you would like to follow the entity's relationships further, you can optionally include an additional select string. You do not need to include the glob character, `*`, in your select string. You can either not include any quotes in the select string, or doubly-escape them, for example: `"[{person/user [*]}]"` or `"[{\\\"person/user\\\" [\\\"*\\\"]}]"`. Your select string needs to be inside of a vector, `[]`.
- Example: `(== [(get (?a) \"_attribute/name") \"book/title\"])`
- Available in: `_attribute/spec`, `_attribute/txSpec`, transaction
- Cost: 10 plus cost of fuel

## Custom Functions

When you add a function to the `_fn` stream, you can optionally reference it using the `_fn/name` that you have created. For example, let's say that we want to create a function that always adds 7 to any given number.

```all
[{
  "_id": "_fn",
  "name": "addSeven",
  "params": ["n"],
  "code": "(+ [7 n])
}] 
```

Now, we will be able to use it anywhere we use database functions. For example:

1. Using it in a transaction

```all
[{
  "_id": "book",
  "length": "(addSeven 100)
}]
```

2. Using it in another `_fn` that is used in an `_attribute/spec`.

```all
[{
  "_id": ["_attribute/name", "book/length"],
  "spec": ["_fn$addManufacturerPages"]
},
{ 
  "_id": "_fn$addManufacturerPages",
  "name": "addManufacturerPages",
  "code": "(+ [(addSeven 0) 13])
}]
```

# Keys and Signatures

## Signing Transactions

Optionally, in a given transaction, you can include an alternate auth record with which to sign your transaction. This is done by passing in an additional map with your transaction. The additional map should be in the `_tx` collection. The attributes in the `_tx` collection are specified below:

Attribute | Type | Description
-- | -- | -- 
`_tx/id` | `string` |  (optional) A unique identifier for this tx.
`_tx/auth` | `ref` | (optional) A reference to the `_auth` for this transaction. This auth signs the transaction.
`_tx/authority` | `ref` | (optional) A reference to an `_auth` record that acts as an authority for this transaction. 
`_tx/nonce` | `long` | (optional) A nonce that helps ensure identical transactions have unique txids, and also can be used for logic within smart functions. Note this nonce does not enforce uniqueness, use _tx/altId if uniqueness must be enforced.
`_tx/altId` | `string` | (optional) Alternative Unique ID for the transaction that the user can supply.


For example, I could specify a  `_tx/id` and `_tx/nonce` in my transaction as follows. If your database specifies a defaultAuth (see the section [Authority](#authority)), this additional map is completely optional.

```all
[{
    "_id": "_collection",
    "name": "movie"
},
{
    "_id": "_tx",
    "id": "moviesColl",
    "nonce": 123456789
}
```

As you can see in the flakes section of the response below, the `_tx/nonce` that we supplied is recorded (in the last flake, `[ -327680, 103, 123456789, -327680, true, 0 ]`).

```all
{
  "tempids": {
    "_collection$1": 4294968297
  },
  "block": 5,
  "hash": "56f0065c194e0afcbb17efa2d28cd2e5c990cb36ba473405e49c9e865577a242",
  "txid": "b9f52827b30cc234db4766417b80337295210c671079b6fda546f992da123a0b",
  "fuel-remaining": 999430,
  "authority": null,
  "signature": "1c304402200cc359c38f90af3b75ca8178f3953f13b31ba6de0382639790cd22b2b53b43c1022047a7fb73ce1b869bad74a8027926df67b3d162651cbd28165310ca0aa0dbd672",
  "time": "20.28ms",
  "fuel": 0,
  "auth": 25769803776,
  "status": 200,
  "block-bytes": 444,
  "timestamp": 1534884422866,
  "flakes": [
     [ 4294968297, 40, "movie", -327680, true, 0 ],
     [ -327680, 1, "56f0065c194e0afcbb17efa2d28cd2e5c990cb36ba473405e49c9e865577a242", -327680, true, 0 ],
     [ -327680, 2, "93d48741923a2033a23d2116c17729b5bb582ae2c575082540071715b25dd866", -327680, true, 0 ],
     [ -327680, 5, 1534884422866, -327680, true, 0 ],
     [ -327680, 100, "b9f52827b30cc234db4766417b80337295210c671079b6fda546f992da123a0b", -327680, true, 0 ],
     [ -327680, 101, 25769803776, -327680, true, 0 ],
     [ -327680, 103, 123456789, -327680, true, 0 ]
  ]
}
```



## Authority

Every transaction is signed by an `_auth` record. By default, every database includes a default auth record, which is specified with the following entity:

```all
{
      "_setting/id": "db",
      "_setting/defaultAuth": {
        "_id": 25769803776
      },
      "_id": 38654705664
}
```

In order to change or remove the defaultAuth, you can simply change the `["_setting/id", "db"]`. For example, in order to remove the defaultAuth:

```all
[{
      "_id": ["_setting/id", "db"],
      "_setting/defaultAuth": [25769803776],
      "_action": "delete"
}]
```

Additionally, every transaction can specify a `_tx/authority` as part of the `_tx` map included in the transaction. For example, if we have an `_auth` record with the id, "rootAuth", we can submit a transaction as follows: 


```all
[{
    "_id": "_attribute",
    "name": "movie/title",
    "type": "string
},
{
    "_id": "_tx",
    "id": "movieTitle",
    "authority": ["_auth/id", "rootAuth"]
}]

```

Remember, if your database specifies a defaultAuth, this `_tx` map is optional. 

# Permissions

## Fluree Permissions

Fluree allows very granular permissions to control exactly what data users can write and read, down to an entity + attribute level. When a user connects to a database, effectively their database is custom to them (and their requested point in time). Any data they do not have access to doesn't exist in their database. This means you can give direct access to the database to any user, and they can run ad-hoc queries without ever a concern that data might be leaked. This is a very powerful concept that can drastically simplify end-user applications.

Permissions are controlled by restricting (or allowing) access to either collections or attributes, and both of these dimensions of access must be true to allow access.

## Permission Structure

Individual permissions, such as read and write access to a collection, are encoded in rules. Rules, in turn, are assigned to roles (via the `_role/rules` attribute). For instance, a chatUser role might include the following rules:

- Read access for all chats
- Read access for all people
- Read and write access for own chats

<p class="text-center">
    <img style="height: 250px; width: 310px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/roleChatUser.svg" alt="Diagram shows a role, chatUser, that is comprised of three rules: read access for all chats and people, as well as read and write access for own chats.">
</p>

Another role, dbAdmin might include read and write access to all users, as well as token issuing permissions.

<p class="text-center">
    <img style="height: 200px; width: 300px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/roleDbAdmin.svg" alt="Diagram shows a role, dbAdmin, that is comprised of two rules: read and write access for all users and the ability to generate and revoke tokens.">
</p>

These roles are then assigned to different auth entities (via the `_auth/roles` attribute). For instance, an administrator auth entity and a standardUser auth entity. The administrator auth entity would need multiple roles, such as dbAdmin and chatUser. The standardUser auth entity would only need the chatUser role.

<p class="text-center">
    <img style="height: 140px; width: 520px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/authEntities.svg" alt="Diagram shows two auth entities, adminstrator and standardUser. administrator is assigned two roles: dbAdmin and chatUser. standardUser is only assigned one role - chatUser.">
</p>

Auth entities govern access to a database. Auth entities are issued tokens, and that auth entity's permissions are applied to every database action that they perform. 

An auth entity does not need to be tied a user. All auth entities can be used independently. However, a common use case is to assign auth entities to database users (via the `_user/auth` attribute). Roles can also be assigned directly to users (via the `_user/roles` attribute), however if a user has an auth entity, permissions are determined according to the auth entity, *not* the roles. 

For instance, in the below example, the users, janeDoe and bobBoberson, both have roles assigned directly to their user entities. bobBoberson's permissions are limited to the rules assigned to the chatUser role - namely read access for all chats and peopls, as well as read and write access to one's own chats. 

janeDoe has the dbAdmin role assigned to her user. However, she also has been assigned an auth entity, standardUser. Auth entities assigned to a user (via the `_user/auth` attribute) automatically override any roles that are directly assigned to a user (via the `_user/roles` attribute. In janeDoe's case, she has the permissions associated with a standardUser auth entity. 

<p class="text-center">
    <img style="height: 150px; width: 500px; margin-bottom: 10px;" src="https://s3.amazonaws.com/fluree-docs/091/userEntities.svg" alt="Diagram shows two user entities, janeDoe and bobBoberson. janeDoe is assigned one role, dbAdmin, and one auth entity, standardUser. bobBoberson is assigned one role, chatUser.">
</p>

## Query / Read Permissions

Every database that a query is executed against in Fluree can be thought of as a unique, custom database. This concept applies not only for historical (time travel) queries, but also for permissions. Effectively, every piece of data the user does not have access to does not exist in their database. This allows you to query at will.

When a query asks for attributes or entities that don't exist for them, the results are simply empty. An exception is not thrown in this case.


When reading, any data the user does not have access to simply disappears, as though it never existed.

## Transact / Write Permissions

When transacting, any attempts to transact data that the user does not have permission to write will throw an exception.
It is entirely possible to have write access to data, but not read access.

Block collection can always be written: if permissions on certain metadata are desired, the respective attributes must be excluded.

## User and Auth Entities

Permissions are always linked to an `_auth` entity that is making the request via a valid authorization token. Roles containing permission rules are referenced from the `_auth` entity (via the `_auth/roles` attribute).

A `_user`, which can be a human or app/system user, can be connected to several different `_auth` entities. However, tokens are tied to specific `_auth` records, not the `_user` record.

The predefined attributes for both `_user` and `_auth` are as follows.

### User attributes

Attribute | Type | Description
-- | -- | -- 
`_user/username` | `string` |  (optional) A unique username for this user.
`_user/auth` | `[ref]` | (optional) Reference to auth entities available for this user to authenticate. Note if no auth entities exist, the user will be unable to authenticate.
`_user/roles` | `[ref]` | (optional) References to the default roles that apply to this user. If roles are specified via the `_auth` entity the user is authenticated as, those roles will always override (replace) any role specified here.



### Auth attributes

Attribute | Type | Description
-- | -- | -- 
`_auth/id` | `string` |  (optional) Globally unique id for this auth record. 
`_auth/doc` | `string` | (optional) A docstring for this auth record.
`_auth/key` | `string` |  (optional) A unique lookup key for this auth record.
`_auth/type` | `tag` | (optional) The type of authorization this is. Current type tags supported are: `password`. When a user uses the `/api/signin` endpoint, the password supplied will be compared to the auth entity containing the `password` type. If there isn't an auth entity of type `password`, the user will be unable to authenticate via that endpoint.
`_auth/secret` | `string` | (optional) The hashed secret. When using this as a `password` `_auth/type`, it is the one-way encrypted password.
`_auth/hashType` | `tag` | (optional) The type of hashing algorithm used on the `_auth/secret`. FlureeDB's API supports `scrypt`, `bcrypt` and `pbkdf2-sha256`.
`_auth/resetToken` | `string` | (optional) If the user is currently trying to reset a password/secret, an indexed reset token can be stored here allowing quick access to the specific auth record that is being reset. Once used, it is recommended to delete this value so it cannot be used again.
`_auth/roles` | `[ref]` | (optional) Multi-cardinality reference to roles to use if authenticated via this auth record. If not provided, this `_auth` record will not be able to view or change anything in the database. 
`_auth/authority` | `[ref]` | (optional) Authorities for this auth record. References another _auth record. Any auth records referenced in `_auth/authority` can sign a transaction in place of this auth record. To use and authority, you must include it in your transaction. See more in the [Authority](#authority) section. 

## Defining Rules

Rules control the actual permissions and are stored in the special system collection `_rule`. Like all FlureeDB functionality, it is defined as data that you can transact as you would any data. 

### Rule attributes

Attribute | Type | Description
-- | -- | -- 
`_rule/id` | `string` |  (optional) A unique identifier for this rule.
`_rule/doc` | `string` | (optional) A docstring for this rule.
`_rule/collection` | `string` | (required) The collection name this rule applies to. In addition to a collection name, the special glob character `*` can be used to indicate all collections (wildcard).
`_rule/collectionDefault` | `boolean` | Indicates if this rule is a default rule for the specified collection. Use either this or `_rule/attributes` on a rule, but not both. Default rules are only executed if a more specific rule does not apply, and can be thought of as a catch-all.
`_rule/attributes` | `[string]`| (optional) A multi-cardinality list of attributes this rule applies to. The special glob character `*` can be used to indicate all attributes (wildcard).
`_rule/predicate` | `[ref]` | (required) Multi-cardinality reference to `_fn` entity. The actual predicate is stored in the `_fn/code` attribute. The predicate function to be applied. Can be `true`, `false`, or a predicate database function expression. Available predicate functions and variables are listed in [Database Functions](#database-functions). `true` indicates the user always has access to this collection + attribute combination. `false` indicates the user is always denied access. Predicate functions will return a truthy or false value that has the same meanings.
`_rule/ops` | `[tag]` | (required) Multi-cardinality tag of action(s) this rule applies to. Current tags supported are `query` for query/read access, `transact` for transact/write access, `token` to generate tokens, `logs` to access all database logs (users always have access to their own logs), and `all` for all operations.
`_rule/errorMessage` | `string` | (optional) If this rule prevents a transaction from executing, this optional error message can be returned to the client instead of the default error message (which is intentionally generic to limit insights into the database configuration).


## Defining Roles

Roles' purpose is simply to group a set of rules under a common name or ID that can be easily assigned to a user.

Roles are assigned to a specific `_auth` entity under the multi-cardinality attribute `_auth/roles`.

Having roles be assigned to an `_auth` record, rather than to a `_user` allows a `_user` to have access to different data, based on which `_auth` they use to authenticate. Additionally, `_auth` records can be added or revoked from a `_user` without having to edit the actual `_auth` record. 

The ability to override roles at the auth entity allows a more limited (or possibly expanded) set of roles to the same user depending on how they authenticate. If, for example, a social media website authenticated as a user, it might only have access to read a limited set of data whereas if the user logged in, they may have their full set of access rights.

 Note that, by default, all databases have a built-in `["_role/id", "root"]` role with access to everything inside a database.

### Role attributes

Attribute | Type | Description
-- | -- | -- 
`_role/id` | `string` |  (optional) A unique identifier for this role.
`_role/doc` | `string` | (optional) A docstring for this role.
`_role/rules` | `[ref]` | (required) References to rule entities that this role aggregates.

# Using GraphQL

## GraphQL

Fluree supports queries and transactions using both the FlureeQL JSON format as well as GraphQL. All GraphQL queries and transactions should be run through the [GraphQL endpoint](#apidbtoken) `/api/db/graphql`.

Because FlureeQL is a JSON format, this allows queries to be more easily composed within your programming code and is built to support Fluree's advanced capabilities like graph recursion. 

GraphQL supports a more limited set of query capability, but is robust enough for many applications. If you don't already know and want to use GraphQL, we definitely recommend using FlureeQL.

The following sections outline key differences when using GraphQL.

## GraphQL Queries 

Using GraphQL, you can only retrieve attributes from within the namespace that you specify. In the below example, we indicate that we are looking in the `chat` collection. 

Therefore, we can only retrieve attributes like `_id`, `message`, `person`, or `comments`, which are in the `chat` namespace. 

```all
{ graph {
  chat {
    _id
    message
  }
}
}
```

Fluree allows any reference attribute to point to any entity, regardless of collection type. 

However, in order to retrieve references using GraphQL, the `restrictCollection` property of that attribute has to be set to a valid collection. This second example retrieves not only the `_id` and `message` for each chat, but the `_id` and `handle` attributes for the `person` associated with each `chat`. 

```all
{ graph {
  chat {
    _id
    message
    person {
        _id
        handle
    }
  }
}
}
```

### Wildcards
GraphQL does not support the use of wildcards ( `*`). When performing a query using GraphQL, you need to list all of the attributes you would like included in the response.

In the below example, we are retrieving the `_id` and `handle` attributes from the `person` collection.  

```all
{ graph {
  person {
    _id
    handle
  }
}
}
```

### Reverse References

In addition to retrieving information in a forward-direction, we can also traverse the graph backwards. 

In the previous section, we requested every person attribute associated with a chat. If we wanted to travel the graph in reverse, we could query people and retrieve information about the chats they have made.

The syntax for doing so differs from FlureeQL to GraphQL. While FlureeQL uses the format `chat/_person`, GraphQL performs the same query with `chat_Via_person`. 

Using GraphQL: 
```all
{ graph {
  person {
    chat_Via_person {
      _id
      instant
      message
    }
  }
}
}
```

Using FlureeQL
```all
{
  "select": [
    "*",
    {"chat/_person": ["*"]}
  ],
  "from": "person"
}
```

### Block Queries

In order to query a specific block or range of blocks in GraphQL, you need to use a specific type of block query and specify the range of blocks you would like to see. 

Querying a single block 

```all
query  {
  block(from: 3, to: 3)
}
```

Querying a range of blocks

```all
query  {
  block(from: 3, to: 5)
}
```

Querying a range of blocks starting from a lower limit

```all
query  {
  block(from: 3)
}
```

### Sort By 

GraphQL queries allow you to sort any field at any level in the graph. In order to perform a sort, you need to specify both the attribute name and whether you would like to sort the values by ascending or descending values. 

In the below example, we are sorting chat messages in alphabetical order. 

```all
{ graph {
  chat (sort: {attribute: "message", order: ASC}) {
    _id
    instant 
    message
  }
}
}
```
The below query sorts every person alphabetically by their full name, and then sorts all of their comments from oldest to newest. 

```all
{ graph {
   person (sort: {attribute: "fullName", order: ASC}) {
    fullName
    comment_Via_person (sort:{attribute: "instant", order: ASC}) {
      message
      instant
    }
  }
}
}
```

#### Query with sort. Get all chat messages sorted alphabetically by message. 
```graphql
{ graph {
  chat (sort: {attribute: "message", order: ASC}) {
    _id
    instant 
    message
  }
}
}
```

#### Query with sort. Get all people, sorted alphabetically by full name, and get each person's chat messages sorted from oldest to newest.  
```graphql
{ graph {
   person (sort: {attribute: "fullName", order: ASC}) {
    fullName
    comment_Via_person (sort:{attribute: "instant", order: ASC}) {
      message
      instant
    }
  }
}
}
```
## GraphQL Transactions
We can perform transactions in GraphQL by passing a variable to a GraphQL mutation. This variable should contain a JSON-formatted parcel of data without line breaks. 

As you can see in the below example, in order to add people, we store the JSON-formatted data in a variable called `myPeopleTx` and use the variable `myPeopleTx` in the mutation statement.

We also need to ensure that all `"` are escaped, like so `\"`.

```all
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, 
  { \"_id\": \"person\", \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

If you are using the UI, you can place your variable in the "Query Variables" section on the lower left hand side of the GraphQL interface.

```graphql
mutation addPeople ($myPeopleTx: JSON) {
  transact(tx: $myPeopleTx)
}

{
  "myPeopleTx": "[
    { \"_id\": \"person\", \"handle\": \"jdoe\", \"fullName\": \"Jane Doe\" }, 
  { \"_id\": \"person\", \"handle\": \"zsmith\", \"fullName\": \"Zach Smith\" }]"
}
```

# Developer Resources

## Fluree Slack

Another way to engage with us is to join the [Fluree Slack](https://launchpass.com/flureedb). The Slack is a place to stay up-to-date with company announcements, discuss features, and get support from the Fluree team or fellow developers using Fluree. 

## FlureeDB Whitepaper

The [FlureeDB Whitepaper](https://flur.ee/assets/pdf/flureedb_whitepaper_v1.pdf) goes into depth about how FlureeDB works. 

# Examples

## Cryptocurrency

This example outlines how a user can create a simple cryptocurrency using FlureeDB. The user will be able to check their own balance and add to other users' balances. 

### Schema

The first step is to create a `crypto` collection with the attributes `crypto/balance`, which tracks the amount of currency each user has, `crypto/user`, which references a database `_user`, and `crypto/walletName`, which is a unique name for the entity. 

```all
[{
    "_id": "_collection",
    "name": "crypto"
}, 
{
    "_id": "_attribute",
    "name": "crypto/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "crypto/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "crypto/walletName",
    "type": "string",
    "unique": true
}]
```

#### Cryptocurrency Schema

```flureeql
[{
    "_id": "_collection",
    "name": "crypto"
}, 
{
    "_id": "_attribute",
    "name": "crypto/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "crypto/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "crypto/walletName",
    "type": "string",
    "unique": true
}]

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_collection",
    "name": "crypto"
}, 
{
    "_id": "_attribute",
    "name": "crypto/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "crypto/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "crypto/walletName",
    "type": "string",
    "unique": true
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation cryptoSchema ($mycryptoSchemaTx: JSON) {
  transact(tx: $mycryptoSchemaTx)
}

{
  "mycryptoSchemaTx": "[
      {\"_id\":\"_collection\",\"name\":\"crypto\"},{\"_id\":\"_attribute\",\"name\":\"crypto/balance\",\"type\":\"int\"},{\"_id\":\"_attribute\",\"name\":\"crypto/user\",\"type\":\"ref\",\"restrictCollection\":\"_user\"},
      {\"_id\":\"_attribute\",\"name\":\"crypto/walletName\",\"type\":\"string\",\"unique\":true}]"
}
```


### Ensure Balance Non-Negative

Next, we add an `_attribute/spec` that makes sure our `crypto/balance` is never negative. The code for this is `(< [-1 (?v)])`. To see how to properly format database functions, you can visit [Function Syntax](#function-syntax).

Note, this transaction, and many of the subsequent transactions can be combined. We separate out these transactions here for demonstration purposes. 

```all
[{  "_id":  ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< [-1 (?v)])"
}]

```

#### Ensure Balance Non-Negative

```flureeql
[{  "_id":  ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< [-1 (?v)])"
}]

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{  "_id":  ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$nonNegative?"],
    "specDoc": "Balance cannot be negative."
},
{
    "_id": "_fn$nonNegative?",
    "name": "nonNegative?",
    "code": "(< [-1 (?v)])"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation nonNegativeBalance ($nonNegativeBalanceTx: JSON) {
  transact(tx: $nonNegativeBalanceTx)
}

{
  "nonNegativeBalanceTx": "[
      {\"_id\":[\"_attribute/name\",\"crypto/balance\"],\"spec\":[\"_fn$nonNegative?\"],\"specDoc\":\"Balance cannot be negative.\"},{\"_id\":\"_fn$nonNegative?\",\"name\":\"nonNegative?\",\"code\":\"(< [-1 (?v)])\"}]"
}
```

### Users and Permissions

In preparation for creating users, we create a function, which checks whether the current entity's `crypto/user` is the same as the user. We will also be using the built-in functions, `["_fn/name", "true"]` and `["_fn/name", "false"]`.

```all
[{
    "_id": "_fn$ownCrypto",
    "name": "ownCrypto?",
    "code": "(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))"
}]
```

Next, we create two users with `_user/username` cryptoMan and cryptoWoman, as well as two auth records- one for each user. Both auth records are given the `_role`, cryptoUser. A cryptoUser can query their `crypto`, and `transact` on any `crypto/balance`. No one, other than the root user can transact on `crypto/user`. 


```all
[ {
    "_id": "_user$cryptoMan",
    "username": "cryptoMan",
    "auth": ["_auth$cryptoMan"]
    }, 
    {
    "_id": "_user$cryptoWoman",
    "username": "cryptoWoman",
    "auth": ["_auth$cryptoWoman"]
    }, 
    {
    "_id": "_auth$cryptoWoman",
    "id": "cryptoWoman",
    "doc": "cryptoWoman auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_auth$cryptoMan",
    "id": "cryptoMan",
    "doc": "cryptoMan auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_role$cryptoUser",
    "id": "cryptoUser",
    "doc": "Standard crypto user",
    "rules": ["_rule$viewOwnCrypto", "_rule$editAnyCryptoBalance", "_rule$cantEditCryptoUser"]
    },
    {
    "_id": "_rule$editAnyCryptoBalance",
    "id": "editAnyCryptoBalance",
    "doc": "Any cryptoUser can edit any crypto/balance.",
    "predicate": [["_fn/name", "true"]],
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/balance"]
    },
    {
    "_id": "_rule$viewOwnCrypto",
    "id": "viewOwnCrypto",
    "doc": "A cryptoUser can only view their own balance",
    "predicate": [["_fn/name", "ownCrypto"]],
    "ops": ["query"],
    "collection": "crypto",
    "collectionDefault": true
    },
    {
    "_id": "_rule$cantEditCryptoUser",
    "id": "cantEditCryptoUser",
    "doc": "No one, other than root, should ever be able to edit a crypto/user",
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/user"],
    "predicate": [["_fn/name", "false"]],
    "errorMessage": "You cannot change a crypto/user. "
  }]
```

#### Creating Database Functions

```flureeql
[{
    "_id": "_fn$ownCrypto",
    "name": "ownCrypto?",
    "code": "(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_fn$ownCrypto",
    "name": "ownCrypto?",
    "code": "(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation nonNegativeBalance ($dbFunTx: JSON) {
  transact(tx: $dbFunTx)
}

{
  "dbFunTx": "[{\"_id\":\"_fn$ownCrypto\",\"name\":\"ownCrypto?\",\"code\":\"(contains? (get-all (?e) [\\\"crypto/user\\\" \\\"_id\\\"]) (?user_id))\"}]"
}
```

#### Adding Users and Permissions

```flureeql
[ {
    "_id": "_user$cryptoMan",
    "username": "cryptoMan",
    "auth": ["_auth$cryptoMan"]
    }, 
    {
    "_id": "_user$cryptoWoman",
    "username": "cryptoWoman",
    "auth": ["_auth$cryptoWoman"]
    }, 
    {
    "_id": "_auth$cryptoWoman",
    "id": "cryptoWoman",
    "doc": "cryptoWoman auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_auth$cryptoMan",
    "id": "cryptoMan",
    "doc": "cryptoMan auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_role$cryptoUser",
    "id": "cryptoUser",
    "doc": "Standard crypto user",
    "rules": ["_rule$viewOwnCrypto", "_rule$editAnyCryptoBalance", "_rule$cantEditCryptoUser"]
    },
    {
    "_id": "_rule$editAnyCryptoBalance",
    "id": "editAnyCryptoBalance",
    "doc": "Any cryptoUser can edit any crypto/balance.",
    "predicate": [["_fn/name", "true"]],
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/balance"]
    },
    {
    "_id": "_rule$viewOwnCrypto",
    "id": "viewOwnCrypto",
    "doc": "A cryptoUser can only view their own balance",
    "predicate": [["_fn/name", "ownCrypto?"]],
    "ops": ["query"],
    "collection": "crypto",
    "collectionDefault": true
    },
    {
    "_id": "_rule$cantEditCryptoUser",
    "id": "cantEditCryptoUser",
    "doc": "No one, other than root, should ever be able to edit a crypto/user",
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/user"],
    "predicate": [["_fn/name", "false"]],
    "errorMessage": "You cannot change a crypto/user. "
  }]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[ {
    "_id": "_user$cryptoMan",
    "username": "cryptoMan",
    "auth": ["_auth$cryptoMan"]
    }, 
    {
    "_id": "_user$cryptoWoman",
    "username": "cryptoWoman",
    "auth": ["_auth$cryptoWoman"]
    }, 
    {
    "_id": "_auth$cryptoWoman",
    "id": "cryptoWoman",
    "doc": "cryptoWoman auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_auth$cryptoMan",
    "id": "cryptoMan",
    "doc": "cryptoMan auth record",
    "roles": ["_role$cryptoUser"]
    },
    {
    "_id": "_role$cryptoUser",
    "id": "cryptoUser",
    "doc": "Standard crypto user",
    "rules": ["_rule$viewOwnCrypto", "_rule$editAnyCryptoBalance", "_rule$cantEditCryptoUser"]
    },
    {
    "_id": "_rule$editAnyCryptoBalance",
    "id": "editAnyCryptoBalance",
    "doc": "Any cryptoUser can edit any crypto/balance.",
    "predicate": [["_fn/name", "true"]],
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/balance"]
    },
    {
    "_id": "_rule$viewOwnCrypto",
    "id": "viewOwnCrypto",
    "doc": "A cryptoUser can only view their own balance",
    "predicate": [["_fn/name", "ownCrypto"]],
    "ops": ["query"],
    "collection": "crypto",
    "collectionDefault": true
    },
    {
    "_id": "_rule$cantEditCryptoUser",
    "id": "cantEditCryptoUser",
    "doc": "No one, other than root, should ever be able to edit a crypto/user",
    "ops": ["transact"],
    "collection": "crypto",
    "attributes": ["crypto/user"],
    "predicate": [["_fn/name", "false"]],
    "errorMessage": "You cannot change a crypto/user. "
  }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation addUsersPerm ($userPermTx: JSON) {
  transact(tx: $userPermTx)
}

{
  "userPermTx": "[{\"_id\":\"_user$cryptoMan\",\"username\":\"cryptoMan\",\"auth\":[\"_auth$cryptoMan\"]},{\"_id\":\"_user$cryptoWoman\",\"username\":\"cryptoWoman\",\"auth\":[\"_auth$cryptoWoman\"]},{\"_id\":\"_auth$cryptoWoman\",\"id\":\"cryptoWoman\",\"doc\":\"cryptoWoman auth record\",\"roles\":[\"_role$cryptoUser\"]},{\"_id\":\"_auth$cryptoMan\",\"id\":\"cryptoMan\",\"doc\":\"cryptoMan auth record\",\"roles\":[\"_role$cryptoUser\"]},{\"_id\":\"_role$cryptoUser\",\"id\":\"cryptoUser\",\"doc\":\"Standard crypto user\",\"rules\":[\"_rule$viewOwnCrypto\",\"_rule$editAnyCryptoBalance\",\"_rule$cantEditCryptoUser\"]},{\"_id\":\"_rule$editAnyCryptoBalance\",\"id\":\"editAnyCryptoBalance\",\"doc\":\"Any cryptoUser can edit any crypto/balance.\",\"predicate\":[[\"_fn/name\",\"true\"]],\"ops\":[\"transact\"],\"collection\":\"crypto\",\"attributes\":[\"crypto/balance\"]},{\"_id\":\"_rule$viewOwnCrypto\",\"id\":\"viewOwnCrypto\",\"doc\":\"A cryptoUser can only view their own balance\",\"predicate\":[[\"_fn/name\",\"ownCrypto\"]],\"ops\":[\"query\"],\"collection\":\"crypto\",\"collectionDefault\":true},{\"_id\":\"_rule$cantEditCryptoUser\",\"id\":\"cantEditCryptoUser\",\"doc\":\"No one, other than root, should ever be able to edit a crypto/user\",\"ops\":[\"transact\"],\"collection\":\"crypto\",\"attributes\":[\"crypto/user\"],\"predicate\":[[\"_fn/name\",\"false\"]],\"errorMessage\":\"You cannot change a crypto/user. \"}]"
}
```

### Adding Crypto/Balance

Once we create these two users, we can give each user a crypto/balance. Note, if you will want more than 400 `crypto/balance` in your database, you will need to add additional users and additional `crypto/balance` at this point in the example. Once we put additional rules in place, no user will be able create `crypto/balance` from nothing without changing the rules that govern the database. 

```all
[{
    "_id": "crypto",
    "walletName": "cryptoWoman's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoWoman"]
    },
    {
    "_id": "crypto",
    "walletName": "cryptoMan's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoMan"]
}]
```

The result is:
```all
{
  "tempids": {
    "crypto$1": 4307852197889,
    "crypto$2": 4307852197890
  },
  "block": 19,
  "hash": "73768d386d665be5b233f76f053a790964d70a1d322cd0e90d8883f4793cb8f0",
  "txid": "9689fb79e7c6822c3f33f49f04c94ec8c2f0e876b9b3aafc505659ca1c595fc6",
  "fuel-remaining": 999999957356,
  "authority": null,
  "signature": "1b3044022021444c6cc9c0cb50b693d0fd3faded5a4bd91c7a19a20a974070300fcd8fd2ff02206f184264f11ddd36bec5db706c227ada846048a29eaca3ae2b42ec893f91b850",
  "time": "22.40ms",
  "fuel": 2265,
  "auth": 25769803776,
  "tx-entid": -1245184,
  "tx": "[{\"_id\":\"crypto\",\"walletName\":\"cryptoWoman's Wallet\",\"balance\":200,\"user\":[\"_user/username\",\"cryptoWoman\"]},{\"_id\":\"crypto\",\"walletName\":\"cryptoMan's Wallet\",\"balance\":200,\"user\":[\"_user/username\",\"cryptoMan\"]}]",
  "status": 200,
  "block-bytes": 755,
  "timestamp": 1535472759449,
  "flakes": [
     [ 4307852197890, 1009, 200, -1245184, true, null ],
     [ 4307852197890, 1010, 21474837480, -1245184, true, null ],
     [ 4307852197890, 1011, "cryptoMan's Wallet", -1245184, true, null ],
     [ 4307852197889, 1009, 200, -1245184, true, null ],
     [ 4307852197889, 1010, 21474837481, -1245184, true, null ],
     [ 4307852197889, 1011, "cryptoWoman's Wallet", -1245184, true, null ],
     [ -1245184, 1, "73768d386d665be5b233f76f053a790964d70a1d322cd0e90d8883f4793cb8f0", -1245184, true, null ],
     [ -1245184, 2, "c1de4911f3c5da564e576bcf121715d60745101a27bcefd5fd4e33d73674167b", -1245184, true, null ],
     [ -1245184, 5, 1535472759449, -1245184, true, null ],
     [ -1245184, 100, "9689fb79e7c6822c3f33f49f04c94ec8c2f0e876b9b3aafc505659ca1c595fc6", -1245184, true, null ],
     [ -1245184, 101, 25769803776, -1245184, true, null ],
     [ -1245184, 103, 1535472759446, -1245184, true, null ]
  ]
}
```

#### Adding Crypto/Balance


```flureeql
[{
    "_id": "crypto",
    "walletName": "cryptoWoman's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoWoman"]
    },
    {
    "_id": "crypto",
    "walletName": "cryptoMan's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoMan"]
}]

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "crypto",
    "walletName": "cryptoWoman's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoWoman"]
    },
    {
    "_id": "crypto",
    "walletName": "cryptoMan's Wallet",
    "balance": 200,
    "user": ["_user/username", "cryptoMan"]
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation createCrypto ($createCryptoTx: JSON) {
  transact(tx: $createCryptoTx)
}

{
  "createCryptoTx": "[{\"_id\":\"crypto\",\"walletName\":\"cryptoWoman's Wallet\",\"balance\":200,\"user\":[\"_user/username\",\"cryptoWoman\"]},{\"_id\":\"crypto\",\"walletName\":\"cryptoMan's Wallet\",\"balance\":200,\"user\":[\"_user/username\",\"cryptoMan\"]}]"
}
```


### Restrict Crypto Spending

At this point, we have a fairly useless cryptocurrency. Anyone can transact anyone else's `crypto/balance`, and there are no protections against someone transacting your `crypto/balance` to 0. In order to prevent this, we can create a rule that only allows you to withdraw from your own `crypto/balance` or deposit in another user's `crypto/balance`.

The `_fn/code` we use for this is fairly long, so we will break it down together:

```all
(or [
        ;; You are the root user
        (== [0 (?auth_id)])  

        ;; If you are not the root user           
        (if-else 
        
            ;; Are you transacting your own crypto?
            (contains? 
                (get-all (?e) [\"crypto/user\" \"_id\"]) 
                (?user_id)
            )  

            ;; Yes? New value (?v) must be less than previous value (?pV) 
            (> [(?pV) (?v)])          

            ;; No? New value (?v) must be more than previous value (?pV) 
            (< [(?pV) (?v)])           
        )
    ]
)
```

The database function checks whether you are the root user (`(== [0 (?auth_id)])`). If so, you have no restrictions on which crypto you can add or remove. In your own cryptocurrency, you can choose whether or not to include a "backdoor" for a root user. 

If you are not the root user, the function checks whether you are transacting your own crypto or not (`(contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))`). 

If you are transacting your own crypto, the new `crypto/balance` value has to be less than the previous value (`(> [(?pV) (?v)])`). 

If you are transacting another user's crypto, the new `crypto/balance` value has to be greater than the previous value (`(< [(?pV) (?v)])`).


In order to put this `_fn/code` into effect, you need to first create a function, and then add it to the `crypto/balance` attribute spec. 

```all
[{
    "_id": "_fn$subtractOwnAddOthers?",
    "name": "subtractOwnAddOthers?",
    "code": "(or [(== [0 (?auth_id)])(if-else (contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))  (> [(?pV) (?v)]) (< [(?pV) (?v)]))])",
    "doc": "You can only add to others balances, and only subtract from your own balance"
},
{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$subtractOwnAddOthers?"],
    "specDoc": "You can only add to others balances, and only subtract from your own balance."
}]
```

#### Restrict Crypto Spending


```flureeql
[{
    "_id": "_fn$subtractOwnAddOthers?",
    "name": "subtractOwnAddOthers?",
    "code": "(or [(== [0 (?auth_id)])  (if-else (contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))  (> [(?pV) (?v)]) (< [(?pV) (?v)]))])",
    "doc": "You can only add to others balances, and only subtract from your own balance"
},
{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$subtractOwnAddOthers?"],
    "specDoc": "You can only add to others balances, and only subtract from your own balance."
}]

```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_fn$subtractOwnAddOthers?",
    "name": "subtractOwnAddOthers?",
    "code": "(or [(== [0 (?auth_id)])(if-else (contains? (get-all (?e) [\"crypto/user\" \"_id\"]) (?user_id))  (> [(?pV) (?v)]) (< [(?pV) (?v)]))])",
    "doc": "You can only add to others balances, and only subtract from your own balance"
},
{
    "_id": ["_attribute/name", "crypto/balance"],
    "spec": ["_fn$subtractOwnAddOthers?"],
    "specDoc": "You can only add to others balances, and only subtract from your own balance."
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation restrictCrypto ($restrictCryptoTx: JSON) {
  transact(tx: $restrictCryptoTx)
}

{
  "restrictCryptoTx": "[
      {\"_id\":\"_fn$subtractOwnAddOthers?\",\"name\":\"subtractOwnAddOthers?\",\"code\":\"(or [(== [0 (?auth_id)])(if-else (contains? (get-all (?e) [\\\"crypto/user\\\" \\\"_id\\\"]) (?user_id))  (> [(?pV) (?v)]) (< [(?pV) (?v)]))])\",\"doc\":\"You can only add to others balances, and only subtract from your own balance\"},{\"_id\":[\"_attribute/name\",\"crypto/balance\"],\"spec\":[\"_fn$subtractOwnAddOthers?\"],\"specDoc\":\"You can only add to others balances, and only subtract from your own balance.\"}]"
}
```

### Testing Our Crypto

We are not quite done with our example yet, but we can test it to this point. Make sure to refresh your UI, so that you can select "cryptoWoman" as the user (in the sidebar).

Cryptowoman will attempt to add 5 to her own `crypto/balance`. When we attempt the below transaction, we should get the error message, 
"You can only add to others balances, and only subtract from your own balance."

```all
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 205
}]
```

When she attempts to subtract from her own account, she can do so successfully. 

```all
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 195
}]
```

Even if she doesn't know her current balance, she can use the database function, `(?pV)` to get the previous value of her `crypto/balance`.

```all
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

She is also able to add to cryptoMan's balance.

```all
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 5])"
}]
```

However, she is not able to remove money from cryptoMan's balance. 

```all
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

#### CryptoWoman Can't Add To Her Own Account

```flureeql
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 205
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 205 }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation addCryptoWoman ($addCryptoWomanTx: JSON) {
  transact(tx: $addCryptoWomanTx)
}

{
  "addCryptoWomanTx": "[
      {\"_id\": "[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":205}]"
}
```

#### CryptoWoman Can Withdraw From Her Own Account

```flureeql
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 195
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": 195 }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation addCryptoWoman ($addCryptoWomanTx: JSON) {
  transact(tx: $addCryptoWomanTx)
}

{
  "addCryptoWomanTx": "[
      {\"_id\":"[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":195}]"
}
```

#### CryptoWoman Can Withdraw From Her Own Account Using a Database Function

```flureeql
[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])" }]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation removeCryptoWoman ($removeCryptoWomanTx: JSON) {
  transact(tx: $removeCryptoWomanTx)
}

{
  "removeCryptoWomanTx": "[
      {\"_id\": "[{\"_id\":[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":\"#(- [(?pV) 5])\"}]"
}
```

#### CryptoWoman Can Add to CryptoMan's Wallet

```flureeql
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 5])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 5])"}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation addCryptoMan ($addCryptoManTx: JSON) {
  transact(tx: $addCryptoManTx)
}

{
  "addCryptoManTx": "[
      {\"_id\": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(+ [(?pV) 5])\"}]"
}
```

#### CryptoWoman Cannot Withdraw From CryptoMan's Wallet

```flureeql
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 5])"}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation removeCryptoMan ($removeCryptoManTx: JSON) {
  transact(tx: $removeCryptoManTx)
}

{
  "removeCryptoManTx": "[
      {\"_id\": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(- [(?pV) 5])\"}]"
}
```

### Crypto Spent = Crypto Received

Now, we can add a spec, which makes sure that the total balance added to one (or several accounts) is equal to the amount subtracted from another account. For this purpose, we can use the `txSpec` attribute. `_attribute/spec`, which we used to ensure that balances are non-negative, checks every flakes in a transaction that contains a given attribute. On the other hand `_attribute/txSpec` is run once *per attribute* in a transaction. For example, if we create an `_attribute/txSpec` for `crypto/balance`, our transactor will group together every flake that changes the `crypto/balance` attribute and only run the `txSpec`
*once*. `txSpec` allows use to do things like sum all the crypto/balance values in a transaction.

The function `(valT)` takes no arguments, and sums all the true flakes in a transaction for the given `_attribute`. Likewise, the function `(valF)` takes no arguments, and sums all the false flakes in a transaction for the given `_attribute`. We want to make sure that the sum of all of the `crypto/balance`s being retracted equals the sum of those being added. 

```all
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(valT)  (valF)])",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]
```

#### Crypto Spent = Crypto Received

```flureeql
[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(valT)  (valF)])",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_attribute/name", "crypto/balance"],
    "txSpec": ["_fn$evenCryptoBalance"],
    "txSpecDoc": "The values of added and retracted crypto/balance flakes need to be equal"
},
{
    "_id": "_fn$evenCryptoBalance",
    "name": "evenCryptoBalance?",
    "code": "(== [(valT)  (valF)])",
    "doc": "The values of added and retracted crypto/balance flakes need to be equal"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation cryptoSpentReceived ($cryptoSpentReceivedTx: JSON) {
  transact(tx: $cryptoSpentReceivedTx)
}

{
  "cryptoSpentReceivedTx": "[{\"_id\":[\"_attribute/name\",\"crypto/balance\"],\"txSpec\":[\"_fn$evenCryptoBalance\"],\"txSpecDoc\":\"The values of added and retracted crypto/balance flakes need to be equal\"},{\"_id\":\"_fn$evenCryptoBalance\",\"name\":\"evenCryptoBalance?\",\"code\":\"(== [(valT) (valF)])\",\"doc\":\"The values of added and retracted crypto/balance flakes need to be equal\"}]"
}
```

### Final Test  

Now, all the pieces of our cryptocurrency are in place. We have created a cryptocurrency with the following features:

1. Balances can never be negative.
2. A user may only withdraw from their own account. 
3. A user may only add to another user's account.
4. When withdrawing or adding, the amount withdraw has to equal the amount added. 

For example, with our final cryptocurrency, no user can perform the following transaction, because it violates feature #4, as listed about.

```all
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

The following transaction spends as much cryptocurrency as it receives. However, because it is withdrawing from cryptoMan's Wallet and adding to cryptoWoman's wallet, only cryptoMan can initiate the transaction. 

```all
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(- [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(+ [(?pV) 10])"
}]
```

#### The Amount Added Has To Equal The Amount Withdrawn

```flureeql
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 5])"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation unevenSpend ($unevenSpendTx: JSON) {
  transact(tx: $unevenSpendTx)
}

{
  "unevenSpendTx": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(+ [(?pV) 10])\"},{\"_id\":[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":\"#(- [(?pV) 5])\"}]"
}
```

#### CryptoMan Can Perform This Transaction

```flureeql
[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 10])"
}]
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["crypto/walletName", "cryptoMan's Wallet"],
    "balance": "#(+ [(?pV) 10])"
},
{
    "_id": ["crypto/walletName", "cryptoWoman's Wallet"],
    "balance": "#(- [(?pV) 10])"
}]' \
   https://$FLUREE_ACCOUNT.beta.flur.ee/api/db/query
```

```graphql
mutation unevenSpend ($unevenSpendTx: JSON) {
  transact(tx: $unevenSpendTx)
}

{
  "unevenSpendTx": "[{\"_id\":[\"crypto/walletName\",\"cryptoMan's Wallet\"],\"balance\":\"#(+ [(?pV) 10])\"},{\"_id\":[\"crypto/walletName\",\"cryptoWoman's Wallet\"],\"balance\":\"#(- [(?pV) 10])\"}]"
}
```

## Rule Governance

This example outlines how users can vote on proposed changes to the database. At the end of the example, user will be able to propose changes, vote on those changes, and create various voting threshholds (minimum votes and minimum win percentage) for different attributes. There are various ways to enable a rule governance scheme, but this is one simple way.

In our hypothetical example, let's say we've had a network that has been humming along quite smoothly, except that a few rogue users have adopted offensive usernames. Rather than relying on central authority to interpret and enforce community standards, we can create a voting mechanism for whenever a user wants to change their username. In practice, you might want to add rules that prevent users from using certain words in their usernames in the first-place, or initiate a voting process only after a complaint. As previously stated, this is a example is a backbone that can be built upon for real-life applications.

### Schema

We will need two additional collections, `vote` and `change` for our example. 

The `vote` collection will have a `vote/name`, `vote/yesVotes`, and `vote/noVotes`. The yes and no votes attributes are multi, ref-type attributes that will hold all of the auth records that voted yes or no, respectively, on the proposed change. 

```all
[
 {
  "_id": "_collection",
  "name": "vote"
 },
 {
  "_id": "_collection",
  "name": "change"
 },
 {
  "_id": "_attribute",
  "name": "vote/name",
  "type": "string",
  "unique": true
 },
  {
  "_id": "_attribute",
  "name": "vote/noVotes",
  "type": "ref",
  "multi": true,
  "restrictCollection": "_auth"
 },
 {
  "_id": "_attribute",
  "name": "vote/yesVotes",
  "type": "ref",
  "multi": true,
  "restrictCollection": "_auth"
 }
]
```

The `change` collection holds the actual details for the proposed change. It has the following attributes, `change/name`, `change/entity`, `change/attribute`, `change/doc`, `change/vote`, and `change/value`. 

`change/entity` is a reference to entity on which we are proposing a change. For example, if we had a collection, group, we could propose a change on a particular `group` entity. If we wanted to vote on the leader of that group, `change/attribute` would reference the `group/leader` attribute, and `change/value` would be the proposed value, for instance, `John Doe`. 

```all
[{
  "_id": "_attribute",
  "name": "change/name",
  "type": "string",
  "index": true,
  "unique": true
 },
 {
  "_id": "_attribute",
  "name": "change/entity",
  "type": "ref",
  "index": true,
  "doc": "A reference to the entity for the proposed change"
 },
 {
  "_id": "_attribute",
  "name": "change/attribute",
  "type": "ref",
  "index": true,
  "restrictCollection": "_attribute",
  "doc": "A reference to the attribute where the change is being proposed"
 },
 {
  "_id": "_attribute",
  "name": "change/doc",
  "doc": "Description of the proposed change",
  "type": "string"
 },
 {
  "_id": "_attribute",
  "name": "change/vote",
  "type": "ref",
  "unique": true
 },
 {
  "_id": "_attribute",
  "name": "change/value",
  "doc": "The proposed new value for",
  "type": "string",
  "index": true
 }
]
```

### Preventing Vote Fraud 

The `vote/yesVotes` and `vote/noVotes` attributes hold all of the auth records that voted for or against a proposed change. We can add a spec to both of these attributes, which ensures that users only cast votes with their own auth records. 

The rule, `(or [(== [0 (?auth_id)]) (== [(?v) (?auth_id)]) ])` checks whether the value being added to the vote, `?v`, belongs to the auth record of the user placing the vote. Alternatively, if transacting via the root user (where auth_id = 0), you can add as many votes as you like. 

```all
[
    {
        "_id": "_fn$ownAuth",
        "_fn/name": "ownAuth?",
        "_fn/code": "(or [(== [0 (?auth_id)]) (== [(?v) (?auth_id)]) ])"
    },
    {
        "_id": ["_attribute/name", "vote/yesVotes"],
        "spec": ["_fn$ownAuth"]
    },
    {
        "_id": ["_attribute/name", "vote/noVotes"],
        "spec": ["_fn$ownAuth"]
    }
]
```

When working this into a real-life application, you may also add a rule that a user can't change their vote after a certain time (by adding a `vote/expiration` attribute), or can only vote yes OR no.

### Adding Permissions

Before building out our smart functions (`_fn`) any further, we will add permissions to our network. For example, we want to ensure that users can't freely add new auth records, otherwise they'd be able add new auth records and artificially inflate a vote. We do want to make sure that users have access to the `vote` and `change` collections. 

All of the permissions transactions can be added at once, but we break them up here for clarity. 
First, we add four rules that will allow users to transact and view votes, changes, and users. The rules only allow users to view, but not edit, auth records. 

```all
[{
    "_id": "_rule$editVotes",
    "predicate": [["_fn/name", "true"]],
    "id": "editVotes",
    "collection": "vote",
    "collectionDefault": true,
    "ops": ["transact", "query"]
},
{
    "_id": "_rule$editChanges",
    "predicate": [["_fn/name", "true"]],
    "id": "editChanges",
    "collection": "vote",
    "collectionDefault": true,
    "ops": ["transact", "query"]
},
{
    "_id": "_rule$editOwnUser",
    "predicate": ["_fn$editOwnUser"],
    "id": "editOwnUser",
    "collection": "_user",
    "collectionDefault": true,
    "ops": ["transact"]
},
{
    "_id": "_rule$viewUsers",
    "predicate": [["_fn/name", "true"]],
    "id": "viewUsers",
    "collection": "_user",
    "collectionDefault": true,
    "ops": ["query"]
},
{
    "_id": "_rule$viewAuth",
    "predicate": [["_fn/name", "true"]],
    "id": "viewAuth",
    "collection": "_auth",
    "collectionDefault": true,
    "ops": ["query"]
},
{
    "_id": "_fn$editOwnUser",
    "name": "editOwnUser",
    "code": "(== [(?v) (?user_id)])"
}]
```

Next, we group all of the rules we just created into a role, `voter`.  

```all
[{
    "_id": "_role$voter",
    "id": "voter",
    "doc": "A voter can view and edit changes, votes, and users. They can view, but not edit, auth records.",
    "rules": [["_rule/id", "editChanges"], ["_rule/id", "editVotes"], ["_rule/id", "editOwnUser"], 
    ["_rule/id", "viewUsers"],["_rule/id", "viewAuth"]]
}]
```

Now we can create and assign 15 auth records, which all have the voter role. The auth record transactions are very similar for each auth record, so we only show five examples below. 

```all
[{
    "_id": "_auth$1",
    "id": "auth1",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
},
{
    "_id": "_auth$2",
    "id": "auth2",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
},
{
    "_id": "_auth$3",
    "id": "auth3",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
},
{
    "_id": "_auth$4",
    "id": "auth4",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
},
{
    "_id": "_auth$5",
    "id": "auth5",
    "doc": "Basic auth records",
    "roles": [["_role/id", "voter"]]
}]
```

To finish off our permissions regime, we add 15 users and assign each of those users an auth record. Although users are not necessary for issuing transactions (only auth records are required), we are building users into this example, because it is a common feature of applications. 

Each of the user transactions is very similar, so we only show five examples. In our example, all of our users are artists who produced one hit wonder. If you would like to follow our lead, then your last 10 users would be: bahaMen, vanillaIce, a-ha, gerardo, debbyBoone, sirMix-A-Lot, vanMcCoy, deee-Lite, ?&TheMysterians. Of course, this is not a technical requirement, but you do get bonus points (non-redeemable) if you can name the songs they are known for. 

```all
[{
    "_id": "_user$1",
    "username": "losDelRio",
    "auth": ["_auth$1"]
},
{
    "_id": "_user$2",
    "username": "softCell",
    "auth": ["_auth$2"]
},
{
    "_id": "_user$3",
    "username": "dexysMidnightRunners",
    "auth": ["_auth$3"]
},
{
    "_id": "_user$4",
    "username": "rightSaidFred",
    "auth": ["_auth$4"]
},
{
    "_id": "_user$5",
    "username": "toniBasil",
    "auth": ["_auth$5"]
}]
```

### Proposing a Change 

Now that we've done our part to prevent voter fraud, we can propose a change. `["_user/username", "a-ha"]` wants to change their username to "Eureka!", so they propose a change, and create a vote. A-Ha also adds their auth record to the `vote/yesVotes` attribute.

```all
[{
    "_id": "change",
    "name": "ahaNameChange",
    "doc": "It's time for a change!",
    "entity": ["_user/username", "a-ha"],
    "attribute": ["_attribute/name", "_user/username"],
    "value": "Eureka!",
    "vote": "vote$aha"
},
{
    "_id": "vote$aha",
    "name": "ahaNameVote",
    "yesVotes": [["_auth/id", "auth8"]]
}]
```

### Building Our Smart Functions

Currently, there is nothing stopping A-Ha from issuing a transaction to change their `_user/username` from `a-ha` to `Eureka!`. In order to prevent users from editing their usernames without a vote, we need to create a set of smart functions ([database functions](#database-functions-1)) that we can add to the `_user/username` attribute specification. 

Given an entity id, we can see all the votes related to that entity with a single query. 

```all
{
    "select": [ { "change/vote": ["*"]}],
    "where": "change/entity = 21474837487"
}

```

Note: Currently, two-tuple references to entities, i.e. `["_user/username", "a-ha"]`, are not supported in where clauses. In the case of our database, `["_user/username", "a-ha"]` resolves to the id `21474837487`. You can find out this information for your own database by querying, `{"select": ["_id"],"from": ["_user/username", "a-ha"]}`.

The above query returns *every* change that might have been proposed for `21474837487`, including changes to other attributes, such as A-Ha's `_user/auth` or their `_user/roles`. It also might return other changes proposed for their `_user/username` other than `Eureka!`.


We want to make sure that we are only looking at votes for a given entity that also pertain to the proper attribute and the relevant value. In order to do this, we need to query the following, where `50` is the entity id for the `_user/username` attribute (you can see this in your database with the query: `{"select": ["_id"],"from": ["_attribute/name", "_user/username"]})`.

```all
{
    "select": [ { "change/vote": ["*"]}],
    "where": "change/entity = 21474837487 AND change/attribute = 50 AND change/value = \"Eureka!\""
}

```

Sample result:

```all
{
  "status": 200,
  "result": [
    {
      "change/vote": {
        "vote/name": "ahaNameVote",
        "vote/yesVotes": [
          {
            "_id": 25769804783
          }
        ],
        "_id": 4294967296001
      }
    }
  ],
  "fuel": 8,
  "block": 11,
  "time": "3.18ms",
  "fuel-remaining": 99999962775
}
```

The first two functions we create build and issue the above query. We will then use these functions to count votes, and eventually decide whether or not changes should be approved. If, at this point, you cannot understand how these functions fit into the larger applications, do not worry, we will see the entire voting mechanism working in short order. At this point, the most important part is to try and understand the syntax of the individual smart functions.

The function, `?voteWhere` constructs the where clause using the `str` function, which concatenates all strings in a given array (all available database or smart functions are detailed in [database functions](#database-functions-1)). 

When we are editing a given entity's attribute in a transaction, we have access to the value we are attempting to input `(?v)`, the id of the entity we are editing `(?eid)`, and the id of the attribute we are editing `(?aid)`, which is all of the information we need in order to compose our where clause. 

```all
[ 
    {
        "_id": "_fn",
        "name": "?voteWhere",
        "code": "(str [\"change/value = \\\"\" (?v) \"\\\"\"  \" AND change/entity = \" (?eid) \" AND change/attribute = \" (?aid)])"
    }
]
```

One of the most useful features of smart functions is that we can put them together. The second function we create issues a query using the `query` smart function. The arguments or parameters for the `query` function are: `select-string`, `from-string`, `where-string`, `block-string`, `limit-string`.

For `select-string`, we use `[{change/vote [*]}]`. `from-string` is nil. For `where-string`, rather than composing the `where-string` from scratch, we can simply use `(?voteWhere)`. `block-string` and `limit-string` are both set to nil.

```all
[
    {
        "_id": "_fn",
        "name": "?vote",
        "code": "(query \"[{change/vote [*]}]\" nil (?voteWhere) nil nil)"
    }
]
```

Using the `(?vote)` function, we can access the `vote/yesVotes` and `vote/noVotes`. We use the `get-all` function, and we specify path that we want to follow in order to get the `vote/noVotes` and `vote/yesVotes` (`["change/vote", "vote/noVotes"])`. 

If you're uncertain where we got this path from, issue the query: `{ "select": [ { "change/vote": ["*"]}], "where": "change/entity = 21474837487 AND change/attribute = 50 AND change/value = \"Eureka!\"" }`.

```all
[
    {
        "_id": "_fn",
        "name": "noVotes",
        "code": "(get-all (?vote) [\"change/vote\" \"vote/noVotes\"] )"
    },
    {
        "_id": "_fn",
        "name": "yesVotes",
        "code": "(get-all (?vote) [\"change/vote\" \"vote/yesVotes\"] )"
    }
]
```

We want to be able to set both a minimum win percentage, as well as a minimum number of votes for each of our votes. For example, we might want to make every vote have at least 10 yes and no vote, combined. In addition, in order for a vote to pass, we could set a minimum threshhold of 50% or 60%. 

First, we create a function, `minWinPercentage` that calculates whether the ratio of yes votes to total votes is above a given percentage. Rather than hard-coding a percentage, we use a `_fn/param`.

```all
[
    {
        "_id": "_fn",
        "name": "minWinPercentage",
        "params": [ "percentage" ],
        "code": "(> [ ( / [ (count (yesVotes) ) (+ [ (count (yesVotes) )  (count (noVotes) )  ]) ] ) percentage ])"
    }
]
```

Then, we create a function, `minVotes`, which checks whether the total number of votes is above a given parameter, `n`. 

```all
[
    {
        "_id": "_fn", 
        "name": "minVotes",
        "params": ["n"],
        "code": "(> [(+ [ (count (yesVotes) )  (count (noVotes) ) ] )  n ])"
    }
]
```

Finally, we can create a function which checks whether a vote on a given entity, on a given attribute, with the given value passes a certain threshhold of minimum votes and a certain minimum win percentage. In this case, we create a 2 vote minimum with a 0.50 minimum win percentage (note that in our `minWinPercentage` function, we used the `>` sign, which indicates strictly greater than. Therefore, if there are only two votes, one for no and one for yes, this particular vote won't pass. Additionally, the percentage needs to be in decimal form with a leading 0). 

```all
[{
    "_id": "_fn",
    "name": "2VotesMajority",
    "code": "(and [(minVotes 2) (minWinPercentage 0.5)])"
}]
```

### Adding the Username Spec

At this point we can add the function, `2VotesMajority` to the `_attribute/spec` for `_user/username`. Now, every time a transaction contains a `_user/username`, the `2VotesMajority` will run. 

```all
[{
    "_id": ["_attribute/name", "_user/username"],
    "spec": [["_fn/name", "2VotesMajority"]]
}]
```

### Testing

The only vote that we have so far is `a-ha` voting for their own name change. That means that if we attempt to change A-Ha's username, it should fail.

```all
[{
    "_id": ["_user/username", "a-ha"],
    "username": "Eureka!"
}]
```

Response:

```all
{
  "status": 400,
  "message": " Value Eureka! does not conform to spec: (and [(minVotes 2) (minWinPercentage 0.5)])",
  "error": "db/invalid-tx",
  "time": "40.73ms",
  "fuel-remaining": 99999949452
}
```

We would need at least two more yes votes in order to successfully make this change. 

For the purposes of this tutorial, we allow the root user (auth id = 0) to edit `vote/yesVotes` and `vote/noVotes` freely. However, in a real-world application, you may choose to remove this backdoor. Feel free to play around with adding and removing votes using each individual auth. For the purposes of this demonstration, we will add votes via the backdoor (bypassing the `editOwnAuth` rule).

```all
[{
    "_id": ["vote/name", "ahaNameVote"],
    "yesVotes": [["_auth/id", "auth1"], ["_auth/id", "auth2"]]
}]
```

After adding more yes votes, the transaction, `[{ "_id": ["_user/username", "a-ha"], "username": "Eureka!" }]` passes. 

We now have a fully operational voting system. If we want to add a voting requirement to any other attributes, we would simply have to issue a transaction specifying a new function (or re-using `2VotesMajority`), and adding that function to any `_attribute`. The below transction would require at least 10 votes with more than 75% voting yes in order to change smart function code. 

```all
[{
    "_id": "_fn$voteReqs",
    "name": "10Votes75%",
    "code": "(and [(minVotes 10) (minWinPercentage 0.75)])"
},
{
    "_id": ["_attribute/name", "_fn/code"],
    "spec": ["_fn$voteReqs"]
}]

```