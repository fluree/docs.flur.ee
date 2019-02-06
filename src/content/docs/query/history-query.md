## History Query 

In this section, we show you how to view the history of a flake or set of flakes. 

All FlureeQL queries in this section can be issued to an API endpoint ending in `/history`.

### History Clauses

A historical query requires a `history` key, which specifies an subject, either by specifiying an subject id, a two-tuple of a unique predicate+object, or an array in flake-format. A historical query can also optionally include a `block` key, which specifies the most recent block for which to list an subject's history. 

Key | Required? | Description
-- | -- | -- 
`history` | yes |  Subject id, unique two-tuple, or flake-format
`block` | no | Optional most recent block (integer) for which to list history

### History of Subject

To view the history of a single subject, you can either specify a subject id or a unique two-tuple.

For example, to query the history up to block 4 of an subject using an subject id:

```flureeql
{
  "history": 4299262263302,
  "block": 4
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": 4299262263302,
  "block": 4
}' \
[HOST]/api/db/history
```
```graphql
{
  history(subject: "4299262263302", block: 4)
}
```

```sparql
Not supported
```

To query the history up to block 4 of an subject using a two-tuple of a unique predicate and value: 

```flureeql
{
  "history": ["person/handle", "zsmith"],
  "block": 4
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": ["person/handle", "zsmith"],
  "block": 4
}' \
 [HOST]/api/db/history
```
```graphql
{
  history(subject: "[\"person/handle\", \"zsmith\"]", block: 4)
}
```

```sparql
Not supported
```

### History Query With Flake Format

Data in Fluree is stored in the form of [flakes](/docs/infrastructure/db-infrastructure#flakes). The flake format is an array where the first three elements specify an [subject, predicate, and object](/docs/infrastructure/db-infrastructure#subject-predicate-object-model) in that order.

You do not need to specify every single part of flake in order to use this format. However, note that the order of items in the flake-format is important, so you will need to include null values if you are skipping any items. 

In the flake-format, either a predicate or a subject is required. 

For example, to query the history of updates to the `person/follows` predicate on the `["person/handle", "zsmith"]` subject, you could issue the following query: 

```flureeql
{
  "history": [["person/handle", "zsmith"], "person/follows"]
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": [["person/handle", "zsmith"], "person/follows"]
}' \
  [HOST]/api/db/history
```
```graphql 
{
  history(subject: "[[\"person/handle\", \"zsmith\"], \"person/follows\"]")
}
```

```sparql
Not supported
```

Note that because we are not specifying any other parts of the flake-format, we can simply omit them. 

If, however, we were interested in looking at flakes that matched any subject with the predicate, `person/handle`, and the object, `jdoe`, we would issue:

```flureeql
{
  "history": [null, "person/handle", "jdoe"]
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
  "history": [null, "person/handle", "jdoe"]
}' \
  [HOST]/api/db/history
```
```graphql
{
  history(subject: "[null, \"person/handle\", \"jdoe\"]")
}
```

```sparql
Not supported
```
