import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# History Query

In this section, we show you how to view the history of a flake or set of flakes.

All FlureeQL queries in this section can be issued to an API endpoint ending in `/history`.

## History Clauses {#history-clauses}

A historical query requires a `history` key, which specifies an subject, either by specifiying an subject id, a two-tuple of a unique predicate+object, or an array in flake-format. A historical query can also optionally include a `block` key, which specifies the most recent block for which to list an subject's history.

Key | Required? | Description
-- | -- | --
`history` | yes |  Subject id, unique two-tuple, or flake-format
`block` | no | Optional block or range of blocks to return, options for the format of this value are the same as for block queries and are listed below.
`showAuth` | no | Optional, `true` or `false`, whether to include auth information in results. Default `false`.
`auth` | no | Optional, an array of `_auth/id`s or `_auth` subject ids. If included, only returns results that were submitted by the included auth records.
`prettyPrint` | no | Optional, `true` or `false`, whether to pretty print results. Default `false`

## History of Subject at a Single Block {#history-of-subject-at-a-single-block}

To view the history of a single subject, you can either specify a subject id or a unique two-tuple.

For example, to query the history of an subject at block 4:

<Tabs
  defaultValue="json"
  values={[{label: 'FlureeQL', value: 'json'},
  {label: 'Curl', value: 'bash'},
  {label: 'GraphQL', value: 'graphql'},
  {label: 'SPARQL', value: 'sparql'}]}
>
<TabItem value="json">

```json
{
  "history": 369435906932737,
  "block": 4
}
```

</TabItem>

<TabItem value="bash">

```bash
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": 369435906932737,
  "block": 4
}' \
[HOST]/api/db/history
```

</TabItem>

<TabItem value="graphql">

```graphql
{
  history(subject: "369435906932737", block: 4)
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Not supported
```

</TabItem>
</Tabs>

To query the history at block 4 of an subject using a two-tuple of a unique predicate and value:

<Tabs
  defaultValue="json"
  values={[{label: 'FlureeQL', value: 'json'},
  {label: 'Curl', value: 'bash'},
  {label: 'GraphQL', value: 'graphql'},
  {label: 'SPARQL', value: 'sparql'}]}
>
<TabItem value="json">

```json
{
  "history": ["person/handle", "zsmith"],
  "block": 4
}
```

</TabItem>

<TabItem value="bash">

```bash
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": ["person/handle", "zsmith"],
  "block": 4
}' \
 [HOST]/api/db/history
```

</TabItem>

<TabItem value="graphql">

```graphql
{
  history(subject: "[\"person/handle\", \"zsmith\"]", block: 4)
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Not supported
```

</TabItem>
</Tabs>

## History of Subject During a Block Range {#history-of-subject-during-a-block-range}

To query the history of an subject using an subject id from block 3 to 5:

<Tabs
  defaultValue="json"
  values={[{label: 'FlureeQL', value: 'json'},
  {label: 'Curl', value: 'bash'},
  {label: 'GraphQL', value: 'graphql'},
  {label: 'SPARQL', value: 'sparql'}]}
>
<TabItem value="json">

```json
{
  "history": 369435906932737,
  "block": [3, 5]
}
```

</TabItem>

<TabItem value="bash">

```bash
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": 369435906932737,
  "block": [3, 5]
}' \
[HOST]/api/db/history
```

</TabItem>

<TabItem value="graphql">

```graphql
Not supported
```

</TabItem>

<TabItem value="sparql">

```sparql
Not supported
```

</TabItem>
</Tabs>

## History of Subject, Lower Limit {#history-of-subject-lower-limit}

To query the history of an subject using an subject id from block 3 to the most recent block:

<Tabs
  defaultValue="json"
  values={[{label: 'FlureeQL', value: 'json'},
  {label: 'Curl', value: 'bash'},
  {label: 'GraphQL', value: 'graphql'},
  {label: 'SPARQL', value: 'sparql'}]}
>
<TabItem value="json">

```json
{
  "history": 369435906932737,
  "block": [3]
}
```

</TabItem>

<TabItem value="bash">

```bash
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": 369435906932737,
  "block": [3]
}' \
[HOST]/api/db/history
```

</TabItem>

<TabItem value="graphql">

```graphql
Not supported
```

</TabItem>

<TabItem value="sparql">

```sparql
Not supported
```

</TabItem>
</Tabs>

## History Query With Flake Format {#history-query-with-flake-format}

Data in Fluree is stored in the form of [flakes](../../concepts/architecture/flakes.md). The flake format is an array where the first three elements specify an [subject, predicate, and object](../../concepts/what-is-fluree#subject-predicate-object-model) in that order.

You do not need to specify every single part of flake in order to use this format. However, note that the order of items in the flake-format is important, so you will need to include null values if you are skipping any items.

In the flake-format, either a predicate or a subject is required.

For example, to query the history of updates to the `person/follows` predicate on the `["person/handle", "zsmith"]` subject, you could issue the following query:

<Tabs
  defaultValue="json"
  values={[{label: 'FlureeQL', value: 'json'},
  {label: 'Curl', value: 'bash'},
  {label: 'GraphQL', value: 'graphql'},
  {label: 'SPARQL', value: 'sparql'}]}
>
<TabItem value="json">

```json
{
  "history": [["person/handle", "zsmith"], "person/follows"]
}
```

</TabItem>

<TabItem value="bash">

```bash
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": [["person/handle", "zsmith"], "person/follows"]
}' \
  [HOST]/api/db/history
```

</TabItem>

<TabItem value="graphql">

```graphql
{
  history(subject: "[[\"person/handle\", \"zsmith\"], \"person/follows\"]")
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Not supported
```

</TabItem>
</Tabs>

Note that because we are not specifying any other parts of the flake-format, we can simply omit them.

If, however, we were interested in looking at flakes that matched any subject with the predicate, `person/handle`, and the object, `jdoe`, we would issue:

<Tabs
  defaultValue="json"
  values={[{label: 'FlureeQL', value: 'json'},
  {label: 'Curl', value: 'bash'},
  {label: 'GraphQL', value: 'graphql'},
  {label: 'SPARQL', value: 'sparql'}]}
>
<TabItem value="json">

```json
{
  "history": [null, "person/handle", "jdoe"]
}
```

</TabItem>

<TabItem value="bash">

```bash
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": [null, "person/handle", "jdoe"]
}' \
  [HOST]/api/db/history
```

</TabItem>

<TabItem value="graphql">

```graphql
{
  history(subject: "[null, \"person/handle\", \"jdoe\"]")
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Not supported
```

</TabItem>
</Tabs>

## Pretty Print History Query {#pretty-print-history-query}

In FlureeQL, you can pretty print the results of a history query by adding `"prettyPrint": true` to your query map. Any format of history query can be pretty printed.

<Tabs
  defaultValue="json"
  values={[{label: 'FlureeQL', value: 'json'},
  {label: 'Curl', value: 'bash'},
  {label: 'GraphQL', value: 'graphql'},
  {label: 'SPARQL', value: 'sparql'}]}
>
<TabItem value="json">

```json
{
  "history": [null, "person/handle", "jdoe"],
  "prettyPrint": true
}
```

</TabItem>

<TabItem value="bash">

```bash
curl \
   -H "Content-Type: application/json" \
   -d '{
  "history": [null, "person/handle", "jdoe"]
  "prettyPrint": true
}' \
 [HOST]/api/db/block
```

</TabItem>

<TabItem value="graphql">

```graphql
{
  history(subject: "[\"person/handle\", \"jdoe\"]",
          prettyPrint: true)
}
```

</TabItem>

<TabItem value="sparql">

```sparql
Not supported
```

</TabItem>
</Tabs>

The pretty printed results look as follows:

```json
{
  "4": {
    "asserted": [
      {
        "person/handle": "jdoe",
        "_id": 351843720888321
      }
    ],
    "retracted": []
  }
}
```

## History Query with Auth Information {#history-query-with-auth-information}

To include auth information in the results of a history query, include the `showAuth` key. For example:

```json
{
  "history": [null, "_collection/name"],
  "showAuth": true
}
```

This could return results like:

```json
[
  {
    "block": 2,
    "flakes": [
       [ 17592186044436, 40, "person", -3, true, null ],
       [ 17592186044437, 40, "chat", -3, true, null ],
       [ 17592186044438, 40, "comment", -3, true, null ],
       [ 17592186044439, 40, "artist", -3, true, null ],
       [ 17592186044440, 40, "movie", -3, true, null ]
    ],
    "t": -3,
    "auth": [
      105553116266496,
      "TexTgp1zpMkxJq1nThrgwkU5dp9wzaXA7BX"
    ]
  },
  {
    "block": 1,
    "flakes": [
       [ 17592186044416, 40, "_predicate", -1, true, null ],
       [ 17592186044417, 40, "_collection", -1, true, null ],
       [ 17592186044418, 40, "_shard", -1, true, null ],
       [ 17592186044419, 40, "_tag", -1, true, null ],
       [ 17592186044420, 40, "_fn", -1, true, null ],
       [ 17592186044421, 40, "_user", -1, true, null ],
       [ 17592186044422, 40, "_auth", -1, true, null ],
       [ 17592186044423, 40, "_role", -1, true, null ],
       [ 17592186044424, 40, "_rule", -1, true, null ],
       [ 17592186044425, 40, "_setting", -1, true, null ]
    ],
    "t": -1,
    "auth": null
  }
]
```

You are also able to filter history query results to only incldue results corresponding to a particular auth record or auth records.

```json
{
  "history": [ null, "_collection/name"],
  "showAuth": true,
  "auth": [ 105553116266496 ]
}
```

This returns the following results:

```json
[
  {
    "block": 2,
    "flakes": [
       [ 17592186044436, 40, "person", -3, true, null ],
       [ 17592186044437, 40, "chat", -3, true, null ],
       [ 17592186044438, 40, "comment", -3, true, null ],
       [ 17592186044439, 40, "artist", -3, true, null ],
       [ 17592186044440, 40, "movie", -3, true, null ]
    ],
    "t": -3,
    "auth": [
      105553116266496,
      "TexTgp1zpMkxJq1nThrgwkU5dp9wzaXA7BX"
    ]
  }
]
```
