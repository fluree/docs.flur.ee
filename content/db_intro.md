# Intro

## Welcome

Welcome to the FlureeDB documentation!

**Where to Start?** 

*Option 1*. To learn a little bit about how our database works, begin with the [What is FlureeDB?](#what-is-flureedb) section. 

*Option 2*. To get your hands dirty right away, visit the [Quick Start](#quickstart) guide to use Fluree in the [FlureeDB interactive web console](#https://flureedb.flur.ee/). 

*Option 3*. To launch a standalone version of FlureeDB, visit the [Standalone FlureeDB](#standalone-flureedb) section. 

If you have issues, please do report them! A simple email to [support@flur.ee](mailto:support@flur.ee) is much appreciated with a description of what happened, and when. 

In addition, our [Fluree Slack](https://flureedb.slack.com/) is a great place to connect with other developers, ask questions, and chat about all things FlureeDB. If you are not already part of the Slack, please [join here](https://launchpass.com/flureedb).

## What is FlureeDB?

FlureeDB is an immutable, time-ordered blockchain database. 

Each block is an atomic update that is cryptographically signed to prevent tampering and linked to the previous block in the chain.

![A series of 5 blocks stacked on top of each other vertically. The middle block is deconstructed to show: the previous block's hash, the current block's hash, data, a timestamp, and the block index.](./images/blockContents.png)

At its core, every block contains a group of specially formatted log files of database updates, as well as block meta-data. We call these log files Flakes. Each Flake is a specific fact at a specific point in time about a specific entity. No two Flakes are the same.

Below is an example of database block. We will go into detail about the contents of the blocks in the [Transaction Response](#transaction-response) section. However, below you can see that, among other things, every block contains a hash, a timestamp, and the size of the block data (block-bytes). This block also contains an array of six Flakes. These Flakes contain all the data that is added, updated, or deleted in block 5, as compared to block 4. 

```
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
We can think of the database at any given point in time as the combination of all the Flakes up until that point. For example, the database at block 5 is the result of "playing all of the Flakes forward" from blocks 1 through 5. 

We will go into detail about how to create schema and transact data in the database later. But for now, the below image shows you a simplified representation of five blocks worth of Flakes. In the first two blocks, we create our simple schema (a user with a user/handle and a user/chat). In block 3, we add a new user named 'bob' and a chat message for Bob. In block 4, we create a new user with the handle 'jane', and finally in block 5, we attribute a chat to 'jane'.

![A table with the columns: "entity", "attribute", "value", "block", and "add." There are seven rows in this table, and each contains sample data, which is explained in the accompanying paragraph.](./images/flakeLogBlocks1-5.png)

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

To launch the standalone version of FlureeDB, download and unzip the [latest version of FlureeDB](). The contents of the folder are as follows:

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

## QuickStart

This quick start is designed to utilize the [FlureeDB interactive web console](https://flureedb.flur.ee). These transactions could also be performed via your code or REPL utilizing the JSON API, but that would require a token.

The first six topics in the Quick Start guide will show you how to query and transact using an already populated database. The next five topics will show you how to set up a brand new database. 

Topic |   
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

![A form from the Admin Portal, heading is "Create New Database". There are two fields in the form, one with the label "Database Name" and the other with the label "Database Templates." "Movie Database" is selected as the option in "Database Templates."](./images/forkMovieDb.png)

Refresh, and then select your new database and the user "root" from the sidebar of the administrative portal.  

Now, select FlureeQL in the sidebar to go to the [FlureeQL interface](https://flureedb.flur.ee/flureeql). Make sure that the "Query" option is selected in the header. Now you are ready to start querying the database!

### Selecting All Actors, Movies, Credits

A Fluree schema consists of collections and attributes. Collections are similar to a relational database's tables. Collections organize changes about a type of entity, i.e. customers, invoices, employees. So if you have a new entity type, you'd create a new collection to hold it. You can learn more about collections in the [Collections](#collections) section. 

The movie database that we forked contains eight collections: actor, credit, keyword, genre, language, country, productionCompany, and movie. 

Fluree allows you to specify queries using our FlureeQL JSON syntax or with GraphQL. The FlureeQL format is designed to easily enable code to compose queries, as the query is simply a data structure.

For each query, the user's permissions (determined according to _auth record through which they are authenticated - more on that in the [Fluree Permissions](#fluree-permissions) section) create a special filtered database that only contains what the user can see. You can safely issue any query, never having to worry about accidentally exposing permissioned data.

We can select all attributes (*) for all actors in the database with the following query:

```
{
 "select": ["*"],
 "from": "actor"
}
```

Your result will look similiar to this. 

```
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
  "status": 200,
  "time": "3905.94ms"
}
```

Although there are more than 1,000 actors, by default FlureeDB only returns 1,000 results, although this can be changed by setting the [limit options](#apidbquery).

We can do the same thing for any other collection by just replacing "actor" with "movie" or "credit" for instance.

```
{
 "select": ["*"],
 "from": "anyCollectionNameHere"
}
```

Note that only the FlureeQL syntax will work on the FlureeQL page, but we have also provided the GraphQL and curl syntax here if you prefer to follow along with the Quick Start through those modes.

#### Selecting All Actors 
```json
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
```json
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
```json
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

```
{
  "select": ["*"],
  "from": 4316442136599
}
```

You could also use a unique attribute like "from": ["actor/name", "Angelina Jolie"]. Both results will be identical. The results are a map/object in this case, and not a collection.

```
{
  "select": ["*"],
  "from": ["actor/name", "Angelina Jolie"]
}
```

Try it yourself. First query all the movies, then note down the _id for the movie you would like to select, and use that _id to select only that single movie. 

```
{
  "select": ["*"],
  "from":  4294967299233
}
```

You can do the same thing by select a movie by its title, for example:

```
{
  "select": ["*"],
  "from": ["movie/title", "Pulp Fiction"]
}
```

#### Selecting an Actor Using Their _id

```json
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
```json
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

```
{
  "select": ["*"],
  "from": ["movie/title", "Pulp Fiction"]
}
```
However, the response only shows us the _id's for each credit/actor. 

```
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

```
{
  "select": ["*", {
    "movie/credits": ["*"]
  }],
  "from": ["movie/title", "Pulp Fiction"]
}
```

```
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

```
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

```
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
```json
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
```json
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
```json
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

```
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
```json
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

```
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

```
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

```
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
```json
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

```json
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

```json
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

```json
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

```json
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

```
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

```json
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

```json
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

```json
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

```json
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

```json
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

```json 
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

```json 
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
    "predicate": [["_fn$name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "collection": "person",
    "collectionDefault": true,
    "predicate": [["_fn$name", "true"]],
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
    "name": "true",
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
    "predicate": [["_fn$name", "true"]],
    "ops": ["query"]
  },
  {
    "_id": "_rule$viewAllPeople",
    "id": "viewAllPeople",
    "doc": "Can view all people",
    "collection": "person",
    "collectionDefault": true,
    "predicate": [["_fn$name", "true"]],
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
    "name": "true",
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
  "myRoleTx": "[{\"_id\":\"_role\",\"id\":\"chatUser\",\"doc\":\"A standard chat user role\",\"rules\":[\"_rule$viewAllChats\",\"_rule$viewAllPeople\",\"_rule$editOwnChats\"]},{\"_id\":\"_rule$viewAllChats\",\"id\":\"viewAllChats\",\"doc\":\"Can view all chats.\",\"collection\":\"chat\",\"collectionDefault\":true,\"predicate\":[[\"_fn$name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$viewAllPeople\",\"id\":\"viewAllPeople\",\"doc\":\"Can view all people\",\"collection\":\"person\",\"collectionDefault\":true,\"predicate\":[[\"_fn$name\",\"true\"]],\"ops\":[\"query\"]},{\"_id\":\"_rule$editOwnChats\",\"id\":\"editOwnChats\",\"doc\":\"Only allow users to edit their own chats\",\"collection\":\"chat\",\"attributes\":[\"chat/message\"],\"predicate\":[\"_fn$editOwnChats\"],\"ops\":[\"transact\"]},{\"_id\":\"_fn$editOwnChats\",\"name\":\"true\",\"code\":\"(contains? (get-all (?e \\\"[{chat/person  [{person/user [_id] }]\\\") [\\\"chat/person\\\" \\\"person/user\\\" \\\"_id\\\"]) (?user_id))\"}]"
}

```

#### Create a new user with an auth record containing that role

```json
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
    "key": "tempAuthRecord"
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
    { \"_id\": \"_auth$temp\", \"key\": \"tempAuthRecord\" } ]"
}
```