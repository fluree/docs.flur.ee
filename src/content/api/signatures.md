## Signatures

For both queries and transactions, a signature is not required if the option `fdb-group-open-api` is set to true (default for the downloaded version of Fluree). 

If you do need to specify a signature, the signature may either be in the Authorization header (for all queries submitted) or in the signature map (for all transactions).

Any requests sent to `/query`, `/multi-query`, `/block`, `/history`, `/sparql`, and any queries submitted through `/graphql` should have a signature in Authorization header (if `fdb-group-open-api` is set to false) [signed queries](#signed-queries). Any transactions submitted, either through `/transact` or `/graphql`, should include a signature in the transaction map [signed transactions](#signed-transactions).

### Signed Queries
If `fdb-group-open-api` is set to true, then you do not need to sign your queries. If you do need to sign your queries, you should include the following header in your request: 

```
"Authorization": "Bearer [SIGNATURE]"
```

TO DO - RETURN TO THIS.

### Signed Transactions
If `fdb-group-open-api` is set to true, then you do not need to sign your transactions.

Each database comes with a default auth record, which is stored [ WHERE NOW? Is that _db/anonymous now?]

Optionally, in a given transaction, you can include an alternate auth record with which to sign your transaction. This is done by passing in an additional map with your transaction. The additional map should be in the `_tx` collection. The predicates in the `_tx` collection are specified below:

Predicate | Type | Description
-- | -- | -- 
`_tx/id` | `string` |  (optional) A unique identifier for this tx.
`_tx/auth` | `ref` | (optional) A reference to the `_auth` for this transaction. This auth signs the transaction.
`_tx/authority` | `ref` | (optional) A reference to an `_auth` record that acts as an authority for this transaction. 
`_tx/nonce` | `long` | (optional) A nonce that helps ensure identical transactions have unique txids, and also can be used for logic within smart functions (not yet implemented). Note this nonce does not enforce uniqueness, use _tx/altId if uniqueness must be enforced.
`_tx/altId` | `string` | (optional) Alternative Unique ID for the transaction that the user can supply.

For example, I could specify a  `_tx/id` and `_tx/nonce` in my transaction as follows. If your database specifies a defaultAuth (see the section [Authority](#authority)), this additional map is completely optional.

```
[{
    "_id": "_collection",
    "name": "movie"
},
{
    "_id": "_tx",
    "id": "moviesColl",
    "nonce": 123456789
}]

```

As you can see in the flakes section of the response below, the `_tx/nonce` that we supplied is recorded (in the last flake, `[ -327680, 103, 123456789, -327680, true, 0 ]`).

```
{
  "tempids": {
    "_collection$1": 4294968297
  },
  "block": 5,
  "hash": "56f0065c194e0afcbb17efa2d28cd2e5c990cb36ba473405e49c9e865577a242",
  "txid": "b9f52827b30cc234db4766417b80337295210c671079b6fda546f992da123a0b",
  "fuel-remaining": 999430,
  "authority": null,
  "signature": "1c304402200cc359c38f90af3b75ca8178f3953f13b31ba6de0382639790cd22b2b53b43c1022047a7fb73ce1b869bad74a8027926df67b3d162651cbd28165310ca0aa0dbd672",
  "time": "20.28ms",
  "fuel": 0,
  "auth": 25769803776,
  "status": 200,
  "block-bytes": 444,
  "timestamp": 1534884422866,
  "flakes": [
     [ 4294968297, 40, "movie", -327680, true, 0 ],
     [ -327680, 1, "56f0065c194e0afcbb17efa2d28cd2e5c990cb36ba473405e49c9e865577a242", -327680, true, 0 ],
     [ -327680, 2, "93d48741923a2033a23d2116c17729b5bb582ae2c575082540071715b25dd866", -327680, true, 0 ],
     [ -327680, 5, 1534884422866, -327680, true, 0 ],
     [ -327680, 100, "b9f52827b30cc234db4766417b80337295210c671079b6fda546f992da123a0b", -327680, true, 0 ],
     [ -327680, 101, 25769803776, -327680, true, 0 ],
     [ -327680, 103, 123456789, -327680, true, 0 ]
  ]
}
```


### Authority

Every transaction is signed by an `_auth` record. By default, every database includes a default auth record, which is specified with the following subject:

```
{
      "_setting/id": "db",
      "_setting/defaultAuth": {
        "_id": 25769803776
      },
      "_id": 38654705664
}
```

In order to change or remove the defaultAuth, you can simply change the `["_setting/id", "db"]`. For example, in order to remove the defaultAuth:

```
[{
      "_id": ["_setting/id", "db"],
      "_setting/defaultAuth": [25769803776],
      "_action": "delete"
}]
```

Additionally, every transaction can specify a `_tx/authority` as part of the `_tx` map included in the transaction. For example, if we have an `_auth` record with the id, "rootAuth", we can submit a transaction as follows: 


```
[{
    "_id": "_predicate",
    "name": "movie/title",
    "type": "string
},
{
    "_id": "_tx",
    "id": "movieTitle",
    "authority": ["_auth/id", "rootAuth"]
}]

```

Remember, if your database specifies a defaultAuth, this `_tx` map is optional. 


