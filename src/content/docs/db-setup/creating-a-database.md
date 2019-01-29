## Creating a Database

### Downloaded Version

This applies to any FlureeDB version after 0.9.1. For previous versions, look at the [Hosted Version](#hosted-version) section.

To create a new database, we need to go to the [master database in the network](/docs/infrastructure/network-infrastructure#master-database), and issue a transaction creating a new subject in the `db` collection. We can also perform this action through the user interface in the same manner as the [hosted version](#hosted-version).

You will also want to add your database to a [relevant network](/docs/network-setup/network-settings). For example:

```all
[{
    "_id": "db$fluree",
    "id": "fluree",
    "alias": "deebee",
    "doc": "This database is called `fluree`, but we also call it `deebee`"
},
{
    "_id": ["network/id", "myNet"],
    "dbs": ["dbs$fluree"]
}]
```

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

When you are creating a new database, you can also [fork an existing database](/docs/database-setup/forking-a-db) by specifing `db/fork` and `db/forkBlock`. 

### Root Auth

If you want to specify a root auth record for this database, meaning an auth record that has full access to all predicates and collection, you need to add a `db/root`. 

The object of `db/root` should an `_auth/id` that exists within the actual database, and that `_auth/id` still needs to have the relevant `_role`s and `_rule`s in order to have root access to the database. [IS THIS THE DEFAULT AUTH NOW???]

### Hosted Version
To create a blank database, login to the user interface on your localhost or the [FlureeDB Admin Portal (https://flureedb.flur.ee)](https://flureedb.flur.ee) online and click "Add Database" in the bottom left-hand side of the page. 

If you are using our hosted version, select "Blank" from the "Database Templates" options. 

If you are using the downloaded version, you can just pick a database name, and click "Create."

<p class="text-center">
    <img style="width: 500px; height: 300px" src="https://s3.amazonaws.com/fluree-docs/addDatabaseDownloaded.png" alt="A form from the Admin Portal, heading is `Create New Database`. There is one field in the form, one with the label `Database Name`">
</p>

Refresh, and then select your new database from the sidebar of the administrative portal. 