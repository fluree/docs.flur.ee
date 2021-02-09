## What is Fluree?

Fluree is an immutable, time-ordered ledger. 

Each block is an atomic update that is cryptographically signed to prevent tampering and linked to the previous block in the chain.

<img class="medium-img float-left" src="https://s3.amazonaws.com/fluree-docs/blockContents.png" alt="A series of 5 blocks stacked on top of each other vertically. The middle block is deconstructed to show: the previous block's hash, the current block's hash, data, a timestamp, and the block index">

You can run Fluree privately or as part of a federated network.

A private Fluree is a group of ledgers run on a single server, hosted either by you or by Fluree for you. 

A federated Fluree is a group of ledgers shared by a network. In addition to all the features of a private instance of Fluree, running Fluree federated provides additional data integrity. With a federated Fluree, the network uses an agreed-upon consensus algorithm to reach a shared state.  

You can find more in-depth information about both individual ledger [infrastructure](/guides/infrastructure/file-system) and [network infrastructure](/guides/infrastructure/network-infrastructure) in later sections. 

## Data Model

This section is background on the way data is conceptualized in any given ledger in Fluree. This sections covers topics like flakes, blocks, and the subject-predicate-object model. 

### Overview 

When a Fluree ledger is initialized, a block 1 is created. This block contains certain important metadata, including all the [System Collections](/docs/schema#all-system-collections) needed to make ledger features work.

A ledger at a given block is a ledger. Every block corresponds to a moment in time, and the data in a block consists of a group of atomic updates made to that ledger at a given point in time. 

These atomic updates are very specially formatted logs. Each updates is a called a [flakes](#flakes). Flakes are a specific fact at a specific point in time about a specific subject. No two flakes are the same.

Below is an example of ledger block. We will go into detail about the contents of the transaction response in the [Block Metadata](#block-metadata) section. However, below you can see that, among other things, every block contains a hash, a timestamp, and the size of the block data (block-bytes). This block also contains an array of nine flakes. These flakes contain all the data that is added, updated, or deleted in block 5, as compared to block 4. 

```all
{
  "tempids": {
    "chat$1": 4299262263297
  },
  "block": 5,
  "hash": "2ae4ca39e8d1e5291b574370dedf36bcdeaf649ad627f826be971a84e636c968",
  "txid": "a9b5c6ade8782eea1a91b6ea2c7b1461bf848193a35bb65f022be09cca287a44",
  "fuel-remaining": 999999987906,
  "authority": null,
  "signature": "1b3045022100f2fd74db3a95b66e3189effbf75ba7356fc501aa94ea01f0061ceb1d26689706022036aff56bad1f7bf7fd9a104781254a57c91070e4c17bec8e550cc3286b6020d5",
  "time": "17.91ms",
  "fuel": 1831,
  "auth": 25769803776,
  "tx-entid": -327680,
  "tx": "[{\"_id\":\"chat\",\"message\":\"This is a sample chat from Jane!\",\"person\":[\"person/handle\",\"jdoe\"],\"instant\":\"#(now)\"}]",
  "status": 200,
  "block-bytes": 607,
  "timestamp": 1535469747975,
  "flakes": [
     [ 4299262263297, 1002, "This is a sample chat from Jane!", -327680, true, null ],
     [ 4299262263297, 1003, 4294967296001, -327680, true, null ],
     [ 4299262263297, 1004, 1535469747977, -327680, true, null ],
     [ -327680, 1, "2ae4ca39e8d1e5291b574370dedf36bcdeaf649ad627f826be971a84e636c968", -327680, true, null ],
     [ -327680, 2, "f0f147cacff392fe8d487f16a03910de353b9ee8033cdd041266ee282c1c1aa0", -327680, true, null ],
     [ -327680, 5, 1535469747975, -327680, true, null ],
     [ -327680, 100, "a9b5c6ade8782eea1a91b6ea2c7b1461bf848193a35bb65f022be09cca287a44", -327680, true, null ],
     [ -327680, 101, 25769803776, -327680, true, null ],
     [ -327680, 103, 1535469747972, -327680, true, null ]
  ]
}
```
We can think of the ledger at any given point in time as the combination of all the flakes up until that point. For example, the ledger at block 5 is the result of "playing all of the flakes forward" from blocks 1 through 5. 

The below image shows you a simplified representation of five blocks worth of flakes. In the first two blocks, we create our simple schema (a user with a user/handle and a user/chat). In block 3, we add a new user named 'bob' and a chat message for Bob. In block 4, we create a new user with the handle 'jane', and finally in block 5, we attribute a chat to 'jane'.

<p class="text-center">
    <img style="width: 600px; height: 220px" src="https://s3.amazonaws.com/fluree-docs/flakeLogBlocks1-5.png" alt="A table with the columns: 'subject', 'predicate', 'object', 'block', and 'add.' There are seven rows in this table, and each contains sample data, which is explained in the accompanying paragraph">
</p>

Rather than storing a copy of the entire ledger in each block, every block contains only flakes, or facts about entities, that are different as of that block.

### Collections and Predicates
A [collection](/docs/schema/collections) is analogous to a relational database table. Every time you want a new type of item in your ledger, you would create a new collection. For example, collections in your ledger might be person, company, and city. 

Every collection has [predicates](/docs/schema/predicates). Predicates are analogous to relational ledger columns. The features of a collection are its predicates. For example, the person collection might have the following predicates: person/firstName, person/lastName, and person/age. 

Together, collections, and predicates make up a Fluree schema. 

### Subject-Predicate-Object Model

Every item in the ledger is called a `subject`. When you create a new subject, you need to specify what collection it belongs to (for example, a person). When you create that subject, we automatically generate an `_id` for it. This `_id` is a long integer, which uniquely references that subject in the ledger. 

In addition to an `_id`, subjects can have an unlimited number of `predicate`s. For example, when you create your person, you might give them a person/firstName, person/lastName, and person/age - those are the predicates. 

In addition to subjects and predicates, we have something called objects in Fluree. The object is the value of the subject-predicate combination. So, a subject could be `17592186044440` (a subject `_id`), a corresponding predicate could be `person/firstName`, and a corresponding object could be `Mike`. 

All together, a subject, predicate, and object together is called a triple. These triples, or [RDF triples](https://www.w3.org/TR/rdf-concepts/), are a standard structure for data, which allows Fluree to be compatible with other triple-store databases. You can also take the triples created by the Fluree transactor and ingest them into a query engine that can interpret triples. 

### Flakes

Flakes are modified RDF triples. Because each block in a Fluree represents the ledger at a different point in time, flakes not only contain a subject-object-predicate, but also  a time `t`, and a boolean (true/false). The sixth element of a flake is a JSON-object for metadata. It is not fully implemented. 

The `t` is a negative integer. `t` is a more granular notion of time than a block. A block with multiple transactions will have multiple `t`s. Each block has a [metadata flake](#block-metadata) with the predicate `_block/number` that links a `t` with a positive block integer. 

For example, if in block 3, we add a person with a `person/firstName` of `Mike`, that triple is true as of a given point in time. If in block 10, we change `Mike` to `Michael`, our transaction would create two flakes: the first flake would retract the current value:

Part | Value 
-- | ---
Subject | Relevant subject id
Predicate | person/firstName
Object | Mike
Time | - 15
Boolean | False
Metadata | {}

The second flake would assert the new fact: 

Part | Value 
-- | ---
Subject | Relevant subject id
Predicate | person/firstName*
Object | Michael
Time | - 15
Boolean | True
Metadata | {}

If you issue a [block query](/docs/query/block-query), you can see all the flakes issued at a given block.  

\* Really, when looking at a flake, the predicate name would not be displayed. Rather the predicate, like every other item in a Fluree ledger is a subject, and it has a subject id. So that predicate's subject id appears in the flake, not the name. 

### Block Metadata

After the user issues a transaction, a Fluree transactor creates new [flakes](#flakes), which represent the changes made to the ledger at that given point in time. In addition to those flakes, there are also new flakes, which represent the metadata for that block (this is distinct from the sixth element of a flake, where metadata for an individual flake will be stored - not currently implemented). 

This metadata is also in the form of flakes, and it is recorded in the ledger in the same way as any other information. The difference is that metadata flakes are automatically generated and cannot be edited. Some custom metadata can be [included in your transaction](/docs/transact/basics#adding-custom-metadata). 

Metadata for each transaction is stored in the `_block` and `_tx` collections. Both `_block` and `_tx` are search-able in the same way as any other information in the ledger. 