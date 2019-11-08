### Archiving a Database

Creating an archiving takes all of the block data from a given database and AVRO encodes the data into a single, compact binary format. Creating an archive only creates an archive in a local database - it does not create archives 

Currently, you can only delete a database if you are using Fluree version 0.11.0 or higher and you are using the downloaded version of Fluree. In addition, there is currently no way to delete a database via the UI. You must use the API to delete a database.

### Creating a Database from an Archive

Currently, you can only create a database from an archive if you are using Fluree version 0.11.0 or higher and you are using the downloaded version of Fluree. In addition, there is currently no way to create an archive via the UI. You must use the [new-db](/api/downloaded-endpoints/downloaded-examples#-new-db) endpoint to create a database from an archive a database.

The archive file that you are using to create your new database does not have to be from the same network. It can be from any Fluree instance. In addition, in the future we anticipate supporting the ability to create database from archives that are hosted remotely (i.e. in an S3 bucket).

To create a database from an archive, you can specifiy the following keys:

Key | Required | Description
-- | -- | --
db/id | yes | This follows the same requirements as creating a regular database. A network name must be only the following characters `a-z0-9-`, it must be followed by a `/`, and then the database name, which may also only contain `a-z0-9-`.
archive | yes | The file-path to your archive.*
archiveBlock | no | Optional, the highest block number to copy from the original database. If none specified, the new datase copies all of the original database's blocks.


\* The archive file must be located inside of the storage directory of any of the transactors on the network. If the transactor processing the request does not have the file you specified, then the transactor will attempt to copy the specified file from the other servers in the network.

If your storage directory is `data/GHI/fdb/`, and your archive file is in `data/GHI/fdb/fluree/demo/archive/1573233945064.avro`, then you should simply provide `fluree/demo/archive/1573233945064.avro` to the request body. 

This is the same file path that is returned when creating an archive. However, as mentioned above, the archive file can come from any Fluree instance- it does not need to come from the same instance or network where the new database is being created. 
