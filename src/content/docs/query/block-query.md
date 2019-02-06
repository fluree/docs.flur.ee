## Block Query 

In this section, we show you how to select all flakes from a block or a selection of blocks. Fluree allows you to select data from an entire block or block range. 

All FlureeQL queries in this section can be issued to an API endpoint ending in `/block`.

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

Using a ISO-8601 formatted duration (as of 1 hour ago):

```flureeql
{
  "block": "PT1H"
}
```
```curl
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '{
    "block": "PT1H"
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
   -H "Authorization: Bearer $FLUREE_TOKEN" \
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
