## Fluree Indexing

### Overview

_This guide is a work in progress, additional details will be added._

[Flakes](/guides/architecture/flakes) are placed into up to 4 indexes (+ optionally a Lucene index if full text searching is used). The [guide about Flakes](/guides/architecture/flakes) describes in more detail the anatomy of a Flake and how it is used, which can help greatly when understanding indexes. In summary, a Flake is a 6-tuple that contain a subject ID (`s`), precicate ID (`p`), object/value (`o`), a reference to the transaction/time it was created at (`t`), the boolean operation of adding or retracting the flake (`op`) and optional metadata (`m`).

Indexes are labeled based on the sort order of the Flakes. The four indexes are:
- `spot` - subject, predicate, object, time - contains all Flakes
- `psot` - predicate, subject, object, time - contains all Flakes
- `post` - predicate, object, subject, time - contains indexed Flakes
- `opst` - object, predicate, subject, time - contains reference Flakes

Every query is broken into one or more statements which is executed in order. Each query statement, depending on the missing variables within it, goes to one of the above indexes to fill in the result.

`spot` is used to find information about a subject quickly - and requires you know the subject ahead of time. `psot` is the column database index - and allow you to quickly find all subjects that have a specific predicate. `post` is only used Flakes with predicates defined as being indexed (defined as `index: true`, `unique: true`, along with a couple other cases). This allows you to quickly find an indexed value (object) for a known predicate. `opst` is only used for Flakes with a reference (join) predicate defined as `type: ref`. This index allows reverse graph crawls.

### spot Index

Simplifying a Flake to just `s`, `p` and `o`, consider the following 3-tuple Flakes which are sorted in `spo` order:

```all
[88 'company'   'ACME Inc"    ]
[26 'firstName' 'John'        ]
[26 'follows'    25           ]
[26 'lastName'  'Smith'       ]
[26 'username'  'jsmith'      ]
[25 'email'     'jane@doe.com']
[25 'firstName' 'Jane'        ]
[25 'lastName'  'Doe'         ]
[25 'username'  'janedoe'     ]
```

Note that the `s` value is sorted in descending order. This sort order means the most recently added subjects are always going to come first based on [how Fluree partitions data within a collection](/guides/architecture/flakes#flake-partitioning). Therefore, the query of `{"select": ["*"], "from": "person", "limit": 10}` would return the 10 most recently added people without requring any additional sorting.

You can see from the above Flakes that the following questions could be answered very quickly based on the corresponding match pattern:

---
**Question:**
Tell me everything about John Smith

Query:
```all
{"select": ["*"], 
 "from": 26}

 // or, could write as:
 {"select": ["*"], 
 "from": ["username", "jsmith"]}

```

Match Pattern:
```all
[26 ? ?]
```

Filtered Flakes:
```all
[26 'firstName' 'John'  ]
[26 'follows'    25     ]
[26 'lastName'  'Smith' ]
[26 'username'  'jsmith']
```

---
**Question:**
Tell me who John Smith follows

Query:
```all
{"select": ["?following"], 
 "where": [[26 "follows" "?following"]]}

 // or, could write as:
{"select": ["?following"], 
 "where": [[["username", "jsmith"], "follows", "?following"]]}

 // or, could write as:
 {"select": ["?following"], 
 "where": [["?john", "username", "jsmith"],
           ["?john", "follows",  "?following"]]}

```

Match Pattern:
```all
[26 'follows' ?]
```

Filtered Flakes:
```all
[26 'follows'    25] ;; John follows the subject id 25 (Jane)
```

### psot Index

The `psot` index helps answer questions related to finding subjects that contain a specific predicate.

While technically the Flake is not rearranged for any of the index sort orders, we rearrange it below to help illustrate.

```all
['company'   88 'ACME Inc"    ]
['email'     25 'jane@doe.com']
['firstName' 26 'John'        ]
['firstName' 25 'Jane'        ]
['follows'   26  25           ]
['lastName'  26 'Smith'       ]
['lastName'  25 'Doe'         ]
['username'  26 'jsmith'      ]
['username'  25 'janedoe'     ]
```

### post Index

The `post` index includes only flakes that whose predicate is `unique: true`, `index: true`, and also include all refs `type: ref`.


```all
['company'   'ACME Inc"     88]
['email'     'jane@doe.com' 25]
['firstName' 'Jane'         25]
['firstName' 'John'         26]
['follows'    25            26]
['lastName'  'Doe'          25]
['lastName'  'Smith'        26]
['username'  'janedoe'      25]
['username'  'jsmith'       26]
```

### opst Index

The `opst` index only contains refs, and is used to crawl the graph in reverse order.

```all
[25 'follows' 26]
```
