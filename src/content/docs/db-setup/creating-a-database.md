## Creating a Database

When creating a new database, you must specify a `db/id`. This id must be unique in your network and cannot be changed. A `db/id` begins with your network name followed by `/`. If a network already exists with that name, and you have permissions to add to that network, a new database will be created. 

If a network does not already exist with that name, a new network and new database will be created. 

The process for doing this is different, depending on your version. 

### Downloaded Version

----- NEED TO ADD NEW INFO HERE ~~

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