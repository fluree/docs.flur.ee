### Snapshotting a Ledger

Creating a snapshot takes all of the block data from a given ledger and AVRO encodes the data into a single, compact binary format. Creating a snapshot only creates a snapshot in a local ledger - it does not create snapshot on every transactor. 

Currently, you can only delete a ledger if you are using Fluree version 0.11.0 or higher and you are using the downloaded version of Fluree. In addition, there is currently no way to delete a ledger via the UI. You must use the API to delete a ledger.

### Creating a ledger from an Snapshot

Currently, you can only create a ledger from a snapshot if you are using Fluree version 0.11.0 or higher and you are using the downloaded version of Fluree. In addition, there is currently no way to create a snapshot via the UI. You must use the [new-db](/api/downloaded-endpoints/downloaded-examples#-new-db) endpoint to create a ledger from a snapshot.

The snapshot file that you are using to create your new ledger does not have to be from the same network. It can be from any Fluree instance. In addition, in the future we anticipate supporting the ability to create ledger from snapshots that are hosted remotely (i.e. in an S3 bucket).

To create a ledger from a snapshot, you can specifiy the following keys:

Key | Required | Description
-- | -- | --
db/id | yes | This follows the same requirements as creating a regular ledger. A network name must be only the following characters `a-z0-9-`, it must be followed by a `/`, and then the ledger name, which may also only contain `a-z0-9-`.
snapshot | yes | The file-path to your snapshot.*
snapshotBlock | no | Optional, the highest block number to copy from the original ledger. If none specified, the new datase copies all of the original ledger's blocks.


\* The snapshot file must be located inside of the storage directory of any of the transactors on the network. If the transactor processing the request does not have the file you specified, then the transactor will attempt to copy the specified file from the other servers in the network.

If your storage directory is `data/GHI/fdb/`, and your snapshot file is in `data/GHI/fdb/fluree/demo/snapshot/1573233945064.avro`, then you should simply provide `fluree/demo/snapshot/1573233945064.avro` to the request body. 

This is the same file path that is returned when creating a snapshot. However, as mentioned above, the snapshot file can come from any Fluree instance- it does not need to come from the same instance or network where the new ledger is being created. 
