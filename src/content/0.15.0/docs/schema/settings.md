
### _setting

Every database contains a built-in `_setting` collection that defines several database configurations, including the consensus algorithm. You can change these accordingly.

Key | Description
---|---
`id` | The setting id. Currently the only setting id that is activated is the `_setting` entry with id `root`. 
`doc` | Optional docstring for the db.
`language` | By default, this is set to English. This is used for full-text search only. To see all available langauges and how to change languages, look [below](#languages). To see how to use full-text search, see the [analytical query section for full-text search](/docs/query/analytical-query#full-text-search).
`consensus` | Consensus type for this db. Currently only 'Raft' supported.
`txMax` | Maximum transaction size in bytes. Will default to the network db's value if not present.
`anonymous` | Reference to auth identity to use for anonymous requests to this db.
`ledgers` | Reference to auth identities that are allowed to act as ledgers for this database.

### Language

By default, all databases use English as a language. We support:

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

To see the language your database is currently set to, you can issue the query:

```all
{
  "select": [ "language" ],
  "from": ["_setting/id", "root"]
}
```

To change your language, simply set your language setting to the two-letter code for your desired language. For example, to set a database to Russian, you can issue the transaction:

```all 
[{
    "_id": ["_setting/id", "root"],
    "language": "ru" 
}]
```

Note that when you change a language, your full-text search may not immediately reflect this change. Your ledger will have to completely reindex any full-text enabled predicates, which may take a while with a larger dataset. When full-text re-indexing is complete, you will see a log `Add full text flakes to store complete for: X subjects.`. 

To see how to use full-text search, see the [analytical query section for full-text search](/docs/query/analytical-query#full-text-search).

\* Fluree Full-text search uses [Apache Lucene Smart Chinese Analyzer](https://lucene.apache.org/core/4_0_0/analyzers-smartcn/org/apache/lucene/analysis/cn/smart/SmartChineseAnalyzer.html) for Chinese and mixed Chinese-English text.