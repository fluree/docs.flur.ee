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

`spot` is used to find information about a subject quickly - and requires you know the subject ahead of time. `psot` is the "column database" index - and allow you to quickly find all subjects that have a specific predicate. `post` is only used for Flakes with predicates defined as being indexed (defined as `index: true`, `unique: true`, along with a couple other cases). This allows you to quickly find an indexed value (object) for a known predicate. `opst` is only used for Flakes with a reference (join) predicate defined as `type: ref`. This index allows reverse graph crawls, i.e. `spot` would be use to find everyone that Jane 'follows', but `opst` would be used to find everyone that 'follows' Jane. As a graph, relationships automatically can be traversed in both directions and the reverse direction is the job of `opst`.

### Immutable indexes
Fluree uses immutable data structures to do what it does efficiently - everything is shared, nothing is copied. When Fluree is working through slices of time, each time is just a delta sitting in top of some reference time - and the common Flakes are all shared via pointers in memory. 

Say you wanted to see the results of a query as of midnight for every day of the year, for the past 3 years. That is technically over 1,000 distinct databases you'd be querying. While you get the benefit of it seeming like you can query 1,000 distinct backups of your db, the machine is just representing deltas against some reference time - and a Flake is never duplicated. The actual impact of this might be a 5% increase in memory, not the 1,000x one might think it would require.

It is extradorinarily efficient, and an end-user should never have to concern themselves with querying a ledger as of current or historical times.

Once an index segment is loaded from disk and in memory, Fluree uses an immutable [AVL tree](https://en.wikipedia.org/wiki/AVL_tree) that will be pivoted and filtered based on time (`t`) and ultimately the user's permissions as controlled by SmartFunctions. Every alternate view into this index segment builds on top the closest calculated representation and only consumes the memory resources consisting of diffs in terms of pointers to Flakes. Representations that are not longer used are thrown away via an LRU cache, so Fluree won't consume more resources than it is given.


### spot Index

Simplifying a Flake to just `s`, `p` and `o`, consider the following 3-tuple Flakes which are sorted in `spo` order:

```all
;; s     p          o 
;;-----------------------------
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
// Fluree will lookup ["username", "jsmith"] and resolve it to s = 26
 {"select": ["*"], 
 "from": ["username", "jsmith"]}

 // or, if the subject ID was already known:
{"select": ["*"], 
 "from": 26}
```

Match Pattern:
```all
= [26 ? ?]
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
= [26 'follows' ?]
```

Filtered Flakes:
```all
[26 'follows'    25] ;; John follows the subject id 25 (Jane)
```

### psot Index

The `psot` index helps answer questions related to finding subjects that contain a specific predicate.

While technically the Flake is not rearranged for any of the index sort orders, we rearrange it below to help illustrate.

```all
;;   p       s     o 
;;-----------------------------
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
;;   p           o          s 
;;-----------------------------
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

You can see this index would be able to quickly find any predicate's value. When using a [Subject Identity](/guides/architecture/flakes#subject-identity) to reference a subject in Fluree this is the index that would be used. 

For example, if I was looking for the `s` value for the Subject Identity of `["usernamne", "janedoe"]`, the corresponding match pattern would be:

```all
= ['username' 'janedoe' ?]
```
You can see this index could quickly give the you answer: `s` = 25.

Range scans are also possible with this and an other index. Particularly useful here might be to find all 'firstName' values that start with "J". Such a match pattern would look like:

```all
start: >= ['firstName' 'J' ?] 
end:    < ['firstName' 'K' ?]
```
Here we've introduced a range scan. Technically every index match, even the `=` match we have been using previously, returns a range of matching values.

### opst Index

The `opst` index only contains Flakes with reference predicates (`type: ref`), and is used to crawl the graph in reverse order.

```all
;; o    p      s 
;;----------------
 [25 'follows' 26]
```

Our sample data set only contains a single ref Flake, but note that this index is a flip of the `s` and `o` values from our primary `spot` index. If we wanted to know who John Smith follows, the `spot` index gives us the quick answer that John (26) follows Jane (25). But what if I want to know who is following Jane, which is the reverse question. `opst` would answer this question quickly with the match expression:

```all
= [25 'follows' ?] ; Jane = 25, John = 26
```

You see this index quickly is able to tell us that the subject _id of `26` follows Jane, which is John. If Jane had multiple people following her there would be multiple values returned from this match.
