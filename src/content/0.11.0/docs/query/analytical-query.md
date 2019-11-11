## Analytical Query

FlureeQL Analytical Queries are used to answer more sophisticated questions about your data. 

Analytical Queries can: 

- Query across multiple internal and external datasets
- Query across the same Fluree at different points in time
- Calculate aggregates
- Create complicated joins
- Group results by a single or multiple variables
- Use aggregate values calculated mid-query to filter results

We utilized concepts of logic programming and variable binding to give an immense amount of query potential that can largely be designed by you. Note that users 


This section covers analytical queries using the FlureeQL syntax. All FlureeQL queries in this section can be issued to an API endpoint ending in `/query`.

### Note: Breaking Changes
Note that to enhance performance and add new features, optional and filter clauses are now part of their own, respective, top-level key value pairs. A full explanation for how to write `optional` and `filter` clauses is below.

### Query Keys

FlureeQL Analytical Queries are also structured as a JSON object/map and may contain the following keys:

Key | Required? | Description
-- | -- | -- 
[select](#select-or-select-one-clauses) | yes (or selectOne or selectDistinct) | Analytical select statement, which can include aggregate functions, bound variables, and query graphs including bound variables. If more than one item is specified, the clause should be inside of square brackets `[ ]`. A `select` statement inside square brackets will return results inside of square brackets. 
[selectOne](#select-or-select-one-clauses) | yes (or select or selectDistinct) | Same as `select` statement, but returns only a single result. Result may be inside of square brackets if the select statement is inside square brackets.
[selectDistinct](#select-or-select-one-clauses) | yes (or select or selectOne) 
[where](#where-clause) | yes | A collection of tuples which contain matching logic and variable binding.
[optional](#optional-clauses) | no | A set of tuples, which are optional. In other words, if there is no match, `null` will be added to the matching pattern, rather than removing that pattern.
[filter](#filter) | no | A set of filters and optional filters.
`block` | no | Optional time-travel query specified by block number, duration, or wall-clock time as a ISO-8601 formatted string.
`limit` | no | Optional limit (integer) of results to include. Default is 100.
`orderBy` | no | Optional variable (string) or two-tuple where the first element is "ASC" or "DESC" and the second element is the variable name. For example, `"?favNums"` or `["ASC", "?favNums"]`
[groupBy](#group-by) | no | Optional variable or array of variables by  Note that depending on the query, group by can significantly slow down results. 
`prettyPrint` | no | Default false. Optional boolean. Whether to "pretty print" the results (as a map with keys) or as a vector without labels. This is only available when select is an array of values. Note that depending on the query, pretty print can significantly slow down results. 
[wikidataOpts](#wikidata-options) | no | Optional map of configurations for Wikidata queries, including specifying whether to return `distinct` results or whether to limit results.

### Where Clause
We suggest reading the [Where Clause](#where-clause) section before reading the [Select or Select One Clauses](#select-or-select-one-clauses) section. The where clause is the first part of the query that is resolved. 

Where clauses are a collection of four-tuples. Each tuple is comprised of a source, subject, predicate, and object. Multiple four-tuples strung together allow us to finely filter data, and connect our Fluree to outside triple-store databases. 

Value | Description
-- | -- 
`source` | Optional source. If no source included, assume current version database. See [Queries Across Sources](#queries-across-sources).
`subject` | Reference to a subject. Can be an subject id, unique two-tuple, a variable (a string that begins with `?`), or null.
`predicate` | Reference to a predicate. Can be either subject id, predicate name, or a variable (a string that begins with `?`).  Reverse references are *NOT* supported.
`object` | Reference to an object. Can be a value, subject id, unique two-tuple, a variable (a string that begins with `?`), or null.

The subject, predicate, and object can all be variables, and a variable needs to be a string that begins with `?`. 

The result of a tuple are the values that match that tuples pattern. For example, with the tuple: `["?person", "person/handle", "?handle"]`, the results would be a table.

?person | ?handle
-- | --
351843720888324 | dsanchez
351843720888323 | anguyen
351843720888322 | zsmith
351843720888321 | jdoe

Subsequent clauses are inner-joined with the previous results. For example, let's say that that next clause is `["?person", "person/favArtists", "?artist"]`. The results of that clause are:

?person | ?artist 
-- | -- 
351843720888324 | 404620279021570
351843720888321 | 404620279021571
351843720888322 | 404620279021569
351843720888323 | 404620279021570
351843720888321 | 404620279021570
351843720888323 | 404620279021571
351843720888321 | 404620279021569

To get the results of `[["?person", "person/handle", "?handle"], ["?person", "person/favArtists", "?artist"]]`, we inner-join these two tables. The `?person` variable is the only variable that matches across both sets of tuples, so that is the one that we look to for matches. The resulting inner join:

?person | ?handle | ?artist
-- | -- | --
351843720888324 | dsanchez | 404620279021570
351843720888323 | anguyen | 404620279021570
351843720888323 | anguyen | 404620279021571
351843720888322 | zsmith | 404620279021569
351843720888321 | jdoe | 404620279021571
351843720888321 | jdoe | 404620279021570
351843720888321 | jdoe | 404620279021569

Note that if the previous result table and the subsequent clause have no matching variables, this is the same as if every row in the previous results (table A) matched every row in the new results (table B). This would result in a table of `count of table A rows` * `count of table B rows`. 

To speed up your queries, you want to order your clauses so that there are matching variables in as many subsequent clauses as possible.

#### Intermediate Aggregate Values

In the middle of a where clause, you can bind a variable to an aggregate value. The aggregate is calculated as of that clause - it does NOT take into account the clauses after it. To bind an intermediate aggregate value, just specify a two-tuple with the first item as a variable and the second item as the aggregate function. For example:

```all
{"select": "?hash", 
 "where": [
    ["?s", "_block/number", "?bNum"],
    ["?maxBlock",  "#(max ?bNum)"],
    ["?s", "_block/number", "?maxBlock"],
    ["?s", "_block/hash", "?hash"]
]}
```

See [Select or selectOne Clauses](#select-or-select-one-clauses) for a list of valid aggregate variables. 

#### Query examples:

In the [Basic Schema](/docs/getting-started/basic-schema), we gave each person a set of favorite numbers. If we want to view all of `zsmith`'s flakes, which contain the values of his favorite numbers, our query could be:

```flureeql
{
    "select": "?nums",
    "where": [ ["$fdb", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": "?nums",
    "where": [ ["$fdb", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?nums
WHERE {
    ?person fd:person/handle    "jdoe";
            fd:person/favNums   ?nums.
}
```

Our where clause only contains one tuple, `["$fdb", ["person/handle", "zsmith"], "person/favNums", "?nums"]` within the main tuple (we'll see examples of multiple tuples later). There are four elements in this tuple: 

Tuple-Part | Example | Explanation
-- | -- | --
source | `$fdb` | This specifies the source from which we will retrieve the subsequent tuple.*
subject | `["person/handle", "zsmith"]` | The second element in a where-clause tuple represents the subject. Our subject is a two-tuple, `["person/handle", "zsmith"]`, but we can alternatively use a Zach Smith's `_id` or any two-tuple, which specifies a unique predicate and that predicate value. 
predicate | `"person/favNums"`| The third element (or second, if we omit a source) in a where-clause tuple is the predicate. In this case, the specified predicate is a `multi` predicate of type `int`. We can specify any type and cardinality of predicate.
object| `"?nums"`| The fourth element is for an object. Rather than specify an object, we bind any of the flake objects specified by subject, `["person/handle", "zsmith"]` and predicate `person/favNums` to the variable `"?nums"`. Variables have to begin with a `?`. These variables can be used in the `select` or `selectOne` statements. 

\* In the above example, because our source is our current database, we can optionally omit the source element (leaving us with the tuple: `[["person/handle", "zsmith"], "person/favNums", "?nums"]`]).

Alternatively, if we want to specify every flake that contains favorite numbers, we set the subject as a variable. 

```flureeql
{
    "select": "?nums",
    "where": [ ["$fdb", "?person", "person/favNums", "?nums"] ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": "?nums",
    "where": [ ["$fdb", null, "person/favNums", "?nums"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?nums
WHERE {
    ?person fd:person/favNums ?nums.
}
```

If the same variable is used in multiple tuples, it acts as a filter. For example, if we want to select any favorite numbers shared by both "jdoe" and "zsmith", we could bind the value of their favNums to the same variable. 

```flureeql
{
    "select": "?nums",
    "where": [  ["$fdb", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["$fdb", ["person/handle", "jdoe"], "person/favNums", "?nums"] ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": "?nums",
    "where": [  ["$fdb", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["$fdb", ["person/handle", "jdoe"], "person/favNums", "?nums"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?nums
WHERE {
    ?person     fd:person/handle    "jdoe";
                fd:person/favNums    ?nums.
    ?person2    fd:person/handle    "zsmith";
                fd:person/favNums   ?nums.
}
```

### Select or Select One Clauses

When submitting an analytical query, you need to specify either a `select` or a `selectOne` clause. A select clause can include aggregate functions, bound variables, and query graphs including bound variables. If more than one item is specified, the clause should be inside of square brackets `[ ]`.  

A select statement inside square brackets will return results inside of square brackets. One without square brackets (only valid when there is a single item in the select clause) will return the result outside of square brackets.

A selectDistinct clause is the same as a select clause, except that it only returns distinct results. It is important to note that all analytical queries are issued against the FULL result set. So for example, if your select statement is `(count ?favNums)`, it will count all `?favNums`, even repeats. If you issue a query like `(sample 5 ?favNums)`, if you use `selectDistinct`, the results may return less than 5 values.

A selectOne clause is the same as a select clause, except only one result is returned. 

If we bind more than one variable in our where clause, we can list multiple select variables. For example:

```flureeql
{
  "select": ["?nums1", "?nums2"],
  "where": [ [["person/handle", "zsmith"], "person/favNums", "?nums1"], 
  [["person/handle", "jdoe"], "person/favNums", "?nums2"] ]
}
```


```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?nums1", "?nums2"],
    "where": [  ["$fdb", ["person/handle", "zsmith"], "person/favNums", "?nums1"], 
                ["$fdb", ["person/handle", "jdoe"], "person/favNums", "?nums2"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?nums1 ?nums2
WHERE {
    ?person     fd:person/handle    "jdoe";
                fd:person/favNums    ?nums1.
    ?person2    fd:person/handle    "zsmith";
                fd:person/favNums   ?nums2.
}
```

Any variables bound in the where clauses can be used in conjunction with the following aggregate functions in your select or selectOne clauses. 

Function | Description
-- | --
`avg` | Returns the average of the values. 
`count` | Returns a count of the values.  
`count-distinct` | Returns a count of the distinct values.  
`distinct` | Returns all of the distinct values. 
`max` | Returns the largest value. 
`median` | Returns the median of the values. 
`min` | Returns the smallest value. 
`rand` | Returns a random value from the specified values. 
`sample` | Given a sample size and a set of values, returns an appropriately sized sample, i.e. `(sample 2 ?age)` returns two ages from values bound to the variable, `?age`.
`stddev` | Returns the standard deviation of the values. 
`sum` | Returns the sum of the values. 
`variance` | Returns the variance of the values. 


In order to see the sum of all of Zach Smith's favorite numbers, we could query:

```flureeql
{
  "selectOne": "(sum ?nums)",
  "where": [ [["person/handle", "zsmith"], "person/favNums", "?nums"]] 
}
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "selectOne": "(sum ?nums)",
  "where": [ [["person/handle", "zsmith"], "person/favNums", "?nums"]] 
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT (SUM(?favNums) AS ?sum)
WHERE {
    ?person     fd:person/handle    "zsmith";
                fd:person/favNums    ?nums.
}
```

If we want to see a sample of size, 10, from all the favorite numbers in the database, we could issue the query: 

```flureeql
{
  "select": "(sample 10 ?nums)",
  "where": [ [null, "person/favNums", "?nums"]] 
}
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": "(sample 10 ?nums)",
  "where": [ [null, "person/favNums", "?nums"]] 
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT (SAMPLE(10 ?favNums) AS ?sample)
WHERE {
    ?person     fd:person/handle    "zsmith";
                fd:person/favNums    ?nums.
}
```

If one of your bound variables returns a subject id, you can display the graph for that subject in your results. In order to do this, you need to include a map in your select clause where the key for that map is the bound variable name. The value for the key should be all the predicates that you want to display. Just like a regular query, you can return relationships by crawling the graph (the below example demonstrates this).

```flureeql
{
  "select": {"?artist": ["*", {"person/_favArtists": ["*"]}]},
  "where": [ [null, "person/favArtists", "?artist"]] 
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": {"?artist": ["*", {"person/_favArtists": ["*"]}]},
  "where": [ [null, "person/favArtists", "?artist"]] 
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
Not supported
```

### Optional Clauses

Optional clauses are structured the same as where clauses. The difference is that rather than performing an inner-join to determine the results, we perform a left outer join. In other words, any rows from the initial table that don't match in the optional clauses's table are joined with `null`s.

Here is a query that does not have any optional clauses:

```all
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"], 
                ["?person", "person/favNums", "?num"] ]
}
```

Let's say the results of the where clause are as follows:

?handle | ?num
-- | --
Alice | 7
Alice | 42 
Bob | 2
Bob | 9
Bob | 42

If there were any people in our database *without* favorite numbers, they would not appear in this query. However, if we want to preserve all `handle`s, even ones belonging to people without favorite numbers, we could issue this query:

```all
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"] ],
    "optional": [["?person", "person/favNums", "?num"]]
}
```

The results of the above query might look below. Where Jack and Jill are still in our result set, even though they don't have favorite numbers.

?handle | ?num
-- | --
Alice | 7
Alice | 42 
Bob | 2
Bob | 9
Bob | 42
Jack | null
Jill | null

You could have as many optional clauses as you like, but note that ORDER matters! So think through those joins before writing out your query.

### Filters
Currently, all filter functions should be written using Clojure. The following are all of the accepted filter functions:

Name | Example | Explanation
-- | -- | -- 
> | `(> 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/%3E" target="_blank">Greater than</a>
>= | `(>= 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/%3E=" target="_blank">Less than</a>
< | `(< 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/%3C" target="_blank">Less than</a>
<= | `(<= 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/%3C=" target="_blank">Less than or equal to</a>
= | `(= 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/=" target="_blank">Equal to</a>
+ | `(> 11 (+ 10 ?nums))` | <a href="https://clojuredocs.org/clojure.core/+" target="_blank">Add</a>
- | `(- 11 (+ 10 ?nums))` | <a href="https://clojuredocs.org/clojure.core/-" target="_blank">Subtract</a>
* | `(> 11 (* 10 ?nums))` | <a href="https://clojuredocs.org/clojure.core/*" target="_blank">Multiply</a>
/ | `(> 11 (/ 10 ?nums))` | <a href="https://clojuredocs.org/clojure.core/_fs" target="_blank">Divide</a>
and | `(and (> 10 ?nums1) (< 100 ?nums2))` | <a href="https://clojuredocs.org/clojure.core/and" target="_blank">And</a>
or | `(or (> 10 ?nums1) (< 100 ?nums2))` | <a href="https://clojuredocs.org/clojure.core/or" target="_blank">Or</a>

Specify all filters in the `filter` key on the top-level of the query.

```all
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"], 
                ["?person", "person/favNums", "?num"] ],
    "filter": [ "(> 10 ?num)"]
}
```

Filters can be optional by specifying a two-tuple where the first item is "optional", and the second item is the filter function. If a filter is optional, like `(> 10 ?num)`, then any row where `?num` is `null` will be ignored and will not be filtered out. On the other hand, any row where `?num` is greater or equal to 10 will be removed.

```all
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"] ],
    "optional": [  ["?person", "person/favNums", "?num"]],
    "filter": [ ["optional", "(> 10 ?num)"] ]
}
```

### Group By
You can group by any variable or variables that appears in your where clause. Grouping is specified in the top-level `groupBy` key. This can either be a single variable, i.e. `?person` or a vector of variables, i.e. `["?person", "?handle"]`.

```all
{
    "select":  "?handle",
    "where": [  ["?person", "person/handle", "?handle"] ],
    "groupBy": "?person"
}
```


```all
{
    "select":  "?handle",
    "where": [  ["?person", "person/handle", "?handle"] ],
    "groupBy": ["?handle", "?person"]
}
```

You can use `groupBy` in conjunction with `orderBy`. For example, the below query will order the results by the second variable in the grouping. 

```all
{
    "select":  "?handle",
    "where": [  ["?person", "person/handle", "?handle"] ],
    "groupBy": ["?handle", "?person"],
    "orderBy": "?person"
}
```

Example results for the above query:

```all
{
  "[\"jdoe\" 351843720888321]": [
    "jdoe"
  ],
  "[\"zsmith\" 351843720888322]": [
    "zsmith"
  ],
  "[\"anguyen\" 351843720888323]": [
    "anguyen"
  ],
  "[\"dsanchez\" 351843720888324]": [
    "dsanchez"
  ],
  "[\"jdoe2\" 351843720888325]": [
    "jdoe2"
  ]
}
```

### Queries Across Sources

Each tuple in a where clause is essentially a triple with an added piece of information at the beginning (source) and at the end (options). This tuple structure allows users to query across multiple points in time and across data sources. Currently, we support querying across Fluree and Wikidata. In the future, we will support additional data sources, as well as the ability to query across multiple Fluree databases. 

Source | Description 
-- | --
`$fdb` | Default source. The current version of a given Fluree. Can be omitted. 
`$fdb3` | Fluree at a specified block, for example `$fdb10` is a given database at block 10. 
`$fdb2019-03-14T20:59:36.097Z` | Fluree at a specified ISO-8601 formatted wall clock time. 
`$fdbPT5M` | Fluree as of a specified ISO-8601 formatted duration ago. For example, `$fdbPT5M` is as of 5 minutes ago.  
`$wd` | Wikidata 

For example, if we wanted to see whether "zsmith" as of block 5 shared a favorite number with "zsmith" as of block 4.

We are currently at block 4, so we would first need to issue a transaction. We can give `zsmith` an additional favorite number. 

```all
[{
  "_id": ["person/handle", "zsmith"],
  "favNums": [100]
}]
```

Now, we can issue a query showing which numbers were his favorites in BOTH block 4 and block 5. This means the results should exclude the number 100. 

```flureeql
{
    "select": "?nums",
    "where": [ ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], ["$fdb5", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}
```
```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": "?nums",
    "where": [ ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], ["$fdb5", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?nums
WHERE {
    ?person     fd4:person/handle   "jdoe";
                fd4:person/favNums  ?nums.
                fd5:person/favNums  ?nums.
}
```

### WikiData Examples

#### Artist Example 

Using the [Basic Schema](/docs/getting-started/basic-schema), we will be able to use analytical queries to connect up a `person/favArtists` (stored in Fluree) to their artworks (stored in Wikidata).

We can retrieve the names of artworks created by jdoe's favorite artists. Our full query is below. We will discuss each of the where clause tuples individually. 

```flureeql
{
    "select": ["?name", "?artist", "?artwork", "?artworkLabel"],
    "where": [[["person/handle", "jdoe"], "person/favArtists", "?artist"],
              ["?artist", "artist/name", "?name"],
              ["$wd", "?artwork", "wdt:P170", "?creator"],
              ["$wd", "?creator", "?label", "?name"]]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?name", "?artist", "?artwork", "?artworkLabel"],
    "where": [[["person/handle", "jdoe"], "person/favArtists", "?artist"],
              ["?artist", "artist/name", "?name"],
              ["$wd", "?artwork", "wdt:P170", "?creator"],
              ["$wd", "?creator", "?label", "?name"]]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?name ?artist ?artwork ?artworkLabel
WHERE {
    ?person     fd:person/handle        "jdoe";
                fd:person/favArtists    ?artist.
    ?artist     fd:artist/name          ?name.
    ?artwork    wdt:P170                ?creator.
    ?creator    wd:?label                ?name.
}
```

Tuple | Explanation
-- | --
`[["person/handle", "jdoe"], "person/favArtists", "?artist"]` | Retrieves all of the subject, `["person/handle", "jdoe"]`'s favorite artists (`"person/favArtists"`) and it binds them to the variable `?artist`.
`["?artist", "artist/name", "?name"]` | Looks up `artist/name` and binds to the variable `?name`.
`["$wd", "?artwork", "wdt:P170", "?creator"]` | Use the [Wikidata property, creator](#https://www.wikidata.org/wiki/Property:P170) to bind `?artwork` and `?creator`
`["$wd", "?creator", "?label", "?name"]` | Limits the scope of our `?creator`s (and thus `?artworks`) based on `?creator`s whose `?label` matches `?name`

#### Movie Example

We can also use Wikidata to retrieve the narrative locations of users' favorite movies with the following query:

```flureeql
{
"select": ["?handle", "?title", "?narrative_locationLabel"],
"where": [ ["?user", "person/favMovies", "?movie"],
["?movie", "movie/title", "?title"],
["$wd", "?wdMovie", "?label", "?title"],
["$wd", "?wdMovie", "wdt:P840", "?narrative_location"],
["$wd", "?wdMovie", "wdt:P31", "wd:Q11424"],
["?user", "person/handle", "?handle"]]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
"select": ["?handle", "?title", "?narrative_locationLabel"],
"where": [ ["?user", "person/favMovies", "?movie"],
["?movie", "movie/title", "?title"],
["$wd", "?wdMovie", "?label", "?title"],
["$wd", "?wdMovie", "wdt:P840", "?narrative_location"],
["$wd", "?wdMovie", "wdt:P31", "wd:Q11424"],
["?user", "person/handle", "?handle"]]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?handle ?title ?narrative_locationLabel
WHERE {
  ?user     fdb:person/favMovies    ?movie.
  ?movie    fdb:movie/title       ?title.
  ?wdMovie  wd:?label             ?title;
            wdt:P840               ?narrative_location;
            wdt:P31               wd:Q11424.
  ?user     fdb:person/handle       ?handle.
}
```

To learn more about querying Wikidata, visit their [documentation](#https://www.wikidata.org/wiki/Wikidata:Introduction). Also, stay tuned for our [analytical query lessons](/lessons) coming soon!

Note that cross-database queries can take some time. 

### Wikidata Options

By default, any Wikidata queries are run with a limit of 100, an offset of 0, English as the label language, and returning only distinct values. Any of these options can be overwritten by specifying Wikidata options in the `wikidataOpts` key-value pair in an analytical query. 

`wikidataOpts` can be a map with any of the following keys:

Key | Description
-- | --
distinct | Default is true. Boolean, which specifies whether to include only distinct Wikidata results.
limit | Default is 100. Number of results (integer) to return for each query.
offset | Default is 0. Number of results to skip before returning the results.  
language | Default is "en". See [Wikidata language codes](https://www.wikidata.org/wiki/Help:Wikimedia_language_codes/lists/all) for other options.

Below is an example of using `wikidataOpts` in a query. In SPARQL, you cannot currently specify Wikidata options other than `language` (see [language labels](/docs/query/sparql#language-labels))

```flureeql
{
    "select": ["?name", "?artist", "?artwork"],
    "where": [
        [["person/handle", "jdoe"], "person/favArtists", "?artist"],
        ["?artist", "artist/name", "?name"],
        ["$wd", "?artwork", "wdt:P170", "?creator"],
        ["$wd", "?creator", "?label", "?name"]
        ],
    "wikidataOpts": {"limit": 5, "distinct": false}
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?name", "?artist", "?artwork"],
    "where": [
        [["person/handle", "jdoe"], "person/favArtists", "?artist"],
        ["?artist", "artist/name", "?name"],
        ["$wd", "?artwork", "wdt:P170", "?creator"],
        ["$wd", "?creator", "?label", "?name"]
        ],
    "wikidataOpts": {"limit": 5, "distinct": false}
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT DISTINCT ?name ?artist ?artwork ?artworkLabel
WHERE {
    ?person     fd:person/handle        "jdoe";
                fd:person/favArtists    ?artist.
    ?artist     fd:artist/name          ?name.
    ?artwork    wdt:P170                ?creator.
    ?creator    wd:?label                ?name.
}
LIMIT 5
```
