
While Fluree is an immutable database, there are several features that provide some flexibility around hiding and removing data. 

### Deleting Data

There is the standard way of [deleting data](/docs/transact/deleting-data). Using this method, the data will not appear in a query against the current database, however the record of that data being added and deleted from the ledger are still present. 

Let's say, for example, you delete or overwrite a person's phone number. When you query for that person, their phone number (the one you deleted) will not appear. However, if you search for the history of all the updates made to that person, the phone number will still appear. If you search for that person's data as of a previous block, that phone number will still appear. 

If you do not need to remove the traces of a certain piece of deleted data, then this is a good option. Deleting data in this matter maintains the full integrity of your blockchain. 

### Hiding Flakes

**BETA FEATURE**

Another option is hiding flakes:

- Hidden data does not appear in queries of the current database.
- Hidden data does not appear in queries of past databases.
- The integrity of the blockchain is maintained. 

A `hide` request can have the following keys:

Key | Required? | Description
-- | -- | --
hide | yes | Subject id, unique two-tuple, or flake-format
block | no | Optional block or range of blocks to return, options for the format of this value are the same as for block or history queries (see in [history](/docs/query/history-query)).
local | no | Defaults to `true`. Whether to hide flakes locally or across the entire network. Currently hiding flakes is only supported for a single server. 

To hide flakes, you specify a given flake patten, such as `[null, "person/handle", "jdoe"]`. In this case, any flakes where the predicate is `person/handle`, and the object is `jdoe` will be matched, and hidden. To see all the flakes it would impact, you could issue the following query to the `/history` endpoint ([see example](/api/downloaded-endpoints/downloaded-examples#-history)). 

You can also add a `block` key-value pair, which limits the blocks hidden (this works in the same way as the block key in history queries).

```all
// to see flakes to be hidden, issue to /history 

{
    "history": [null, "person/handle", "jdoe"]
}
```

To see an example of `hide` request, see the [API section on /hide](/api/downloaded-endpoints/downloaded-examples#-hide).

When flakes are hidden, the original block files are renamed with a version tag, for example `000000000000005:v1.fdbd`. A new `000000000000005.fdbd` is created that omits the hidden flakes, as well as the original transaction `_tx/tx`. A single hide request can impact multiple blocks and a single block can have flakes hidden multiple times (i.e. `v2`, `v3`, etc). 

Hiding flakes cannot be reversed, so make sure to double-check before issuing the request. The only way to undo hidden flakes is to delete or rename the latest block and remove the `v1` from the file name of the original block. Please only do this if you understand the full repercussions.

Currently hiding flakes is only supported when using an open API.

### Purging Data

Purging data is not currently supported, but will allow users to completely remove any trace of a flake. Purging data is the most extreme option for mutable, and does NOT maintain the integrity of the blockchain.

### Snapshot No History

Creating a snapshot with no history does not impact the original ledger in any way. However, it does allow a user to create a new ledger from the snapshot that has no historical data. 

A snapshot with no history will have at least three blocks:

- `Genesis Block` with any system collections and predicates, as well as auths, roles, rules, functions, tags, and settings.
- `Schema Block` with any user-created collections and predicates, excluding any _collection/spec, _predicate/spec, and _predicate/txSpec.
- `Data Block` with any active flakes (i.e. flakes that have not been retracted). Depending on the size of your active flakes, this may be 1 or more blocks. After all other flakes are added to the ledger, we will then apply any smart functions to collection or predicate specs.

See [/snapshot](/api/downloaded-endpoints/downloaded-examples#-snapshot) to see how to do issue this request.

### Querying Across Ledgers

One common reason for wanting mutable data is to store personally identifiable information (PII). One common way for dealing with PII is by storing the PII in one ledger and non-sensitive data in a separate ledger. A single query can join data across multiple ledgers (see the [query syntax](/docs/query/analytical-query#prefixes-and-querying-across-sources) here). 

In this situation, the ledger with PII can be shared only with select users, and information that should be deleted can be handled in any of the ways listed above:
- hiding data
- purging data
- every x days, creating a new PII ledger using a no-history snapshot.