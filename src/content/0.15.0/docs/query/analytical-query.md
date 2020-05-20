## Analytical Query

FlureeQL Analytical Queries are used to answer more sophisticated questions about your data. 

Analytical Queries can: 

- Query across multiple internal and external datasets
- Query across the same Fluree at different points in time
- Calculate aggregates
- Create complicated joins
- Group results by a single or multiple variables
- Use aggregate values calculated mid-query to filter results

We utilized concepts of logic programming and variable binding to give an immense amount of query potential that can largely be designed by you. 

This section covers analytical queries using the FlureeQL syntax. All code examples are shown in FlureeQL. All of these queries can be issued through the API or the user interface (select `FlureeQL` in the sidebar, then make sure `Query` is selected in the top-right, as well as in the dropdown). 

To issue these queries using the API, see `/query` in [Fluree Anywhere](/api/downloaded-endpoints/downloaded-examples#-query) or [Fluree On-Demand](/api/hosted-endpoints/hosted-examples#-api-db-network-db-query) (you may have to change versions). You can also issue multiple queries at once using the `/multi-query` endpoints in [Fluree Anywhere](/api/downloaded-endpoints/downloaded-examples#-multi-query) or [Fluree On-Demand](/api/hosted-endpoints/hosted-examples#-api-db-network-db-multi-query) (you may have to change versions)

### Query Keys

FlureeQL Analytical Queries are also structured as a JSON object/map and may contain the following keys:

Key | Required? | Description
-- | -- | -- 
[select, selectOne, or selectDistinct](#select-key) | yes | `select` returns all relevant results, `selectOne` returns one result, and `selectDistinct` only returns unique results. [See select key](#select-key)
[where](#where-key) | yes | A collection of tuples which allow for complex filtering of data. 
`block` | no | Optional block specified by block number, duration, or wall-clock time as a ISO-8601 formatted string. This applies a block to every part of the query that does not have a block specified. It follows the same syntax as the [block key in basic queries](/docs/query/overview#block-key). 
`prefixes` | no | Optional map of outside sources. See [prefixes](#prefixes-key).
`vars` | no | Optional map of variable bindings. See [vars](#vars-key).
`opts` | no | Optional map where options like `limit`, `orderBy`, `pretty-print`, and `wikipediaOpts` can be specified. See [opts](#opts-key).

### Select Key

`select` returns all relevant results, `selectOne` returns one result, and `selectDistinct` only returns unique results. Exactly one of the select keys is required. 

Item | Example | Description 
-- | -- | --
Variable | `"?apple"` | Variables are declared in the `where` clause
Variable Select-Array | `{"?var1": ["*"]}` <br/>  <br/> `{"?var1": ["*", {"chat/person": ["*"]}]}` | A map where the key is a valid variable and the value is a valid [select-array](/docs/query/overview#select-key). This only works when the variable is bound to subject ids. 
Aggregate variable | `"(avg ?nums)"` | Any valid variables can be wrapped in an aggregate function. All valid aggregate functions are listed in the table below. 

The value for the select key can be any of the items in the following table. Your select key can be multiple of these select items. In the case that it is multiple items, these items should be wrapped in `[ ]`. For example `[ "?var1", "(sum ?var2)", {"?var3": ["*"] }, "?var4" ]`. 

If your select value only has one item, then you can either wrap it in square brackets or not  (i.e.  `{ "select": ["?var"] }` or `{ "select": "?var" }`). If your select key is an array, then your results will also return an array. 

#### Valid Aggregate Functions

All the following are valid aggregate functions. These below functions can only be applied to variables- you cannot provide your own array. In addition, they cannot be nested within each other- for example `(rand (sample 2 ?age))` is NOT valid.

Function | Arguments | Description
-- | -- | --
`avg` | variable | Returns the average of the values. 
`count` |  variable | Returns a count of the values.  
`count-distinct` |  variable | Returns a count of the distinct values. This is equivalent to `(count (distinct ?var))`
`max` |  variable | Returns the largest value. 
`min` |  variable | Returns the smallest value.
`median` |  variable | Returns the median of the values. 
`rand` |  variable | Returns a random value from the specified values. 
`sample` |  n, variable | Given a sample size and a set of values, returns an appropriately sized sample, i.e. `(sample 2 ?age)` returns two ages from values bound to the variable, `?age`.
`stddev` |  variable | Returns the standard deviation of the values. 
`sum` |  variable | Returns the sum of the values. 
`variance` |  variable | Returns the variance of the values. 

Additional Modifiers

1. `as`: `as` can be wrapped around the ENTIRE aggregate function to rename the result for this aggregate. This renaming only applies to how the results are displayed if pretty-printed. For example, `(as (sum ?nums) ?sum)`.

2. `distinct`: If you want an aggregate function to only apply to the set of distinct values, you can wrap `distinct` around the variable. For example, `(variance (distinct ?nums))` or  `(as (sum (distinct ?nums)) ?sum)`.

If using `groupBy`, aggregates are applied only to the values within that group. 

If select a mixture of aggregate and non-aggregate variables, the results of the aggregate are returned alongside every non-aggregate value. To see what this looks like, try issuing the below query against the basic schema. 

```all
{
  "select": ["?nums", "(avg ?nums)"],
  "where": [["?person", "person/favNums", "?nums"]]
}
```

### Where Key

The value for the where key is an array- we'll call it a where-array in this section. Each item of the where-array acts to filter data, bind variables, or perform other complex data actions. The order of the items in a where-array is extremeley important, as each item is resolved sequentially. 

A where-array can be comprised of any of the following items in any order:

Item | Function 
-- | --
three-tuple | Looks for flakes (pieces of data) in the database that match a provided pattern, and bind variables to the results. See [three tuple](#three-tuple)
four-tuple | Same as a simple three-tuple, except the first item in the tuple specifies a particular data source, such as Wikidata, another ledger, or the current ledger at a specific in time.  See [four tuple](#four-tuple)
Intermediate Aggregate clause | TO DO
Binding map | Serves the same function as an intermediate aggregate clause, except the syntax is different. 
Optional map | TO DO
Union map | TO DO
Filter map | TO DO


#### Three Tuple

Every piece of data in Fluree can be expressed as `[ subject, predicate, object ]`. To read more about this, see the [Subject-Predicate-Object Model](/guides/intro/what-is-fluree#subject-predicate-object-model) in the `What is Fluree?` guide.

When you include a three-tuple in your where-array, you specify the values for one or two parts of the tuple. The parts you don't specify are either `null` or variables. For example, in this three tuple, `["?person", "person/handle", "?handle"]`, only the predicate `person/handle` is specified. The subject `?person` and the object `?handle` are variables. The below table lists all the possible values for each part of the three tuple. 

Part | Value
-- | -- 
`subject` | Can be an subject id, unique two-tuple, a variable (a string that begins with `?`), or null.
`predicate` | Can be either subject id, predicate name, or a variable (a string that begins with `?`).  Reverse references are *NOT* supported.
`object` | Can be a value, subject id, unique two-tuple, a variable (a string that begins with `?`), or null. <br/> <br/> If your object begins with a `?`, and it is NOT a variable, for example someone's name is `?Fred`, then you can use escape strings in the object, for example: `"\"?Fred\""`.

A three tuple acts as a pattern in a where-array. First it pulls all the data that matches that given pattern, and then it binds the appropriate variables. For example, we can issue the following query:

```all
{
    "select": ["?person", "?handle"],
    "where": [["?person", "person/handle", "?handle"]]
}
```

The result (in table form) could be (subject ids may be different for you):

?person | ?handle
-- | --
351843720888324 | dsanchez
351843720888323 | anguyen
351843720888322 | zsmith
351843720888321 | jdoe

Subsequent three-tuples are inner-joined with the previous results. For example, let's say that that next clause is `["?person", "person/favArtists", "?artist"]`. The results of that clause (in table form) could be:

?person | ?artist 
-- | -- 
351843720888324 | 404620279021570
351843720888321 | 404620279021571
351843720888322 | 404620279021569
351843720888323 | 404620279021570
351843720888321 | 404620279021570
351843720888323 | 404620279021571
351843720888321 | 404620279021569

If we were to resolve these two sequential three tuples `["?person", "person/handle", "?handle"]` `["?person", "person/favArtists", "?artist"]`, the above tables need to be inner-joined. The `?person` variable is the only variable that matches across both sets of tuples, so that is the one that we look to for matches. The resulting inner join:


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

#### Four Tuple

Four tuples are exactly the same as three tuples, except that four tuples specify a data source for the `subject, predicate, object` pattern. Currently, Fluree supports querying across multiple Fluree databases and across Wikidata. The following are the sources that can be used.

Source | Example | Description 
-- | -- | --
This Database | `$fdb` | Default source. The current version of a given Fluree. Can be omitted. 
This Database at a Previous Point in Time | `$fdb3`, `$fdb2019-03-14T20:59:36.097Z`, `$fdbPT5M`| This database at a specified block. The block is specified either by providing the block integer, ISO-8601 formatted wall clock time, or ISO-8601 formatted duration ago
Other Fluree Database | `$ftest` | Other Fluree database must be specifed in the [prefixes key](#prefixes-key). 
Other Fluree Database | `$ftestPT5M` | Other database at a specified block. The block is specified either by providing the block integer, ISO-8601 formatted wall clock time, or ISO-8601 formatted duration ago
Wikidata | `$wd` | Wikidata 

For example, the three tuple `["?person", "person/handle", "?handle"]` is equivalent to `["$fdb", "?person", "person/handle", "?handle"]`, because the specified source is the current database. The four tuple, `["$fdbPT2H", "?person", "person/handle", "?handle"]` is matching the given tuple pattern to the subject-predicate-object triples active in the database as of two hours ago. 

#### Intermediate Aggregate Values

You can bind a variable to an aggregate value. As mentioned above, where-array items are resolved in the order in which they appear. This means that aggregates do NOT take into account the where-array item that come later in the array. To bind an intermediate aggregate value, just specify a two-tuple with the first item as a variable and the second item as the aggregate function. For example:

```flureeql
{"select": "?hash", 
 "where": [
    ["?s", "_block/number", "?bNum"],
    ["?maxBlock",  "#(max ?bNum)"],
    ["?s", "_block/number", "?maxBlock"],
    ["?s", "_block/hash", "?hash"]
]}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": "?hash", 
        "where": [
    ["?s", "_block/number", "?bNum"],
    ["?maxBlock",  "#(max ?bNum)"],
    ["?s", "_block/number", "?maxBlock"],
    ["?s", "_block/hash", "?hash"]
]}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?hash
WHERE {
  ?s fdb:_block/number ?bNum.
  BIND (MAX(?bNum) AS ?maxBlock)
  ?s fdb:_block/number ?maxBlock.
  ?s fdb:_block/hash ?hash.
}
```

<!-- 
### Where Key
We suggest reading the [Where Clause](#where-clause) section before reading the [Select or Select One Clauses](#select-or-select-one-clauses) section. The where clause is the first part of the query that is resolved. 

Where clauses are a collection of four-tuples. Each tuple is comprised of a source, subject, predicate, and object. Multiple four-tuples strung together allow us to finely filter data, and connect our Fluree to outside triple-store databases. The where clause can also contain [unions](#unions), [intermediate aggregate](#intermediate-aggregate-values) values, [binds](#bind), [optional](#optional) clauses, [filter](#filter) clauses.








#### Bind

Binding works the same as intermediate aggregate values, except the syntax is different. 

A `bind` map (or multiple maps), can be declared anywhere in the where clause. The `bind` map must precede any clauses, which use the variables declared in the map. 

The map is comprised of keys that correspond to variables, and values. For example, `{"bind": {"?handle": "dsanchez"}}`. You can bind multiple variables in the same map, as well, for example `{"bind": {"?handle": "dsanchez", "?person": 351843720888324}}`.

```flureeql
{
  "select": [ "?person", "?handle"],
  "where": [
      {"bind": {"?handle": "dsanchez"}},
    [
      "?person",
      "person/handle",
      "?handle"
    ]
  ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [ "?person", "?handle"],
  "where": [
      {"bind": {"?handle": "dsanchez"}},
    [
      "?person",
      "person/handle",
      "?handle"
    ]
  ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?person ?handle
WHERE {
  BIND ("dsanchez" AS ?handle)
  ?person fdb:person/handle ?handle.
}
```

Like intermediate aggregate clauses, binds can use aggregate functions. See [Select or selectOne Clauses](#select-or-select-one-clauses) for a list of valid aggregate variables. 

```flureeql
{"select": "?hash", 
 "where": [
    ["?s", "_block/number", "?bNum"],
    {"bind": {"?maxBlock":  "#(max ?bNum)"}},
    ["?s", "_block/number", "?maxBlock"],
    ["?s", "_block/hash", "?hash"]
]}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{"select": "?hash", 
 "where": [
    ["?s", "_block/number", "?bNum"],
    {"bind": {"?maxBlock":  "#(max ?bNum)"}},
    ["?s", "_block/number", "?maxBlock"],
    ["?s", "_block/hash", "?hash"]
]}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?hash
WHERE {
  ?s fdb:_block/number ?bNum,
  BIND (MAX(?bNum) AS ?maxBlock)
  ?s fdb:_block/number ?maxBlock.
  ?s fdb:_block/hash ?hash.
}
```

#### Unions

A `union` map in a where clause allow variables to match multiple graph patterns. 

For example, the clause `[ "?person", "person/handle", "dsanchez" ]` will only match Diana Sanchez. The clause `[ "?person", "person/handle", "jdoe" ]` will only match Jane Doe. If we want to bind BOTH Diana and Jane's subject ids to `?person`, we can use a `union` map. The `union` map has an array of clause array. Note that even if each clause array only has a single clause, it still must be enclosed in `[`.

```flureeql
{
      "union": [
        [[ "?person", "person/handle", "dsanchez" ]],
        [[ "?person", "person/handle", "anguyen"]]
      ]
    }
```

```curl
// Below is just the FlureeQL code
{
      "union": [
        [[ "?person", "person/handle", "dsanchez" ]],
        [[ "?person", "person/handle", "anguyen"]]
      ]
}
```

```graphql 
Not supported
```

```sparql 
{ ?person fdb:person/handle "dsanchez" } UNION { ?person fdb:person/handle "anguyen" } 
```

Below is an example of a `union` with multiple clauses. In this case, `?person` can EITHER have an age of 70 and a handle, dsanzhez, OR it can have a handle of anguyen.

```flureeql
{
      "union": [
        // First clause group
        [["?person","person/age", 70],
        ["?person", "person/handle", "dsanchez]],
        
        // Second clause
        [["?person", "person/handle", "anguyen"]]
      ]
}
```

```curl
// Below is just the FlureeQL code
{
      "union": [
        // First clause group
        [["?person","person/age", 70],
        ["?person", "person/handle", "dsanchez]],
        
        // Second clause
        [["?person", "person/handle", "anguyen"]]
      ]
}
```

```graphql
Not supported
```

```sparql 
{   ?person fdb:person/age 70.
    ?person fdb:person/handle "dsanchez". } 
  UNION 
{   ?person fdb:person/handle "anguyen" } 
```

A `union` map can be placed anywhere inside of a `where` clause. For example:

```flureeql
{
  "select": [ "?person", "?age" ],
  "where": [
   {
      "union": [
        // First clause group
        [["?person","person/age", 70],
        ["?person", "person/handle", "dsanchez"]],
        
        // Second clause
        [["?person", "person/handle", "anguyen"]]
      ]
  }
    [
      "?person",
      "person/age",
      "?age"
    ]
  ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [ "?person", "?age" ],
  "where": [
   {
      "union": [
        // First clause group
        [["?person","person/age", 70],
        ["?person", "person/handle", "dsanchez"]],
        
        // Second clause
        [["?person", "person/handle", "anguyen"]]
      ]
  }
    [
      "?person",
      "person/age",
      "?age"
    ]
  ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?person ?age
WHERE {
  {   ?person fdb:person/age 70.
    ?person fdb:person/handle "dsanchez". } 
  UNION 
  {   ?person fdb:person/handle "anguyen". } 
  ?person fdb:person/age ?age.
}
```

#### Optional

An optional map can be placed anywhere in a `where` clause. Note that the order of an `optional` clause matters. `Optional` clauses are evaluated according to their order in a where clause. 

Optional clauses are structured the same as where clauses. The difference is that rather than performing an inner-join to determine the results, we perform a left outer join. In other words, any rows from the initial table that don't match in the optional clauses's table are joined with nulls. For more information, see [optional clauses](#optional-clauses).

Currently, we do not support starting your where clause with an `optional` map. This will always return an empty result, as of 0.13.0. 

```flureeql
{
  "select": [ "?person", "?name", "?age" ],
  "where": [ [ "?person", "person/age", "?age"],
    { "optional": [ [ "?person", "person/fullName", "?name"],
        [ "?person", "person/favNums", "?favNums"]]
    }
  ]
}
```

```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": [ "?person", "?name", "?age" ],
  "where": [ [ "?person", "person/age", "?age"],
    { "optional": [ [ "?person", "person/fullName", "?name"],
        [ "?person", "person/favNums", "?favNums"]]
    }
  ]
}' \
   [HOST]/api/db/query
```

```graphql 
Not supported
```

```sparql
SELECT ?person ?name ?age
WHERE {
  ?person fdb:person/fullName ?name. 
  OPTIONAL {  ?person fdb:person/fullName ?name. 
              ?person fdb:person/favNums ?favNums. }
}
```

#### Filter

To see all supported filters, see the [Filters](#filters) section. Filters can be placed anywhere in a where clause. 

```flureeql
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"], 
                ["?person", "person/favNums", "?num"],
                { "filter": [ "(> 10 ?num)"] }]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"], 
                ["?person", "person/favNums", "?num"],
                { "filter": [ "(> 10 ?num)"] }]
}' \
   [HOST]/api/db/query
```

```graphql 
Not supported
```

```sparql
SELECT ?handle ?num
WHERE {
  ?person fdb:person/handle ?handle.
  ?person fdb:person/favNums ?num.
  FILTER ( ?num > 10 ).
}
```

#### Query examples:

In the [Basic Schema](/docs/getting-started/basic-schema), we gave each person a set of favorite numbers. If we want to view all of `zsmith`'s flakes, which contain the values of his favorite numbers, our query could be:

```flureeql
{
    "select": "?nums",
    "where": [["$fdb", ["person/handle", "zsmith"], "person/favNums", "?nums"]]
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

### Optional Clauses

Optional clauses are structured the same as where clauses. The difference is that rather than performing an inner-join to determine the results, we perform a left outer join. In other words, any rows from the initial table that don't match in the optional clauses's table are joined with `null`s.

Here is a query that does not have any optional clauses:

```flureeql
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"], 
                ["?person", "person/favNums", "?num"] ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"], 
                ["?person", "person/favNums", "?num"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?handle ?num
WHERE {
  ?person fdb:person/handle ?handle.
  ?person fdb:person/favNums ?num.
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

```flureeql
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"] ],
    "optional": [["?person", "person/favNums", "?num"]]
}
```

```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"] ],
    "optional": [["?person", "person/favNums", "?num"]]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?handle ?num
WHERE {
  ?person fdb:person/handle ?handle.
  OPTIONAL { ?person fdb:person/favNums ?num. }
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
> | `(> 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/%3E" target="_blank">greater than</a>
>= | `(>= 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/%3E=" target="_blank">less than</a>
< | `(< 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/%3C" target="_blank">less than</a>
<= | `(<= 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/%3C=" target="_blank">less than or equal to</a>
= | `(= 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/=" target="_blank">equal to</a>
not= | `(not= 10 ?nums)` | <a href="https://clojuredocs.org/clojure.core/not=" target="_blank">not equal to</a>
+ | `(> 11 (+ 10 ?nums))` | <a href="https://clojuredocs.org/clojure.core/+" target="_blank">add</a>
- | `(- 11 (+ 10 ?nums))` | <a href="https://clojuredocs.org/clojure.core/-" target="_blank">subtract</a>
* | `(> 11 (* 10 ?nums))` | <a href="https://clojuredocs.org/clojure.core/*" target="_blank">multiply</a>
/ | `(> 11 (/ 10 ?nums))` | <a href="https://clojuredocs.org/clojure.core/_fs" target="_blank">divide</a>
and | `(and (> 10 ?nums1) (< 100 ?nums2))` | <a href="https://clojuredocs.org/clojure.core/and" target="_blank">and</a>
&& | `(&& (> 10 ?nums1) (< 100 ?nums2))` | Same as and.
or | `(or (> 10 ?nums1) (< 100 ?nums2))` | <a href="https://clojuredocs.org/clojure.core/or" target="_blank">or</a>
\|\| | `(\|\| (> 10 ?nums1) (< 100 ?nums2))` | Same as or.
nil? | `(nil? ?nums)` | <a href="https://clojuredocs.org/clojure.core/nil_q" target="_blank">nil?</a>
bound | `(bound ?nums)` | True if non-nil
coalesce | `(> ?nums (coalesce ?age 30))` | Coalesce takes the first non-nil argument, example below. 
if | `(if (> ?nums 30) (> ?age 100) true)` |  <a href="https://clojuredocs.org/clojure.core/if" target="_blank">if</a>
not | `(not (> ?nums 30))` |  <a href="https://clojuredocs.org/clojure.core/not" target="_blank">not</a>
! | `(! (> ?nums 30))` |  Same as not
now | `(> ?nums (now))` | Returns the current time in epoch milliseconds.
re-pattern | `(re-pattern "\\d+")` | Returns a regex pattern, for use in re-find. <a href="https://clojuredocs.org/clojure.core/re-pattern" target="_blank">re-pattern</a>
re-find | `(re-find (re-pattern \"^_collection\") ?name)` | Returns the first regex match. <a href="https://clojuredocs.org/clojure.core/re-find" target="_blank">re-find</a>
strStarts | `(strStarts ?message \"Hi\")` | Returns true if the string starts with the given substring, case sensitive. 
strEnds | `(strEnds ?message \"Amy.\")` | Returns true if the string ends with the given substring, case sensitive. 

Specify all filters in the `filter` key on the top-level of the query.

```flureeql
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"], 
                ["?person", "person/favNums", "?num"] ],
    "filter": [ "(> 10 ?num)"]
}
```

```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"], 
                ["?person", "person/favNums", "?num"] ],
    "filter": [ "(> 10 ?num)"]
}' \
   [HOST]/api/db/query
```

```graphql 
Not supported
```

```sparql 
SELECT ?handle ?num
WHERE {
  ?person fdb:person/handle ?handle.
  ?person fdb:person/favNums ?num.
  FILTER ( ?num > 10 ).
}
```

Filters can be optional by specifying a two-tuple where the first item is "optional", and the second item is the filter function. If a filter is optional, like `(> 10 ?num)`, then any row where `?num` is `null` will be ignored and will not be filtered out. On the other hand, any row where `?num` is greater or equal to 10 will be removed.

```flureeql
{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"] ],
    "optional": [  ["?person", "person/favNums", "?num"]],
    "filter": [ ["optional", "(> 10 ?num)"] ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?handle", "?num"],
    "where": [  ["?person", "person/handle", "?handle"] ],
    "optional": [  ["?person", "person/favNums", "?num"]],
    "filter": [ ["optional", "(> 10 ?num)"] ]
}' \
   [HOST]/api/db/query
```

```graphql 
Not supported.
```

```sparql
SELECT ?handle ?num
WHERE {
  ?person fdb:person/handle ?handle.
  OPTIONAL { ?person fdb:person/favNums ?num. 
            FILTER( ?num > 10 )
    }
}
```

Filters can include multiple variables, for example gets all the favorite numbers for every person, and if a person has an age, it also gets their age. Then, it filters by returning only the favorite numbers that are greater than a given person's age or greater than 3 if no age is provided. 

```flureeql
{
  "select": ["?favNums", "?age" ],
  "where": [["?person", "person/favNums", "?favNums"]],
  "optional": [["?person", "person/age", "?age"]],
  "filter": ["(> ?favNums (coalesce ?age 3))"]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "select": ["?favNums", "?age" ],
  "where": [["?person", "person/favNums", "?favNums"]],
  "optional": [["?person", "person/age", "?age"]],
  "filter": ["(> ?favNums (coalesce ?age 3))"]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?favNums ?age
WHERE {
  ?person fdb:person/favNums ?favNums.
  OPTIONAL {
    ?person fdb:person/age ?age.
  }
  FILTER( ?favNums > (coalesce ?age 3))
}
```

### Variables

You can provide a map of variables which will get substituted into a given query. 

For example, in the below query `?handle` will be replaced with `dsanchez` anywhere it appears in the query.

```flureeql
{
    "select": "?handle",
    "where": [  
        ["?person", "person/handle", "?handle"] ],
    "vars": {
        "?handle": "dsanchez"
    }
}
```

```curl 
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": "?handle",
    "where": [  
        ["?person", "person/handle", "?handle"] ],
    "vars": {
        "?handle": "dsanchez"
    }
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
// Althought the SPARQL 1.1 spec supports multiple values for any given variable, currently Fluree only support a 1:1 relationship 
// between variables and their values

SELECT ?handle
WHERE {
  VALUES ?handle { "dsanchez" }
  ?person fdb:person/handle ?handle.
}
```

### Group By
You can group by any variable or variables that appears in your where clause. Grouping is specified in the top-level `groupBy` key. This can either be a single variable, i.e. `?person` or a vector of variables, i.e. `["?person", "?handle"]`.

```flureeql
{
    "select":  "?handle",
    "where": [  ["?person", "person/handle", "?handle"] ],
    "groupBy": "?person"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select":  "?handle",
    "where": [["?person", "person/handle", "?handle"]],
    "groupBy": "?person"
}' \
   [HOST]/api/db/query
```

```graphql
Not supported.
```

```sparql
SELECT ?handle
WHERE {
  ?person fdb:person/handle ?handle.
}
GROUP BY ?person
```

Below, we group by two different variables. 

```flureeql
{
    "select":  "?handle",
    "where": [  ["?person", "person/handle", "?handle"] ],
    "groupBy": ["?handle", "?person"]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select":  "?handle",
    "where": [  ["?person", "person/handle", "?handle"] ],
    "groupBy": ["?handle", "?person"]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported.
```

```sparql
SELECT ?handle
WHERE {
  ?person fdb:person/handle ?handle.
}
GROUP BY ?person ?handle
```

You can use `groupBy` in conjunction with `orderBy`. For example, the below query will order the results by the second variable in the grouping. 

```flureeql
{
    "select":  "?handle",
    "where": [  ["?person", "person/handle", "?handle"] ],
    "groupBy": ["?handle", "?person"],
    "orderBy": "?person"
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select":  "?handle",
    "where": [  ["?person", "person/handle", "?handle"] ],
    "groupBy": ["?handle", "?person"],
    "orderBy": "?person"
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?handle
WHERE {
  ?person fdb:person/handle ?handle.
}
GROUP BY ?handle ?person
ORDER BY ?person
```

Example results for the above query in FlureeQL.

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

### Full Text Search

You can use analytical queries to search objects of a given predicate or within a given collection. In order to do this, you first need to enable full text search on any predicates you want to be able to search. For example, we're going to enable full text search on `person/fullName`, `person/handle`, and `chat/message`. 

```flureeql
[{
    "_id": ["_predicate/name", "person/fullName"],
    "fullText": true
},
{
    "_id": ["_predicate/name", "person/handle"],
    "fullText": true
},
{
    "_id": ["_predicate/name", "chat/message"],
    "fullText": true
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "person/fullName"],
    "fullText": true
},
{
    "_id": ["_predicate/name", "person/handle"],
    "fullText": true
},
{
    "_id": ["_predicate/name", "chat/message"],
    "fullText": true
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation makeFullText ($myFullTextTx: JSON) {
  transact(tx: $myFullTextTx)
}

{
  "myFullTextTx": "[{\"_id\":[\"_predicate/name\",\"person/fullName\"],\"fullText\":true},{\"_id\":[\"_predicate/name\",\"person/handle\"],\"fullText\":true},{\"_id\":[\"_predicate/name\",\"chat/message\"],\"fullText\":true}]"
}
```

```sparql
Transactions not supported in SPARQL.
```

Now, we can issue a full text query against any predicate or collection by using a special predicate, `fullText:PREDICATE` or `fullText:COLLECTION`, which acts as a service call. For example:

```flureeql
{
    "select": "?person",
    "where": [
        ["?person", "fullText:person/handle", "jdoe"]
    ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": "?person",
    "where": [
        ["?person", "fullText:person/handle", "jdoe"]
    ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?person
WHERE {
  ?person fullText:person/handle "jdoe".
}
```

The above query binds the subject _ids for any person whose full names includes `doe` (not case-sensitive). We can also issue the same query searching any full-text-searchable predicates in the `person` collection. In this case, we would be searching the predicates: `person/fullName` and `person/handle`.

```flureeql
{
    "select": "?person",
    "where": [
        ["?person", "fullText:person", "doe"]
    ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": "?person",
    "where": [
        ["?person", "fullText:person", "doe"]
    ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?person
WHERE {
  ?person fullText:person "doe".
}
```

We can combine a full-text search service call clause with any other clause, for example:

```flureeql
{
    "select": ["?person", "?nums", "?age"
    "where": [
        ["?person", "fullText:person/handle", "jdoe"],
        ["?person", "person/favNums", "?nums"],
        ["?person", "person/age", "?age"]
    ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?person", "?nums", "?age"
    "where": [
        ["?person", "fullText:person/handle", "jdoe"],
        ["?person", "person/favNums", "?nums"],
        ["?person", "person/age", "?age"]
    ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?person ?nums ?age
WHERE {
  ?person fullText:person/handle "jdoe".
  ?person fdb:person/favNums ?nums.
  ?person fdb:person/age ?age.
}
```

A predicate can be removed from the full-text search index (and thus from full-text search capability) at any time by simply setting `fullText` to false:

```flureeql
[{
    "_id": ["_predicate/name", "person/fullName"],
    "fullText": false
}]
```


```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": ["_predicate/name", "person/fullName"],
    "fullText": false
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation unmakeFullText ($myFullTextRemoveTx: JSON) {
  transact(tx: $myFullTextRemoveTx)
}

{
  "myFullTextRemoveTx": "[{\"_id\":[\"_predicate/name\",\"person/fullName\"],\"fullText\":false}]"
}
```

```sparql
Transactions not supported in SPARQL.
```

#### Note
A few things to note with full text searching:

1. The full-text search index is not guaranteed to be fully up-to-date. It may take some time for index to become synchronized.
2. Full-text search is only available for the current Fluree database. 

### Prefixes and Querying Across Sources



For example, if we wanted to see whether "zsmith" as of block 5 shared a favorite number with "zsmith" as of block 4. We are currently at block 4, so we would first need to issue a transaction. We can give `zsmith` an additional favorite number. 

```flureeql
[{
  "_id": ["person/handle", "zsmith"],
  "favNums": [100]
}]
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
  "_id": ["person/handle", "zsmith"],
  "favNums": [100]
}]' \
   [HOST]/api/db/transact
```

```graphql
mutation addFavNum ($addFavNumTx: JSON) {
  transact(tx: $addFavNumTx)
}

{
  "addFavNumTx": "[{\"_id\":[\"person/handle\",\"zsmith\"],\"favNums\":[100]}]"
}
```

```sparql
Transactions not supported in SPARQL.
```

Now, we can issue a query showing which numbers were his favorites in BOTH block 4 and block 5. This means the results should exclude the number 100. 

```flureeql
{
    "select": "?nums",
    "where": [  ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["$fdb5", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": "?nums",
    "where": [  ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["$fdb5", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
SELECT ?nums
WHERE {
    ?person     fd4:person/handle   "zsmith";
                fd4:person/favNums  ?nums;
                fd5:person/favNums  ?nums.
}
```

#### Prefixes 
If we want to query across multiple Fluree databases we can do so by specifying the database in the `prefixes` map. 

```flureeql
{
    "prefixes": {
      "ftest": "fluree/test"
    },
    "select": "?nums",
    "where": [  ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["ftest", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "prefixes": {
      "ftest": "fluree/test"
    },
    "select": "?nums",
    "where": [  ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["ftest", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported.
```

```sparql
PREFIX ftest: <fluree/test>
SELECT ?nums
WHERE {
   ?person     fd4:person/handle   "zsmith";
                fd4:person/favNums  ?nums.
    ?personTest ftest:person/handle "zsmith".
                ftest:person/favNums  ?nums.
}
```

SPARQL Note: When using SPARQL, omit the `$` in front-of built-in sources. In addition, if you want to specify an `ISO-8601` formatted wall clock time, replace all the `:` with `;`. For example, `"SELECT ?s ?o WHERE {  ?s   fdb2019-03-14T20;59;36;097Z:person/handle  ?o.}`. 

In the prefix map, we can specify what ledger we want to query across, in this case `fluree/test`, and we give that source a name, `ftest`. The name given to a source must be only lowercase letters and no numbers. 

Now we can use `ftest` as a source in any clause. 

After declaring the source in the prefix, we can access that ledger at any block by specifying the time in the clause. You can specify a time using a block integer (`ftest3`), a duration (`ftestPT5M`), or an ISO-8601 formatted time-string (`ftest2019-03-14T20:59:36.097Z`). The time SHOULD NOT be declared in the prefix map - only in a particular clause. 

For example, the below is incorrect. 

```flureeql
<<< ----- THIS IS A AN INCORRECT EXAMPLE ----- >>>
{
    "prefixes": {
      "ftest5": "fluree/test" <<< ----- WRONG ----- >>>
    },
    "select": "?nums",
    "where": [  ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["ftest5", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}
```

```curl
<<< ----- THIS IS A AN INCORRECT EXAMPLE ----- >>>
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "prefixes": {
      "ftest5": "fluree/test" <<< ----- WRONG ----- >>>
    },
    "select": "?nums",
    "where": [  ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["ftest5", ["person/handle", "zsmith"], "person/favNums", "?nums"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
<<< ----- THIS IS A AN INCORRECT EXAMPLE ----- >>>
PREFIX ftest5: <fluree/test> <<< ----- WRONG ----- >>>
SELECT ?nums
WHERE {
   ?person     fd4:person/handle   "zsmith";
                fd4:person/favNums  ?nums.
    ?personTest ftest5:person/handle "zsmith".
                ftest5:person/favNums  ?nums.
}
```

The below is correct, where the time is specified in the actual clause itself. 

```flureeql
{
    "prefixes": {
      "ftest": "fluree/test" 
    },
    "select": "?nums",
    "where": [  ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["ftest5", ["person/handle", "zsmith"], "person/favNums", "?nums"],
                ["ftestPT5M", ["person/handle", "jdoe"], "person/favNums", "?nums"] ]
}
```

```curl
  curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "prefixes": {
      "ftest": "fluree/test" 
    },
    "select": "?nums",
    "where": [  ["$fdb4", ["person/handle", "zsmith"], "person/favNums", "?nums"], 
                ["ftest5", ["person/handle", "zsmith"], "person/favNums", "?nums"],
                ["ftestPT5M", ["person/handle", "jdoe"], "person/favNums", "?nums"] ]
}' \
   [HOST]/api/db/query
```

```graphql
Not supported
```

```sparql
PREFIX ftest: <fluree/test> 
SELECT ?nums
WHERE {
   ?person     fd4:person/handle   "zsmith";
                fd4:person/favNums  ?nums.
    ?personTest ftest5:person/handle "zsmith".
                ftest5:person/favNums  ?nums.
}
```

#### Permissions
If you want to access information in different databases, you need to have permissions to access those databases, and those databases need to be running on the same transactor. 

1. If you are accessing outside databases in the **same network** as your current database (i.e. `fluree/one` and `fluree/test`) and **fdb-open-api** is `true`, then you can freely query across databases. 
2. In any other situation, `fdb-open-api` must be `false`, and your query must be signed. The `_auth` record with which you signed your query will be the one that determines your permissions for each given database. 

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

### Recursion

To recur across a relationship, simply add a `+` after a predicate. This will match flakes any path length from the original. By default the recur depth is 100. You can also specify a certain path length by adding an integer after the `+`. 

```flureeql
{
    "select": ["?followHandle"],
    "where": [
        ["?person", "person/handle", "anguyen"],
        ["?person", "person/follows+", "?follows"],
        ["?follows", "person/handle", "?followHandle"]
        ]  
}
```

```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?followHandle"],
    "where": [
        ["?person", "person/handle", "anguyen"],
        ["?person", "person/follows+", "?follows"],
        ["?follows", "person/handle", "?followHandle"]
        ]  
}' \
   [HOST]/api/db/query
```

```graphql
Not supported.
```

```sparql
SELECT ?followHandle
WHERE {
  ?person fdb:person/handle "anguyen".
  ?person fdb:person/follows+ ?follows.
  ?person fdb:person/handle ?followHandle.
}
```

Below is an example specifying a maximum recursion depth. 

```flureeql
{
    "select": ["?followHandle"],
    "where": [
        ["?person", "person/handle", "anguyen"],
        ["?person", "person/follows+3", "?follows"],
        ["?follows", "person/handle", "?followHandle"]
        ]
    
}
```

```curl
 curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "select": ["?followHandle"],
    "where": [
        ["?person", "person/handle", "anguyen"],
        ["?person", "person/follows+3", "?follows"],
        ["?follows", "person/handle", "?followHandle"]
        ]
    
}' \
   [HOST]/api/db/query
```

```graphql
Not sypported.
```

```sparql
SELECT ?followHandle
WHERE {
  ?person fdb:person/handle "anguyen".
  ?person fdb:person/follows+3 ?follows.
  ?follows fdb:person/handle ?followHandle.
}
```

<!-- `limit` | no | Optional limit (integer) of results to include. Default is 100.
`orderBy` | no | Optional variable (string) or two-tuple where the first element is "ASC" or "DESC" and the second element is the variable name. For example, `"?favNums"` or `["ASC", "?favNums"]`
`vars` | no | Provide a map of variables that will be substituted into a given query. 
[groupBy](#group-by) | no | Optional variable or array of variables by  Note that depending on the query, group by can significantly slow down results. 
`prettyPrint` | no | Default false. Optional boolean. Whether to "pretty print" the results (as a map with keys) or as a vector without labels. This is only available when select is an array of values. Note that depending on the query, pretty print can significantly slow down results. 
[wikidataOpts](#wikidata-options) | no | Optional map of configurations for Wikidata queries, including specifying whether to return `distinct` results or whether to limit results. -->