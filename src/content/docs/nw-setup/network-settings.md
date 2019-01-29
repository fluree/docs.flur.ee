##  Network Settings

Every time you launch a new instance of FlureeDB, you are creating a new network. Each network has a master database, which holds information about the other databases in the network. 

In version 0.9.1 and earlier and on the hosted version, the master database was called `f.master`. In later versions, it is called `$network`. 

The following predicates in the network collection are available after version 0.9.1. 

Key | Description
---|---
`dbs` | Reference to databases on this network.
`transactors` | Transactors auth identities for this network.
`consensus` | [Consensus type](/docs/network-setup/consensus-algorithms) for this network. Currently only `raft` available.
`id` | Unique network name.

Each master database should only have one `network` subject. If you add multiple `network` subjects, only the most recent one will be used when determining network configuration.