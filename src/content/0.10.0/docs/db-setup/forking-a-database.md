
## Forking a ledger

COMING SOON

<!-- Forking a ledger is creating a copy of a certain ledger up to a point in time. 

### Downloaded Version

This applies to any Fluree version after 0.9.1. Forking was not enabled in downloadable versions 0.9.1 and earlier. 

To fork a ledger, we need to go to the [master ledger in the network](/docs/infrastructure/network-infrastructure#master-ledger), and issue a transaction creating a new subject in the `db` collection. 

All of the `db` predicates are listed below.

Key | Description
---|---
`id` | Main ledger id, should never be changed.
`alias` | Alias name for this db, can be changed but must be unique.
`root` | Root auth id
`fork` | If this ledger is a fork of an existing db, include the db identity.
`forkBlock` | If this ledger is a fork of an existing db, the block at which the fork happened (inclusive).
`doc` | Optional docstring describing this ledger.
`active` | If active is set to false, will not allow any new transactions/updates to this db. Default is true.
`archived` | If true, this ledger is archived and only blocks can be retrieved. Defaults false.

When forking, we need to specify a fork and optionally, a forkBlock. The fork should be either the db id or alias. Anyone who has permission to create a new ledger in the master ledger, has permission to fork any ledger. 

You will also want to add your forked ledger to a [relevant network](/docs/network-setup/network-settings). For example:

```
[{
    "_id": "db$dbone",
    "id": "dbone",
    "alias": "one",
    "doc": "A fork of ledger onehalf up to block 10, inclusive.",
    "fork": "onehalf",
    "forkBlock": 10
},
{
    "_id": ["network/id", "myNet"],
    "dbs": ["dbs$dbone"]
}]
```

### Hosted Version

To create a blank ledger, login to the user interface on your localhost or the [Fluree Admin Portal (https://flureedb.flur.ee)](https://flureedb.flur.ee) online and click "Add ledger" in the bottom left-hand side of the page. 

You can fork any ledger in the "ledger Templates" section. As of December 2018, only one ledger is available to fork, "Movie ledger", which contains about 5,000 movies with accompanying credit, actor, etc information.

<p class="text-center">
    <img style="width: 500px; height: 300px" src="https://s3.amazonaws.com/fluree-docs/forkMovieDb.png" alt="A form from the Admin Portal, heading is `Create New ledger`. There are two fields in the form, one with the label `ledger Name` and the other with the label `ledger Templates.` `Movie ledger` is selected as the option in `ledger Templates.`">
</p>


Refresh, and then select your new ledger and the user "root" from the sidebar of the administrative portal.  
 -->
