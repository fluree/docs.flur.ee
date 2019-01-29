
## Forking a Database

Forking a database is creating a copy of a certain database up to a point in time. 

### Downloaded Version

This applies to any FlureeDB version after 0.9.1. Forking was not enabled in downloadable versions 0.9.1 and earlier. 

To fork a database, we need to go to the [master database in the network](/docs/infrastructure/network-infrastructure#master-database), and issue a transaction creating a new subject in the `db` collection. 

All of the `db` predicates are listed below.

Key | Description
---|---
`id` | Main database id, should never be changed.
`alias` | Alias name for this db, can be changed but must be unique.
`root` | Root auth id
`fork` | If this database is a fork of an existing db, include the db identity.
`forkBlock` | If this database is a fork of an existing db, the block at which the fork happened (inclusive).
`doc` | Optional docstring describing this database.
`active` | If active is set to false, will not allow any new transactions/updates to this db. Default is true.
`archived` | If true, this database is archived and only blocks can be retrieved. Defaults false.

When forking, we need to specify a fork and optionally, a forkBlock. The fork should be either the db id or alias. Anyone who has permission to create a new database in the master database, has permission to fork any database. 

You will also want to add your forked database to a [relevant network](/docs/network-setup/network-settings). For example:

```
[{
    "_id": "db$dbone",
    "id": "dbone",
    "alias": "one",
    "doc": "A fork of database onehalf up to block 10, inclusive.",
    "fork": "onehalf",
    "forkBlock": 10
},
{
    "_id": ["network/id", "myNet"],
    "dbs": ["dbs$dbone"]
}]
```

### Hosted Version

To create a blank database, login to the user interface on your localhost or the [FlureeDB Admin Portal (https://flureedb.flur.ee)](https://flureedb.flur.ee) online and click "Add Database" in the bottom left-hand side of the page. 

You can fork any database in the "Database Templates" section. As of December 2018, only one database is available to fork, "Movie Database", which contains about 5,000 movies with accompanying credit, actor, etc information.

<p class="text-center">
    <img style="width: 500px; height: 300px" src="https://s3.amazonaws.com/fluree-docs/forkMovieDb.png" alt="A form from the Admin Portal, heading is `Create New Database`. There are two fields in the form, one with the label `Database Name` and the other with the label `Database Templates.` `Movie Database` is selected as the option in `Database Templates.`">
</p>


Refresh, and then select your new database and the user "root" from the sidebar of the administrative portal.  

