## Deleting a Database

### Downloaded Version

This applies to any FlureeDB version after 0.9.1. For previous versions, look at the [Hosted Version](#hosted-version) section.

To create a new database, we need to go to the [master database in the network](/docs/infrastructure/network-infrastructure#master-database), and issue a transaction deleting the relevant `db`. We can also perform this action through the user interface in the same manner as the [hosted version](#hosted-version). 

Note, this does not delete the actual files containing your database. In order to delete those files, you need to manually delete from your file system. If running in a decentralized network, your fellow network participants would also need to manually delete the relevant database. 

For example, to delete a database: 
```all
[{
    "_id": ["db/id", "fluree"],
    "_action": "delete"
}]
```

Note: When you delete any subject, including a `db`, all of the references for that subject are retracted. In this example, references to the deleted database in a network would be automatically retracted. 

### Hosted Version
To delete a blank database, login to the user interface on your localhost or the [FlureeDB Admin Portal (https://flureedb.flur.ee)](https://flureedb.flur.ee) online and look for the relevant database in the bottom left-hand side of the page. 

Select "Options" and click "Delete Database". 

<p class="text-center">
    <img style="width: 500px; height: 150px" src="https://s3.amazonaws.com/fluree-docs/databases.png" alt="A header, which says `Databases (0 available). Below, an icon of a cube, the word `default`, and a button to the right, which says `Options`">
</p>

Note: in the hosted version and downloaded version prior to 0.9.1, this **will completely delete your database**. You will not be able to retrieve it. Only delete if you are certain that you want to do so.