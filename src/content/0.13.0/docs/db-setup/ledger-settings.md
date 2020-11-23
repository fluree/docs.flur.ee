## Ledger Settings

Every ledger contains a built-in `_setting` collection that defines several ledger configurations, including the consensus algorithm. You can change these accordingly.

Key | Description
---|---
`id` | The setting id. Currently the only setting id that is activated is the `_setting` entry with id `root`. 
`doc` | Optional docstring for the db.
`language` | By default, this is set to English. This is used for full-text search only. To see all available langauges and how to change languages, look [below](#languages). To see how to use full-text search, see the [analytical query section for full-text search](/docs/query/analytical-query#full-text-search).
`consensus` | Consensus type for this db. Currently only 'Raft' supported.
`txMax` | Maximum transaction size in bytes. Will default to the network db's value if not present.
`anonymous` | Reference to auth identity to use for anonymous requests to this db.
`ledgers` | Reference to auth identities that are allowed to act as ledgers for this ledger.

### Language

By default, all ledgers use English as a language. We support:

- Arabic (`ar`)
- Bengali (`bn`)
- Chinese (`cn`)*
- English (`en`)
- French (`fr`)
- Hindi (`hi`)
- Indonesian (`id`)
- Brazilian Portuguese (`br`)
- Russian (`ru`)
- Spanish (`es`)

To see all supported languages, you can also query:

```all
{
    "select": {"?tag": ["*"]},
    "where": [["?tag", "_tag/id", "?id"]],
    "filter": [ "(re-find (re-pattern \"^_setting/language\") ?id)"]
}
```

To see the language your ledger is currently set to, you can issue the query:

```all
{
  "select": [ "language" ],
  "from": ["_setting/id", "root"]
}
```

To change your language, simply set your language setting to the two-letter code for your desired language. For example, to set a ledger to Russian, you can issue the transaction:

```all 
[{
    "_id": ["_setting/id", "root"],
    "language": "ru" 
}]
```

Note that when you change a language, your full-text search may not immediately reflect this change. Your ledger will have to completely reindex any full-text enabled predicates, which may take a while with a larger dataset. When full-text re-indexing is complete, you will see a log `Add full text flakes to store complete for: X subjects.`. 

To see how to use full-text search, see the [analytical query section for full-text search](/docs/query/analytical-query#full-text-search).

\* Fluree Full-text search uses [Apache Lucene Smart Chinese Analyzer](https://lucene.apache.org/core/4_0_0/analyzers-smartcn/org/apache/lucene/analysis/cn/smart/SmartChineseAnalyzer.html) for Chinese and mixed Chinese-English text.

### Consensus Algorithms

Consensus algorithms decide how new blocks are committed to a chain, as well as who can commit those blocks. Consensus algorithms have to balance the need for speed with the need for security. The choice of consensus algorithm depends on your use case, and whether your network is more or less trusted. 

Currently, Fluree supports the Raft consensus algorithm. The next algorithm we will release is the PBFT (Practical Byzantine Fault Tolerance) algorithm. The consensus algorithm you use is specified in the `_setting/consensus` predicate in each ledger (look at [ledger settings](/docs/ledger-setup/ledger-settings) for more information).

### Raft

[Raft](https://raft.github.io/raft.pdf) is a consensus algorithm that is designed to be easy to understand. Raft is well-suited for networks that are more trusted, and it is faster than PBFT. 

- Fault tolerance: `2n + 1` servers required, where `n` is a faulty server
- In Raft, a leader is elected, and that leader commits blocks until they become unresponsive for a period of time.  

Resources:

- [Raft paper](https://raft.github.io/raft.pdf)
- [Github Pages for Raft](https://raft.github.io/) for visualizations and links to more resources.
 
### PBFT 

[Practical Byzantine Fault Tolerance](http://pmg.csail.mit.edu/papers/osdi99.pdf) (PBFT) is a Byzantine fault tolerant algorithm designed for asnychronous environments (like a Fluree network or the internet).

- Fault tolerance: `3n + 1` servers required, where `n` is a faulty server
- PBFT also uses leader-election, and the leader is replaced in each transaction, or if an existing leader is unresponsive for a period of time. 

Resources:
- [PBFT paper](http://pmg.csail.mit.edu/papers/osdi99.pdf)

