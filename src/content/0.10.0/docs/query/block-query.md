## Block Query 

In this section, we show you how to select all flakes from a block or a selection of blocks. Fluree allows you to select data from an entire block or block range. 

All FlureeQL queries in this section can be issued to an API endpoint ending in `/block`.

### Block Clauses

A block query requires a `block` key, which specifies a block or range of blocks to return. There are a variety of options for how to format this value. They are listed below. 

A block query can also optionally include a `pretty-print` key, which pretty prints the results if `true`.

Key | Required? | Description
-- | -- | -- 
`block` | yes | A block or range of blocks to return, options for the format of this value are listed below.
`pretty-print` | no | Optional, `true` or `false`, whether to pretty-print results. Default `false`

### Query Single block

To query a single block, you specify the block number, an ISO-8601 formatted wall clock time, or an ISO-8601 formatted duration. 

Using a block number:

```flureeql
{
  "block": 3
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": 3
}' \
   [HOST]/api/db/block
```
```graphql
query  {
  block(from: 3, to: 3)
}
```

```sparql
Not supported
```

Using an ISO-8601 formatted wall-clock time:

```flureeql
{
  "block": "2017-11-14T20:59:36.097Z"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": "2017-11-14T20:59:36.097Z"
}' \
[HOST]/api/db/block
```
```graphql
Not supported
```

```sparql
Not supported
```


### Query Block Range

To query a range of block, specify a lower and upper limit (inclusive).

```flureeql
{
  "block": [3,5]
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": [3, 5]
}' \
[HOST]/api/db/block
```
```graphql
query  {
  block(from: 3, to: 5)
}
```

```sparql
Not supported
```

### Query Block Range, Lower Limit

To query a range of block, starting with a lower limit, specify just the lower limit (inclusive).

```flureeql
{
  "block": [3]
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -d '{
    "block": [3]
}' \
 [HOST]/api/db/block
```
```graphql
query  {
  block(from: 3)
}
```

```sparql
Not supported
```

### Pretty-Print Block Query

In FlureeQL, you can pretty print the results of a block query by adding `"pretty-print": true` to your query map. Any format of block query can be pretty-printed. 

```flureeql
{
  "block": [3],
  "pretty-print": true
}
```

```curl
curl \
   -H "Content-Type: application/json" \
   -d '{
  "block": [3],
  "pretty-print": true
}' \
 [HOST]/api/db/block
```

```graphql
Not supported
```

```sparql
Not supported
```